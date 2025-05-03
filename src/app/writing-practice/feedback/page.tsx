"use client";

import React, { useState, useEffect } from "react";
import {
    WritingService,
    WritingResponse,
    WritingFeedback,
} from "@/lib/writing/writing-service";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(true);
    const [writingResponse, setWritingResponse] =
        useState<WritingResponse | null>(null);
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    const [activeTab, setActiveTab] = useState<
        "overview" | "grammar" | "vocabulary" | "structure" | "improvement"
    >("overview");

    const writingService = WritingService.getInstance();

    useEffect(() => {
        // Lấy bài viết mới nhất từ localStorage
        const savedResponses = writingService.getSavedWritingResponses();
        if (savedResponses.length > 0) {
            const latestResponse = savedResponses[savedResponses.length - 1];
            setWritingResponse(latestResponse);

            // Lấy đánh giá cho bài viết
            getFeedback(latestResponse);
        } else {
            setLoading(false);
        }
    }, []);

    const getFeedback = async (response: WritingResponse) => {
        setLoading(true);
        try {
            const feedbackResult = await writingService.evaluateWriting(
                response.content,
                response.originalPrompt
            );
            setFeedback(feedbackResult);
        } catch (error) {
            console.error("Error getting feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-700">
                    Đang phân tích bài viết của bạn...
                </p>
            </div>
        );
    }

    if (!writingResponse || !feedback) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Không tìm thấy bài viết
                    </h1>
                    <p className="text-gray-700 mb-6">
                        Không có bài viết nào để đánh giá. Hãy hoàn thành một
                        bài viết trước khi xem đánh giá.
                    </p>
                    <Link href="/writing-practice/practice">
                        <Button>Bắt đầu luyện tập</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Đánh giá bài viết</h1>
                <div className="flex space-x-4">
                    <Link href="/writing-practice/practice">
                        <Button variant="outline">Viết bài mới</Button>
                    </Link>
                    <Link href="/writing-practice/my-writings">
                        <Button variant="outline">Bài viết của tôi</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột bên trái - Bài viết gốc */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Bài viết của bạn
                        </h2>
                        <div className="prose max-w-none">
                            <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm italic">
                                <p>{writingResponse.originalPrompt}</p>
                            </div>
                            <div className="whitespace-pre-wrap">
                                {writingResponse.content}
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            Đã nộp:{" "}
                            {new Date(
                                writingResponse.timestamp
                            ).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Cột bên phải - Đánh giá */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center mb-6">
                            <div className="mr-4">
                                <div className="text-3xl font-bold">
                                    {feedback.overallScore}/10
                                </div>
                                <div className="text-sm text-gray-500">
                                    Điểm tổng thể
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ScoreCard
                                    title="Ngữ pháp"
                                    score={feedback.grammar.score}
                                />
                                <ScoreCard
                                    title="Từ vựng"
                                    score={feedback.vocabulary.score}
                                />
                                <ScoreCard
                                    title="Cấu trúc"
                                    score={feedback.structure.score}
                                />
                                <ScoreCard
                                    title="Mạch lạc"
                                    score={feedback.coherence.score}
                                />
                            </div>
                        </div>

                        <div className="border-b mb-6">
                            <div className="flex space-x-1 md:space-x-4">
                                <TabButton
                                    active={activeTab === "overview"}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    Tổng quan
                                </TabButton>
                                <TabButton
                                    active={activeTab === "grammar"}
                                    onClick={() => setActiveTab("grammar")}
                                >
                                    Ngữ pháp
                                </TabButton>
                                <TabButton
                                    active={activeTab === "vocabulary"}
                                    onClick={() => setActiveTab("vocabulary")}
                                >
                                    Từ vựng
                                </TabButton>
                                <TabButton
                                    active={activeTab === "structure"}
                                    onClick={() => setActiveTab("structure")}
                                >
                                    Cấu trúc
                                </TabButton>
                                <TabButton
                                    active={activeTab === "improvement"}
                                    onClick={() => setActiveTab("improvement")}
                                >
                                    Cải thiện
                                </TabButton>
                            </div>
                        </div>

                        {activeTab === "overview" && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nhận xét tổng quát
                                    </h3>
                                    <div className="space-y-4">
                                        {feedback.grammar.comments
                                            .slice(0, 1)
                                            .map((comment, index) => (
                                                <div
                                                    key={`g-${index}`}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            ))}
                                        {feedback.vocabulary.comments
                                            .slice(0, 1)
                                            .map((comment, index) => (
                                                <div
                                                    key={`v-${index}`}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            ))}
                                        {feedback.structure.comments
                                            .slice(0, 1)
                                            .map((comment, index) => (
                                                <div
                                                    key={`s-${index}`}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-purple-100 text-purple-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            ))}
                                        {feedback.coherence.comments
                                            .slice(0, 1)
                                            .map((comment, index) => (
                                                <div
                                                    key={`c-${index}`}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-yellow-100 text-yellow-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "grammar" && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nhận xét về ngữ pháp
                                    </h3>
                                    <div className="space-y-2">
                                        {feedback.grammar.comments.map(
                                            (comment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Ví dụ về lỗi ngữ pháp
                                    </h3>
                                    <div className="space-y-4">
                                        {feedback.grammar.examples.map(
                                            (example, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-md p-4"
                                                >
                                                    <div className="flex items-start">
                                                        <div className="text-red-500 font-medium mr-2">
                                                            ✗
                                                        </div>
                                                        <div>
                                                            <div className="mb-1">
                                                                {
                                                                    example.original
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    example.explanation
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start mt-2">
                                                        <div className="text-green-500 font-medium mr-2">
                                                            ✓
                                                        </div>
                                                        <div>
                                                            {example.correction}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "vocabulary" && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nhận xét về từ vựng
                                    </h3>
                                    <div className="space-y-2">
                                        {feedback.vocabulary.comments.map(
                                            (comment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Gợi ý cải thiện từ vựng
                                    </h3>
                                    <div className="space-y-4">
                                        {feedback.vocabulary.suggestions.map(
                                            (suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-md p-4"
                                                >
                                                    <div className="flex flex-wrap items-center mb-2">
                                                        <span className="font-medium mr-2">
                                                            {suggestion.word}:
                                                        </span>
                                                        {suggestion.alternatives.map(
                                                            (alt, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2 mb-2"
                                                                >
                                                                    {alt}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="italic">
                                                            Trong ngữ cảnh:
                                                        </span>{" "}
                                                        "{suggestion.context}"
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "structure" && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nhận xét về cấu trúc bài viết
                                    </h3>
                                    <div className="space-y-2">
                                        {feedback.structure.comments.map(
                                            (comment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-purple-100 text-purple-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Nhận xét về tính mạch lạc và liên kết
                                    </h3>
                                    <div className="space-y-2">
                                        {feedback.coherence.comments.map(
                                            (comment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-yellow-100 text-yellow-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{comment}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "improvement" && (
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Gợi ý cải thiện
                                    </h3>
                                    <div className="space-y-2">
                                        {feedback.improvements.map(
                                            (improvement, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <div className="bg-indigo-100 text-indigo-800 rounded-full p-1 mr-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p>{improvement}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Phiên bản được cải thiện
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                                        {feedback.improvedVersion}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ title, score }) {
    return (
        <div className="rounded-lg border p-3 text-center">
            <div className="text-xl font-semibold">{score}/10</div>
            <div className="text-sm text-gray-600">{title}</div>
        </div>
    );
}

function TabButton({ children, active, onClick }) {
    return (
        <button
            className={`py-2 px-1 md:px-4 text-sm font-medium border-b-2 transition-colors ${
                active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
