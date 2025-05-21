"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Award,
    BarChart3,
    Clock,
    CheckCircle2,
    XCircle,
    Share2,
    Download,
    FileText,
} from "lucide-react";

interface ResultsPageProps {
    params: {
        id: string;
        attemptId: string;
    };
}

const TestResultsPage = ({ params }: ResultsPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [testData, setTestData] = useState<any>(null);
    const [attemptData, setAttemptData] = useState<any>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    `Fetching test results: ${params.id}/${params.attemptId}`
                );
                const response = await fetch(
                    `/api/online-tests/${params.id}/attempt/${params.attemptId}`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(
                            "Bài kiểm tra hoặc lần thử không tồn tại"
                        );
                    }
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                            "Không thể tải thông tin kết quả bài kiểm tra"
                    );
                }

                const data = await response.json();
                console.log("Successfully fetched test result data");

                setTestData(data.test);
                setAttemptData(data.attempt);
                setQuestions(data.questions.list);
                setAnswers(data.attempt.answers || []);
            } catch (err: any) {
                setError(
                    err.message || "Đã xảy ra lỗi khi tải kết quả bài kiểm tra"
                );
                console.error("Error fetching test results:", err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id && params.attemptId) {
            fetchResults();
        } else {
            setError("ID bài kiểm tra hoặc lần thử không hợp lệ");
            setLoading(false);
        }
    }, [params.id, params.attemptId]);

    // Tính tổng số câu đúng
    const calculateCorrectAnswers = () => {
        if (!answers || !questions) return 0;
        return answers.filter((a) => a.isCorrect).length;
    };

    // Tính phần trăm chính xác
    const calculateAccuracy = () => {
        if (!answers || !questions || answers.length === 0) return 0;
        return Math.round((calculateCorrectAnswers() / answers.length) * 100);
    };

    // Định dạng thời gian làm bài
    const calculateDuration = () => {
        if (!attemptData) return "N/A";

        const startTime = new Date(attemptData.startTime).getTime();
        const endTime = attemptData.endTime
            ? new Date(attemptData.endTime).getTime()
            : Date.now();

        const durationMs = endTime - startTime;
        const minutes = Math.floor(durationMs / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

        return `${minutes} phút ${seconds} giây`;
    };

    // Tính điểm từng phần
    const getSectionScore = (section: string) => {
        if (!attemptData || !attemptData.sectionScores) return "N/A";
        return attemptData.sectionScores[section] || 0;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !testData || !attemptData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link
                        href="/online-tests"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Quay lại danh sách bài kiểm tra
                    </Link>
                </div>
                <div className="bg-red-50 rounded-lg p-6 text-red-700">
                    <h2 className="text-xl font-semibold mb-2">
                        Đã xảy ra lỗi
                    </h2>
                    <p>{error || "Không thể tải kết quả bài kiểm tra"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link
                    href="/online-tests"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Quay lại danh sách bài kiểm tra
                </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="bg-blue-600 p-8 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Kết quả bài kiểm tra
                    </h1>
                    <p className="text-blue-100">{testData.title}</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Điểm tổng */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-blue-100 text-sm mb-1">
                                        Điểm số
                                    </p>
                                    <h2 className="text-3xl font-bold">
                                        {attemptData.score || 0}
                                    </h2>
                                </div>
                                <Award className="h-10 w-10 text-blue-200" />
                            </div>
                            <div className="mt-4 h-1 w-full bg-blue-200 bg-opacity-30 rounded-full">
                                <div
                                    className="h-1 bg-white rounded-full"
                                    style={{
                                        width: `${attemptData.score || 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Độ chính xác */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">
                                        Độ chính xác
                                    </p>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {calculateAccuracy()}%
                                    </h2>
                                </div>
                                <BarChart3 className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {calculateCorrectAnswers()} câu đúng /{" "}
                                {answers.length} câu đã trả lời
                            </p>
                        </div>

                        {/* Thời gian hoàn thành */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">
                                        Thời gian làm bài
                                    </p>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {calculateDuration()}
                                    </h2>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                Thời gian cho phép: {testData.duration} phút
                            </p>
                        </div>

                        {/* Hoàn thành bài thi */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">
                                        Trạng thái
                                    </p>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {attemptData.completed
                                            ? "Đã hoàn thành"
                                            : "Chưa hoàn thành"}
                                    </h2>
                                </div>
                                {attemptData.completed ? (
                                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                                ) : (
                                    <XCircle className="h-8 w-8 text-red-500" />
                                )}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {attemptData.completed
                                    ? new Date(
                                          attemptData.endTime
                                      ).toLocaleString()
                                    : "Bài thi chưa được nộp"}
                            </p>
                        </div>
                    </div>

                    {/* Điểm chi tiết từng phần */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Điểm từng phần
                        </h3>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {testData.sections &&
                                    Object.keys(testData.sections).map(
                                        (section) => (
                                            <div
                                                key={section}
                                                className="grid grid-cols-1 md:grid-cols-3 px-6 py-4"
                                            >
                                                <div className="text-sm font-medium text-gray-900 capitalize">
                                                    {section}
                                                </div>
                                                <div className="text-sm text-gray-500 md:col-span-2">
                                                    <div className="flex items-center">
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${getSectionScore(
                                                                        section
                                                                    )}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700 w-16 text-right">
                                                            {getSectionScore(
                                                                section
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Phân tích và phản hồi */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Phản hồi
                        </h3>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <p className="text-gray-700">
                                {attemptData.feedback ||
                                    "Chưa có phản hồi chi tiết cho bài kiểm tra này. Bạn có thể xem lại các câu trả lời để cải thiện kết quả."}
                            </p>
                        </div>
                    </div>

                    {/* Các hành động */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/online-tests/${params.id}/review/${params.attemptId}`}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Xem lại bài làm
                        </Link>
                        <Link
                            href={`/online-tests/${params.id}`}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại bài kiểm tra
                        </Link>
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ kết quả
                        </button>
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                            <Download className="h-4 w-4 mr-2" />
                            Tải kết quả PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;
