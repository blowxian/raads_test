"use client";

import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useReactToPrint} from 'react-to-print';
import {
    AlertTriangle,
    Book,
    Briefcase,
    Calendar,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    GraduationCap,
    Heart,
    HeartPulse,
    Home,
    Lock,
    Monitor,
    Stethoscope,
    Users,
    XCircle
} from 'lucide-react';

const getInterpretation = (score: number) => {
    if (score <= 25) return "No Indications of Autism";
    if (score <= 50) return "Presence of Some Traits Associated with Autism, Though It's Unlikely to Be Autism";
    if (score <= 65) return "Base Threshold for Potential Autism Consideration";
    if (score <= 90) return "Enhanced Signs of Autism";
    if (score <= 130) return "Average Score Among Individuals with Autism, Indicating a Strong Likelihood of Autism";
    if (score <= 160) return "Overwhelming Evidence Pointing Towards Autism";
    if (score <= 227) return "Highest Score Recorded by Individuals with Autism in the Foundational RAADS-R Study";
    return "The Absolute Maximum Score Attainable on the RAADS-R Scale";
};

const getRecommendations = (score: number) => {
    const recommendations = [
        {
            range: [0, 25],
            items: [
                {
                    title: "Monitoring",
                    content: "Continue to observe behavior for any changes or concerns.",
                    icon: Monitor
                },
                {
                    title: "Social Engagement",
                    content: "Engage in social activities to develop social skills and interests.",
                    icon: Users
                },
            ],
        },
        {
            range: [26, 50],
            items: [
                {
                    title: "Professional Consultation",
                    content: "Consider consulting a psychologist or autism specialist for further evaluation and advice.",
                    icon: Briefcase
                },
                {
                    title: "Behavioral Interventions",
                    content: "Social skills training or behavioral interventions can help improve social interaction and communication abilities.",
                    icon: CheckCircle
                },
                {
                    title: "Support Groups",
                    content: "Join support groups or online communities for additional resources and shared experiences.",
                    icon: Users
                },
            ],
        },
        {
            range: [51, 65],
            items: [
                {
                    title: "Comprehensive Evaluation",
                    content: "Arrange for a comprehensive autism evaluation, including interviews and observations by a psychologist, psychiatrist, or autism specialist.",
                    icon: Book
                },
                {
                    title: "Early Intervention",
                    content: "If diagnosed, begin developing a personalized intervention plan, including social skills training, speech therapy, and behavioral therapy to address specific challenges.",
                    icon: AlertTriangle
                },
                {
                    title: "Educational Support",
                    content: "Engage with educational support services to ensure appropriate accommodations are made in academic settings.",
                    icon: Book
                },
            ],
        },
        {
            range: [66, 90],
            items: [
                {
                    title: "Immediate Assessment",
                    content: "Seek a comprehensive autism diagnosis assessment to determine the specific situation.",
                    icon: AlertTriangle
                },
                {
                    title: "Intensive Intervention",
                    content: "If diagnosed, participate in early intervention programs, including applied behavior analysis (ABA), to improve cognitive and behavioral skills.",
                    icon: CheckCircle
                },
                {
                    title: "Multidisciplinary Approach",
                    content: "Include occupational therapy, speech therapy, and possibly physical therapy to address various developmental needs.",
                    icon: Heart
                },
            ],
        },
        {
            range: [91, 130],
            items: [
                {
                    title: "Diagnosis Confirmation",
                    content: "Confirm the diagnosis and collaborate with autism specialists to develop a comprehensive intervention plan.",
                    icon: Briefcase
                },
                {
                    title: "Specialized Programs",
                    content: "Engage in specialized programs and therapies designed for individuals with autism to support social, communication, and behavioral development.",
                    icon: Book
                },
                {
                    title: "Educational and Vocational Planning",
                    content: "Plan for long-term educational and vocational support to ensure successful transitions through various life stages.",
                    icon: Book
                },
            ],
        },
        {
            range: [131, 160],
            items: [
                {
                    title: "Thorough Evaluation",
                    content: "Confirm the diagnosis with a thorough evaluation by an autism specialist.",
                    icon: Book
                },
                {
                    title: "Robust Support Plan",
                    content: "Implement a robust and multi-faceted intervention plan, including intensive behavioral therapy, social skills training, and family support programs.",
                    icon: CheckCircle
                },
                {
                    title: "Comprehensive Care",
                    content: "Ensure access to comprehensive care, including medical, psychological, and educational support services.",
                    icon: Heart
                },
            ],
        },
        {
            range: [161, 227],
            items: [
                {
                    title: "Accurate Diagnosis",
                    content: "Ensure an accurate and comprehensive diagnosis to confirm the extent of autism.",
                    icon: Briefcase
                },
                {
                    title: "Individualized Support",
                    content: "Develop an intensive, individualized support plan that includes specialized education, therapies, and continuous monitoring of progress.",
                    icon: Heart
                },
                {
                    title: "Lifelong Assistance",
                    content: "Plan for lifelong assistance and support, including transition planning for adulthood and independent living if possible.",
                    icon: Users
                },
            ],
        },
        {
            range: [228, 240],
            items: [
                {
                    title: "Comprehensive Evaluations",
                    content: "Confirm the diagnosis with thorough professional evaluations, including multidisciplinary assessments.",
                    icon: Book
                },
                {
                    title: "Extensive Interventions",
                    content: "Implement an extensive and tailored intervention strategy, involving multiple therapeutic approaches and continuous evaluation to address all aspects of autism.",
                    icon: CheckCircle
                },
                {
                    title: "Community and Family Support",
                    content: "Engage community and family support systems to provide a network of care and assistance.",
                    icon: Users
                },
            ],
        },
    ];

    return recommendations.find(rec => score >= rec.range[0] && score <= rec.range[1])?.items || [];
};

const getGeneralAdvice = () => {
    return [
        {
            title: "Mental Health Support",
            content: "Many individuals with autism or autism-like traits benefit from mental health support, including counseling and cognitive-behavioral therapy (CBT).",
            icon: <HeartPulse className="h-6 w-6 mb-2 text-blue-600"/>
        },
        {
            title: "Educational Accommodations",
            content: "Ensure that educational settings provide necessary accommodations, such as individualized education plans (IEPs) and specialized support.",
            icon: <GraduationCap className="h-6 w-6 mb-2 text-blue-600"/>
        },
        {
            title: "Social Skills Training",
            content: "Programs focusing on social skills can significantly improve interactions and quality of life.",
            icon: <Users className="h-6 w-6 mb-2 text-blue-600"/>
        },
        {
            title: "Regular Medical Checkups",
            content: "Regular medical and developmental checkups can help address any co-occurring conditions or concerns early on.",
            icon: <Stethoscope className="h-6 w-6 mb-2 text-blue-600"/>
        },
        {
            title: "Family Education",
            content: "Educate family members about autism to foster a supportive home environment and reduce misunderstandings.",
            icon: <Home className="h-6 w-6 mb-2 text-blue-600"/>
        }
    ];
};

const getInterpretationDetails = (score: number) => {
    if (score <= 25) return "A score of 25 indicates no signs of autism. This score suggests that there are no significant characteristics related to autism in various aspects such as social interaction, communication, and repetitive behaviors.";
    if (score <= 50) return "A score of 50 indicates the presence of some traits associated with autism, but it is unlikely to be autism. This may reflect mild social difficulties or special interests, but not enough to warrant an autism diagnosis.";
    if (score <= 65) return "A score of 65 suggests that autism should be considered as a potential diagnosis. This score is at the threshold for autism consideration, indicating the need for a more in-depth assessment.";
    if (score <= 90) return "A score of 90 indicates significant signs of autism, although such scores can also be found in non-autistic individuals. This suggests that the individual may exhibit multiple characteristics of autism and needs further professional assessment.";
    if (score <= 130) return "A score of 130 is the average score among individuals with autism, strongly suggesting the presence of autism. This indicates that the individual has noticeable autism characteristics in social, communication, and behavioral aspects.";
    if (score <= 160) return "A score of 160 indicates overwhelming evidence of autism. This score suggests that the individual exhibits very strong and numerous characteristics associated with autism.";
    if (score <= 227) return "A score of 227 represents the highest score recorded by individuals with autism in the foundational RAADS-R study. This indicates a very high level of autism characteristics.";
    return "A score of 240 is the maximum score attainable on the RAADS-R scale, indicating the presence of all measured characteristics associated with autism to the highest degree.";
};

const pricingTiers = [
    {
        name: "basic",
        title: "Basic",
        originalPrice: 18.00,
        price: 8,
        features: ["1 eBook"],
    },
    {
        name: "premium",
        title: "Premium",
        originalPrice: 38,
        price: 18,
        features: ["Full RAADS-R Report", "3 eBooks", "1 Year AI Assistant Access"],
    },
    {
        name: "service",
        title: "Service",
        originalPrice: 1600,
        price: 800,
        features: ["Full RAADS-R Report", "3 eBooks", "1 Year AI Assistant Access", "One-Month Email Consultation Service"],
    },
];

const ebooks = [
    {
        title: "Unmasking Autism",
        cover: "/raads_report/ebook/unmasking_autism.jpg",
        description: `
        A deep dive into the spectrum of Autistic experience and the phenomenon of masked Autism, giving individuals the tools to safely uncover their true selves while broadening society’s narrow understanding of neurodiversity.

        <em>“A remarkable work that will stand at the forefront of the neurodiversity movement.”—Barry M. Prizant, PhD, CCC-SLP, author of Uniquely Human: A Different Way of Seeing Autism</em>
        `,
        link: "#"
    },
    {
        title: "I Think I Might Be Autistic",
        cover: "/raads_report/ebook/i_think_i_might_be_autistic.jpg",
        description: `
        This New York Times–bestselling book upends conventional thinking about autism and suggests a broader model for acceptance, understanding, and full participation in society for people who think differently.

        <em>“Beautifully told, humanizing, important.”—The New York Times Book Review</em>
        <em>“Breathtaking.”—The Boston Globe</em>
        <em>“Epic and often shocking.”—Chicago Tribune</em>

        WINNER OF THE SAMUEL JOHNSON PRIZE FOR NONFICTION AND THE CALIFORNIA BOOK AWARD
        `,
        link: "#"
    },
    {
        title: "Neuro Tribe",
        cover: "/raads_report/ebook/neuro_tribes.jpg",
        description: `
        In her forties, the author was diagnosed with Asperger's syndrome. She addresses aspects of living with ASD as a late-diagnosed adult, including coping with the emotional effect of discovering oneself to be autistic and deciding with whom to share the diagnosis and how.
        `,
        link: "#"
    },
];

export default function RAADSRReport() {
    const searchParams = useSearchParams();
    const [totalScore, setTotalScore] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [showEbooks, setShowEbooks] = useState(true);
    const [paymentCancelled, setPaymentCancelled] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePayment = (tier) => {
        // Implement actual payment logic here
        window.location.href = `/raads_report/checkout?score=${totalScore}&package=${tier}`;
    };

    const EbookPreview = () => (
        <div className="mt-4 w-full">
            <button
                onClick={() => setShowEbooks(!showEbooks)}
                className="flex items-center justify-between w-full p-2 bg-gray-100 rounded"
            >
                <span className="font-bold">Included eBooks (Standard & Premium Plans)</span>
                {showEbooks ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
            </button>
            {showEbooks && (
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {ebooks.map((book, index) => (
                        <div key={index} className="p-2 border rounded">
                            <img src={book.cover} alt={book.title}
                                 className="w-20 md:w-32 object-cover float-left mr-2 border-black drop-shadow-md"/>
                            <div>
                                <h4 className="font-bold text-sm">{book.title}</h4>
                                <p
                                    className="text-xs text-gray-600"
                                    style={{whiteSpace: 'pre-wrap'}}
                                    dangerouslySetInnerHTML={{__html: book.description}}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const EbookDownload = () => (
        <div className="mt-4 w-full">
            <div className="grid grid-cols-1 gap-4 mt-4">
                {ebooks.map((book, index) => (
                    <div key={index} className="p-2 border rounded">
                        <img src={book.cover} alt={book.title}
                             className="w-20 md:w-32 object-cover float-left mr-2 border-black drop-shadow-md"/>
                        <div>
                            <h4 className="font-bold text-sm">{book.title}</h4>
                            <p
                                className="text-xs text-gray-600"
                                style={{whiteSpace: 'pre-wrap'}}
                                dangerouslySetInnerHTML={{__html: book.description}}
                            />
                        </div>
                        <a className="mb-4 bg-blue-600 text-white px-4 py-2 rounded float-right ml-2 flex items-center"
                           href={book.link}>Download</a>
                    </div>
                ))}
            </div>
        </div>
    );

    useEffect(() => {
        const scoreFromParams = searchParams.get('score');
        if (scoreFromParams) {
            const parsedScore = parseInt(scoreFromParams, 10);
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 240) {
                setTotalScore(parsedScore);
            }
        }

        const paymentStatus = searchParams.get('status');
        if (paymentStatus === 'success') {
            // verify payment status
            const sessionId = searchParams?.get('session_id');
            if (sessionId) {
                fetch(`/raads_report/api/checkout/verify?session_id=${sessionId}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        setIsPaid(true);
                        setSelectedTier(data.metadata.plan);
                    })
                    .catch(error => {
                        console.error("Failed to verify payment:", error);
                    });
            }
        } else if (paymentStatus === 'cancel') {
            console.log("Payment cancelled.");
            setPaymentCancelled(true);
            setShowFlash(true);
            setTimeout(() => {
                setPaymentCancelled(false);
            }, 3000); // 3秒后隐藏通知栏
            setTimeout(() => {
                setShowFlash(false);
            }, 6000); // 6秒后停止边框闪烁
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div>

                {/* Payment overlay */}
                {!selectedTier && (
                    <div
                        className="flex items-center justify-center overflow-auto">
                        <div
                            className="text-center p-4 sm:p-8 w-full max-w-4xl h-full">
                            <Lock className="h-12 w-12 mx-auto mb-4 text-blue-600"/>
                            <h2 className="text-2xl font-bold mb-4">Unlock Your RAADS-R Report</h2>
                            <p className="mb-6">Choose a plan to access your complete RAADS-R evaluation report and
                                additional resources.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {pricingTiers.map((tier, index) => (
                                    <div key={index}
                                         className={`border-2 rounded-lg p-4 flex flex-col justify-between ${showFlash ? 'flash-border' : ''}`}>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">{tier.title}</h3>
                                            <div className="mb-4">
                                                <span className="text-2xl font-bold text-green-600">${tier.price}</span>
                                                <span
                                                    className="text-sm text-gray-500 line-through ml-2">${tier.originalPrice}</span>
                                            </div>
                                            <ul className="text-left mb-4">
                                                {tier.features.map((feature, fIndex) => (
                                                    <li key={fIndex} className="flex items-center mb-2">
                                                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0"/>
                                                        <span className="text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => handlePayment(tier.name)}
                                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mt-auto"
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full flex flex-wrap md:justify-end button-container">
                    <button onClick={handlePrint}
                            className={`mb-4 px-4 py-2 rounded ml-4 flex items-center ${
                                isPaid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-300 cursor-not-allowed'
                            }`} disabled={!isPaid}>

                        {isPaid ? (
                            <Download className="mr-2 text-white"/>
                        ) : (
                            <XCircle className="mr-2 text-gray-300"/>
                        )}
                        Download Report
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl" ref={componentRef}>
                    <h1 className="text-2xl font-bold mb-4">RAADS-R Evaluation Report</h1>
                    <p className="text-sm text-gray-600 mb-4">Evaluation Date: {new Date().toLocaleDateString()}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className={`col-span-2 ${!isPaid ? 'blur-md' : ''}`}>
                            <h2 className="text-xl font-bold mb-2">Analysis and Interpretation</h2>
                            <p className="mb-2">{getInterpretationDetails(totalScore)}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h2 className="font-bold mb-2">Total Score</h2>
                                <div className="text-4xl font-bold text-blue-600">{totalScore}</div>
                                <p className="text-sm mt-1">{getInterpretation(totalScore)}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`mb-6 ${!isPaid ? 'blur-md' : ''}`}>
                        <h2 className="text-xl font-bold mb-2">Recommendations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getRecommendations(totalScore).map((recommendation, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-1">
                                        <recommendation.icon className="h-6 w-6 mb-2 text-blue-600"/>
                                        <h3 className="font-bold ml-3">{recommendation.title}</h3>
                                    </div>
                                    <p className="text-sm">{recommendation.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`mb-6 ${!isPaid ? 'blur-md' : ''}`}>
                        <h2 className="text-xl font-bold mb-2">General Advice for All</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getGeneralAdvice().map((advice, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-1">
                                        {advice.icon}
                                        <h3 className="font-bold ml-3">{advice.title}</h3>
                                    </div>
                                    <p className="text-sm">{advice.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        <h3 className="font-bold mb-1">Data Privacy Notice</h3>
                        <p>Your evaluation data is confidential and used only for your personal assessment. We strictly
                            protect your privacy and ensure your personal information is not disclosed.</p>
                    </div>
                </div>

                {!selectedTier && (
                    <div
                        className="flex items-center justify-center overflow-auto">
                        <div
                            className="text-center p-4 sm:p-8 w-full max-w-4xl h-full">
                            <EbookPreview/>
                        </div>
                    </div>
                )}

                {(selectedTier === 'Premium' || selectedTier === 'Service') && (
                    <>
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mt-4" id="EBook">
                            <h1 className="text-2xl font-bold mb-4">E-Book</h1>
                            <div className={!isPaid ? 'blur-md' : ''}>
                                <EbookDownload/>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mt-4" id="AI_Assistant">
                            <h1 className="text-2xl font-bold mb-4">Continuous AI Assistant</h1>
                            <div className={`flex justify-center${!isPaid ? 'blur-md' : ''}`}>
                                <a className="mb-4 bg-blue-600 text-white px-4 py-2 rounded ml-4 flex items-center"
                                   href="#AI_Assistant">
                                    <Calendar className="mr-2"/>
                                    One Year Access
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {paymentCancelled && (
                    <div
                        className="fixed top-0 left-0 right-0 bg-[#ffa500] text-white flex items-center justify-center">
                        <div className="p-4 text-center">
                            <h2 className="text-2xl font-bold mb-4">Payment Cancelled</h2>
                            <p>Your payment was cancelled. Please choose a suitable plan to unlock your complete RAADS-R
                                report and additional resources.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
