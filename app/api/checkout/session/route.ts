import Stripe from 'stripe';
import {NextRequest, NextResponse} from 'next/server';
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const FEISHU_NOTIFY_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/f3310800-9803-4235-bc20-9557188d6d20';

async function notifyFeishu(message: any) {
    try {
        await axios.post(FEISHU_NOTIFY_WEBHOOK_URL, {
            msg_type: 'text',
            content: {
                text: message,
            },
        });
    } catch (error) {
        console.error('Failed to send Feishu notification', error);
    }
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const score = formData.get('score') ? Number(formData.get('score')) : undefined;
    const plan = formData.get('plan')?.toString();

    // 获取客户端 IP 地址
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'IP not found';

    // 获取当前时间并转换为东八区时间格式
    const date = new Date();
    const options = {timeZone: 'Asia/Shanghai', hour12: false};
    const formattedDate = date.toLocaleString('zh-CN', options);

    console.log(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户访问报告支付页  ${plan}`);
    notifyFeishu(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户访问报告支付页 ${plan}`);

    // 根据 plan 动态设置 price ID
    let priceId: string;
    switch (plan) {
        case 'basic':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            priceId = 'price_1Pm5PVRsqc5wnJW12pia28Sz';
            break;
        case 'premium':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            priceId = 'price_1PkP2uRsqc5wnJW1H00EWgPH';
            break;
        case 'service':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            priceId = 'price_1PkP3iRsqc5wnJW1OvKCSjeP';
            break;
        default:
            return NextResponse.json({error: 'Invalid plan specified'});
    }

    try {
        // 创建 Checkout 会话
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // mode: 'subscription',
            mode: 'payment',
            success_url: `${req.headers.get('origin')}?score=${score}&status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}?score=${score}&status=cancel`,
            automatic_tax: {enabled: true},
            metadata: {
                score: score,  // 将 userId 添加到 metadata 中
                plan: plan  // 可选: 将 plan 添加到 metadata 中以跟踪
            }
        } as any);
        return NextResponse.redirect(session.url as any, 303);
    } catch (err: any) {
        return NextResponse.json({error: err.message});
    }
}