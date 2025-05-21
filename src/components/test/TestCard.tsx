import React from "react";
import Link from "next/link";
import { OnlineTest } from "@/interfaces/online-test";
import { Clock, Users, BookOpen, BarChart, Star } from "lucide-react";

interface TestCardProps {
    test: OnlineTest;
}

const TestCard: React.FC<TestCardProps> = ({ test }) => {
    // Format the tags string to array if it's a string
    const tags =
        typeof test.tags === "string"
            ? test.tags.split(",").map((tag) => tag.trim())
            : [];

    // Helper function to get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-green-100 text-green-800";
            case "Intermediate":
                return "bg-blue-100 text-blue-800";
            case "Advanced":
                return "bg-purple-100 text-purple-800";
            case "Expert":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Helper function to get test type color
    const getTestTypeColor = (testType: string) => {
        switch (testType) {
            case "TOEIC":
                return "bg-blue-100 text-blue-800";
            case "IELTS":
                return "bg-green-100 text-green-800";
            case "Placement":
                return "bg-orange-100 text-orange-800";
            case "General":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get total number of questions by summing up sections
    const getTotalQuestions = () => {
        if (!test.sections) return 0;

        return Object.values(test.sections).reduce((total, section) => {
            return total + (section.questions || 0);
        }, 0);
    };

    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-100">
            {/* Header with thumbnail or gradient background */}
            <div
                className={`h-32 ${
                    test.thumbnail
                        ? ""
                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                } flex items-center justify-center relative`}
            >
                {test.thumbnail ? (
                    <img
                        src={test.thumbnail}
                        alt={test.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-center text-white px-4">
                        <h3 className="text-2xl font-bold">{test.testType}</h3>
                        <p>{test.difficulty} Level</p>
                    </div>
                )}

                {/* Test type badge */}
                <div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${getTestTypeColor(
                        test.testType
                    )}`}
                >
                    {test.testType}
                </div>

                {/* Difficulty badge */}
                <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(
                        test.difficulty
                    )}`}
                >
                    {test.difficulty}
                </div>

                {/* AI Generated badge */}
                {test.isAIGenerated && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                        AI Generated
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                    {test.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description}
                </p>

                {/* Info section */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                            {test.duration} phút
                        </span>
                    </div>
                    <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                            {getTotalQuestions()} câu hỏi
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                            {test.popularity || 0} người
                        </span>
                    </div>
                    <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                            {test.completionRate || 0}% hoàn thành
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                +{tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Action button */}
                <Link
                    href={`/online-tests/${test.id}`}
                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                >
                    Xem bài kiểm tra
                </Link>
            </div>
        </div>
    );
};

export default TestCard;
