"use client";

import React, { useState, useEffect } from "react";
import { fetchPathById } from "@/api/learningPath";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";

const learningPaths = [
    {
        id: 1,
        title: "Lộ trình cho người mới bắt đầu",
        description: "Bắt đầu với các khái niệm cơ bản và phát triển dần kỹ năng ngôn ngữ. ",
        courses: [
            { id: 101, title: "Nhập môn tiếng Anh", url: "/courses/31" },
            { id: 102, title: "Phát âm cơ bản", url: "/courses/1" },
        ],
    },
    {
        id: 2,
        title: "Lộ trình trung cấp",
        description: "Nâng cao từ vựng và cải thiện kỹ năng giao tiếp.",
        courses: [
            { id: 201, title: "Giao tiếp thực tế", url: "/courses/real-life-conversation" },
            { id: 202, title: "Ngữ pháp nâng cao", url: "/courses/advanced-grammar" },
        ],
    },
    {
        id: 3,
        title: "Lộ trình chuyên sâu",
        description: "Luyện thi chứng chỉ và sử dụng ngôn ngữ chuyên sâu.",
        courses: [
            { id: 301, title: "Luyện thi TOEIC", url: "/courses/toeic-prep" },
            { id: 302, title: "Viết luận chuyên nghiệp", url: "/courses/academic-writing" },
        ],
    },
];

export default function LearningPath() {
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [learningPath, setLearningPath] = useState<string | null>(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.id;

    useEffect(() => {
        if (!user) return alert("Bạn cần đăng nhập để xem lộ trình cá nhân hoá.");
        const fetchLearningPath = async () => {
            try {
                const storedPath = await fetchPathById(userId);
                setLearningPath(storedPath);
            } catch (error) {
                console.error("Lỗi khi lấy lộ trình:", error);
            }
        };
        fetchLearningPath();
    }, [userId]);
    const formatMarkdown = (text: string) => {
        return text.replace(/-?\s*(http[^\s]+)/g, (_, url) => {
            return ` [Xem khóa học](${url})`;
        });
    };
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center my-10 text-violet-500">
                Learning Paths
            </h1>
            <p className="text-center text-gray-500 mb-8 text-lg">
                Chọn lộ trình phù hợp hoặc để AI gợi ý.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPaths.map((path) => (
                    <div
                        key={path.id}
                        className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all transform hover:scale-105 border border-gray-200 bg-white ${
                            selectedPath === path.id ? "border-violet-500 shadow-xl" : ""
                        }`}
                        onClick={() => setSelectedPath(path.id)}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{path.title}</h2>
                        <p className="text-gray-600">{path.description}</p>
                    </div>
                ))}
            </div>

            {selectedPath !== null && (
                <div className="mt-10 p-6 bg-gray-100 border border-gray-200 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                        Khóa học trong lộ trình
                    </h2>
                    <ul className="space-y-3">
                        {learningPaths
                            .find((path) => path.id === selectedPath)
                            ?.courses.map((course) => (
                                <li
                                    key={course.id}
                                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                                >
                                    <span className="font-medium text-gray-800">
                                        {course.title}
                                    </span>
                                    <a
                                        href={course.url}
                                        className="text-violet-500 font-medium hover:underline"
                                    >
                                        Xem khóa học
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {learningPath && (
                <div className="mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                        Lộ trình cá nhân hoá
                    </h2>
                    <ReactMarkdown
                        components={{
                            ol: ({ node, ...props }) => (
                                <ol className="list-decimal ml-6 text-gray-700" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc ml-6 text-gray-700" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                                <a
                                    {...props}
                                    className="text-blue-500 underline hover:text-blue-700"
                                    target="_blank"
                                />
                            ),
                        }}
                    >
                        {learningPath.pathDetails
                            ? formatMarkdown(learningPath.pathDetails)
                            : "Lộ trình học chưa có"}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}
