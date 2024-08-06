import Stripe from 'stripe';
import {NextRequest, NextResponse} from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const score = formData.get('score') ? Number(formData.get('score')) : undefined;
    const plan = formData.get('plan')?.toString();
    console.log('plan:', plan);

    // 根据 plan 动态设置 price ID
    let priceId: string;
    switch (plan) {
        case 'basic':
            // priceId = 'price_1Pea9ERsqc5wnJW18S6sgHcZ';      // Test Price ID
            priceId = 'price_1PkP1ORsqc5wnJW10jTPQiyV';
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