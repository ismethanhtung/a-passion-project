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
    Plus,
    Sparkles,
    Zap,
    BrainCircuit,
    X,
} from "lucide-react";
import Link from "next/link";
import TestsChatbot from "@/components/TestsChatbot";
import TestList from "@/components/test/TestList";

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
    const [showChatbot, setShowChatbot] = useState(true);
    const [showCreateTestModal, setShowCreateTestModal] = useState(false);
    const [creatingTest, setCreatingTest] = useState(false);
    const [newTestType, setNewTestType] = useState<TestType>("TOEIC");
    const [newTestDifficulty, setNewTestDifficulty] =
        useState<TestDifficulty>("Intermediate");
    const [newTestPrompt, setNewTestPrompt] = useState("");
    const [newTestTitle, setNewTestTitle] = useState("");

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

    // Mẫu cấu trúc bài thi TOEIC
    const toeicTestTemplate = {
        listening: {
            part1: {
                name: "Photographs",
                description: "Nghe mô tả, chọn hình ảnh phù hợp",
                questionCount: 6,
            },
            part2: {
                name: "Question-Response",
                description: "Nghe câu hỏi, chọn câu trả lời phù hợp",
                questionCount: 25,
            },
            part3: {
                name: "Conversations",
                description: "Nghe đoạn hội thoại, trả lời câu hỏi",
                questionCount: 39,
            },
            part4: {
                name: "Talks",
                description: "Nghe bài nói, trả lời câu hỏi",
                questionCount: 30,
            },
        },
        reading: {
            part5: {
                name: "Incomplete Sentences",
                description: "Hoàn thành câu với từ thích hợp",
                questionCount: 30,
            },
            part6: {
                name: "Text Completion",
                description: "Hoàn thành đoạn văn với từ/cụm từ thích hợp",
                questionCount: 16,
            },
            part7: {
                name: "Reading Comprehension",
                description: "Đọc hiểu và trả lời câu hỏi",
                questionCount: 54,
            },
        },
    };

    // Mẫu cấu trúc bài thi IELTS
    const ieltsTestTemplate = {
        listening: {
            section1: {
                name: "Section 1",
                description: "Hội thoại hàng ngày giữa 2 người",
                questionCount: 10,
            },
            section2: {
                name: "Section 2",
                description: "Bài nói độc thoại về tình huống hàng ngày",
                questionCount: 10,
            },
            section3: {
                name: "Section 3",
                description:
                    "Hội thoại giữa tối đa 4 người trong môi trường học thuật",
                questionCount: 10,
            },
            section4: {
                name: "Section 4",
                description: "Bài nói độc thoại về chủ đề học thuật",
                questionCount: 10,
            },
        },
        reading: {
            passages: {
                name: "Academic Reading",
                description: "3 bài đọc dài từ sách, tạp chí học thuật",
                questionCount: 40,
            },
        },
        writing: {
            task1: {
                name: "Task 1",
                description: "Mô tả biểu đồ, bảng, sơ đồ hoặc quá trình",
                questionCount: 1,
            },
            task2: {
                name: "Task 2",
                description: "Viết luận về một chủ đề",
                questionCount: 1,
            },
        },
        speaking: {
            parts: {
                name: "Speaking Test",
                description:
                    "Phỏng vấn với 3 phần: giới thiệu, độc thoại và thảo luận",
                questionCount: 3,
            },
        },
    };

    // Hàm tạo bài test mới bằng AI (giả lập)
    const createAITest = () => {
        if (!newTestTitle.trim() || !newTestPrompt.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setCreatingTest(true);

        // Giả lập thời gian xử lý AI
        setTimeout(() => {
            const newTestId = `${newTestType.toLowerCase()}-${Math.floor(
                Math.random() * 1000
            )}`;

            const newTest: TestItem = {
                id: newTestId,
                title: newTestTitle,
                description: newTestPrompt,
                duration: newTestType === "TOEIC" ? "120 phút" : "165 phút",
                questions: newTestType === "TOEIC" ? 200 : 120,
                participants: 0,
                testType: newTestType,
                tags: [newTestType, "AI Generated", newTestDifficulty],
                difficulty: newTestDifficulty,
                popularity: 50,
                isFeatured: false,
                completionRate: 0,
                lastUpdated: new Date().toISOString().split("T")[0],
                sections:
                    newTestType === "TOEIC"
                        ? {
                              listening: {
                                  parts: 4,
                                  questions: 100,
                              },
                              reading: {
                                  parts: 3,
                                  questions: 100,
                              },
                          }
                        : {
                              listening: {
                                  parts: 4,
                                  questions: 40,
                              },
                              reading: {
                                  parts: 3,
                                  questions: 40,
                              },
                          },
            };

            // Thêm test mới vào danh sách
            tests.unshift(newTest);

            setCreatingTest(false);
            setShowCreateTestModal(false);
            setNewTestTitle("");
            setNewTestPrompt("");

            // Chuyển đến bài test vừa tạo
            router.push(`/online-tests/${newTestId}`);
        }, 2000);
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

            <div className="container mx-auto px-4 py-12 px-6 lg:px-32">
                {/* Banner tạo bài Test bằng AI - New */}
                <div className="mb-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-white mb-4 sm:mb-0">
                            <div className="flex items-center mb-2">
                                <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
                                <h3 className="text-xl font-bold">
                                    Tạo bài kiểm tra bằng AI
                                </h3>
                            </div>
                            <p className="opacity-90 mb-2 max-w-xl">
                                Tạo nhanh bài kiểm tra theo chuẩn TOEIC hoặc
                                IELTS với nội dung tùy chỉnh theo nhu cầu của
                                bạn.
                            </p>
                            <div className="flex items-center text-amber-200 text-sm">
                                <BrainCircuit className="h-4 w-4 mr-1.5" />
                                <span>
                                    AI tạo nội dung đạt tiêu chuẩn quốc tế
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateTestModal(true)}
                            className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium 
                            flex items-center shadow-sm transition-all duration-200 whitespace-nowrap"
                        >
                            <Zap className="h-5 w-5 mr-2" />
                            Tạo bài kiểm tra
                        </button>
                    </div>
                </div>

                {/* Filter and Sort Controls - Modernized */}
                <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-slate-500" />
                            Lọc và sắp xếp
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
                                <option value="popular">Phổ biến nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="completion">
                                    Tỷ lệ hoàn thành cao nhất
                                </option>
                                <option value="questions">
                                    Nhiều câu hỏi nhất
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-5">
                        <div>
                            <h3 className="text-sm font-medium text-slate-700 mb-2">
                                Loại bài kiểm tra
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
                                Độ khó
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
                                Luyện tập và chuẩn bị cho kỳ thi TOEIC với đầy
                                đủ các phần.
                            </p>
                        </Link>

                        <Link
                            href="/online-tests?testType=IELTS"
                            className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-bold mb-2">IELTS</h3>
                            <p className="text-green-100 text-sm">
                                Rèn luyện 4 kỹ năng Nghe, Nói, Đọc, Viết với bài
                                thi IELTS.
                            </p>
                        </Link>

                        <Link
                            href="/online-tests?testType=Placement"
                            className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                Placement
                            </h3>
                            <p className="text-orange-100 text-sm">
                                Kiểm tra và xác định trình độ tiếng Anh hiện tại
                                của bạn.
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

                {/* Thêm Chatbot cho tests */}
                <TestsChatbot />
            </div>

            {/* Modal tạo bài kiểm tra */}
            {showCreateTestModal && (
                <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                                    Tạo bài kiểm tra bằng AI
                                </h3>
                                <button
                                    onClick={() =>
                                        setShowCreateTestModal(false)
                                    }
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề bài kiểm tra
                                </label>
                                <input
                                    type="text"
                                    value={newTestTitle}
                                    onChange={(e) =>
                                        setNewTestTitle(e.target.value)
                                    }
                                    placeholder="Ví dụ: TOEIC Reading Practice Test"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                />
                            </div>

                            {/* Mẫu bài test có sẵn */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mẫu nhanh
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setNewTestType("TOEIC");
                                            setNewTestTitle(
                                                "TOEIC Test - Business and Office"
                                            );
                                            setNewTestPrompt(
                                                "Tạo bài kiểm tra TOEIC với chủ đề văn phòng và kinh doanh. Bài test nên tập trung vào từ vựng môi trường công sở, email doanh nghiệp, và các tình huống giao tiếp trong kinh doanh."
                                            );
                                            setNewTestDifficulty(
                                                "Intermediate"
                                            );
                                        }}
                                        className="p-3 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                                    >
                                        <h4 className="font-medium text-blue-800 mb-1">
                                            TOEIC - Kinh doanh & Văn phòng
                                        </h4>
                                        <p className="text-xs text-blue-600">
                                            Từ vựng môi trường công sở, email
                                            doanh nghiệp, hội thoại kinh doanh
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setNewTestType("TOEIC");
                                            setNewTestTitle(
                                                "TOEIC Test - Travel and Tourism"
                                            );
                                            setNewTestPrompt(
                                                "Tạo bài kiểm tra TOEIC với chủ đề du lịch và khách sạn. Nội dung liên quan đến đặt phòng, giao tiếp tại điểm du lịch, sân bay, và các tình huống khi đi du lịch."
                                            );
                                            setNewTestDifficulty(
                                                "Intermediate"
                                            );
                                        }}
                                        className="p-3 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left"
                                    >
                                        <h4 className="font-medium text-green-800 mb-1">
                                            TOEIC - Du lịch & Khách sạn
                                        </h4>
                                        <p className="text-xs text-green-600">
                                            Từ vựng du lịch, khách sạn, đặt
                                            phòng, giao tiếp tại điểm du lịch
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setNewTestType("IELTS");
                                            setNewTestTitle(
                                                "IELTS Academic Test - Science and Technology"
                                            );
                                            setNewTestPrompt(
                                                "Tạo bài kiểm tra IELTS Academic với chủ đề khoa học và công nghệ. Bài Reading sử dụng các bài đọc về công nghệ mới, nghiên cứu khoa học. Bài Listening có các bài giảng và thảo luận học thuật."
                                            );
                                            setNewTestDifficulty("Advanced");
                                        }}
                                        className="p-3 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                                    >
                                        <h4 className="font-medium text-purple-800 mb-1">
                                            IELTS - Khoa học & Công nghệ
                                        </h4>
                                        <p className="text-xs text-purple-600">
                                            Chủ đề công nghệ, phát minh, xu
                                            hướng khoa học, nghiên cứu học thuật
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setNewTestType("IELTS");
                                            setNewTestTitle(
                                                "IELTS Academic Test - Environment and Society"
                                            );
                                            setNewTestPrompt(
                                                "Tạo bài kiểm tra IELTS Academic với chủ đề môi trường và xã hội. Bao gồm nội dung về biến đổi khí hậu, phát triển bền vững, bảo vệ môi trường và các vấn đề xã hội."
                                            );
                                            setNewTestDifficulty("Advanced");
                                        }}
                                        className="p-3 border border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                                    >
                                        <h4 className="font-medium text-amber-800 mb-1">
                                            IELTS - Môi trường & Xã hội
                                        </h4>
                                        <p className="text-xs text-amber-600">
                                            Biến đổi khí hậu, phát triển bền
                                            vững, vấn đề xã hội đương đại
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại bài kiểm tra
                                    </label>
                                    <select
                                        value={newTestType}
                                        onChange={(e) =>
                                            setNewTestType(
                                                e.target.value as TestType
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    >
                                        <option value="TOEIC">TOEIC</option>
                                        <option value="IELTS">IELTS</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Độ khó
                                    </label>
                                    <select
                                        value={newTestDifficulty}
                                        onChange={(e) =>
                                            setNewTestDifficulty(
                                                e.target.value as TestDifficulty
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    >
                                        {difficultyLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả yêu cầu cho AI
                                </label>
                                <textarea
                                    value={newTestPrompt}
                                    onChange={(e) =>
                                        setNewTestPrompt(e.target.value)
                                    }
                                    placeholder="Mô tả chi tiết về bài kiểm tra bạn muốn tạo. Ví dụ: Tạo bài kiểm tra TOEIC tập trung vào ngữ pháp và từ vựng trong môi trường công sở, với chủ đề là marketing và quảng cáo."
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                ></textarea>
                                <p className="mt-2 text-sm text-gray-500">
                                    Gợi ý: Bạn có thể chỉ định chủ đề cụ thể
                                    (kinh doanh, du lịch, giáo dục...), mục tiêu
                                    bài test (luyện ngữ pháp, từ vựng, kỹ năng
                                    nghe...) và độ khó chi tiết hơn (từ vựng
                                    trình độ nào, cấu trúc câu phức tạp hay đơn
                                    giản...).
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-800 mb-3">
                                    Cấu trúc bài kiểm tra {newTestType}
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {newTestType === "TOEIC" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                                    <Headphones className="h-4 w-4 mr-1.5 text-blue-500" />
                                                    Phần Nghe (100 câu)
                                                </h5>
                                                <ul className="space-y-2 text-sm">
                                                    {Object.values(
                                                        toeicTestTemplate.listening
                                                    ).map((part, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {part.name}:{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        part.description
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {
                                                                    part.questionCount
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                                    <BookMarked className="h-4 w-4 mr-1.5 text-emerald-500" />
                                                    Phần Đọc (100 câu)
                                                </h5>
                                                <ul className="space-y-2 text-sm">
                                                    {Object.values(
                                                        toeicTestTemplate.reading
                                                    ).map((part, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {part.name}:{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        part.description
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {
                                                                    part.questionCount
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                                    <Headphones className="h-4 w-4 mr-1.5 text-blue-500" />
                                                    Listening (40 câu)
                                                </h5>
                                                <ul className="space-y-2 text-sm">
                                                    {Object.values(
                                                        ieltsTestTemplate.listening
                                                    ).map((section, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {section.name}:{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        section.description
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {
                                                                    section.questionCount
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                                    <BookMarked className="h-4 w-4 mr-1.5 text-emerald-500" />
                                                    Reading
                                                </h5>
                                                <ul className="space-y-2 text-sm">
                                                    {Object.values(
                                                        ieltsTestTemplate.reading
                                                    ).map((section, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {section.name}:{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        section.description
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {
                                                                    section.questionCount
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                                    <PenTool className="h-4 w-4 mr-1.5 text-purple-500" />
                                                    Writing
                                                </h5>
                                                <ul className="space-y-2 text-sm">
                                                    {Object.values(
                                                        ieltsTestTemplate.writing
                                                    ).map((task, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {task.name}:{" "}
                                                                <span className="text-gray-500">
                                                                    {
                                                                        task.description
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {
                                                                    task.questionCount
                                                                }{" "}
                                                                câu
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 mt-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-1.5 text-blue-600" />
                                    Về bài kiểm tra AI tạo
                                </h4>
                                <p className="text-sm text-blue-700">
                                    Bài kiểm tra được tạo bởi AI sẽ dựa trên
                                    định dạng chuẩn{" "}
                                    {newTestType === "TOEIC"
                                        ? "TOEIC từ ETS"
                                        : "IELTS từ British Council và IDP"}
                                    . Nội dung sẽ được sinh tự động theo yêu cầu
                                    của bạn với độ khó phù hợp. Bài kiểm tra
                                    được tạo ra sẽ được lưu trong tài khoản của
                                    bạn và có thể sử dụng lại nhiều lần.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowCreateTestModal(false)}
                                className="px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium mr-3"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={createAITest}
                                disabled={creatingTest}
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
                                flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {creatingTest ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang tạo bài kiểm tra...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Tạo bài kiểm tra
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tests;
