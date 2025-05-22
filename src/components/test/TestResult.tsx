import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckSquare, FileText } from "lucide-react";

interface TestResultProps {
    testId: string | number;
    mockId: string;
    totalQuestions: number;
    answeredQuestions: number;
    submittedAt: string | null;
    onRetakeTest: () => void;
}

const TestResult: React.FC<TestResultProps> = ({
    testId,
    mockId,
    totalQuestions,
    answeredQuestions,
    submittedAt,
    onRetakeTest,
}) => {
    const calculatePercentage = () => {
        return Math.round((answeredQuestions / totalQuestions) * 100);
    };

    const getCompletionMessage = () => {
        const percentage = calculatePercentage();

        if (percentage >= 90) {
            return "Tuyệt vời! Bạn đã hoàn thành hầu hết các câu hỏi.";
        } else if (percentage >= 70) {
            return "Rất tốt! Bạn đã hoàn thành phần lớn bài kiểm tra.";
        } else if (percentage >= 50) {
            return "Tốt! Bạn đã hoàn thành nửa bài kiểm tra.";
        } else {
            return "Bạn đã hoàn thành một phần bài kiểm tra.";
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bài kiểm tra đã hoàn thành
                </h2>
                <p className="text-gray-600">{getCompletionMessage()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500">Tổng số câu hỏi</div>
                    <div className="text-2xl font-bold">{totalQuestions}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500">
                        Câu hỏi đã trả lời
                    </div>
                    <div className="text-2xl font-bold">
                        {answeredQuestions}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500">
                        Thời gian hoàn thành
                    </div>
                    <div className="text-2xl font-bold">
                        {submittedAt
                            ? new Date(submittedAt).toLocaleString()
                            : "N/A"}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500">
                        Tỷ lệ hoàn thành
                    </div>
                    <div className="text-2xl font-bold">
                        {calculatePercentage()}%
                    </div>
                </div>
            </div>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Lưu ý</h3>
                <p className="text-blue-700 text-sm">
                    Đây là bài kiểm tra mẫu, vì vậy điểm số cuối cùng không được
                    lưu trữ trên hệ thống. Bạn có thể xem lại các câu hỏi và làm
                    lại bài kiểm tra này bất cứ lúc nào.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
                <Link
                    href={`/online-tests/${testId}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Quay lại thông tin bài kiểm tra
                </Link>

                <button
                    onClick={onRetakeTest}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <FileText className="mr-2 h-5 w-5" />
                    Làm lại bài kiểm tra
                </button>
            </div>
        </div>
    );
};

export default TestResult;
