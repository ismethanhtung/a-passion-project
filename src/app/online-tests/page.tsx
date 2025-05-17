"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    Badge,
    Clock,
    Users,
    MessageSquare,
    ChevronRight,
    ArrowRight,
    TrendingUp,
    CheckCircle,
    BookOpen,
    Award,
    Star,
    BarChart,
    ChevronDown,
    Headphones,
    Settings,
    BookMarked,
    PenTool,
    FileText,
    ArrowUp,
} from "lucide-react";
import Link from "next/link";
import TestsChatbot from "@/components/TestsChatbot";

// Types định nghĩa cho bài thi
type TestType = "TOEIC" | "IELTS" | "General" | "Placement";
type TestDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

interface TestItem {
    id: string | number;
    title: string;
    description: string;
    duration: string;
    questions: number;
    participants: number;
    testType: TestType;
    tags: string[];
    difficulty: TestDifficulty;
    popularity: number;
    isFeatured: boolean;
    completionRate: number;
    sections?: {
        listening?: {
            parts: number;
            questions: number;
        };
        reading?: {
            parts: number;
            questions: number;
        };
    };
    lastUpdated?: string;
}

const categories = ["All", "TOEIC", "IELTS", "Placement", "General"];
const difficultyLevels: TestDifficulty[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
];

const Tests = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState<
        TestDifficulty | ""
    >("");
    const [sortBy, setSortBy] = useState("popular");
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const tests: TestItem[] = [
        {
            id: "toeic-1",
            title: "TOEIC Full Test",
            description:
                "Bài thi TOEIC đầy đủ với cấu trúc và độ khó tương đương đề thi thật.",
            duration: "120 phút",
            questions: 200,
            participants: 1245,
            testType: "TOEIC",
            tags: ["TOEIC", "Full Test", "ETS Format"],
            difficulty: "Intermediate",
            popularity: 98,
            isFeatured: true,
            completionRate: 87,
            sections: {
                listening: {
                    parts: 4,
                    questions: 100,
                },
                reading: {
                    parts: 3,
                    questions: 100,
                },
            },
            lastUpdated: "2023-11-15",
        },
        {
            id: "toeic-2",
            title: "TOEIC Mini Test - Listening Focus",
            description:
                "Bài thi tập trung vào phần Listening với các câu hỏi phổ biến.",
            duration: "60 phút",
            questions: 100,
            participants: 876,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Practice"],
            difficulty: "Intermediate",
            popularity: 85,
            isFeatured: true,
            completionRate: 92,
            sections: {
                listening: {
                    parts: 4,
                    questions: 100,
                },
            },
            lastUpdated: "2023-10-20",
        },
        {
            id: "toeic-3",
            title: "TOEIC Mini Test - Reading Focus",
            description:
                "Luyện tập phần Reading với các dạng câu hỏi thường gặp.",
            duration: "75 phút",
            questions: 100,
            participants: 735,
            testType: "TOEIC",
            tags: ["TOEIC", "Reading", "Grammar", "Practice"],
            difficulty: "Intermediate",
            popularity: 82,
            isFeatured: false,
            completionRate: 78,
            sections: {
                reading: {
                    parts: 3,
                    questions: 100,
                },
            },
            lastUpdated: "2023-09-05",
        },
        {
            id: "ielts-1",
            title: "IELTS Academic Test Simulation",
            description:
                "Bài thi mô phỏng IELTS Academic với đầy đủ 4 kỹ năng.",
            duration: "165 phút",
            questions: 120,
            participants: 562,
            testType: "IELTS",
            tags: ["IELTS", "Academic", "Full Test"],
            difficulty: "Advanced",
            popularity: 90,
            isFeatured: true,
            completionRate: 75,
            lastUpdated: "2023-11-28",
        },
        {
            id: "placement-1",
            title: "English Placement Test",
            description:
                "Bài kiểm tra phân loại trình độ tiếng Anh từ A1 đến C2.",
            duration: "45 phút",
            questions: 60,
            participants: 2145,
            testType: "Placement",
            tags: ["Placement", "CEFR", "All Levels"],
            difficulty: "Beginner",
            popularity: 95,
            isFeatured: false,
            completionRate: 96,
            lastUpdated: "2023-12-01",
        },
        {
            id: "toeic-4",
            title: "TOEIC Part 5 & 6 Practice",
            description:
                "Tập trung luyện tập ngữ pháp và cấu trúc câu trong TOEIC.",
            duration: "40 phút",
            questions: 50,
            participants: 895,
            testType: "TOEIC",
            tags: ["TOEIC", "Grammar", "Part 5", "Part 6"],
            difficulty: "Intermediate",
            popularity: 88,
            isFeatured: false,
            completionRate: 90,
            sections: {
                reading: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-08-15",
        },
        {
            id: "toeic-5",
            title: "TOEIC Part 7 Reading Comprehension",
            description:
                "Luyện đọc hiểu với các dạng bài đọc đa dạng trong TOEIC.",
            duration: "55 phút",
            questions: 54,
            participants: 723,
            testType: "TOEIC",
            tags: ["TOEIC", "Reading", "Part 7"],
            difficulty: "Advanced",
            popularity: 80,
            isFeatured: false,
            completionRate: 72,
            sections: {
                reading: {
                    parts: 1,
                    questions: 54,
                },
            },
            lastUpdated: "2023-07-22",
        },
        {
            id: "ielts-2",
            title: "IELTS Reading Practice",
            description: "Luyện đọc hiểu với các bài đọc theo format IELTS.",
            duration: "60 phút",
            questions: 40,
            participants: 638,
            testType: "IELTS",
            tags: ["IELTS", "Reading", "Academic"],
            difficulty: "Advanced",
            popularity: 85,
            isFeatured: false,
            completionRate: 78,
            lastUpdated: "2023-10-10",
        },
        {
            id: "toeic-6",
            title: "TOEIC Listening Parts 1-2",
            description:
                "Tập trung vào Photographs và Question-Response trong TOEIC.",
            duration: "30 phút",
            questions: 50,
            participants: 912,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Part 1", "Part 2"],
            difficulty: "Beginner",
            popularity: 87,
            isFeatured: false,
            completionRate: 94,
            sections: {
                listening: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-09-18",
        },
        {
            id: "toeic-7",
            title: "TOEIC Listening Parts 3-4",
            description: "Luyện nghe với Conversations và Talks trong TOEIC.",
            duration: "45 phút",
            questions: 50,
            participants: 786,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Part 3", "Part 4"],
            difficulty: "Intermediate",
            popularity: 84,
            isFeatured: false,
            completionRate: 82,
            sections: {
                listening: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-10-05",
        },
        {
            id: "general-1",
            title: "Business English Test",
            description:
                "Kiểm tra kỹ năng tiếng Anh trong môi trường doanh nghiệp.",
            duration: "60 phút",
            questions: 80,
            participants: 456,
            testType: "General",
            tags: ["Business", "Professional", "Workplace"],
            difficulty: "Advanced",
            popularity: 75,
            isFeatured: false,
            completionRate: 68,
            lastUpdated: "2023-08-30",
        },
        {
            id: "general-2",
            title: "CEFR B2 Level Test",
            description: "Đánh giá trình độ theo khung tham chiếu châu Âu B2.",
            duration: "90 phút",
            questions: 100,
            participants: 528,
            testType: "General",
            tags: ["CEFR", "B2", "European Framework"],
            difficulty: "Intermediate",
            popularity: 82,
            isFeatured: false,
            completionRate: 88,
            lastUpdated: "2023-11-05",
        },
        {
            id: "placement-2",
            title: "Bài kiểm tra đầu vào",
            description: "Bài kiểm tra phân loại trình độ tiếng Anh.",
            duration: "55 phút",
            questions: 54,
            participants: 697,
            testType: "Placement",
            tags: ["Placement", "CEFR", "All Levels"],
            difficulty: "Beginner",
            popularity: 78,
            isFeatured: false,
            completionRate: 88,
            lastUpdated: "2023-11-15",
        },
    ];

    // Filter tests based on search term, category, difficulty, and sort
    const filteredTests = tests
        .filter(
            (test) =>
                (searchTerm === "" ||
                    test.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    test.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    test.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )) &&
                (selectedCategory === "All" ||
                    test.testType === selectedCategory ||
                    test.tags.includes(selectedCategory)) &&
                (selectedDifficulty === "" ||
                    test.difficulty === selectedDifficulty)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.popularity - a.popularity;
                case "newest":
                    return (
                        new Date(b.lastUpdated || "").getTime() -
                        new Date(a.lastUpdated || "").getTime()
                    );
                case "completion":
                    return b.completionRate - a.completionRate;
                case "questions":
                    return b.questions - a.questions;
                default:
                    return 0;
            }
        });

    // Get featured tests
    const featuredTests = tests.filter((test) => test.isFeatured);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleDifficultyChange = (difficulty: TestDifficulty) => {
        setSelectedDifficulty(
            difficulty === selectedDifficulty ? "" : difficulty
        );
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
    };

    const getTestTypeColor = (testType: TestType) => {
        switch (testType) {
            case "TOEIC":
                return "bg-blue-100 text-blue-600";
            case "IELTS":
                return "bg-emerald-100 text-emerald-600";
            case "Placement":
                return "bg-amber-100 text-amber-600";
            case "General":
            default:
                return "bg-purple-100 text-purple-600";
        }
    };

    const getDifficultyColor = (difficulty: TestDifficulty) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-green-500 text-white";
            case "Intermediate":
                return "bg-blue-500 text-white";
            case "Advanced":
                return "bg-orange-500 text-white";
            case "Expert":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner - Updated with cleaner design */}
            <div className="bg-slate-900 text-white py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40"></div>
                <div className="container mx-auto px-4 relative z-10 ">
                    <div className="max-w-3xl mx-auto text-center ">
                        <div className="inline-flex items-center bg-blue-900/30 rounded-full px-4 py-2 mb-4 border border-blue-700/30">
                            <BookOpen className="h-4 w-4 text-blue-300 mr-2" />
                            <span className="text-sm font-medium">
                                Online Tests
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Online Tests
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Evaluate and improve your language skills with
                            international standard tests that provide detailed
                            feedback and analysis.
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tests by name, tags, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3 w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm 
                                text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 px-32">
                {/* Filter and Sort Controls - Modernized */}
                <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-slate-500" />
                            Filter and Sort
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="px-4 py-2 rounded-lg bg-slate-100 border-0 text-sm font-medium 
                                text-slate-700 focus:ring-2 focus:ring-slate-400"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest</option>
                                <option value="completion">
                                    Highest Completion Rate
                                </option>
                                <option value="questions">
                                    Most Questions
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-5">
                        <div>
                            <h3 className="text-sm font-medium text-slate-700 mb-2">
                                Test Type
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                                            selectedCategory === category
                                                ? "bg-slate-800 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-slate-700 mb-2">
                                Difficulty
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {difficultyLevels.map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() =>
                                            handleDifficultyChange(difficulty)
                                        }
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                                            selectedDifficulty === difficulty
                                                ? "bg-slate-800 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Tests Section - Redesigned */}
                {featuredTests.length > 0 &&
                    searchTerm === "" &&
                    selectedDifficulty === "" &&
                    selectedCategory === "All" && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Star className="h-6 w-6 mr-2 text-amber-500" />
                                Featured Tests
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {featuredTests.slice(0, 3).map((test) => (
                                    <div
                                        key={test.id}
                                        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm 
                                        hover:shadow-md transition-all duration-300 flex flex-col"
                                    >
                                        <div className="p-6 pb-4 border-b border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div
                                                    className={`text-xs font-medium px-2.5 py-1 rounded 
                                                    ${getTestTypeColor(
                                                        test.testType
                                                    )}`}
                                                >
                                                    {test.testType}
                                                </div>

                                                <div
                                                    className={`text-xs font-medium px-2.5 py-1 rounded 
                                                    ${getDifficultyColor(
                                                        test.difficulty
                                                    )}`}
                                                >
                                                    {test.difficulty}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                {test.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {test.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-2">
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    <span>{test.duration}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    <span>
                                                        {test.participants.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <FileText className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    <span>
                                                        {test.questions}{" "}
                                                        questions
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <Award className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    <span>
                                                        {test.completionRate}%
                                                        completed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {test.sections && (
                                            <div className="px-6 py-3 bg-slate-50">
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    {test.sections
                                                        .listening && (
                                                        <div className="flex items-center">
                                                            <Headphones className="h-4 w-4 mr-1.5 text-blue-500" />
                                                            <span>
                                                                Listening:{" "}
                                                                {
                                                                    test
                                                                        .sections
                                                                        .listening
                                                                        .questions
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </div>
                                                    )}
                                                    {test.sections.reading && (
                                                        <div className="flex items-center">
                                                            <BookMarked className="h-4 w-4 mr-1.5 text-emerald-500" />
                                                            <span>
                                                                Reading:{" "}
                                                                {
                                                                    test
                                                                        .sections
                                                                        .reading
                                                                        .questions
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-5 mt-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {test.tags
                                                        .slice(0, 2)
                                                        .map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    {test.tags.length > 2 && (
                                                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                                            +
                                                            {test.tags.length -
                                                                2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/online-tests/${test.id}`
                                                    )
                                                }
                                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 
                                                rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                Start Test{" "}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {/* All Tests Section - Completely redesigned */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <BookOpen className="h-6 w-6 mr-2 text-slate-700" />
                        {searchTerm ||
                        selectedDifficulty !== "" ||
                        selectedCategory !== "All"
                            ? "Search Results"
                            : "All Tests"}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({filteredTests.length} tests)
                        </span>
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between mb-4">
                                            <div className="h-6 bg-slate-200 rounded w-24"></div>
                                            <div className="h-6 bg-slate-200 rounded w-20"></div>
                                        </div>
                                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                        </div>
                                        <div className="h-8 bg-slate-200 rounded w-full mt-4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTests.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map((test) => (
                                <div
                                    key={test.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm 
                                    hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    <div className="p-6 pb-4 border-b border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div
                                                className={`text-xs font-medium px-2.5 py-1 rounded 
                                                ${getTestTypeColor(
                                                    test.testType
                                                )}`}
                                            >
                                                {test.testType}
                                            </div>

                                            <div
                                                className={`text-xs font-medium px-2.5 py-1 rounded 
                                                ${getDifficultyColor(
                                                    test.difficulty
                                                )}`}
                                            >
                                                {test.difficulty}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {test.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {test.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-2">
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                                                <span>{test.duration}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                                                <span>
                                                    {test.participants.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <FileText className="h-4 w-4 mr-1.5 text-gray-400" />
                                                <span>
                                                    {test.questions} questions
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <BarChart className="h-4 w-4 mr-1.5 text-gray-400" />
                                                <span>
                                                    {test.completionRate}%
                                                    completed
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {test.sections && (
                                        <div className="px-6 py-3 bg-slate-50">
                                            <div className="flex justify-between text-sm text-slate-600">
                                                {test.sections.listening && (
                                                    <div className="flex items-center">
                                                        <Headphones className="h-4 w-4 mr-1.5 text-blue-500" />
                                                        <span>
                                                            Listening:{" "}
                                                            {
                                                                test.sections
                                                                    .listening
                                                                    .questions
                                                            }{" "}
                                                            questions
                                                        </span>
                                                    </div>
                                                )}
                                                {test.sections.reading && (
                                                    <div className="flex items-center">
                                                        <BookMarked className="h-4 w-4 mr-1.5 text-emerald-500" />
                                                        <span>
                                                            Reading:{" "}
                                                            {
                                                                test.sections
                                                                    .reading
                                                                    .questions
                                                            }{" "}
                                                            questions
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-5 mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {test.tags
                                                    .slice(0, 2)
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                {test.tags.length > 2 && (
                                                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        +{test.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/online-tests/${test.id}`
                                                )
                                            }
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 
                                            rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            Start Test{" "}
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No tests found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                No tests match your search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedDifficulty("");
                                    setSelectedCategory("All");
                                }}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Thêm Chatbot cho tests */}
            <TestsChatbot />
        </div>
    );
};

export default Tests;
