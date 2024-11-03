import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';
import { NextRequest } from 'next/server';

// 使用凭证文件路径
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// 初始化 Google Auth
const auth = new GoogleAuth({
    keyFilename: keyFilename,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

// 初始化 Vertex AI
const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT || '',
    location: process.env.GOOGLE_CLOUD_LOCATION || '',
    auth: auth
} as any);

// 获取 Gemini Pro 模型
const model = 'gemini-pro';
const generativeModel = vertexAI.preview.getGenerativeModel({
    model: model,
    generation_config: {
        max_output_tokens: 2048,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
    },
} as any);

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { query } = body;

    if (!query) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // 设置响应头以支持流式传输
    const encoder = new TextEncoder();

    try {
        // 获取新的访问令牌
        const client = await auth.getClient();
        await client.getAccessToken();

        // 创建 TransformStream 用于流式响应
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        // 发送请求到 Gemini
        const streamingResp = await generativeModel.generateContentStream({
            contents: [{ role: 'user', parts: [{ text: query }] }],
        });

        // 处理流式响应
        (async () => {
            try {
                for await (const item of streamingResp.stream) {
                    if (item.candidates && item.candidates.length > 0) {
                        const candidate = item.candidates[0];
                        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                            const content = candidate.content.parts[0].text;
                            await writer.write(
                                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                            );
                        } else if (candidate.finishReason === "SAFETY") {
                            await writer.write(
                                encoder.encode(`data: ${JSON.stringify({ error: "SAFETY_BLOCK" })}\n\n`)
                            );
                            break;
                        }
                    } else if (item.promptFeedback && item.promptFeedback.blockReason === "SAFETY") {
                        await writer.write(
                            encoder.encode(`data: ${JSON.stringify({ error: "SAFETY_BLOCK" })}\n\n`)
                        );
                        break;
                    }
                }

                await writer.write(encoder.encode('data: [DONE]\n\n'));
                await writer.close();
            } catch (error) {
                console.error('Streaming error:', error);
                await writer.write(
                    encoder.encode(`data: ${JSON.stringify({ error: "STREAMING_ERROR" })}\n\n`)
                );
                await writer.close();
            }
        })();

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('API error:', error);
        return new Response(
            JSON.stringify({ error: "API_ERROR", message: (error as Error).message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
