"use client";

import React, { useState, useEffect } from "react";
import { fetchPathById } from "@/api/learningPath";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

interface LearningPath {
    pathDetails?: string;
}
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
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const router = useRouter();

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.id;

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
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
        <div className="max-w-screen-xl mx-auto p-8">
            {/* Header */}
            <header className="text-center my-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-violet-600">
                    Learning Paths
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Chọn lộ trình phù hợp hoặc để AI gợi ý.
                </p>
            </header>

            {/* Danh sách Learning Paths */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {learningPaths.map((path) => (
                    <div
                        key={path.id}
                        onClick={() => setSelectedPath(path.id)}
                        className={`p-6 bg-white border rounded-xl hover:border-violet-600 shadow transition-all transform hover:scale-105 cursor-pointer 
                  ${selectedPath === path.id ? "border-violet-600 shadow-xl" : "border-gray-200"}`}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{path.title}</h2>
                        <p className="text-gray-600">{path.description}</p>
                    </div>
                ))}
            </section>

            {selectedPath !== null && (
                <section className="mt-12">
                    <div className="p-8 bg-gray-50 border border-gray-200 hover:border-violet-600 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                            Khóa học trong lộ trình
                        </h2>
                        <ul className="space-y-4">
                            {learningPaths
                                .find((path) => path.id === selectedPath)
                                ?.courses.map((course) => (
                                    <li
                                        key={course.id}
                                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <span className="font-medium text-gray-800">
                                            {course.title}
                                        </span>
                                        <a
                                            href={course.url}
                                            className="text-violet-600 font-medium hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Xem khóa học
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </section>
            )}

            <section className="mt-12">
                {typeof learningPath === "undefined" ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <img src="/icons/loading.gif" alt="Loading..." className="w-16 h-16" />
                        <p className="mt-4 text-lg text-gray-700">Đang tải lộ trình học...</p>
                    </div>
                ) : learningPath ? (
                    <div className="p-8 bg-white border border-gray-200 hover:border-violet-600 rounded-xl shadow">
                        <h2 className="text-3xl font-semibold text-center text-violet-400 mb-6">
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
                                        rel="noopener noreferrer"
                                    />
                                ),
                            }}
                        >
                            {learningPath.pathDetails
                                ? formatMarkdown(learningPath.pathDetails)
                                : "Lộ trình học chưa có"}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <img src="/icons/loading.gif" alt="Loading..." className="w-16 h-16" />
                        <p className="mt-4 text-lg text-gray-700">Đang tải lộ trình học...</p>
                    </div>
                )}
            </section>
        </div>
    );
}
