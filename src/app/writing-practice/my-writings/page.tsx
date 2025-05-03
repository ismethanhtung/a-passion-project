"use client";

import React, { useState, useEffect } from "react";
import { WritingService, WritingResponse } from "@/lib/writing/writing-service";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function MyWritingsPage() {
    const [savedWritings, setSavedWritings] = useState<WritingResponse[]>([]);
    const [selectedWriting, setSelectedWriting] =
        useState<WritingResponse | null>(null);
    const [isClient, setIsClient] = useState(false);

    const writingService = WritingService.getInstance();

    useEffect(() => {
        setIsClient(true);
        const writings = writingService.getSavedWritingResponses();
        setSavedWritings(
            writings.sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            )
        );
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    const truncateContent = (content: string, maxLength: number = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    };

    if (!isClient) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Bài viết của tôi</h1>
                <Link href="/writing-practice/practice">
                    <Button>Viết bài mới</Button>
                </Link>
            </div>

            {savedWritings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">
                        Bạn chưa có bài viết nào
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Hãy bắt đầu luyện tập viết để cải thiện kỹ năng ngôn ngữ
                        của bạn!
                    </p>
                    <Link href="/writing-practice/practice">
                        <Button size="large">Bắt đầu ngay</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Danh sách bài viết */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b">
                                <h2 className="font-semibold">
                                    Bài viết đã lưu ({savedWritings.length})
                                </h2>
                            </div>
                            <div className="divide-y max-h-[70vh] overflow-y-auto">
                                {savedWritings.map((writing) => (
                                    <div
                                        key={writing.id}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedWriting?.id === writing.id
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedWriting(writing)
                                        }
                                    >
                                        <p className="text-sm text-gray-500 mb-1">
                                            {formatDate(writing.timestamp)}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 mb-2">
                                            {truncateContent(
                                                writing.originalPrompt,
                                                80
                                            )}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            {truncateContent(writing.content)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nội dung bài viết được chọn */}
                    <div className="lg:col-span-2">
                        {selectedWriting ? (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Đã viết vào:{" "}
                                        {formatDate(selectedWriting.timestamp)}
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                                        <p className="text-gray-700 italic">
                                            {selectedWriting.originalPrompt}
                                        </p>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap">
                                        {selectedWriting.content}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        href={`/writing-practice/feedback?id=${selectedWriting.id}`}
                                    >
                                        <Button variant="primary">
                                            Xem đánh giá
                                        </Button>
                                    </Link>
                                    <Link href={`/writing-practice/practice`}>
                                        <Button variant="outline">
                                            Viết bài tương tự
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                                <h2 className="text-xl font-semibold mb-4">
                                    Chọn một bài viết để xem
                                </h2>
                                <p className="text-gray-600">
                                    Chọn một bài viết từ danh sách bên trái để
                                    xem nội dung chi tiết và đánh giá.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
