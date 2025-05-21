"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Users,
    Star,
    BarChart3,
    CheckCircle2,
    Play,
    Edit,
    Download,
    Share2,
    BookOpen,
} from "lucide-react";
import { OnlineTest, SectionType } from "@/interfaces/online-test";

interface TestDetail extends OnlineTest {
    _count: {
        participants: number;
        testQuestions: number;
    };
}

const TestDetail = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [test, setTest] = useState<TestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isStartingTest, setIsStartingTest] = useState(false);

    // Fetch test details
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(`Fetching test details for ID: ${params.id}`);
                const response = await fetch(`/api/online-tests/${params.id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        console.error(`Test with ID ${params.id} not found`);
                        throw new Error("Bài kiểm tra không tồn tại");
                    }
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                            "Không thể tải thông tin bài kiểm tra"
                    );
                }

                const data = await response.json();
                console.log(`Successfully fetched test data: ${data.title}`);
                setTest(data);
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi khi tải bài kiểm tra");
                console.error("Error fetching test:", err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchTest();
        } else {
            setError("ID bài kiểm tra không hợp lệ");
            setLoading(false);
        }
    }, [params.id]);

    // Start test
    const handleStartTest = async () => {
        if (!test) return;

        try {
            setIsStartingTest(true);

            console.log(`Starting test attempt for test ID: ${test.id}`);
            // Create a test attempt
            const response = await fetch(
                `/api/online-tests/${test.id}/attempts`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Không thể bắt đầu bài kiểm tra"
                );
            }

            const data = await response.json();
            console.log(`Created test attempt ID: ${data.id}`);

            // Redirect to test attempt page
            router.push(`/online-tests/${test.id}/attempt/${data.id}`);
        } catch (err: any) {
            console.error("Error starting test:", err);
            alert("Có lỗi xảy ra khi bắt đầu bài kiểm tra. Vui lòng thử lại.");
        } finally {
            setIsStartingTest(false);
        }
    };

    // Helper functions
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`;
        }
        return `${mins} phút`;
    };

    const getSectionColor = (section: SectionType) => {
        switch (section) {
            case "listening":
                return "bg-blue-100 text-blue-800";
            case "reading":
                return "bg-green-100 text-green-800";
            case "writing":
                return "bg-purple-100 text-purple-800";
            case "speaking":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatTags = (tags: string) => {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !test) {
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
                    <p>{error || "Không thể tải thông tin bài kiểm tra"}</p>
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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${
                                    test.testType === "TOEIC"
                                        ? "bg-blue-100 text-blue-800"
                                        : ""
                                }
                                ${
                                    test.testType === "IELTS"
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                }
                                ${
                                    test.testType === "Placement"
                                        ? "bg-orange-100 text-orange-800"
                                        : ""
                                }
                                ${
                                    test.testType === "General"
                                        ? "bg-purple-100 text-purple-800"
                                        : ""
                                }
                            `}
                            >
                                {test.testType}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                {test.difficulty}
                            </span>
                            {test.isAIGenerated && (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                    <svg
                                        className="mr-1 h-3 w-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    AI Generated
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            {test.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 mb-5 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDuration(test.duration)}
                            </div>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {test._count.participants} người đã làm
                            </div>
                            <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                {test._count.testQuestions} câu hỏi
                            </div>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                Độ phổ biến: {test.popularity}%
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                Tỷ lệ hoàn thành: {test.completionRate}%
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">{test.description}</p>

                        {/* Tags */}
                        {test.tags && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Chủ đề và từ khóa
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {formatTags(test.tags).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Test structure */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Cấu trúc bài kiểm tra
                            </h3>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {test.sections &&
                                    Object.entries(test.sections).map(
                                        ([section, details]) => (
                                            <div
                                                key={section}
                                                className="flex items-start rounded-lg border border-gray-200 p-4"
                                            >
                                                <div
                                                    className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getSectionColor(
                                                        section as SectionType
                                                    )}`}
                                                >
                                                    {section ===
                                                        "listening" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V8Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 18V22"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M8 22H16"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "reading" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "writing" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M4 20H20"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M4 20H8L18 10L14 6L4 16V20Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "speaking" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M7 15L6 19L12 17L18 19L17 15"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-medium capitalize text-gray-900">
                                                        {section}
                                                    </h4>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        <p>
                                                            {details.parts} phần
                                                        </p>
                                                        <p>
                                                            {details.questions}{" "}
                                                            câu hỏi
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Hướng dẫn làm bài
                            </h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                <div className="prose max-w-none text-sm">
                                    {test.instructions}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <button
                                    onClick={handleStartTest}
                                    disabled={isStartingTest}
                                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                                >
                                    {isStartingTest ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang chuẩn bị...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Play className="mr-2 h-5 w-5" />
                                            Bắt đầu làm bài
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Thời gian làm bài:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatDuration(test.duration)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Tổng số câu hỏi:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test._count.testQuestions}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Độ khó:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test.difficulty}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Người tạo:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test.creator?.name || "Admin"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Chia sẻ bài kiểm tra
                                </button>
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Download className="mr-2 h-4 w-4" />
                                    Tải xuống bản PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestDetail;
