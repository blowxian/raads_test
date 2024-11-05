import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface ScoreChartsProps {
    scores: {
        socialRelatedness: number;
        circumscribedInterests: number;
        language: number;
        sensoryMotor: number;
    };
}

const ScoreCharts: React.FC<ScoreChartsProps> = React.memo(({ scores }) => {
    const chartData = [
        { name: 'Social', fullName: 'Social Relatedness', score: scores.socialRelatedness },
        { name: 'Interests', fullName: 'Circumscribed Interests', score: scores.circumscribedInterests },
        { name: 'Language', fullName: 'Language', score: scores.language },
        { name: 'Sensory', fullName: 'Sensory Motor', score: scores.sensoryMotor },
    ];

    const CustomizedAxisTick = ({ x, y, payload }: any) => {
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                    {payload.value.split(' ').map((word: any, index: any) => (
                        <tspan x="0" dy={index ? "1.2em" : "0"} key={index}>
                            {word}
                        </tspan>
                    ))}
                </text>
            </g>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" aspect={1}>
                        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 0, left: 30 }}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" tick={<CustomizedAxisTick />} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                            <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" aspect={1}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 0, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#666' }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                            <Bar dataKey="score" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
});

// 添加比较函数以确保只在分数真正改变时才重新渲染
const areEqual = (prevProps: ScoreChartsProps, nextProps: ScoreChartsProps) => {
    return (
        prevProps.scores.socialRelatedness === nextProps.scores.socialRelatedness &&
        prevProps.scores.circumscribedInterests === nextProps.scores.circumscribedInterests &&
        prevProps.scores.language === nextProps.scores.language &&
        prevProps.scores.sensoryMotor === nextProps.scores.sensoryMotor
    );
};

ScoreCharts.displayName = 'ScoreCharts';

export default React.memo(ScoreCharts, areEqual);