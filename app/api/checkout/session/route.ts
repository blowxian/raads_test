import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
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
    const couponCode = formData.get('coupon')?.toString(); // 新增：获取优惠券代码

    // 获取客户端 IP 地址
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'IP not found';

    // 获取当前时间并转换为东八区时间格式
    const date = new Date();
    const options = { timeZone: 'Asia/Shanghai', hour12: false };
    const formattedDate = date.toLocaleString('zh-CN', options);

    console.log(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户访问报告支付页  ${plan}`);
    notifyFeishu(`[${process.env.NEXT_PUBLIC_ENV_HINT}] [${formattedDate}] IP: ${ip}, 用户访问报告支付页 ${plan}`);

    // 根据 plan 动态设置 price ID
    let priceId: string;
    switch (plan) {
        case 'basic':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            // priceId = 'price_1Pm74JRsqc5wnJW1dAHdHPbM';
            priceId = 'price_1QGtHpRsqc5wnJW1wRJrAiY6';
            break;
        case 'premium':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            // priceId = 'price_1PkP2uRsqc5wnJW1H00EWgPH';
            // priceId = 'price_1Pmr41Rsqc5wnJW12ZXcZlhd';
            priceId = 'price_1QGtKhRsqc5wnJW1IiBysX7S';
            break;
        case 'service':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            priceId = 'price_1PkP3iRsqc5wnJW1OvKCSjeP';
            break;
        default:
            return NextResponse.json({ error: 'Invalid plan specified' });
    }

    try {
        // 创建 Checkout 会话
        const sessionOptions: Stripe.Checkout.SessionCreateParams = {
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}?score=${score}&status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}?score=${score}&status=cancel`,
            automatic_tax: { enabled: true },
            metadata: {
                score: score,
                plan: plan
            }
        } as any;

        // 设置优惠券代码（用户提供的或默认的）
        let appliedCoupon = couponCode;
        if (!appliedCoupon) {
            if (plan === 'basic') {
                appliedCoupon = 'UV1QerRE';
            } else if (plan === 'premium') {
                appliedCoupon = '01louUWo';
            }
        }

        // 如果有优惠券代码（包括默认的），添加到会话选项中
        if (appliedCoupon) {
            sessionOptions.discounts = [
                {
                    coupon: appliedCoupon,
                },
            ];
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);
        return NextResponse.redirect(session.url as string, 303);
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}