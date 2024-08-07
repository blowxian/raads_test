// /app/api/checkout/verify-payment.ts
import Stripe from 'stripe';
import {NextRequest, NextResponse} from "next/server";
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

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const session_id = searchParams.get('session_id') || '';

    try {
        if (!session_id) {
            return NextResponse.json({success: false, message: 'Invalid session ID.'});
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            // 从 session metadata 获取 userId，并确保它是整数
            const metadata = session.metadata;
            console.log('metadata: ', metadata);

            // 获取客户端 IP 地址
            const ip = req.headers.get('x-forwarded-for') || req.ip || 'IP not found';

            // 获取当前时间并转换为东八区时间格式
            const date = new Date();
            const options = {timeZone: 'Asia/Shanghai', hour12: false};
            const formattedDate = date.toLocaleString('zh-CN', options);

            console.log(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户[${session.customer_email || session.customer_details?.email}][${metadata?.plan}]访问支付成功报告页`);
            notifyFeishu(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户[${session.customer_email || session.customer_details?.email}][${metadata?.plan}]访问支付成功报告页`);

            // 获取发票 ID
            const invoice_id = session.invoice as string;
            console.log("invoice_id: ", invoice_id);

            if (invoice_id) {
                // 检索发票详细信息
                const invoice = await stripe.invoices.retrieve(invoice_id);
                console.log('invoice: ', invoice);

                return NextResponse.json({success: true, metadata, session, invoice});
            } else {
                return NextResponse.json({
                    success: true,
                    metadata,
                    session,
                    message: 'No invoice associated with this session'
                });
            }
        } else {
            return NextResponse.json({success: false, message: 'Payment not completed'});
        }
    } catch (error: any) {
        console.error('Error handling payment verification:', error);
        return NextResponse.json({success: false, message: error.message});
    }
}