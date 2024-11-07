import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, DollarSign, X } from 'lucide-react';
import axios from 'axios';

const FEISHU_NOTIFY_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/f4c87354-47b7-4ad1-83ff-a56962dc83a1';

const sendFeishuNotification = async (message: string) => {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Notification timeout')), 5000); // 5秒超时
    });

    const notificationPromise = axios.post(FEISHU_NOTIFY_WEBHOOK_URL, {
        msg_type: 'text',
        content: { text: message },
    });

    Promise.race([notificationPromise, timeoutPromise])
        .catch(error => {
            console.error('Failed to send Feishu notification:', error);
        });
};

const getLocationInfo = async () => {
    try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;

        const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        const location = locationResponse.data;

        const locationInfo = location ?
            `[${location.city || 'Unknown'}, ${location.region || 'Unknown'}, ${location.country_name || 'Unknown'}]` :
            '[Location unknown]';

        return { ip, locationInfo };
    } catch (error) {
        console.error('Failed to get location info:', error);
        return { ip: 'Unknown', locationInfo: '[Location unknown]' };
    }
};

interface MarketingPopupProps {
    handlePayment: (tier: string, coupon?: string) => void;
    isPaid?: boolean;
    customerEmail?: string | null;
    showMarketingPopup?: boolean;
}

const MarketingPopup = ({ handlePayment, isPaid = false, customerEmail = null, showMarketingPopup = false }: MarketingPopupProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showMinimized, setShowMinimized] = useState(false);
    const [displayTime, setDisplayTime] = useState('10:00.000');
    const endTimeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    const premiumPlan = {
        name: "premium",
        title: "Premium",
        originalPrice: 99.99,
        price: 19,
        features: [
            {
                text: `Comprehensive Report: <strong>In-Depth Analysis & Personalized Insights</strong>`,
                anchorName: 'report'
            }, {
                text: "<strong>Bonus:</strong> 3 Expert-Curated eBooks",
                anchorName: 'ebookDetail'
            }, {
                text: "<strong>Exclusive Offer:</strong> One-Year AI Mental Health Assistant Access",
                anchorName: 'aiDetail'
            }
        ],
    };

    useEffect(() => {
        if (!isPaid && showMarketingPopup) {
            setShowPopup(true);
            startCountdown();

            (async () => {
                const date = new Date();
                const options = { timeZone: 'Asia/Shanghai', hour12: false };
                const formattedDate = date.toLocaleString('zh-CN', options);

                const { ip, locationInfo } = await getLocationInfo();

                console.log('Marketing Popup Email:', customerEmail);

                const emailInfo = customerEmail ? `Email: ${customerEmail}, ` : '';

                sendFeishuNotification(
                    `[${process.env.NEXT_PUBLIC_ENV_HINT}] ${emailInfo}IP: ${ip} ${locationInfo}, 用户看到营销弹窗 at ${formattedDate}`
                );
            })();
        }
    }, [isPaid, showMarketingPopup, customerEmail]);

    const startCountdown = () => {
        const startTime = performance.now();
        endTimeRef.current = startTime + 600000; // 10 mins in milliseconds

        const updateCountdown = () => {
            const currentTime = performance.now();
            const remainingTime = Math.max(0, endTimeRef.current - currentTime);

            if (remainingTime > 0) {
                setDisplayTime(formatTime(remainingTime));
                animationFrameRef.current = requestAnimationFrame(updateCountdown);
            } else {
                setDisplayTime('00:00.000');
            }
        };

        updateCountdown();
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current as any);
            }
        };
    }, []);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor(milliseconds % 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    };

    const handleClose = () => {
        setShowPopup(false);
        setShowMinimized(true);
    };

    const handlePaymentWithNotification = (tier: string, coupon = "") => {
        handlePayment(tier, coupon);

        (async () => {
            const date = new Date();
            const options = { timeZone: 'Asia/Shanghai', hour12: false };
            const formattedDate = date.toLocaleString('zh-CN', options);

            const { ip, locationInfo } = await getLocationInfo();

            const emailInfo = customerEmail ? `Email: ${customerEmail}, ` : '';

            sendFeishuNotification(
                `[${process.env.NEXT_PUBLIC_ENV_HINT}] ${emailInfo}IP: ${ip} ${locationInfo}, 用户点击营销弹窗购买按钮 at ${formattedDate}`
            );
        })();
    };

    if (isPaid) {
        return null;
    }

    const discountAmount = premiumPlan.originalPrice - premiumPlan.price;

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg p-4 sm:p-6 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-200 p-1"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                        <div className="text-center pt-4">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4 font-sans">
                                Black Friday Mega Deal! 🔥
                            </h2>
                            <div className="bg-yellow-300 text-red-800 font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full inline-block mb-3 sm:mb-4 transform -rotate-2 shadow-md">
                                <span className="text-xl sm:text-2xl">SAVE {Math.round((discountAmount / premiumPlan.originalPrice) * 100)}%</span>
                            </div>
                            <p className="text-base sm:text-lg mb-4 sm:mb-6 font-sans text-white">
                                Unlock Your Complete RAADS-R Analysis at Our Lowest Price Ever!
                            </p>
                            <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
                                <h3 className="text-red-600 font-bold mb-2 text-sm sm:text-base">Black Friday Bundle Includes:</h3>
                                <ul className="space-y-2">
                                    {premiumPlan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start text-sm sm:text-base">
                                            <Check size={16} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: feature.text }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mb-4 sm:mb-6">
                                <p className="text-yellow-300 text-lg sm:text-xl font-bold">
                                    <span className="line-through">${premiumPlan.originalPrice}</span>
                                    <span className="ml-2 text-white text-2xl sm:text-3xl">${premiumPlan.price}</span>
                                </p>
                                <p className="text-yellow-200 text-sm">Best Value of the Year!</p>
                            </div>
                            <button
                                onClick={() => handlePaymentWithNotification('premium', "01louUWo")}
                                className="bg-white text-red-600 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full hover:bg-red-100 transition duration-300 shadow-lg text-base sm:text-lg w-full sm:w-auto"
                            >
                                Claim Your Black Friday Discount Now
                            </button>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-yellow-200 font-semibold">
                                ⚡ Flash Sale Ends In: <span className="font-mono">{displayTime}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {showMinimized && !showPopup && (
                <div
                    className="fixed top-4 right-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg shadow-lg p-3 z-50 text-white cursor-pointer"
                    onClick={() => setShowPopup(true)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-sm">Premium Offer</p>
                            <p className="text-xs">Save ${discountAmount}</p>
                        </div>
                        <ChevronDown size={20} className="ml-2" />
                    </div>
                    <p className="text-xs mt-1">
                        Ends in: <span className="font-mono">{displayTime}</span>
                    </p>
                </div>
            )}
        </>
    );
};

export default MarketingPopup;
