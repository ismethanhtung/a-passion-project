"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WritingService, WritingResponse } from "@/lib/writing/writing-service";
import { Button } from "@/components/ui/button";

export default function MyWritingsPage() {
    const [writings, setWritings] = useState<WritingResponse[]>([]);
    const [filteredWritings, setFilteredWritings] = useState<WritingResponse[]>(
        []
    );
    const [selectedLanguage, setSelectedLanguage] = useState<
        "all" | "en" | "vi"
    >("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWriting, setSelectedWriting] =
        useState<WritingResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const writingService = WritingService.getInstance();

    // Lấy danh sách bài viết từ localStorage khi trang được tải
    useEffect(() => {
        const savedWritings = writingService.getSavedWritingResponses();
        // Sắp xếp theo thời gian gần nhất
        const sortedWritings = [...savedWritings].sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        );
        setWritings(sortedWritings);
        setFilteredWritings(sortedWritings);
    }, []);

    // Lọc bài viết khi ngôn ngữ hoặc từ khóa tìm kiếm thay đổi
    useEffect(() => {
        let filtered = [...writings];

        // Lọc theo ngôn ngữ
        if (selectedLanguage !== "all") {
            filtered = filtered.filter(
                (writing) => writing.language === selectedLanguage
            );
        }

        // Lọc theo từ khóa
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (writing) =>
                    writing.content.toLowerCase().includes(term) ||
                    writing.originalPrompt.toLowerCase().includes(term) ||
                    (writing.title &&
                        writing.title.toLowerCase().includes(term))
            );
        }

        setFilteredWritings(filtered);
    }, [selectedLanguage, searchTerm, writings]);

    // Mở modal xem chi tiết bài viết
    const openWritingDetail = (writing: WritingResponse) => {
        setSelectedWriting(writing);
        setIsModalOpen(true);
    };

    // Component Modal xem chi tiết bài viết
    const WritingDetailModal = () => {
        if (!selectedWriting) return null;

        const feedback = writingService.getSavedFeedback(selectedWriting.id);
        const language = selectedWriting.language || "en";

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {language === "vi"
                                    ? "Chi tiết bài viết"
                                    : "Writing Details"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md mb-4 border-l-4 border-blue-500">
                            <h3 className="font-medium text-gray-700 mb-2">
                                {language === "vi" ? "Đề bài" : "Prompt"}:
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line">
                                {selectedWriting.originalPrompt}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">
                                {language === "vi"
                                    ? "Bài viết của bạn"
                                    : "Your Writing"}
                                :
                            </h3>
                            <div className="border border-gray-200 rounded-md p-4 whitespace-pre-wrap">
                                {selectedWriting.content}
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                            <div>
                                {language === "vi" ? "Đã nộp" : "Submitted"}:{" "}
                                {new Date(
                                    selectedWriting.timestamp
                                ).toLocaleString()}
                            </div>
                            <div>
                                {language === "vi" ? "Số từ" : "Word count"}:{" "}
                                {selectedWriting.wordCount || 0}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Link
                                href={`/writing-practice/feedback?id=${selectedWriting.id}`}
                            >
                                <Button>
                                    {feedback
                                        ? language === "vi"
                                            ? "Xem đánh giá"
                                            : "View Feedback"
                                        : language === "vi"
                                        ? "Nhận đánh giá"
                                        : "Get Feedback"}
                                </Button>
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                {language === "vi" ? "Đóng" : "Close"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {selectedLanguage === "vi"
                        ? "Bài viết của tôi"
                        : "My Writings"}
                </h1>
                <Link href="/writing-practice/practice">
                    <Button variant="primary">
                        {selectedLanguage === "vi"
                            ? "Viết bài mới"
                            : "Write New"}
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="relative flex-grow max-w-xl">
                        <input
                            type="text"
                            placeholder={
                                selectedLanguage === "vi"
                                    ? "Tìm kiếm bài viết..."
                                    : "Search writings..."
                            }
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pl-10"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">
                            🔍
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setSelectedLanguage("all")}
                            className={`px-4 py-2 rounded-md ${
                                selectedLanguage === "all"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {selectedLanguage === "vi" ? "Tất cả" : "All"}
                        </button>
                        <button
                            onClick={() => setSelectedLanguage("en")}
                            className={`px-4 py-2 rounded-md ${
                                selectedLanguage === "en"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setSelectedLanguage("vi")}
                            className={`px-4 py-2 rounded-md ${
                                selectedLanguage === "vi"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Tiếng Việt
                        </button>
                    </div>
                </div>

                {filteredWritings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            {selectedLanguage === "vi"
                                ? "Chưa có bài viết nào"
                                : "No writings found"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {selectedLanguage === "vi"
                                ? "Bạn chưa lưu bài viết nào. Hãy bắt đầu luyện tập!"
                                : "You haven't saved any writings yet. Start practicing!"}
                        </p>
                        <Link href="/writing-practice/practice">
                            <Button>
                                {selectedLanguage === "vi"
                                    ? "Bắt đầu viết"
                                    : "Start Writing"}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedLanguage === "vi"
                                            ? "Đề bài"
                                            : "Prompt"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedLanguage === "vi"
                                            ? "Ngày tạo"
                                            : "Date"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedLanguage === "vi"
                                            ? "Ngôn ngữ"
                                            : "Language"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedLanguage === "vi"
                                            ? "Số từ"
                                            : "Words"}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedLanguage === "vi"
                                            ? "Tác vụ"
                                            : "Actions"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredWritings.map((writing) => (
                                    <tr
                                        key={writing.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            openWritingDetail(writing)
                                        }
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {writing.originalPrompt.substring(
                                                    0,
                                                    60
                                                )}
                                                {writing.originalPrompt.length >
                                                60
                                                    ? "..."
                                                    : ""}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(
                                                    writing.timestamp
                                                ).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    writing.language === "en"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {writing.language === "en"
                                                    ? "English"
                                                    : "Tiếng Việt"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {writing.wordCount || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/writing-practice/feedback?id=${writing.id}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                {selectedLanguage === "vi"
                                                    ? "Đánh giá"
                                                    : "Feedback"}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && <WritingDetailModal />}
        </div>
    );
}
