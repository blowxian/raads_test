// /app/[locale]/checkout/page.tsx
'use client';

import React, {useEffect, useRef} from 'react';

const CheckoutPage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null as any);
    const scoreRef = useRef<HTMLInputElement>(null as any);  // 创建 ref 用于隐藏的用户 ID 输入框
    const planRef = useRef<HTMLInputElement>(null as any);    // 创建 ref 用于隐藏的 plan 输入框

    useEffect(() => {
        // 获取 URL 中的 score、plan 和 coupon 参数
        const queryParams = new URLSearchParams(window.location.search);
        const score = queryParams.get('score');
        const plan = queryParams.get('package');

        // 在隐藏的输入字段中设置用户 ID、plan 和优惠券
        if (scoreRef.current && planRef.current) {
            scoreRef.current.value = score || '';
            planRef.current.value = plan || '';
        }

        // 在组件加载时自动提交表单
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div className="redirecting">
                Redirecting&nbsp;<span>.</span><span>.</span><span>.</span>
            </div>
            <form ref={formRef} action="/raads_report/api/checkout/session" method="POST" style={{display: 'none'}}>
                <input type="hidden" ref={scoreRef} name="score"/>
                <input type="hidden" ref={planRef} name="plan"/>
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