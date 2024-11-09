import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const FEISHU_NOTIFY_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/8a488a45-7644-4406-89fc-0609cc2da948';

interface SurveyPopupProps {
    handlePayment: (tier: string, coupon?: string) => void;
    isPaid?: boolean;
    customerEmail?: string | null;
    showSurveyPopup?: boolean;
}

// 添加 IP 和位置获取函数
async function getIPLocation() {
    try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        return {
            ip,
            location: locationResponse.data
        };
    } catch (error) {
        console.error('Failed to get location info:', error);
        return { ip: 'Unknown', location: null };
    }
}

const SurveyPopup = ({ handlePayment, isPaid = false, customerEmail = null, showSurveyPopup = false }: SurveyPopupProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showMinimized, setShowMinimized] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({
        profession: '',
        customProfession: '',
        frequency: '',
        interests: [] as string[]
    });
    const [showReward, setShowReward] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [otherInputs, setOtherInputs] = useState({
        profession: '',
        interests: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Survey questions data
    const surveyQuestions = [
        {
            id: 'profession',
            question: 'What is your profession?',
            type: 'radio',
            required: true,
            options: [
                'Doctor/Healthcare Provider',
                'Teacher/Educator',
                'Student',
                'Psychologist/Social Worker',
                'Other'
            ]
        },
        {
            id: 'frequency',
            question: 'How often do you use the RAADS test?',
            type: 'radio',
            required: true,
            options: [
                'Daily or several times a week',
                'Several times a month',
                'Occasionally',
                'Never used'
            ]
        },
        {
            id: 'interests',
            question: 'Which additional services interest you most?',
            type: 'checkbox',
            required: true,
            options: [
                'Interpretation and detailed reporting',
                'Data management and analysis',
                'Long-term tracking and record-keeping',
                'Remote diagnosis and consultation',
                'Additional psychological assessment tools',
                'Educational resources and support',
                'Other',
                'None of the above'
            ]
        }
    ];

    useEffect(() => {
        if (!isPaid && showSurveyPopup) {
            setShowMinimized(true);
            notifyFeishu(`User ${customerEmail || 'Unknown'} viewed survey popup`);
        }
    }, [isPaid, showSurveyPopup, customerEmail]);

    const handleClose = () => {
        setShowPopup(false);
        setShowMinimized(true);
    };

    const handleAnswer = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));

        if (questionId === 'profession' && value !== 'Other') {
            setOtherInputs(prev => ({ ...prev, profession: '' }));
        }
    };

    const handleOtherInput = (field: 'profession' | 'interests', value: string) => {
        setOtherInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 验证当前步骤的答案
    const validateCurrentStep = () => {
        const currentQuestion = surveyQuestions[currentStep];
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (currentQuestion.required) {
            if (currentQuestion.type === 'radio') {
                if (!answers[currentQuestion.id as keyof typeof answers]) {
                    newErrors[currentQuestion.id] = 'Please select an option';
                    isValid = false;
                }

                if (answers[currentQuestion.id as keyof typeof answers] === 'Other' && !otherInputs.profession) {
                    newErrors.otherProfession = 'Please specify your profession';
                    isValid = false;
                }
            }

            if (currentQuestion.type === 'checkbox') {
                if (!(answers.interests as string[]).length) {
                    newErrors.interests = 'Please select at least one option';
                    isValid = false;
                }

                if ((answers.interests as string[]).includes('Other') && !otherInputs.interests) {
                    newErrors.otherInterests = 'Please specify your interests';
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // 更新 handleNext
    const handleNext = async () => {
        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < surveyQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
            setErrors({});
        } else {
            await submitSurvey();
        }
    };

    // 更新提交问卷函数
    const submitSurvey = async () => {
        try {
            const completeAnswers = {
                ...answers,
                profession: answers.profession === 'Other' ? otherInputs.profession : answers.profession,
                interests: answers.interests.includes('Other')
                    ? [...answers.interests.filter(i => i !== 'Other'), otherInputs.interests]
                    : answers.interests
            };

            // 获取 referrer 信息
            const referrer = document.referrer || 'Direct';
            const currentUrl = window.location.href;

            // 异步获取 IP 和位置信息
            getIPLocation().then(({ ip, location }) => {
                const locationInfo = location ?
                    `[${location.city || 'Unknown'}, ${location.region || 'Unknown'}, ${location.country_name || 'Unknown'}]` :
                    '[Location unknown]';

                const message = `Survey completed by ${customerEmail || 'Unknown'}
IP: ${ip}
Location: ${locationInfo}
Referrer: ${referrer}
Current URL: ${currentUrl}
Answers: ${JSON.stringify(completeAnswers, null, 2)}`;

                // 异步发送飞书通知
                notifyFeishu(message).catch(error =>
                    console.error('Failed to send Feishu notification:', error)
                );
            });

            // 移除随机奖励逻辑，直接使用固定折扣码
            setDiscountCode('01louUWo');
            setShowReward(true);
        } catch (error) {
            console.error('Failed to submit survey:', error);
        }
    };

    const notifyFeishu = async (message: string) => {
        try {
            await axios.post(FEISHU_NOTIFY_WEBHOOK_URL, {
                msg_type: 'text',
                content: { text: message }
            });
        } catch (error) {
            console.error('Failed to send Feishu notification:', error);
        }
    };

    if (isPaid) return null;

    const renderRadioInputs = () => (
        <div className="space-y-3">
            {surveyQuestions[currentStep].options.map((option) => (
                <div key={option}>
                    <label className="flex items-center p-3 rounded-lg border-2 
                                    cursor-pointer transition-all duration-200
                                    hover:border-indigo-300 hover:bg-indigo-50">
                        <input
                            type="radio"
                            name={surveyQuestions[currentStep].id}
                            value={option}
                            checked={answers[surveyQuestions[currentStep].id as keyof typeof answers] === option}
                            onChange={(e) => handleAnswer(surveyQuestions[currentStep].id, e.target.value)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                    {option === 'Other' &&
                        answers[surveyQuestions[currentStep].id as keyof typeof answers] === 'Other' &&
                        renderOtherInput('profession')}
                </div>
            ))}
        </div>
    );

    const renderCheckboxInputs = () => (
        <div className="space-y-3">
            {surveyQuestions[currentStep].options.map((option) => (
                <div key={option}>
                    <label className="flex items-center p-3 rounded-lg border-2
                                    cursor-pointer transition-all duration-200
                                    hover:border-indigo-300 hover:bg-indigo-50">
                        <input
                            type="checkbox"
                            value={option}
                            checked={(answers.interests as string[]).includes(option)}
                            onChange={(e) => {
                                const newInterests = e.target.checked
                                    ? [...answers.interests, option]
                                    : answers.interests.filter(i => i !== option);
                                handleAnswer('interests', newInterests);
                            }}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                    {option === 'Other' && (answers.interests as string[]).includes('Other') && (
                        <>
                            {!otherInputs.interests && (
                                <div className="ml-7 mt-1 mb-1">
                                    <p className="text-amber-600 text-xs flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Please specify your interests below
                                    </p>
                                </div>
                            )}
                            <div className="mt-1 ml-7">
                                <input
                                    type="text"
                                    placeholder="Please specify..."
                                    value={otherInputs.interests}
                                    onChange={(e) => handleOtherInput('interests', e.target.value)}
                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 
                                            focus:border-indigo-500 text-sm md:text-base
                                            ${!otherInputs.interests ? 'border-amber-300' : 'border-gray-300'}`}
                                />
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    const renderOtherInput = (field: 'profession' | 'interests') => (
        <div className="mt-2 ml-7">
            <input
                type="text"
                placeholder="Please specify..."
                value={otherInputs[field]}
                onChange={(e) => handleOtherInput(field, e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 
                         focus:border-indigo-500 text-sm md:text-base"
            />
        </div>
    );

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] shadow-2xl relative 
                              transform transition-all duration-300 scale-100 opacity-100 flex flex-col">
                        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 z-10">
                            <button
                                onClick={handleClose}
                                className="bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 
                                         transition-colors duration-200"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        {!showReward ? (
                            <div className="flex flex-col h-full">
                                {/* Fixed Header */}
                                <div className="bg-survey-gradient text-white p-4 rounded-t-xl">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Special Offer!</h2>
                                    <p className="text-white/90 text-sm md:text-base">
                                        Complete this survey to get 81% OFF instantly! 🎁
                                    </p>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                    <div className="flex items-center mb-4">
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Question {currentStep + 1} of {surveyQuestions.length}
                                        </span>
                                    </div>

                                    {/* Question */}
                                    <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-800">
                                        {surveyQuestions[currentStep].question}
                                    </h3>

                                    {/* Error Messages - Now between question and options */}
                                    {errors[surveyQuestions[currentStep].id] && (
                                        <div className="mb-4 px-1">
                                            <p className="text-red-500 text-sm flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                {errors[surveyQuestions[currentStep].id]}
                                            </p>
                                        </div>
                                    )}

                                    {/* Radio/Checkbox inputs */}
                                    <div className="space-y-3">
                                        {surveyQuestions[currentStep].type === 'radio' && renderRadioInputs()}
                                        {surveyQuestions[currentStep].type === 'checkbox' && renderCheckboxInputs()}
                                    </div>

                                    {/* Other input error - Show below the other input field */}
                                    {answers[surveyQuestions[currentStep].id as keyof typeof answers] === 'Other' &&
                                        errors[`other${surveyQuestions[currentStep].id.charAt(0).toUpperCase() +
                                        surveyQuestions[currentStep].id.slice(1)}`] && (
                                            <div className="mt-2 px-1">
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    {errors[`other${surveyQuestions[currentStep].id.charAt(0).toUpperCase() +
                                                        surveyQuestions[currentStep].id.slice(1)}`]}
                                                </p>
                                            </div>
                                        )}
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-4 border-t">
                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-survey-gradient text-white font-bold py-3 px-6 rounded-lg
                                                 hover:opacity-90 transition-opacity duration-200 shadow-lg"
                                    >
                                        {currentStep === surveyQuestions.length - 1 ? 'Submit' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Reward section
                            <div className="flex flex-col h-full">
                                <div className="bg-survey-gradient text-white p-6 rounded-t-xl">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Thank You!</h2>
                                    <p className="text-white/90">
                                        Your feedback helps us improve our service
                                    </p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="animate-pulse-slow">
                                        <div className="bg-indigo-100 text-indigo-800 p-4 rounded-lg mb-4">
                                            <p className="text-lg font-bold mb-2">🎁 Special Offer</p>
                                            <p>Get 81% OFF your comprehensive report!</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t">
                                    <button
                                        onClick={() => handlePayment('premium', '01louUWo')}
                                        className="w-full bg-survey-gradient text-white font-bold py-3 px-6 rounded-lg
                                                 hover:opacity-90 transition-opacity duration-200 shadow-lg"
                                    >
                                        Claim Your 81% Discount Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showMinimized && !showPopup && (
                <div
                    className="fixed bottom-4 right-4 text-white rounded-xl shadow-lg 
                              cursor-pointer z-50 animate-float"
                    onClick={() => setShowPopup(true)}
                >
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-survey-minimized-animated animate-gradient-shift"
                            style={{ backgroundSize: '200% 200%' }} />
                        <div className="relative p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between space-x-3">
                                <div>
                                    <p className="font-bold text-sm md:text-base flex items-center">
                                        <span className="animate-bounce-slow inline-block mr-2">💰</span>
                                        Get 81% OFF Now!
                                    </p>
                                    <p className="text-xs md:text-sm text-white/90 mt-1">
                                        Quick survey - Massive discount
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3].map((dot, index) => (
                                            <div
                                                key={dot}
                                                className="w-1.5 h-1.5 bg-white rounded-full opacity-75"
                                                style={{
                                                    animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className="text-white/80 transform transition-transform duration-300 hover:translate-y-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10 blur-xl opacity-30 bg-survey-minimized-animated animate-gradient-shift"
                        style={{
                            backgroundSize: '200% 200%',
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default SurveyPopup; 