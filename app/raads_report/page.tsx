"use client"

import React from 'react';
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Book, Users} from 'lucide-react';

const data = [
    {name: 'Social Relationships', score: 30, fullMark: 65},
    {name: 'Language', score: 20, fullMark: 65},
    {name: 'Sensory/Motor', score: 25, fullMark: 65},
    {name: 'Interests', score: 15, fullMark: 65},
];

export default function RAADSRReport() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-4">RAADS-R Evaluation Report</h1>
                <p className="text-sm text-gray-600 mb-4">Evaluation Date: August 4, 2024</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="score" fill="#3b82f6"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="font-bold mb-2">Total Score</h2>
                            <div className="text-4xl font-bold text-blue-600">90</div>
                            <p className="text-sm mt-1">Indicates enhanced autistic traits</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Analysis and Interpretation</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Social Relationships (30):</strong> Higher score indicates challenges in social
                            interactions.
                        </li>
                        <li><strong>Language (20):</strong> Moderate score suggests some difficulties in language
                            communication.
                        </li>
                        <li><strong>Sensory/Motor (25):</strong> Higher score may indicate sensory and motor
                            coordination issues.
                        </li>
                        <li><strong>Interests (15):</strong> Lower score suggests no significant repetitive or
                            stereotyped behaviors.
                        </li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Recommendations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <Users className="h-6 w-6 mb-2 text-blue-600"/>
                            <h3 className="font-bold mb-1">Professional Consultation</h3>
                            <p className="text-sm">Contact a psychologist or psychiatrist for a detailed diagnosis.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <Book className="h-6 w-6 mb-2 text-blue-600"/>
                            <h3 className="font-bold mb-1">Self-Help Resources</h3>
                            <p className="text-sm">Read "The Autism Social Skills Guide" or join local support
                                groups.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <Users className="h-6 w-6 mb-2 text-blue-600"/>
                            <h3 className="font-bold mb-1">Behavioral Strategies</h3>
                            <p className="text-sm">Consider enrolling in social skills training courses.</p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    <h3 className="font-bold mb-1">Data Privacy Notice</h3>
                    <p>Your evaluation data is confidential and used only for your personal assessment. We strictly
                        protect your privacy and ensure your personal information is not disclosed.</p>
                </div>
            </div>
        </div>
    );
}