import React from "react";
import {
    Award,
    ThumbsUp,
    AlertCircle,
    Star,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

interface FeedbackProps {
    feedback: {
        overallScore: number;
        strengths: string[];
        areasToImprove: string[];
        detailedFeedback: string;
        specificExamples: {
            goodExamples: Array<{ text: string; comment: string }>;
            improvementExamples: Array<{ text: string; comment: string }>;
        };
        nextSteps: string[];
    };
}

export const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
    // Chuyển điểm số thành số ngôi sao (tối đa 5 sao)
    const stars = Math.round((feedback.overallScore / 100) * 5);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Award className="mr-2 text-yellow-500" size={24} />
                    Đánh giá kỹ năng giao tiếp
                </h2>
                <div className="flex items-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {feedback.overallScore}
                    </div>
                    <div className="text-xl text-gray-500 dark:text-gray-400">
                        /100
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={20}
                            className={`${
                                i < stars
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                    ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {stars}/5 sao
                </span>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <ThumbsUp className="mr-2 text-green-500" size={18} />
                        Điểm mạnh
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {feedback.strengths.map((strength, index) => (
                            <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300"
                            >
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <AlertCircle
                            className="mr-2 text-amber-500"
                            size={18}
                        />
                        Cần cải thiện
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {feedback.areasToImprove.map((area, index) => (
                            <li
                                key={index}
                                className="text-gray-700 dark:text-gray-300"
                            >
                                {area}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        Nhận xét chi tiết
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {feedback.detailedFeedback}
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        Ví dụ cụ thể
                    </h3>

                    {feedback.specificExamples.goodExamples.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                                Biểu đạt tốt
                            </h4>
                            <div className="space-y-3">
                                {feedback.specificExamples.goodExamples.map(
                                    (example, index) => (
                                        <div
                                            key={index}
                                            className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md"
                                        >
                                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                                                "{example.text}"
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <CheckCircle
                                                    size={14}
                                                    className="inline mr-1 text-green-500"
                                                />
                                                {example.comment}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {feedback.specificExamples.improvementExamples.length >
                        0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Cần cải thiện
                            </h4>
                            <div className="space-y-3">
                                {feedback.specificExamples.improvementExamples.map(
                                    (example, index) => (
                                        <div
                                            key={index}
                                            className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md"
                                        >
                                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                                                "{example.text}"
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <AlertCircle
                                                    size={14}
                                                    className="inline mr-1 text-amber-500"
                                                />
                                                {example.comment}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        Bước tiếp theo
                    </h3>
                    <ul className="space-y-2">
                        {feedback.nextSteps.map((step, index) => (
                            <li
                                key={index}
                                className="flex items-start text-gray-700 dark:text-gray-300"
                            >
                                <ArrowRight
                                    size={16}
                                    className="mr-2 mt-1 text-blue-500 flex-shrink-0"
                                />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
