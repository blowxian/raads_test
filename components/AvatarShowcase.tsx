import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';

const AvatarShowcase = ({score}: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        '/style001.webp', '/style002.webp', '/style003.webp', '/style004.webp',
        '/style005.webp', '/style006.webp', '/style007.webp', '/style008.webp',
        '/style009.png', '/style010.png', '/style011.png', '/style012.png',
        '/style013.png', '/style014.png', '/style015.png', '/style016.png',
        '/style017.png', '/style018.png', '/style019.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleGenerateAvatar = () => {
        const url = `https://10p.ai/en/autism-avatar-generator?score=${score}`;
        window.open(url, '_blank');
    };


    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative z-20">
            <h2 className="text-base font-bold mb-4">FREE Personalized RAADS-R Score Avatar</h2>
            <div className="relative">
                <img
                    src={`/avatar_demo/${images[currentImageIndex]}`}
                    alt={`RAADS-R Avatar Style ${currentImageIndex + 1}`}
                    className="w-full h36 object-cover rounded-lg cursor-pointer"
                    onClick={handleGenerateAvatar}
                />
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-800"/>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                >
                    <ArrowRight className="h-6 w-6 text-gray-800"/>
                </button>
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={handleGenerateAvatar}
                    className="mt-2 font-bold py-2 px-4 rounded transition duration-300 animate-pulse"
                    style={{
                        background: 'linear-gradient(45deg, #FF4500, #FFD700)',
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                >
                    Generate My FREE Avatar Now!
                </button>
            </div>
        </div>
    );
};

export default AvatarShowcase;