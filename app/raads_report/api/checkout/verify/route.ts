// /app/api/checkout/verify-payment.ts
import Stripe from 'stripe';
import {NextRequest, NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

            return NextResponse.json({success: true, metadata});
        } else {
            return NextResponse.json({success: false, message: 'Payment not completed'});
        }
    } catch (error: any) {
        console.error('Error handling payment verification:', error);
        return NextResponse.json({success: false, message: error.message});
    }
}