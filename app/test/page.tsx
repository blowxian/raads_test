"use client"

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {logEvent} from '@/lib/GAlog';
import Cookies from 'js-cookie';

const questions = [
    {"id": 1, "text": "I am a sympathetic person."},
    {"id": 2, "text": "I often use words and phrases from movies and television in conversations."},
    { "id": 3, "text": "I am often surprised when others tell me I have been rude." },
    { "id": 4, "text": "Sometimes I talk too loudly or too softly, and I am not aware of it." },
    { "id": 5, "text": "I often don't know how to act in social situations." },
    { "id": 6, "text": "I can 'put myself in other people's shoes.'" },
    { "id": 7, "text": "I have a hard time figuring out what some phrases mean, like 'you are the apple of my eye.'" },
    { "id": 8, "text": "I only like to talk to people who share my special interests." },
    { "id": 9, "text": "I focus on details rather than the overall idea." },
    { "id": 10, "text": "I always notice how food feels in my mouth. This is more important to me than how it tastes." },
    { "id": 11, "text": "I miss my best friends or family when we are apart for a long time." },
    { "id": 12, "text": "Sometimes I offend others by saying what I am thinking, even if I don’t mean to." },
    { "id": 13, "text": "I only like to think and talk about a few things that interest me." },
    { "id": 14, "text": "I’d rather go out to eat in a restaurant by myself than with someone I know." },
    { "id": 15, "text": "I cannot imagine what it would be like to be someone else." },
    { "id": 16, "text": "I have been told that I am clumsy or uncoordinated." },
    { "id": 17, "text": "Others consider me odd or different." },
    { "id": 18, "text": "I understand when friends need to be comforted." },
    { "id": 19, "text": "I am very sensitive to the way my clothes feel when I touch them. How they feel is more important to me than how they look." },
    { "id": 20, "text": "I like to copy the way certain people speak and act. It helps me appear more normal." },
    { "id": 21, "text": "It can be very intimidating for me to talk to more than one person at the same time." },
    { "id": 22, "text": "I have to 'act normal' to please other people and make them like me." },
    { "id": 23, "text": "Meeting new people is usually easy for me." },
    { "id": 24, "text": "I get highly confused when someone interrupts me when I am talking about something I am very interested in." },
    { "id": 25, "text": "It is difficult for me to understand how other people are feeling when we are talking." },
    { "id": 26, "text": "I like having a conversation with several people, for instance around a dinner table, at school or at work." },
    { "id": 27, "text": "I take things too literally, so I often miss what people are trying to say." },
    { "id": 28, "text": "It is very difficult for me to understand when someone is embarrassed or jealous." },
    { "id": 29, "text": "Some ordinary textures that do not bother others feel very offensive when they touch my skin." },
    { "id": 30, "text": "I get extremely upset when the way I like to do things is suddenly changed." },
    { "id": 31, "text": "I have never wanted or needed to have what other people call an 'intimate relationship.'" },
    { "id": 32, "text": "It is difficult for me to start and stop a conversation. I need to keep going until I am finished." },
    { "id": 33, "text": "I speak with a normal rhythm." },
    { "id": 34, "text": "The same sound, color or texture can suddenly change from very sensitive to very dull." },
    { "id": 35, "text": "The phrase 'I’ve got you under my skin' makes me very uncomfortable." },
    { "id": 36, "text": "Sometimes the sound of a word or a high-pitched noise can be painful to my ears." },
    { "id": 37, "text": "I am an understanding type of person." },
    { "id": 38, "text": "I do not connect with characters in movies and cannot feel what they feel." },
    { "id": 39, "text": "I cannot tell when someone is flirting with me." },
    { "id": 40, "text": "I can see in my mind in exact detail things that I am interested in." },
    { "id": 41, "text": "I keep lists of things that interest me, even when they have no practical use (for example sports statistics, train schedules, calendar dates, historical facts and dates)." },
    { "id": 42, "text": "When I feel overwhelmed by my senses, I have to isolate myself to shut them down." },
    { "id": 43, "text": "I like to talk things over with my friends." },
    { "id": 44, "text": "I cannot tell if someone is interested or bored with what I am saying." },
    { "id": 45, "text": "It can be very hard to read someone's face, hand and body movements when they are talking." },
    { "id": 46, "text": "The same thing (like clothes or temperatures) can feel very different to me at different times." },
    { "id": 47, "text": "I feel very comfortable with dating or being in social situations with others." },
    { "id": 48, "text": "I try to be as helpful as I can when other people tell me their personal problems." },
    { "id": 49, "text": "I have been told that I have an unusual voice (for example flat, monotone, childish, or high-pitched)." },
    { "id": 50, "text": "Sometimes a thought or a subject gets stuck in my mind and I have to talk about it even if no one is interested." },
    { "id": 51, "text": "I do certain things with my hands over and over again (like flapping, twirling sticks or strings, waving things by my eyes)." },
    { "id": 52, "text": "I have never been interested in what most of the people I know consider interesting." },
    { "id": 53, "text": "I am considered a compassionate type of person." },
    { "id": 54, "text": "I get along with other people by following a set of specific rules that help me look normal." },
    { "id": 55, "text": "It is very difficult for me to work and function in groups." },
    { "id": 56, "text": "When I am talking to someone, it is hard to change the subject. If the other person does so, I can get very upset and confused." },
    { "id": 57, "text": "Sometimes I have to cover my ears to block out painful noises (like vacuum cleaners or people talking too much or too loudly)." },
    { "id": 58, "text": "I can chat and make small talk with people." },
    { "id": 59, "text": "Sometimes things that should feel painful are not (for instance when I hurt myself or burn my hand on a stove)." },
    { "id": 60, "text": "When talking to someone, I have a hard time telling when it is my turn to talk or to listen." },
    { "id": 61, "text": "I am considered a loner by those who know me best." },
    { "id": 62, "text": "I usually speak in a normal tone." },
    { "id": 63, "text": "I like things to be exactly the same day after day and even small changes in my routines upset me." },
    { "id": 64, "text": "How to make friends and socialize is a mystery to me." },
    { "id": 65, "text": "It calms me to spin around or to rock in a chair when I am feeling stressed." },
    { "id": 66, "text": "The phrase, 'He wears his heart on his sleeve,' does not make sense to me." },
    { "id": 67, "text": "If I am in a place where there are many smells, textures to feel, noises or bright lights, I feel anxious or frightened." },
    { "id": 68, "text": "I can tell when someone says one thing but means something else." },
    { "id": 69, "text": "I like to be by myself as much as I can." },
    { "id": 70, "text": "I keep my thoughts stacked in my memory like they are on filing cards, and I pick out the ones I need by looking through the stack and finding the right one (or another unique way)." },
    { "id": 71, "text": "The same sound sometimes seems very loud or very soft, even though I know it has not changed." },
    { "id": 72, "text": "I enjoy spending time eating and talking with my family and friends." },
    { "id": 73, "text": "I can’t tolerate things I dislike (like smells, textures, sounds or colors)." },
    { "id": 74, "text": "I don’t like to be hugged or held." },
    { "id": 75, "text": "When I go somewhere, I have to follow a familiar route or I can get very confused and upset." },
    { "id": 76, "text": "It is difficult to figure out what other people expect of me." },
    { "id": 77, "text": "I like to have close friends." },
    { "id": 78, "text": "People tell me that I give too much detail." },
    { "id": 79, "text": "I am often told that I ask embarrassing questions." },
    {"id": 80, "text": "I tend to point out other people's mistakes."}
];

const options = [
    "True now and when I was young",
    "True now only",
    "True only when I was younger than 16",
    "Never true"
];

const scoreMap = {
    "symptom": [3, 2, 1, 0],
    "non-symptom": [0, 1, 2, 3]
};

// 标记带有星号的问题
const starQuestions = [1, 6, 11, 18, 23, 26, 33, 37, 43, 47, 53, 58, 62, 68, 72, 77];

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [showWarning, setShowWarning] = useState(false);
    const [showFinalWarning, setShowFinalWarning] = useState(false);
    const [showNameEmail, setShowNameEmail] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showNameEmailWarning, setShowNameEmailWarning] = useState(false);
    const [testComplete, setTestComplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAnswer = (value: number) => {
        logEvent('click', 'Quiz', `Answered Question ${currentQuestion + 1}`, value);
        setAnswers({...answers, [currentQuestion]: value});
        setShowWarning(false);
        setShowFinalWarning(false);
    };

    const goToPrevious = () => {
        logEvent('click', 'Quiz', `Previous Question ${currentQuestion + 1}`, -1);
        setCurrentQuestion(Math.max(0, currentQuestion - 1));
        setShowWarning(false);
    };

    const goToNext = () => {
        if (answers[currentQuestion] !== undefined) {
            logEvent('click', 'Quiz', `Next Question ${currentQuestion + 1}`, 1);
            setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1));
            setShowWarning(false);
        } else {
            setShowWarning(true);
        }
    };

    const dimensionQuestions = {
        socialRelatedness: [1, 6, 8, 11, 14, 17, 18, 25, 37, 38, 3, 5, 12, 28, 39, 44, 45, 76, 79, 80, 20, 21, 22, 23, 26, 31, 43, 47, 48, 53, 54, 55, 60, 61, 64, 68, 69, 72, 77],
        circumscribedInterests: [9, 13, 24, 30, 32, 40, 41, 50, 52, 56, 63, 70, 75, 78],
        language: [2, 7, 27, 35, 58, 66, 15],
        sensoryMotor: [10, 19, 4, 33, 34, 36, 46, 71, 16, 29, 42, 49, 51, 57, 59, 62, 65, 67, 73, 74]
    };

    const calculateScore = () => {
        let totalScore = 0;
        let scores = {
            socialRelatedness: 0,
            circumscribedInterests: 0,
            language: 0,
            sensoryMotor: 0
        };

        questions.forEach((question, index) => {
            const answer = answers[index];
            if (answer !== undefined) {
                // 计算总分
                if (starQuestions.includes(question.id)) {
                    totalScore += scoreMap["non-symptom"][answer];
                } else {
                    totalScore += scoreMap["symptom"][answer];
                }

                // 计算各个维度的分数
                const dimensionKey = Object.keys(dimensionQuestions).find(dimension =>
                    (dimensionQuestions as any)[dimension].includes(question.id)
                );
                if (dimensionKey) {
                    if (starQuestions.includes(question.id)) {
                        (scores as any)[dimensionKey] += scoreMap["non-symptom"][answer];
                    } else {
                        (scores as any)[dimensionKey] += scoreMap["symptom"][answer];
                    }
                }
            }
        });

        return {totalScore, scores};
    };

    const handleSubmit = () => {
        const allQuestionsAnswered = questions.every((_, index) => answers[index] !== undefined);
        if (!allQuestionsAnswered) {
            setShowFinalWarning(true);
            return;
        }
        logEvent('click', 'Quiz', 'Submit Quiz', calculateScore().totalScore);
        setShowNameEmail(true);
    };

    const handleFinalSubmit = () => {
        if (name.trim() === '' || email.trim() === '') {
            setShowNameEmailWarning(true);
            return;
        }
        const scores = calculateScore();
        logEvent('click', 'Quiz', 'Final Submit', scores.totalScore);

        // 将 scores.totalScore 和各维度的分数存储到 cookie 中
        Cookies.set('totalScore', (scores as any).totalScore, {expires: 7});
        Cookies.set('scores', JSON.stringify(scores.scores), {expires: 7});

        console.log('Submit:', answers);
        console.log('Total Score:', scores.totalScore);
        console.log('Scores: ', scores.scores)
        window.open(`/?score=${scores.totalScore}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, '_blank');
        setTestComplete(true);
    };

    const handleRetake = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowWarning(false);
        setShowFinalWarning(false);
        setShowNameEmail(false);
        setName('');
        setEmail('');
        setShowNameEmailWarning(false);
        setTestComplete(false);
    };

    const question = questions[currentQuestion];

    const skewValue = Math.max(0, Math.min(6, (768 - windowWidth) / 768 * 6));
    const rotateValue = Math.max(0, Math.min(6, (windowWidth - 768) / (1024 - 768) * 6));

    const progress = Math.round((currentQuestion + 1) / questions.length * 100);

    return (
        <div
            className="min-h-screen flex flex-col space-y-4 items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="relative w-full max-w-3xl mx-auto">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg rounded-3xl"
                    style={{
                        transform: `${windowWidth < 768 ? `skewY(-${skewValue}deg)` : `rotate(-${rotateValue}deg)`}`,
                        transition: 'transform 0.3s ease-in-out'
                    }}
                ></div>
                <div className="relative bg-white shadow-lg rounded-3xl p-4 sm:p-10">
                    <div className="max-w-lg mx-auto">
                        {!showNameEmail && !testComplete && (
                            <>
                                <p className="text-lg sm:text-xl font-semibold mb-4">{`${currentQuestion + 1}. ${question.text}`}</p>
                                <div className="space-y-4">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`option-${index}`}
                                                name="answer"
                                                type="radio"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                checked={answers[currentQuestion] === index}
                                                onChange={() => handleAnswer(index)}
                                            />
                                            <label htmlFor={`option-${index}`}
                                                   className="ml-3 block text-sm sm:text-base font-medium text-gray-700">
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {showWarning && (
                                    <p className="text-red-500 text-sm mt-2">Please select an answer before
                                        proceeding.</p>
                                )}
                                <div className="h-2 bg-gray-200 rounded-full mt-6">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{width: `${progress}%`}}
                                    ></div>
                                </div>
                                <div className="mt-6 sm:mt-8 flex justify-between items-center">
                                    <button
                                        onClick={goToPrevious}
                                        disabled={currentQuestion === 0}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50 text-sm sm:text-base"
                                    >
                                        Previous
                                    </button>
                                    <span
                                        className="text-xs sm:text-sm text-gray-500">{`${currentQuestion + 1} out of ${questions.length}`}</span>
                                    {currentQuestion === questions.length - 1 ? (
                                        <button
                                            onClick={handleSubmit}
                                            className={`font-bold py-2 px-4 rounded-r text-sm sm:text-base ${Object.keys(answers).length === questions.length ? 'bg-cyan-500 hover:bg-cyan-700 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'}`}
                                        >
                                            View Report
                                        </button>
                                    ) : (
                                        <button
                                            onClick={goToNext}
                                            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-r text-sm sm:text-base"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                                {showFinalWarning && (
                                    <p className="text-red-500 text-sm mt-2">Please answer all questions before viewing
                                        the report.</p>
                                )}
                            </>
                        )}
                        {showNameEmail && !testComplete && (
                            <div className="mt-6 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {showNameEmailWarning && (
                                    <p className="text-red-500 text-sm mt-2">Please enter your name and email.</p>
                                )}
                                <button
                                    onClick={handleFinalSubmit}
                                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mx-auto block"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                        {testComplete && (
                            <div className="mt-6 space-y-4 text-center">
                                <p className="text-lg sm:text-xl font-semibold">Thank you! You can view your report in
                                    the new tab.</p>
                                <button
                                    onClick={handleRetake}
                                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Retake Test
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}