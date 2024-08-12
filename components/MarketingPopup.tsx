import React, {useEffect, useState} from 'react';
import {ChevronUp, DollarSign, X} from 'lucide-react';

const MarketingPopup = ({handlePayment, isPaid = false}: any) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showMinimized, setShowMinimized] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

    useEffect(() => {
        if (!isPaid) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 8000);

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
        return null; // 如果已支付，不渲染任何内容
    }

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 max-w-sm w-full shadow-2xl">
                        <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-200">
                            <X size={24}/>
                        </button>
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-white mb-4 font-sans">Exclusive Offer!</h2>
                            <div
                                className="bg-yellow-300 text-blue-800 font-bold py-2 px-4 rounded-full inline-block mb-4 transform -rotate-2 shadow-md">
                                <DollarSign className="inline-block mr-1" size={20}/>
                                <span className="text-2xl">20 OFF</span>
                            </div>
                            <p className="text-white text-lg mb-6 font-sans">
                                Unlock the full potential of your RAADS-R report with our Premium plan!
                            </p>
                            <button
                                onClick={() => handlePayment('premium', "EYsVBfUA")}
                                className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg text-lg"
                            >
                                Claim Your Discount
                            </button>
                            <p className="mt-4 text-sm text-yellow-200 font-semibold">
                                Hurry! Offer ends in: <span className="font-mono">{formatTime(timeLeft)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {showMinimized && !showPopup && (
                <div
                    className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-4 z-50 text-white cursor-pointer"
                    onClick={() => setShowPopup(true)}>
                    <button className="absolute top-1 right-1 text-white hover:text-gray-200">
                        <ChevronUp size={20}/>
                    </button>
                    <p className="text-sm font-bold mb-1">$20 OFF Premium</p>
                    <p className="text-xs">Ends in: <span className="font-mono">{formatTime(timeLeft)}</span></p>
                </div>
            )}
        </>
    );
};

export default MarketingPopup;