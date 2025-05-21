"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Clock, Users, Plus } from "lucide-react";
import Link from "next/link";
import TestsChatbot from "@/components/TestsChatbot";
import TestList from "@/components/test/TestList";

const Tests = () => {
    const router = useRouter();
    const [showChatbot, setShowChatbot] = useState(true);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bài kiểm tra trực tuyến
                    </h1>
                    <p className="text-gray-600 max-w-2xl">
                        Thực hành với các bài kiểm tra TOEIC, IELTS và nhiều bài
                        kiểm tra khác. Cải thiện kỹ năng và theo dõi tiến trình
                        của bạn qua thời gian.
                    </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/online-tests/create"
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center"
                    >
                        <Plus className="h-5 w-5 mr-1.5" />
                        Tạo bài kiểm tra
                    </Link>

                    <Link
                        href="/online-tests/ai-generate"
                        className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center"
                    >
                        <svg
                            className="h-5 w-5 mr-1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.4999"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Tạo với AI
                    </Link>
                </div>
            </div>

            {/* Featured tests section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Bài kiểm tra nổi bật
                    </h2>
                    <Link
                        href="/online-tests?featured=true"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Xem tất cả
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Placeholder for featured tests - will be replaced with real data from API */}
                    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-100">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative">
                            <div className="text-center text-white px-4">
                                <h3 className="text-2xl font-bold">TOEIC</h3>
                                <p>Intermediate Level</p>
                            </div>
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                TOEIC
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                Intermediate
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                TOEIC Full Test
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Bài thi TOEIC đầy đủ với cấu trúc và độ khó
                                tương đương đề thi thật.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        120 phút
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        1245 người
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/online-tests/toeic-1"
                                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                            >
                                Xem bài kiểm tra
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-100">
                        <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center relative">
                            <div className="text-center text-white px-4">
                                <h3 className="text-2xl font-bold">IELTS</h3>
                                <p>Advanced Level</p>
                            </div>
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                IELTS
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                Advanced
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                IELTS Academic Test
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Bài thi mô phỏng IELTS Academic với đầy đủ 4 kỹ
                                năng.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        165 phút
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        562 người
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/online-tests/ielts-1"
                                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                            >
                                Xem bài kiểm tra
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-100">
                        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center relative">
                            <div className="text-center text-white px-4">
                                <h3 className="text-2xl font-bold">
                                    Placement
                                </h3>
                                <p>Beginner Level</p>
                            </div>
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                Placement
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                Beginner
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                English Placement Test
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Bài kiểm tra phân loại trình độ tiếng Anh từ A1
                                đến C2.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        45 phút
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                        2145 người
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/online-tests/placement-1"
                                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                            >
                                Xem bài kiểm tra
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Categories section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Danh mục bài kiểm tra
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/online-tests?testType=TOEIC"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-2">TOEIC</h3>
                        <p className="text-blue-100 text-sm">
                            Luyện tập và chuẩn bị cho kỳ thi TOEIC với đầy đủ
                            các phần.
                        </p>
                    </Link>

                    <Link
                        href="/online-tests?testType=IELTS"
                        className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-2">IELTS</h3>
                        <p className="text-green-100 text-sm">
                            Rèn luyện 4 kỹ năng Nghe, Nói, Đọc, Viết với bài thi
                            IELTS.
                        </p>
                    </Link>

                    <Link
                        href="/online-tests?testType=Placement"
                        className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-2">Placement</h3>
                        <p className="text-orange-100 text-sm">
                            Kiểm tra và xác định trình độ tiếng Anh hiện tại của
                            bạn.
                        </p>
                    </Link>

                    <Link
                        href="/online-tests?testType=General"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-2">General</h3>
                        <p className="text-purple-100 text-sm">
                            Các bài kiểm tra kỹ năng tiếng Anh tổng quát.
                        </p>
                    </Link>
                </div>
            </div>

            {/* All tests section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tất cả bài kiểm tra
                </h2>
                <TestList />
            </div>

            {/* Chatbot */}
            {showChatbot && <TestsChatbot />}
        </div>
    );
};

export default Tests;
