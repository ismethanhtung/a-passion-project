"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Tất cả", "Economy", "TOEIC", "IELTS", "Old Format"];

const Tests = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const tests = [
        {
            id: 1,
            title: " New Economy TOEIC Test 1",
            description: "Kiểm tra kiến thức về ngữ pháp tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "TOEIC", "Grammar"],
            category: "Economy",
        },
        {
            id: 2,
            title: "Economy (old format) TOEIC 4 Test 1",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "TOEIC"],
        },
        {
            id: 3,
            title: "Longman TOEIC (old format) Test 2",
            description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "Reading", "TOEIC"],
        },
        {
            id: 4,
            title: "Economy Y1 TOEIC Test 2",
            description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "Reading", "TOEIC"],
        },
        {
            id: 5,
            title: "Economy (old format) TOEIC 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "TOEIC"],
        },
        {
            id: 6,
            title: "Economy Longman TOEIC (old format) Test 3",
            description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "Reading", "TOEIC"],
        },
        {
            id: 7,
            title: "New Economy TOEIC(old format) Test 4",
            description: "Kiểm tra kiến thức về ngữ pháp tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "TOEIC", "Grammar"],
        },
        {
            id: 8,
            title: "Economy (old format) IELTS Simulation 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "IELTS"],
        },
        {
            id: 9,
            title: "Economy Y1 TOEIC(old format) Test 2",
            description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "Reading", "TOEIC"],
        },
        {
            id: 10,
            title: "New Economy (old format) IELTS Simulation 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 0,
            comments: 0,
            tags: ["Part 5", "IELTS"],
        },
    ];

    const filteredTests = tests.filter(
        (test) =>
            test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCategoryClick = (category: string) => {
        if (category === "Tất cả") {
            setSearchTerm("");
        } else {
            setSearchTerm(category.toLowerCase());
        }
    };

    return (
        <div className="container mx-auto max-w-screen-lg p-4">
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-500">Online Tests</h1>

            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài kiểm tra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-2/3"
                />
            </div>

            <div className="flex justify-center gap-2 flex-wrap mb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 text-sm rounded-lg transition ${
                            searchTerm.toLowerCase() === category.toLowerCase()
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                        <div
                            key={test.id}
                            className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">{test.title}</h2>
                            <p className="text-gray-600 text-sm mb-3">{test.description}</p>

                            <div className="text-gray-500 text-xs space-y-1 mb-3">
                                <div className="flex items-center gap-2">
                                    <img className="w-4 h-4" src="/icons/clock.png" alt="Time" />
                                    <span>{test.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-4 h-4"
                                        src="/icons/user.png"
                                        alt="Participants"
                                    />
                                    <span>{test.participants} người làm</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-4 h-4"
                                        src="/icons/comment.png"
                                        alt="Comments"
                                    />
                                    <span>{test.comments} bình luận</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {test.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-lg"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => router.push(`/online-tests/${test.id}`)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg transition mt-auto"
                            >
                                Làm bài
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        Không tìm thấy bài kiểm tra.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Tests;
