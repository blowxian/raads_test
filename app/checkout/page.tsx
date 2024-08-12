// /app/[locale]/checkout/page.tsx
'use client';

import React, {useEffect, useRef} from 'react';

const CheckoutPage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null as any);
    const scoreRef = useRef<HTMLInputElement>(null as any);
    const planRef = useRef<HTMLInputElement>(null as any);
    const couponRef = useRef<HTMLInputElement>(null as any);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const score = queryParams.get('score');
        const plan = queryParams.get('package');
        const coupon = queryParams.get('coupon');

        if (scoreRef.current && planRef.current && couponRef.current) {
            scoreRef.current.value = score || '';
            planRef.current.value = plan || '';
            couponRef.current.value = coupon || '';
        }

        // 自动提交表单
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div className="redirecting">
                Redirecting&nbsp;<span>.</span><span>.</span><span>.</span>
            </div>
            <form ref={formRef} action="/api/checkout/session" method="POST" style={{display: 'none'}}>
                <input type="hidden" ref={scoreRef} name="score"/>
                <input type="hidden" ref={planRef} name="plan"/>
                <input type="hidden" ref={couponRef} name="coupon"/>
                <button type="submit" role="link">Checkout</button>
            </form>
            <style jsx>{`
                .redirecting {
                    font-size: 24px;
                    font-weight: bold;
                }

                .redirecting span {
                    opacity: 0;
                    animation: fade 1.5s infinite;
                }

                .redirecting span:nth-child(1) {
                    animation-delay: 0s;
                }

                .redirecting span:nth-child(2) {
                    animation-delay: 0.5s;
                }

                .redirecting span:nth-child(3) {
                    animation-delay: 1s;
                }

                @keyframes fade {
                    0%, 100% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;