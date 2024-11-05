"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
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
    Eye,
    Facebook,
    GraduationCap,
    Heart,
    HeartPulse,
    Home,
    Lock,
    Monitor,
    Stethoscope,
    Twitter,
    Users,
    XCircle
} from 'lucide-react';
import axios from "axios";
import { logEvent } from '@/lib/GAlog';
import MarketingPopup from "@/components/MarketingPopup";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import ReactMarkdown from 'react-markdown';

const ScoreCharts = dynamic(() => import('@/components/ScoreCharts'), {
    ssr: false,
    loading: () => <p>Loading charts...</p>
});

const FEISHU_NOTIFY_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/f4c87354-47b7-4ad1-83ff-a56962dc83a1';

async function notifyFeishu(message: any) {
    try {
        await axios.post(FEISHU_NOTIFY_WEBHOOK_URL, {
            msg_type: 'text',
            content: {
                text: message,
            },
        });
    } catch (error) {
        console.error('Failed to send Feishu notification', error);
    }
}

async function getIPLocation(ip: any) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch IP location:', error);
        return null;
    }
}

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
            icon: <HeartPulse className="h-6 w-6 mb-2 text-blue-600" />
        },
        {
            title: "Educational Accommodations",
            content: "Ensure that educational settings provide necessary accommodations, such as individualized education plans (IEPs) and specialized support.",
            icon: <GraduationCap className="h-6 w-6 mb-2 text-blue-600" />
        },
        {
            title: "Social Skills Training",
            content: "Programs focusing on social skills can significantly improve interactions and quality of life.",
            icon: <Users className="h-6 w-6 mb-2 text-blue-600" />
        },
        {
            title: "Regular Medical Checkups",
            content: "Regular medical and developmental checkups can help address any co-occurring conditions or concerns early on.",
            icon: <Stethoscope className="h-6 w-6 mb-2 text-blue-600" />
        },
        {
            title: "Family Education",
            content: "Educate family members about autism to foster a supportive home environment and reduce misunderstandings.",
            icon: <Home className="h-6 w-6 mb-2 text-blue-600" />
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
        name: "premium",
        title: "Premium",
        originalPrice: 99.99,
        price: 39.99,
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
    },
    {
        name: "basic",
        title: "Basic",
        originalPrice: 29.99,
        price: 15.99,
        features: [
            {
                text: `Comprehensive Report: <strong>In-Depth Analysis & Personalized Insights</strong>`,
                anchorName: 'report'
            }
        ],
    },
];

const ebooks = [
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
        link: "/raads_report/ebook/I Think I Might Be Autistic A Guide to Autism Spectrum Disorder Diagnosis and Self-Discovery for Adults (Cynthia Kim) .epub",
        amazonPrice: 12.99
    },
    {
        title: "Neuro Tribe",
        cover: "/raads_report/ebook/neuro_tribes.jpg",
        description: `
        In her forties, the author was diagnosed with Asperger's syndrome. She addresses aspects of living with ASD as a late-diagnosed adult, including coping with the emotional effect of discovering oneself to be autistic and deciding with whom to share the diagnosis and how.
        `,
        link: "/raads_report/ebook/Neurotribes The Legacy of Autism and the Future of Neurodiversity (Steve Silberman) .epub",
        amazonPrice: 12.99
    },
    {
        title: "Autism and Asperger Syndrome in Adults",
        cover: "/raads_report/ebook/autism_and_asperger_syndrome_in_adults.jpg",
        description: `
        Autism is still persistently viewed as a disorder or impairment, but this concept needs to be challenged. Written by a university lecturer with several years’ experience in the field, this helpful book presents an up-to-date overview of autism and Asperger syndrome. Dr Luke Beardon comments on the realities of adult life, including further and higher education, employment, dating and parenthood. Autism and Asperger Syndrome in Adults is written for autistic people, their families and friends, and all professionals interested in autism.
        `,
        link: "/raads_report/ebook/Autism and Asperger Syndrome in Adults (Beardon Luke Dr) .epub",
        amazonPrice: 8.99
    },
];

// 添加新的状态和类型定义
interface AnswerData {
    i: number; // id
    a: number; // answerIndex
}

interface AIReport {
    content: string;
    loading: boolean;
    error: string | null;
    isTyping: boolean; // 添加打字动画状态
}

export default function RAADSRReport() {
    const searchParams = useSearchParams();
    const [totalScore, setTotalScore] = useState(0);
    const [scores, setScores] = useState({
        socialRelatedness: 0,
        circumscribedInterests: 0,
        language: 0,
        sensoryMotor: 0
    });
    const [isPaid, setIsPaid] = useState(false);
    const [hasDetailedScores, setHasDetailedScores] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [showEbooks, setShowEbooks] = useState(true);
    const [paymentCancelled, setPaymentCancelled] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [customerEmail, setCustomerEmail] = useState<string | null>(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const componentRef = useRef(null);
    const purchaseRef = useRef(null); // 用于滚动到购买区域
    const reportRef = useRef(null);
    const ebookDetailRef = useRef(null);
    const aiDetailRef = useRef(null);
    const [answersDetail, setAnswersDetail] = useState<Array<{
        id: number;
        text: string;
        answer: string;
    }>>([]);
    const [aiReport, setAIReport] = useState<AIReport>({
        content: '',
        loading: false,
        error: null,
        isTyping: false
    });

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => {
            logEvent('click', 'RAADSRReport', 'print_report', totalScore);
        }
    });

    const handlePayment = (tier: string, coupon = "") => {
        logEvent('click', 'RAADSRReport', 'initiate_payment', totalScore);
        window.location.href = `/checkout?score=${totalScore}&package=${tier}` + (coupon ? '&coupon=' + coupon : '');
    };

    const EbookPreview = () => (
        <div className="mt-4 w-full">
            <button
                onClick={() => setShowEbooks(!showEbooks)}
                className="flex items-center justify-between w-full p-2 bg-gray-100 rounded"
            >
                <span className="font-bold">Included eBooks</span>
                {showEbooks ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {showEbooks && (
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {ebooks.map((book, index) => (
                        <div key={index} className="p-2 border rounded">
                            <h4 className="font-bold text-sm mb-2">{book.title}</h4>
                            <div className="flex items-center justify-between">
                                <img src={book.cover} alt={book.title}
                                    className="w-20 md:w-32 object-cover float-left mr-2 border-black drop-shadow-md" />
                                <div>
                                    <p
                                        className="text-xs text-gray-600"
                                        style={{ whiteSpace: 'pre-wrap' }}
                                        dangerouslySetInnerHTML={{ __html: book.description }}
                                    />
                                    <p className="amazon-price font-bold">Retail Price: <span
                                        className="text-gray-500 line-through">${book.amazonPrice}</span></p>
                                </div>
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
                {ebooks.map((book, index) => {
                    // Check if selectedTier is 'service' and if the current book is the first one
                    if (selectedTier === 'basic' && index > 0) {
                        return null;
                    }

                    return (
                        <div key={index} className="p-2 border text-center rounded">
                            <h4 className="font-bold text-sm mb-2">{book.title}</h4>
                            <div className="flex items-center justify-between">
                                <img src={book.cover} alt={book.title}
                                    className="w-20 md:w-32 object-cover float-left mr-2 border-black drop-shadow-md" />
                                <div>
                                    <p
                                        className="text-xs text-gray-600"
                                        style={{ whiteSpace: 'pre-wrap' }}
                                        dangerouslySetInnerHTML={{ __html: book.description }}
                                    />
                                    <a className="mb-4 bg-blue-600 text-white px-4 py-2 rounded float-right ml-2 flex items-center"
                                        href={book.link}>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    useEffect(() => {
        document.title = "Unlock RAADs-R Assessment Report";

        const scoreFromParams = searchParams.get('score');
        if (scoreFromParams) {
            const parsedScore = parseInt(scoreFromParams, 10);
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 240) {
                setTotalScore(parsedScore);
                logEvent('page_view', 'RAADSRReport', 'view_report', parsedScore);
            }
        }

        // 加载分数数据
        const cookieScores = Cookies.get('scores');
        if (cookieScores) {
            try {
                const parsedScores = JSON.parse(cookieScores);
                setScores(parsedScores);
                setHasDetailedScores(true);
            } catch (error) {
                console.error('Failed to parse scores from cookie:', error);
                setHasDetailedScores(false);
            }
        }

        // 加载总分
        const totalScoreFromCookie = Cookies.get('totalScore');
        if (totalScoreFromCookie) {
            setTotalScore(parseInt(totalScoreFromCookie, 10));
        }

        const paymentStatus = searchParams.get('status');
        if (paymentStatus === 'success') {
            // verify payment status
            const sessionId = searchParams?.get('session_id');
            if (sessionId) {
                fetch(`/api/checkout/verify?session_id=${sessionId}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        setIsPaid(true);
                        setSelectedTier(data.metadata?.plan);
                        setCustomerEmail(data.session?.customer_email || data.session?.customer_details?.email);

                        // 添加空值检查
                        const invoiceNum = data.invoice?.number;
                        setInvoiceNumber(invoiceNum || null);

                        // 获取当前时间并转换为东八区时间格式
                        const date = new Date();
                        const options = { timeZone: 'Asia/Shanghai', hour12: false };
                        const formattedDate = date.toLocaleString('zh-CN', options);

                        // 添加空值检查
                        const email = data.session?.customer_email || data.session?.customer_details?.email || 'Unknown';
                        const plan = data.metadata?.plan || 'Unknown';
                        const invoice = invoiceNum || 'No invoice number';

                        notifyFeishu(`[${process.env.NEXT_PUBLIC_ENV_HINT}] ${email} 购买了 ${plan}, 回执编号 ${invoice}, 在 ${formattedDate} 访问了购买成功页面`);

                        // 记录支付成功事件
                        logEvent('purchase', 'RAADSRReport', 'payment_success', data.metadata?.score);
                    })
                    .catch(error => {
                        console.error("Failed to verify payment:", error);
                        // 添加错误处理
                        setIsPaid(false);
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

            // 记录支付取消事件
            logEvent('purchase', 'RAADSRReport', 'payment_cancel', totalScore);
        }

        // 修改 IP 获取和位置查询逻辑
        const getLocationInfo = async () => {
            try {
                const ipResponse = await axios.get('https://api.ipify.org?format=json');
                const ip = ipResponse.data.ip;

                // 获取当前时间并转换为东八区时间格式
                const date = new Date();
                const options = { timeZone: 'Asia/Shanghai', hour12: false };
                const formattedDate = date.toLocaleString('zh-CN', options);
                const currentUrl = window.location.href;

                try {
                    const location = await getIPLocation(ip);
                    if (location) {
                        await notifyFeishu(
                            `[${currentUrl}] [${formattedDate}] IP: ${ip} [${location.city || 'Unknown'}, ${location.region || 'Unknown'}, ${location.country_name || 'Unknown'}], 用户访问报告详情页`
                        );
                    }
                } catch (locationError) {
                    // 如果获取位置失败，仍然发送基本信息
                    await notifyFeishu(
                        `[${currentUrl}] [${formattedDate}] IP: ${ip}, 用户访问报详页 (位置信息获取失败)`
                    );
                    console.warn('Failed to fetch location details:', locationError);
                }
            } catch (error) {
                console.error('Failed in IP tracking process:', error);
            }
        };

        getLocationInfo();

        // 加载答案详情
        const cookieAnswers = Cookies.get('answersDetail');
        if (cookieAnswers) {
            try {
                const parsedAnswers = JSON.parse(cookieAnswers);
                setAnswersDetail(parsedAnswers);
            } catch (error) {
                console.error('Failed to parse answers from cookie:', error);
            }
        }

        // 从 URL 参数中获取邮箱
        const email = searchParams.get('email');
        if (email) {
            setCustomerEmail(email);
        }

        // 从支付会话中获取邮箱
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            fetch(`/api/checkout/verify?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setIsPaid(true);
                    setSelectedTier(data.metadata?.plan);
                    // 设置邮箱，优先使用会话中的邮箱
                    setCustomerEmail(data.session?.customer_email || data.session?.customer_details?.email || email);

                    // ... rest of the code ...
                })
                .catch(error => {
                    console.error("Failed to verify payment:", error);
                    setIsPaid(false);
                });
        }
    }, [searchParams]);

    const [shareError, setShareError] = useState('');

    const handleTwitterShare = () => {
        try {
            console.log('Attempting to share on Twitter...');
            const text = `My RAADS-R TEST score is ${totalScore}. ${getInterpretation(totalScore)}`;
            const url = 'https://raadstest.com';
            const hashtags = 'RAADSR,AutismAwareness';
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
            const newWindow = window.open(twitterUrl, '_blank');
            if (newWindow) {
                newWindow.opener = null;
                // 记录成功的分享事件
                logEvent('share', 'RAADSRReport', 'share_twitter_success', totalScore);
            } else {
                setShareError('Popup blocked. Please allow popups for this site.');
                // 记录失败的分享事件
                logEvent('share', 'RAADSRReport', 'share_twitter_blocked', totalScore);
            }
        } catch (error) {
            console.error('Error sharing to Twitter:', error);
            setShareError('An error occurred while sharing. Please try again.');
            // 记录错误的分享事件
            logEvent('share', 'RAADSRReport', 'share_twitter_error', totalScore);
        }
    };

    const handleFacebookShare = () => {
        try {
            console.log('Attempting to share on Facebook...');
            const url = 'https://raadstest.com';
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            const newWindow = window.open(facebookUrl, '_blank');
            if (newWindow) {
                newWindow.opener = null;
                // 记录成功的分享事件
                logEvent('share', 'RAADSRReport', 'share_facebook_success', totalScore);
            } else {
                setShareError('Popup blocked. Please allow popups for this site.');
                // 记录失败的分享事件
                logEvent('share', 'RAADSRReport', 'share_facebook_blocked', totalScore);
            }
        } catch (error) {
            console.error('Error sharing to Facebook:', error);
            setShareError('An error occurred while sharing. Please try again.');
            // 记录错误的分享事件
            logEvent('share', 'RAADSRReport', 'share_facebook_error', totalScore);
        }
    };

    // 添加一个检查是否在浏览器环境的函数
    const isBrowser = () => typeof window !== 'undefined';

    // 修改 checkAnswersExist 函数
    const checkAnswersExist = () => {
        if (!isBrowser()) return false;

        try {
            const chunkCount = parseInt(localStorage.getItem('answersChunkCount') || '0');
            const questionsMap = localStorage.getItem('questionsMap');
            const optionsMap = localStorage.getItem('optionsMap');

            return chunkCount > 0 && questionsMap && optionsMap;
        } catch (error) {
            console.error('Error checking answers:', error);
            return false;
        }
    };

    // 修改 handleGenerateReport 函数中的 localStorage 相关代码
    const handleGenerateReport = async () => {
        if (isBrowser()) {
            // 首先检查 localStorage 中是否已有报告
            const storedReport = localStorage.getItem(`aiReport_${totalScore}`);
            if (storedReport) {
                setAIReport({
                    content: storedReport,
                    loading: false,
                    error: null,
                    isTyping: false
                });
                return;
            }
        }

        setAIReport({
            content: '',
            loading: true,
            error: null,
            isTyping: false
        });

        try {
            const prompt = generatePrompt();
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: prompt })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            // 存储完整的报告内容到 localStorage
                            localStorage.setItem(`aiReport_${totalScore}`, fullContent);
                            setAIReport(prev => ({
                                ...prev,
                                loading: false,
                                isTyping: false
                            }));
                        } else {
                            try {
                                const parsedData = JSON.parse(data);
                                if (parsedData.content) {
                                    fullContent += parsedData.content;
                                    handleSSE(data);
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e);
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setAIReport(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                loading: false,
                isTyping: false
            }));
        }
    };

    // 修改生成提示词函数，添加错误处理
    const generatePrompt = () => {
        const dimensionScores = {
            "Social Relatedness": scores.socialRelatedness,
            "Circumscribed Interests": scores.circumscribedInterests,
            "Language": scores.language,
            "Sensory-Motor": scores.sensoryMotor
        };

        // 基础提示词部分
        let prompt = `As a professional psychological expert specializing in autism, please analyze the following RAADS-R test results:

OVERALL SCORE: ${totalScore}/240

DIMENSION SCORES:
${Object.entries(dimensionScores)
                .map(([dimension, score]) => `${dimension}: ${score}`)
                .join('\n')}`;

        // 如果有详细答案，添加答案部分
        if (answersDetail.length > 0) {
            prompt += `\n\nDETAILED RESPONSES:\n${answersDetail.map(a =>
                `Q${a.id}. "${a.text}"\n    Response: ${a.answer}`
            ).join('\n\n')
                }`;
        }

        // 添加输出要求
        prompt += `\n\nPlease provide:
1. A comprehensive analysis of the test results
2. Interpretation of each dimension score
${answersDetail.length > 0 ? '3. Specific patterns or notable responses\n' : ''}
4. Practical recommendations for daily life improvement
5. Suggested support resources and next steps

Format the response in clear sections with headers.`;

        return prompt;
    };

    // 自定义 Markdown 组件样式
    const MarkdownComponents = {
        h1: ({ children }: any) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-800">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-xl font-bold mb-3 text-gray-700">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-lg font-semibold mb-2 text-gray-600">{children}</h3>
        ),
        p: ({ children }: any) => (
            <p className="mb-4 text-gray-600 leading-relaxed break-words whitespace-pre-wrap">{children}</p>
        ),
        ul: ({ children }: any) => (
            <ul className="list-disc pl-5 mb-4 text-gray-600">{children}</ul>
        ),
        li: ({ children }: any) => (
            <li className="mb-2">{children}</li>
        ),
        strong: ({ children }: any) => (
            <strong className="font-semibold text-gray-800">{children}</strong>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 break-words whitespace-pre-wrap">
                {children}
            </blockquote>
        ),
        a: ({ children, href }: any) => (
            <a
                href={href}
                className="text-blue-600 hover:text-blue-800 break-words overflow-hidden overflow-ellipsis"
                style={{ maxWidth: '100%', display: 'inline-block' }}
            >
                {children}
            </a>
        ),
    };

    // 修改 handleSSE 函数
    const handleSSE = (response: string) => {
        try {
            const data = JSON.parse(response);
            if (data.content) {
                setAIReport(prev => {
                    // 确保新内容被追加到现有内容后面
                    const newContent = prev.content + data.content;
                    return {
                        ...prev,
                        content: newContent,
                        isTyping: true
                    };
                });
            } else if (data.error) {
                setAIReport(prev => ({
                    ...prev,
                    error: data.error,
                    loading: false,
                    isTyping: false
                }));
            }
        } catch (error) {
            console.error('Error parsing SSE response:', error);
        }
    };

    // 修改自动生成报告的 useEffect
    useEffect(() => {
        if (totalScore > 0 && checkAnswersExist()) {
            handleGenerateReport();
        }
    }, [totalScore]);

    // 修改报告展示部分
    const renderAIReport = () => {
        return (
            <div className={`${!isPaid ? 'blur-sm' : ''} max-w-full`}>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Book className="mr-2 flex-shrink-0" />
                    <span className="break-words">In-Depth Analysis & Personalized Insights</span>
                </h2>
                <div className="mb-2 overflow-hidden">
                    {aiReport.loading && !aiReport.content ? (
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Generating comprehensive analysis...</p>
                        </div>
                    ) : aiReport.error ? (
                        <div className="text-red-500 p-4 flex items-center">
                            <AlertTriangle className="mr-2 flex-shrink-0" />
                            <span className="break-words">Error generating report: {aiReport.error}</span>
                        </div>
                    ) : aiReport.content ? (
                        <div className="prose max-w-none overflow-hidden">
                            <div className="markdown-content-wrapper relative">
                                <ReactMarkdown
                                    components={MarkdownComponents}
                                    className={`markdown-content ${aiReport.isTyping ? 'typing' : ''} break-words`}
                                >
                                    {aiReport.content}
                                </ReactMarkdown>
                                {aiReport.isTyping && (
                                    <span className="typing-cursor absolute bottom-0 right-0">|</span>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    };

    // 修改报告展示部分
    const renderContent = () => {
        // 如果没有答案数据，只显示基础解释
        if (!checkAnswersExist()) {
            return (
                <div className={`${!isPaid ? 'blur-sm' : ''}`}>
                    <h2 className="text-xl font-bold mb-2">Analysis and Interpretation</h2>
                    <p className="mb-2">{getInterpretationDetails(totalScore)}</p>
                </div>
            );
        }

        // 如果有答案数据，显示 AI 报告或基础解释
        if (aiReport.content) {
            return renderAIReport();
        }

        return (
            <div className={`${!isPaid ? 'blur-sm' : ''}`}>
                <h2 className="text-xl font-bold mb-2">Analysis and Interpretation</h2>
                <p className="mb-2">{getInterpretationDetails(totalScore)}</p>
            </div>
        );
    };

    // 添加一个新的 state 来控制按钮的位置
    const [lockButtonVisible, setLockButtonVisible] = useState(false);

    // 添加一个 useEffect 来监听滚动事件
    useEffect(() => {
        if (!isPaid) {
            const handleScroll = () => {
                const blurredElements = document.querySelectorAll('.blur-sm');
                let isVisible = false;

                blurredElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        isVisible = true;
                    }
                });

                setLockButtonVisible(isVisible);
            };

            window.addEventListener('scroll', handleScroll);
            handleScroll(); // 初始检查

            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isPaid]);

    // 添加固定定位的解锁按钮
    const FloatingUnlockButton = () => {
        const handleUnlockClick = () => {
            // 滚动到购买区域
            (purchaseRef.current as any)?.scrollIntoView({ behavior: 'smooth' });

            // 记录事件
            logEvent('click', 'RAADSRReport', 'unlock_full_report', totalScore);

            // 发送飞书通知（异步，不阻塞）
            const message = `[${process.env.NEXT_PUBLIC_ENV_HINT}] User ${customerEmail || 'Unknown'} clicked unlock full report button (Score: ${totalScore})`;
            notifyFeishu(message).catch(error => {
                console.error('Failed to send Feishu notification:', error);
            });
        };

        return (
            <div
                className={`
                    fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                    flex flex-col items-center justify-center
                    transition-opacity duration-300 z-50
                    ${lockButtonVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
            >
                <Lock className="h-16 w-16 text-blue-600 mb-4" />
                <button
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    onClick={handleUnlockClick}
                >
                    Unlock Full Report
                </button>
            </div>
        );
    };

    // 1. 首先添加日期格式化工具函数
    const formatDate = () => {
        // 使用固定格式，避免客户端/服务端差异
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    // 2. 修改组件，使用 useEffect 确保客户端渲染
    const [mounted, setMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setMounted(true);
        setCurrentDate(formatDate());
    }, []);

    // 3. 使用 dynamic import 处理客户端组件
    const DynamicScoreCharts = dynamic(() => import('@/components/ScoreCharts'), {
        ssr: false,
        loading: () => <div className="min-h-[300px] flex items-center justify-center">Loading charts...</div>
    });

    // 4. 返回组件JSX，确保服务端和客户端渲染一致
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {!isPaid && <FloatingUnlockButton />}
            <div>
                <div className="w-full flex flex-wrap md:justify-end button-container"
                    ref={reportRef}>
                    <button onClick={handlePrint}
                        className={`mb-4 px-4 py-2 rounded ml-4 flex items-center ${isPaid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-300 cursor-not-allowed'
                            }`} disabled={!isPaid}>

                        {isPaid ? (
                            <Download className="mr-2 text-white" />
                        ) : (
                            <XCircle className="mr-2 text-gray-300" />
                        )}
                        Download Report
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative" ref={componentRef}>
                    <h1 className="text-2xl font-bold mb-4">RAADS-R Evaluation Report</h1>
                    {/* 只在客户端渲染日期 */}
                    {mounted && (
                        <p className="text-sm text-gray-600 mb-4">
                            Evaluation Date: {currentDate}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="col-span-2 relative">
                            {hasDetailedScores && (
                                <div className={`${!isPaid ? 'blur-sm' : ''}`}>
                                    <h2 className="text-xl font-bold mb-2">RAADS-R Visualization</h2>
                                    {scores.socialRelatedness !== undefined && (
                                        <div className="min-h-[650px] md:min-h-[300px] w-full">
                                            <DynamicScoreCharts scores={scores} />
                                        </div>
                                    )}
                                </div>
                            )}
                            {renderContent()}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h2 className="font-bold mb-2">Total Score</h2>
                                <div className="text-4xl font-bold text-blue-600">{totalScore}</div>
                                <p className="text-sm mt-1">{getInterpretation(totalScore)}</p>
                                <div className="mt-2 flex justify-end space-x-2">
                                    <button
                                        onClick={handleTwitterShare}
                                        className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition duration-300 z-30"
                                    >
                                        <Twitter size={20} />
                                    </button>
                                    <button
                                        onClick={handleFacebookShare}
                                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300 z-30"
                                    >
                                        <Facebook size={20} />
                                    </button>
                                </div>
                                {shareError && (
                                    <p className="text-red-500 text-sm mt-2">{shareError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                            className={`mb-6 ${!isPaid ? 'blur-sm' : ''}`}>
                            <h2 className="text-xl font-bold mb-2">Recommendations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {getRecommendations(totalScore).map((recommendation, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-1">
                                            <recommendation.icon className="h-6 w-6 mb-2 text-blue-600" />
                                            <h3 className="font-bold ml-3">{recommendation.title}</h3>
                                        </div>
                                        <p className="text-sm">{recommendation.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`mb-6 ${!isPaid ? 'blur-sm' : ''}`}>
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
                    </div>

                    <div className="text-sm text-gray-600">
                        <h3 className="font-bold mb-1">Data Privacy Notice</h3>
                        <p>Your evaluation data is confidential and used only for your personal assessment. We strictly
                            protect your privacy and ensure your personal information is not disclosed.</p>
                    </div>
                </div>

                {/* Payment overlay */}
                {!selectedTier && (
                    <div
                        ref={purchaseRef}
                        className="flex items-center justify-center overflow-auto mt-6">
                        <div
                            className="text-center p-4 sm:p-8 w-full max-w-4xl h-full">
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="flex items-center space-x-4">
                                    <Lock className="h-12 w-12 text-blue-600" />
                                    <h2 className="text-2xl font-bold">Unlock Report</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 justify-center">
                                {pricingTiers.map((tier, index) => (
                                    <div key={index}
                                        className={`border-2 rounded-lg p-4 flex flex-col justify-between mx-auto ${showFlash ? 'flash-border' : ''}`}>
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
                                                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                                        <div>
                                                            <span className="text-sm"
                                                                dangerouslySetInnerHTML={{ __html: feature.text }} />{feature.anchorName !== 'none' &&
                                                                    <Eye
                                                                        onClick={() => {
                                                                            if (feature.anchorName === 'none')
                                                                                return;
                                                                            const ref = {
                                                                                report: reportRef,
                                                                                ebookDetail: ebookDetailRef,
                                                                                aiDetail: aiDetailRef
                                                                            }[feature.anchorName];
                                                                            (ref?.current as any)?.scrollIntoView({ behavior: 'smooth' });
                                                                        }}
                                                                        className="inline-block h-4 w-4 ml-2 text-blue-500 flex-shrink-0 cursor-pointer" />}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => handlePayment(tier.name as any)}
                                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mt-auto"
                                        >
                                            Unlock
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!selectedTier && (
                    <>
                        <div className="flex items-center justify-center overflow-auto"
                            ref={ebookDetailRef}>
                            <div
                                className="text-center p-4 sm:p-8 w-full max-w-4xl h-full">
                                <EbookPreview />
                            </div>
                        </div>
                        <div className="flex items-center justify-center overflow-auto"
                            ref={aiDetailRef}>
                            <div className="text-center p-4 sm:p-8 w-full max-w-4xl h-full">
                                <div className="mt-4 w-full">
                                    <span
                                        className="font-bold flex ml-2">Included AI Assistant</span>
                                    <div className="grid grid-cols-1 gap-4 mt-4">
                                        <div className="p-2 border rounded">
                                            <img src="/raads_report/thumbnail/ai_assistant.png" alt="AI Assistant"
                                                className="h-20 md:h-32 object-cover float-right ml-2 border-black drop-shadow-md" />
                                            <div className="flex flex-col items-start justify-between h-full">
                                                <div>
                                                    <h4 className="font-bold text-sm">AI Powered Mental Health
                                                        Assistant</h4>
                                                    <p
                                                        className="text-xs text-gray-600">
                                                        <br />
                                                        Experience personalized emotional support and professional
                                                        advice with
                                                        our AI-powered mental health assistant. Anytime, anywhere, our
                                                        assistant
                                                        is here to help you navigate life&apos;s challenges, improve
                                                        your mental
                                                        well-being, and enjoy a more fulfilling and balanced life.
                                                    </p>
                                                </div>
                                                <p className="amazon-price font-bold">One-Year Access: <span
                                                    className="text-gray-500 line-through">$199.99</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {(selectedTier === 'premium' || selectedTier === 'service') && (
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mt-4" id="EBook">
                        <h1 className="text-2xl font-bold mb-4">E-Book</h1>
                        <div className={!isPaid ? 'blur-md' : ''}>
                            <EbookDownload />
                        </div>
                    </div>
                )}

                {(selectedTier === 'premium' || selectedTier === 'service') && (
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mt-4" id="AI_Assistant">
                        <h1 className="text-2xl font-bold mb-4">Continuous AI Assistant</h1>
                        <div className={`${!isPaid ? 'blur-md' : ''}`}>
                            <img src="/raads_report/thumbnail/ai_assistant.png" alt="AI Assistant"
                                className="h-20 md:h-32 object-cover float-right ml-2 border-black drop-shadow-md" />
                            <h4 className="font-bold text-sm">AI Powered Mental Health
                                Assistant</h4>
                            <p
                                className="text-xs text-gray-600">
                                <br />
                                Experience personalized emotional support and professional advice with
                                our AI-powered mental health assistant. Anytime, anywhere, our assistant
                                is here to help you navigate life&apos;s challenges, improve your mental
                                well-being, and enjoy a more fulfilling and balanced life.
                            </p>
                            <a className="mb-4 bg-blue-600 text-white px-4 py-2 rounded mr-4 mt-4 float-left flex"
                                href="https://raadstest.com/ai-powered-mental-health-assistant-paidversion/"
                                target="_blank">
                                <Calendar className="mr-2" />
                                One Year Access
                            </a>
                            <div><br /><br /><br /></div>
                        </div>
                    </div>
                )}

                {paymentCancelled && (
                    <div
                        className="fixed top-0 left-0 right-0 bg-[#ffa500] text-white flex items-center justify-center z-20">
                        <div className="p-4 text-center">
                            <h2 className="text-2xl font-bold mb-4">Payment Cancelled</h2>
                            <p>Your payment was cancelled. Please choose a suitable plan to unlock your complete RAADS-R
                                report and additional resources.</p>
                        </div>
                    </div>
                )}

                {isPaid && (
                    <div className="font-italic text-xs text-gray-500 mt-4">
                        <em>If you have any
                            questions, please contact us at:
                            wd.gstar@gmail.com</em></div>
                )}
            </div>
            <MarketingPopup
                handlePayment={handlePayment}
                isPaid={isPaid}
                customerEmail={customerEmail}
            />
        </div>
    );
}

// 添加相关样式
const markdownStyles = `
.markdown-content {
    @apply text-gray-700 leading-relaxed;
}

.markdown-content h1 {
    @apply text-2xl font-bold text-gray-900 mb-4;
}

.markdown-content h2 {
    @apply text-xl font-bold text-gray-800 mb-3;
}

.markdown-content h3 {
    @apply text-lg font-semibold text-gray-700 mb-2;
}

.markdown-content p {
    @apply mb-4 text-gray-600;
}

.markdown-content ul {
    @apply list-disc pl-5 mb-4 text-gray-600;
}

.markdown-content ol {
    @apply list-decimal pl-5 mb-4 text-gray-600;
}

.markdown-content li {
    @apply mb-2;
}

.markdown-content strong {
    @apply font-semibold text-gray-800;
}

.markdown-content em {
    @apply italic;
}

.markdown-content blockquote {
    @apply border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600;
}

.markdown-content code {
    @apply bg-gray-100 rounded px-1 font-mono text-sm;
}

.markdown-content pre {
    @apply bg-gray-100 rounded p-4 mb-4 overflow-x-auto;
}

.markdown-content a {
    @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content table {
    @apply min-w-full border-collapse mb-4;
}

.markdown-content th,
.markdown-content td {
    @apply border border-gray-300 px-4 py-2;
}

.markdown-content th {
    @apply bg-gray-50 font-semibold;
}

.type-animation {
    @apply font-mono;
}

.type-animation-cursor {
    @apply inline-block w-[0.1em] h-[1em] bg-current ml-[0.1em] animate-blink;
}

@keyframes blink {
    from, to {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
`;

// 添加打字动画相关样式
const typeAnimationStyles = `
.markdown-content.typing {
    animation: none;
}

.markdown-content.typing * {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.type-animation-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    from, to {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
`;

// 添加新的样式
const additionalStyles = `
.markdown-content-wrapper {
    position: relative;
    min-height: 20px;
}

.markdown-content.typing > *:last-child {
    display: inline-block;
}

.typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background-color: currentColor;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    vertical-align: middle;
}

.markdown-content {
    transition: all 0.1s ease-out;
}

.markdown-content > * {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes blink {
    from, to {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content p,
.markdown-content ul,
.markdown-content ol,
.markdown-content blockquote {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateY(10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.markdown-content {
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
}

.markdown-content * {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
}

.markdown-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
}

.markdown-content code {
    white-space: pre-wrap;
    word-wrap: break-word;
}

.markdown-content-wrapper {
    max-width: 100%;
    overflow-x: hidden;
}
`;
