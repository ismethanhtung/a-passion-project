"use client";

import React, { useState, useEffect } from "react";
import { fetchPathById } from "@/api/learningPath";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    BookOpen,
    ChevronRight,
    Award,
    BarChart,
    Clock,
    Check,
    Users,
    Target,
    Layers,
    Star,
    Bookmark,
    TrendingUp,
    BookMarked,
    Sparkles,
    RefreshCw,
    User,
} from "lucide-react";

// Types
interface Course {
    id: number;
    title: string;
    url: string;
    duration?: string;
    level?: string;
    completionRate?: number;
}

interface LearningPathItem {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    popularity: number;
    completionRate: number;
    courses: Course[];
    icon?: React.ReactNode;
}

interface LearningPath {
    pathDetails?: string;
}

// Dữ liệu mẫu
const learningPaths: LearningPathItem[] = [
    {
        id: 1,
        title: "Beginner Learning Path",
        description:
            "Start with the fundamentals and gradually build your language skills.",
        level: "Beginner",
        duration: "3 months",
        popularity: 85,
        completionRate: 78,
        icon: <BookOpen className="h-10 w-10 text-blue-500" />,
        courses: [
            {
                id: 101,
                title: "Introduction to English",
                url: "/courses/31",
                duration: "4 weeks",
                level: "Beginner",
                completionRate: 92,
            },
            {
                id: 102,
                title: "Basic Pronunciation",
                url: "/courses/1",
                duration: "3 weeks",
                level: "Beginner",
                completionRate: 85,
            },
            {
                id: 103,
                title: "Everyday Vocabulary",
                url: "/courses/15",
                duration: "4 weeks",
                level: "Beginner",
                completionRate: 79,
            },
            {
                id: 104,
                title: "Simple Grammar Structures",
                url: "/courses/8",
                duration: "5 weeks",
                level: "Beginner",
                completionRate: 83,
            },
        ],
    },
    {
        id: 2,
        title: "Intermediate Learning Path",
        description: "Expand your vocabulary and improve communication skills.",
        level: "Intermediate",
        duration: "4 months",
        popularity: 92,
        completionRate: 74,
        icon: <BarChart className="h-10 w-10 text-green-500" />,
        courses: [
            {
                id: 201,
                title: "Real-Life Conversations",
                url: "/courses/17",
                duration: "5 weeks",
                level: "Intermediate",
                completionRate: 88,
            },
            {
                id: 202,
                title: "Advanced Grammar",
                url: "/courses/18",
                duration: "6 weeks",
                level: "Intermediate",
                completionRate: 76,
            },
            {
                id: 203,
                title: "Business English",
                url: "/courses/22",
                duration: "4 weeks",
                level: "Intermediate",
                completionRate: 81,
            },
            {
                id: 204,
                title: "Listening & Speaking Skills",
                url: "/courses/5",
                duration: "5 weeks",
                level: "Intermediate",
                completionRate: 79,
            },
        ],
    },
    {
        id: 3,
        title: "Advanced Learning Path",
        description:
            "Master the language with test preparation and professional skills.",
        level: "Advanced",
        duration: "6 months",
        popularity: 78,
        completionRate: 68,
        icon: <Award className="h-10 w-10 text-purple-500" />,
        courses: [
            {
                id: 301,
                title: "TOEIC Exam Preparation",
                url: "/courses/19",
                duration: "8 weeks",
                level: "Advanced",
                completionRate: 75,
            },
            {
                id: 302,
                title: "Professional Writing",
                url: "/courses/20",
                duration: "6 weeks",
                level: "Advanced",
                completionRate: 82,
            },
            {
                id: 303,
                title: "Advanced Pronunciation",
                url: "/courses/7",
                duration: "4 weeks",
                level: "Advanced",
                completionRate: 77,
            },
            {
                id: 304,
                title: "Academic Writing",
                url: "/courses/21",
                duration: "7 weeks",
                level: "Advanced",
                completionRate: 69,
            },
        ],
    },
    {
        id: 4,
        title: "Business English Path",
        description:
            "Develop professional English skills for the workplace and business contexts.",
        level: "Intermediate to Advanced",
        duration: "5 months",
        popularity: 87,
        completionRate: 72,
        icon: <Target className="h-10 w-10 text-orange-500" />,
        courses: [
            {
                id: 401,
                title: "Business Communication",
                url: "/courses/25",
                duration: "6 weeks",
                level: "Intermediate",
                completionRate: 84,
            },
            {
                id: 402,
                title: "Professional Presentations",
                url: "/courses/26",
                duration: "5 weeks",
                level: "Intermediate",
                completionRate: 79,
            },
            {
                id: 403,
                title: "Negotiation & Meeting Skills",
                url: "/courses/27",
                duration: "7 weeks",
                level: "Advanced",
                completionRate: 76,
            },
            {
                id: 404,
                title: "Business Email Writing",
                url: "/courses/28",
                duration: "4 weeks",
                level: "Intermediate",
                completionRate: 91,
            },
        ],
    },
];

export default function LearningPath() {
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [activeTab, setActiveTab] = useState<"paths" | "personalized">(
        "paths"
    );
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
    }, [userId, router, user]);

    const formatMarkdown = (text: string) => {
        return text?.replace(/-?\s*(http[^\s]+)/g, (_, url) => {
            return ` [Xem khóa học](${url})`;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Hero */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mx-auto max-w-3xl">
                        <div className="inline-flex items-center py-1 px-3 bg-slate-700/40 rounded-full text-sm text-slate-300 mb-5">
                            <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                            <span>Built by LanguaX AI</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Learning Paths
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Pursue specially designed learning paths or create
                            personalized paths to achieve goals
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setActiveTab("paths")}
                                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === "paths"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-slate-700 hover:bg-slate-600 text-white"
                                }`}
                            >
                                <span className="flex items-center">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Learning Paths
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab("personalized")}
                                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === "personalized"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-slate-700 hover:bg-slate-600 text-white"
                                }`}
                            >
                                <span className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Personalized Paths
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {activeTab === "paths" ? (
                    <>
                        {/* Hiển thị lộ trình có sẵn */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {learningPaths.map((path) => (
                                <div
                                    key={path.id}
                                    onClick={() =>
                                        setSelectedPath(
                                            path.id === selectedPath
                                                ? null
                                                : path.id
                                        )
                                    }
                                    className={`bg-white border rounded-xl transition-all cursor-pointer
                                    ${
                                        selectedPath === path.id
                                            ? "border-blue-500 ring-2 ring-blue-200"
                                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="mb-4">{path.icon}</div>
                                        <div className="flex items-center mb-2">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {path.title}
                                            </h2>
                                            {selectedPath === path.id && (
                                                <Check className="h-5 w-5 text-blue-500 ml-2" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {path.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                <span>{path.duration}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <TrendingUp className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                <span>{path.level}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                <span>
                                                    {path.popularity}%
                                                    popularity
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <BarChart className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                <span>
                                                    {path.completionRate}%
                                                    completion
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-blue-600">
                                                {path.courses.length} khóa học
                                            </span>
                                            <button
                                                className="text-xs flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Logic to bookmark
                                                }}
                                            >
                                                <Bookmark className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chi tiết lộ trình được chọn */}
                        {selectedPath !== null && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
                                <div className="border-b border-gray-200 bg-gray-50 p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                {
                                                    learningPaths.find(
                                                        (p) =>
                                                            p.id ===
                                                            selectedPath
                                                    )?.title
                                                }
                                            </h2>
                                            <p className="text-gray-600">
                                                {
                                                    learningPaths.find(
                                                        (p) =>
                                                            p.id ===
                                                            selectedPath
                                                    )?.description
                                                }
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
                                            <BookMarked className="h-4 w-4 mr-2" />
                                            Follow the learning path
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                                        Courses in the learning path
                                    </h3>

                                    <div className="space-y-4">
                                        {learningPaths
                                            .find((p) => p.id === selectedPath)
                                            ?.courses.map((course, index) => (
                                                <div
                                                    key={course.id}
                                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center mb-2">
                                                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                                                    {index + 1}
                                                                </div>
                                                                <h4 className="font-medium text-gray-800">
                                                                    {
                                                                        course.title
                                                                    }
                                                                </h4>
                                                            </div>

                                                            <div className="ml-9 grid grid-cols-3 gap-4 text-xs text-gray-500 mb-3">
                                                                <div className="flex items-center">
                                                                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                                    <span>
                                                                        {
                                                                            course.duration
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <TrendingUp className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                                    <span>
                                                                        {
                                                                            course.level
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <BarChart className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                                    <span>
                                                                        {
                                                                            course.completionRate
                                                                        }
                                                                        %
                                                                        completion
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <a
                                                            href={course.url}
                                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                                                        >
                                                            <span>
                                                                Xem khóa học
                                                            </span>
                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // Lộ trình cá nhân hóa
                    <div className="max-w-4xl mx-auto">
                        {typeof learningPath === "undefined" ? (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <Target className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    Chưa có lộ trình cá nhân hóa
                                </h2>
                                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                    Tạo lộ trình học cá nhân dựa trên mục tiêu,
                                    trình độ và sở thích học tập của bạn
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/chatbot">
                                        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto">
                                            Tạo lộ trình với Chatbot
                                        </button>
                                    </Link>
                                    <Link href="/settings">
                                        <button className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors w-full sm:w-auto">
                                            Cập nhật thông tin học tập
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : learningPath ? (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                    <h2 className="text-2xl font-bold mb-2">
                                        Lộ trình học cá nhân hóa
                                    </h2>
                                    <p className="text-blue-100">
                                        Được cá nhân hóa dựa trên mục tiêu và
                                        trình độ của bạn
                                    </p>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-end mb-6">
                                        <div className="inline-flex gap-2">
                                            <Link href="/chatbot">
                                                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors flex items-center">
                                                    <span>
                                                        Làm mới lộ trình
                                                    </span>
                                                    <RefreshCw className="h-3.5 w-3.5 ml-1.5" />
                                                </button>
                                            </Link>
                                            <Link href="/settings">
                                                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors flex items-center">
                                                    <span>
                                                        Cập nhật mục tiêu
                                                    </span>
                                                    <Target className="h-3.5 w-3.5 ml-1.5" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                ol: ({ node, ...props }) => (
                                                    <ol
                                                        className="list-decimal ml-6 space-y-2 text-gray-700"
                                                        {...props}
                                                    />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul
                                                        className="list-disc ml-6 space-y-2 text-gray-700"
                                                        {...props}
                                                    />
                                                ),
                                                a: ({ node, ...props }) => (
                                                    <a
                                                        {...props}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    />
                                                ),
                                                h1: ({ node, ...props }) => (
                                                    <h1
                                                        className="text-2xl font-bold text-gray-800 my-4"
                                                        {...props}
                                                    />
                                                ),
                                                h2: ({ node, ...props }) => (
                                                    <h2
                                                        className="text-xl font-semibold text-gray-800 mt-6 mb-3"
                                                        {...props}
                                                    />
                                                ),
                                                h3: ({ node, ...props }) => (
                                                    <h3
                                                        className="text-lg font-medium text-gray-800 mt-5 mb-2"
                                                        {...props}
                                                    />
                                                ),
                                                p: ({ node, ...props }) => (
                                                    <p
                                                        className="my-3 text-gray-700"
                                                        {...props}
                                                    />
                                                ),
                                            }}
                                        >
                                            {learningPath.pathDetails
                                                ? formatMarkdown(
                                                      learningPath.pathDetails
                                                  )
                                                : "Lộ trình học chưa có nội dung"}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <Target className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    Chưa có lộ trình cá nhân hóa
                                </h2>
                                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                    Tạo lộ trình học cá nhân dựa trên mục tiêu,
                                    trình độ và sở thích học tập của bạn
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/chatbot">
                                        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto">
                                            Tạo lộ trình với Chatbot
                                        </button>
                                    </Link>
                                    <Link href="/settings">
                                        <button className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors w-full sm:w-auto">
                                            Cập nhật thông tin học tập
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Thêm phần gợi ý */}
                        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                <Star className="h-5 w-5 mr-2 text-amber-500" />
                                Gợi ý cho bạn
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Để đạt được kết quả tốt nhất với lộ trình học cá
                                nhân:
                            </p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                                    <span>
                                        Học đều đặn mỗi ngày, thậm chí chỉ 15-30
                                        phút
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                                    <span>
                                        Hoàn thành các bài tập sau mỗi khóa học
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                                    <span>
                                        Thực hành với bạn học hoặc ứng dụng đàm
                                        thoại Pronunciation Coach
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                                    <span>
                                        Cập nhật mục tiêu của bạn khi cần thiết
                                        để điều chỉnh lộ trình
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
