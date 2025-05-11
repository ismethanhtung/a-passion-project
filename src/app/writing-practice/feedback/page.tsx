"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    WritingService,
    WritingResponse,
    WritingFeedback,
} from "@/lib/writing/writing-service";
import Button from "@/components/ui/button";

export default function FeedbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const writingId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [writing, setWriting] = useState<WritingResponse | null>(null);
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    const [activeTab, setActiveTab] = useState<
        "overview" | "grammar" | "vocabulary" | "structure" | "improvement"
    >("overview");

    const writingService = WritingService.getInstance();

    // Lấy dữ liệu bài viết và feedback
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!writingId) {
                    setError("No writing ID provided");
                    setLoading(false);
                    return;
                }

                // Lấy thông tin bài viết từ localStorage
                const writingData =
                    writingService.getWritingResponseById(writingId);
                if (!writingData) {
                    setError("Writing not found");
                    setLoading(false);
                    return;
                }
                setWriting(writingData);

                // Kiểm tra xem feedback đã tồn tại chưa
                let feedbackData = writingService.getSavedFeedback(writingId);

                // Nếu chưa có feedback, gọi API để đánh giá
                if (!feedbackData) {
                    feedbackData = await writingService.evaluateWriting(
                        writingData.content,
                        writingData.originalPrompt,
                        writingData.id,
                        writingData.language
                    );
                }

                setFeedback(feedbackData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load feedback");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [writingId]);

    // Xử lý trạng thái đang tải
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-gray-700">
                    {writing?.language === "vi"
                        ? "Đang phân tích bài viết của bạn..."
                        : "Analyzing your writing..."}
                </p>
            </div>
        );
    }

    // Xử lý trạng thái lỗi
    if (error || !writing || !feedback) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">
                        {writing?.language === "vi"
                            ? "Có lỗi xảy ra"
                            : "An error occurred"}
                    </h1>
                    <p className="text-gray-700 mb-6">
                        {error ||
                            (writing?.language === "vi"
                                ? "Không thể tải phản hồi bài viết"
                                : "Could not load writing feedback")}
                    </p>
                    <Link href="/writing-practice/practice">
                        <Button variant="primary">
                            {writing?.language === "vi"
                                ? "Quay lại luyện tập"
                                : "Back to practice"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Xác định ngôn ngữ hiển thị
    const language = writing.language || "en";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {language === "vi"
                        ? "Đánh giá bài viết"
                        : "Writing Feedback"}
                </h1>
                <div className="flex space-x-4">
                    <Link href="/writing-practice/practice">
                        <Button variant="outline">
                            {language === "vi" ? "Viết bài mới" : "Write New"}
                        </Button>
                    </Link>
                    <Link href="/writing-practice/my-writings">
                        <Button variant="outline">
                            {language === "vi"
                                ? "Bài viết của tôi"
                                : "My Writings"}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột bên trái - Bài viết gốc */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {language === "vi"
                                ? "Bài viết của bạn"
                                : "Your Writing"}
                        </h2>
                        <div className="prose max-w-none">
                            <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm italic border-l-4 border-blue-500">
                                <p className="whitespace-pre-line">
                                    {writing.originalPrompt}
                                </p>
                            </div>
                            <div className="whitespace-pre-wrap">
                                {writing.content}
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 flex justify-between">
                            <span>
                                {language === "vi" ? "Đã nộp" : "Submitted"}:{" "}
                                {new Date(writing.timestamp).toLocaleString()}
                            </span>
                            <span>
                                {language === "vi" ? "Số từ" : "Words"}:{" "}
                                {writing.wordCount || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cột bên phải - Đánh giá */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6 mb-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                            <div className="mb-4 sm:mb-0">
                                <div className="text-3xl font-bold">
                                    {feedback.overallScore}/10
                                </div>
                                <div className="text-sm text-gray-500">
                                    {language === "vi"
                                        ? "Điểm tổng thể"
                                        : "Overall Score"}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <ScoreCard
                                    title={
                                        language === "vi"
                                            ? "Ngữ pháp"
                                            : "Grammar"
                                    }
                                    score={feedback.grammar.score}
                                />
                                <ScoreCard
                                    title={
                                        language === "vi"
                                            ? "Từ vựng"
                                            : "Vocabulary"
                                    }
                                    score={feedback.vocabulary.score}
                                />
                                <ScoreCard
                                    title={
                                        language === "vi"
                                            ? "Cấu trúc"
                                            : "Structure"
                                    }
                                    score={feedback.structure.score}
                                />
                                <ScoreCard
                                    title={
                                        language === "vi"
                                            ? "Mạch lạc"
                                            : "Coherence"
                                    }
                                    score={feedback.coherence.score}
                                />
                            </div>
                        </div>

                        <div className="border-b mb-6">
                            <div className="flex flex-wrap gap-2">
                                <TabButton
                                    active={activeTab === "overview"}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    {language === "vi"
                                        ? "Tổng quan"
                                        : "Overview"}
                                </TabButton>
                                <TabButton
                                    active={activeTab === "grammar"}
                                    onClick={() => setActiveTab("grammar")}
                                >
                                    {language === "vi" ? "Ngữ pháp" : "Grammar"}
                                </TabButton>
                                <TabButton
                                    active={activeTab === "vocabulary"}
                                    onClick={() => setActiveTab("vocabulary")}
                                >
                                    {language === "vi"
                                        ? "Từ vựng"
                                        : "Vocabulary"}
                                </TabButton>
                                <TabButton
                                    active={activeTab === "structure"}
                                    onClick={() => setActiveTab("structure")}
                                >
                                    {language === "vi"
                                        ? "Cấu trúc"
                                        : "Structure"}
                                </TabButton>
                                <TabButton
                                    active={activeTab === "improvement"}
                                    onClick={() => setActiveTab("improvement")}
                                >
                                    {language === "vi"
                                        ? "Cải thiện"
                                        : "Improvement"}
                                </TabButton>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "overview" && (
                                    <OverviewTab
                                        feedback={feedback}
                                        language={language}
                                    />
                                )}
                                {activeTab === "grammar" && (
                                    <GrammarTab
                                        feedback={feedback}
                                        language={language}
                                    />
                                )}
                                {activeTab === "vocabulary" && (
                                    <VocabularyTab
                                        feedback={feedback}
                                        language={language}
                                    />
                                )}
                                {activeTab === "structure" && (
                                    <StructureTab
                                        feedback={feedback}
                                        language={language}
                                    />
                                )}
                                {activeTab === "improvement" && (
                                    <ImprovementTab
                                        feedback={feedback}
                                        language={language}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Component hiển thị điểm đánh giá
function ScoreCard({ title, score }) {
    const getScoreColor = (score: number) => {
        if (score >= 9) return "bg-green-100 text-green-800";
        if (score >= 7) return "bg-blue-100 text-blue-800";
        if (score >= 5) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="text-center p-2 rounded-lg bg-gray-50">
            <div className="text-sm mb-1">{title}</div>
            <div
                className={`text-xl font-bold rounded-full inline-block w-8 h-8 flex items-center justify-center ${getScoreColor(
                    score
                )}`}
            >
                {score}
            </div>
        </div>
    );
}

// Component nút tab
function TabButton({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                active
                    ? "bg-blue-50 text-blue-800 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
        >
            {children}
        </button>
    );
}

// Tab tổng quan
function OverviewTab({ feedback, language }) {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                    {language === "vi"
                        ? "Đánh giá tổng quát"
                        : "General Assessment"}
                </h3>
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-blue-800 mb-2">
                            {language === "vi" ? "Ngữ pháp" : "Grammar"}
                        </h4>
                        <p className="text-gray-700">
                            {feedback.grammar.comments[0]}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md">
                        <h4 className="font-medium text-purple-800 mb-2">
                            {language === "vi" ? "Từ vựng" : "Vocabulary"}
                        </h4>
                        <p className="text-gray-700">
                            {feedback.vocabulary.comments[0]}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-md">
                        <h4 className="font-medium text-green-800 mb-2">
                            {language === "vi" ? "Cấu trúc" : "Structure"}
                        </h4>
                        <p className="text-gray-700">
                            {feedback.structure.comments[0]}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-md">
                        <h4 className="font-medium text-yellow-800 mb-2">
                            {language === "vi" ? "Mạch lạc" : "Coherence"}
                        </h4>
                        <p className="text-gray-700">
                            {feedback.coherence.comments[0]}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">
                    {language === "vi"
                        ? "Điểm mạnh và điểm yếu"
                        : "Strengths & Weaknesses"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-md">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                            <span className="mr-2">✓</span>
                            {language === "vi" ? "Điểm mạnh" : "Strengths"}
                        </h4>
                        <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            {feedback.grammar.comments
                                .slice(0, 1)
                                .map((comment, i) => (
                                    <li key={`str-g-${i}`}>{comment}</li>
                                ))}
                            {feedback.vocabulary.comments
                                .slice(0, 1)
                                .map((comment, i) => (
                                    <li key={`str-v-${i}`}>{comment}</li>
                                ))}
                            {feedback.structure.comments
                                .slice(0, 1)
                                .map((comment, i) => (
                                    <li key={`str-s-${i}`}>{comment}</li>
                                ))}
                        </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-md">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                            <span className="mr-2">⚠</span>
                            {language === "vi"
                                ? "Điểm cần cải thiện"
                                : "Areas to Improve"}
                        </h4>
                        <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            {feedback.improvements
                                .slice(0, 3)
                                .map((improvement, i) => (
                                    <li key={`imp-${i}`}>{improvement}</li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tab ngữ pháp
function GrammarTab({ feedback, language }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">
                {language === "vi" ? "Đánh giá ngữ pháp" : "Grammar Assessment"}
            </h3>
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi" ? "Nhận xét" : "Comments"}
                </h4>
                <ul className="space-y-2 bg-blue-50 p-4 rounded-md">
                    {feedback.grammar.comments.map((comment, i) => (
                        <li key={`comment-${i}`} className="text-gray-700">
                            {comment}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi" ? "Lỗi cụ thể" : "Specific Errors"}
                </h4>
                <div className="space-y-4">
                    {feedback.grammar.errors &&
                        feedback.grammar.errors.map((error, i) => (
                            <div
                                key={`error-${i}`}
                                className="border border-gray-200 rounded-md overflow-hidden"
                            >
                                <div className="bg-red-50 p-3 border-b border-gray-200">
                                    <div className="font-medium text-red-800">
                                        {language === "vi" ? "Lỗi" : "Error"}:
                                    </div>
                                    <div className="text-gray-700">
                                        {error.original}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 border-b border-gray-200">
                                    <div className="font-medium text-green-800">
                                        {language === "vi"
                                            ? "Sửa thành"
                                            : "Correction"}
                                        :
                                    </div>
                                    <div className="text-gray-700">
                                        {error.correction}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3">
                                    <div className="font-medium text-gray-800">
                                        {language === "vi"
                                            ? "Giải thích"
                                            : "Explanation"}
                                        :
                                    </div>
                                    <div className="text-gray-700">
                                        {error.explanation}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

// Tab từ vựng
function VocabularyTab({ feedback, language }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">
                {language === "vi"
                    ? "Đánh giá từ vựng"
                    : "Vocabulary Assessment"}
            </h3>
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi" ? "Nhận xét" : "Comments"}
                </h4>
                <ul className="space-y-2 bg-purple-50 p-4 rounded-md">
                    {feedback.vocabulary.comments.map((comment, i) => (
                        <li key={`v-comment-${i}`} className="text-gray-700">
                            {comment}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi"
                        ? "Gợi ý từ vựng"
                        : "Vocabulary Suggestions"}
                </h4>
                <div className="space-y-4">
                    {feedback.vocabulary.suggestions &&
                        feedback.vocabulary.suggestions.map((suggestion, i) => (
                            <div
                                key={`sug-${i}`}
                                className="border border-gray-200 rounded-md overflow-hidden"
                            >
                                <div className="bg-yellow-50 p-3 border-b border-gray-200">
                                    <div className="font-medium text-yellow-800">
                                        {language === "vi"
                                            ? "Từ hiện tại"
                                            : "Current Word"}
                                        :
                                    </div>
                                    <div className="text-gray-700 font-bold">
                                        {suggestion.word}
                                    </div>
                                    <div className="text-gray-600 mt-1 text-sm italic">
                                        {language === "vi"
                                            ? "Ngữ cảnh"
                                            : "Context"}
                                        : {suggestion.context}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3">
                                    <div className="font-medium text-green-800">
                                        {language === "vi"
                                            ? "Từ thay thế"
                                            : "Alternatives"}
                                        :
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {suggestion.alternatives.map(
                                            (alt, j) => (
                                                <span
                                                    key={`alt-${j}`}
                                                    className="bg-white px-2 py-1 rounded-full text-sm border border-green-200"
                                                >
                                                    {alt}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

// Tab cấu trúc
function StructureTab({ feedback, language }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">
                {language === "vi"
                    ? "Đánh giá cấu trúc và mạch lạc"
                    : "Structure & Coherence Assessment"}
            </h3>

            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi" ? "Cấu trúc bài viết" : "Structure"}
                </h4>
                <ul className="space-y-2 bg-green-50 p-4 rounded-md">
                    {feedback.structure.comments.map((comment, i) => (
                        <li key={`s-comment-${i}`} className="text-gray-700">
                            {comment}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi" ? "Tính mạch lạc" : "Coherence"}
                </h4>
                <ul className="space-y-2 bg-yellow-50 p-4 rounded-md">
                    {feedback.coherence.comments.map((comment, i) => (
                        <li key={`c-comment-${i}`} className="text-gray-700">
                            {comment}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-3">
                    {language === "vi" ? "Lời khuyên" : "Tips for Improvement"}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {feedback.improvements.slice(0, 3).map((tip, i) => (
                        <li key={`tip-${i}`}>{tip}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

// Tab cải thiện
function ImprovementTab({ feedback, language }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">
                {language === "vi"
                    ? "Gợi ý cải thiện"
                    : "Improvement Suggestions"}
            </h3>

            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi"
                        ? "Điểm cần cải thiện"
                        : "Areas to Improve"}
                </h4>
                <ul className="space-y-2 bg-orange-50 p-4 rounded-md list-disc list-inside">
                    {feedback.improvements.map((improvement, i) => (
                        <li key={`imp-full-${i}`} className="text-gray-700">
                            {improvement}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-medium text-gray-700 mb-3">
                    {language === "vi"
                        ? "Phiên bản cải thiện"
                        : "Improved Version"}
                </h4>
                <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500">
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {feedback.improvedVersion}
                    </p>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <div>
                    <Link href="/writing-practice/practice">
                        <Button>
                            {language === "vi"
                                ? "Viết bài mới"
                                : "Write New Essay"}
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href="/writing-practice/my-writings">
                        <Button variant="outline">
                            {language === "vi"
                                ? "Bài viết của tôi"
                                : "My Writings"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
