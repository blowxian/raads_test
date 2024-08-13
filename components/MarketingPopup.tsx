import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown, DollarSign, X} from 'lucide-react';

const MarketingPopup = ({handlePayment, isPaid = false}: any) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showMinimized, setShowMinimized] = useState(false);
    const [displayTime, setDisplayTime] = useState('10:00.000');
    const endTimeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    const premiumPlan = {
        name: "premium",
        title: "Premium",
        originalPrice: 98,
        price: 15,
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
        if (!isPaid) {
            const timer = setTimeout(() => {
                setShowPopup(true);
                startCountdown();
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [isPaid]);

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

    if (isPaid) {
        return null;
    }

    const discountAmount = premiumPlan.originalPrice - premiumPlan.price;

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-200">
                            <X size={24}/>
                        </button>
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-white mb-4 font-sans">Limited Time Offer!</h2>
                            <div
                                className="bg-yellow-300 text-red-800 font-bold py-2 px-4 rounded-full inline-block mb-4 transform -rotate-2 shadow-md">
                                <DollarSign className="inline-block mr-1" size={20}/>
                                <span className="text-2xl">{discountAmount} OFF</span>
                            </div>
                            <p className="text-white text-lg mb-6 font-sans">
                                Transform your understanding with our {premiumPlan.title} RAADS-R report!
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-6 text-left">
                                <h3 className="text-red-600 font-bold mb-2">Premium Package Includes:</h3>
                                <ul className="space-y-2">
                                    {premiumPlan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1"/>
                                            <span dangerouslySetInnerHTML={{__html: feature.text}}/>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mb-6">
                                <p className="text-yellow-300 text-xl font-bold">
                                    <span className="line-through">${premiumPlan.originalPrice}</span>
                                    <span className="ml-2 text-white text-3xl">${premiumPlan.price}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => handlePayment('premium', "BpW0IPwI")}
                                className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-red-100 transition duration-300 shadow-lg text-lg"
                            >
                                Click to Pay Now
                            </button>
                            <p className="mt-4 text-sm text-yellow-200 font-semibold">
                                Hurry! Offer expires in: <span className="font-mono">{displayTime}</span>
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
                        <ChevronDown size={20} className="ml-2"/>
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