import React, {useEffect, useState} from 'react';
import {Check, ChevronDown, DollarSign, X} from 'lucide-react';

const MarketingPopup = ({handlePayment, isPaid = false}: any) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showMinimized, setShowMinimized] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

    const premiumPlan = {
        name: "premium",
        title: "Premium",
        originalPrice: 98,
        price: 18,
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
            }, 20000);

            return () => clearTimeout(timer);
        }
    }, [isPaid]);

    useEffect(() => {
        if (!isPaid) {
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPaid]);

    const handleClose = () => {
        setShowPopup(false);
        setShowMinimized(true);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
                        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-200">
                            <X size={24}/>
                        </button>
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-white mb-4 font-sans">Limited Time Offer!</h2>
                            <div
                                className="bg-yellow-300 text-blue-800 font-bold py-2 px-4 rounded-full inline-block mb-4 transform -rotate-2 shadow-md">
                                <DollarSign className="inline-block mr-1" size={20}/>
                                <span className="text-2xl">{discountAmount} OFF</span>
                            </div>
                            <p className="text-white text-lg mb-6 font-sans">
                                Transform your understanding with our {premiumPlan.title} RAADS-R report!
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-6 text-left">
                                <h3 className="text-blue-600 font-bold mb-2">Premium Package Includes:</h3>
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
                                onClick={() => handlePayment('premium', "EYsVBfUA")}
                                className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg text-lg"
                            >
                                Unlock Premium Now
                            </button>
                            <p className="mt-4 text-sm text-yellow-200 font-semibold">
                                Hurry! Offer expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {showMinimized && !showPopup && (
                <div
                    className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-3 z-50 text-white cursor-pointer"
                    onClick={() => setShowPopup(true)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-sm">Premium Offer</p>
                            <p className="text-xs">Save ${discountAmount}</p>
                        </div>
                        <ChevronDown size={20} className="ml-2"/>
                    </div>
                    <p className="text-xs mt-1">
                        Ends in: <span className="font-mono">{formatTime(timeLeft)}</span>
                    </p>
                </div>
            )}
        </>
    );
};

export default MarketingPopup;