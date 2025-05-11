"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Clock,
    Users,
    MessageSquare,
    Award,
    BookOpen,
    TrendingUp,
    Star,
    ChevronRight,
    Filter,
} from "lucide-react";
import Link from "next/link";

const categories = [
    "Tất cả",
    "Economy",
    "TOEIC",
    "IELTS",
    "Old Format",
    "Placement Test",
];
const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const Tests = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const tests = [
        {
            id: "placement-test-1",
            title: "Bài Kiểm Tra Đầu Vào",
            description: "Đánh giá trình độ tiếng Anh trước khi học.",
            duration: "120 phút",
            participants: 245,
            comments: 18,
            tags: ["Placement Test", "TOEIC", "Grammar", "Reading"],
            difficulty: "Beginner",
            popularity: 95,
            isFeatured: true,
            completionRate: 87,
            image: "/images/test-cover-1.jpg",
        },
        {
            id: "placement-test-2",
            title: "Bài Kiểm Tra Đầu Vào Từ Vựng",
            description: "Đánh giá kiến thức từ vựng trước khi học.",
            duration: "120 phút",
            participants: 189,
            comments: 12,
            tags: ["Placement Test", "Vocabulary"],
            difficulty: "Beginner",
            popularity: 88,
            isFeatured: true,
            completionRate: 92,
            image: "/images/test-cover-2.jpg",
        },
        {
            id: 2,
            title: "Economy (old format) TOEIC 4 Test 1",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 156,
            comments: 8,
            tags: ["Part 5", "TOEIC"],
            difficulty: "Intermediate",
            popularity: 75,
            isFeatured: false,
            completionRate: 68,
            image: "/images/test-cover-3.jpg",
        },
        {
            id: 3,
            title: "Longman TOEIC (old format) Test 2",
            description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
            duration: "120 phút",
            participants: 132,
            comments: 7,
            tags: ["Part 5", "Reading", "TOEIC"],
            difficulty: "Intermediate",
            popularity: 72,
            isFeatured: false,
            completionRate: 65,
            image: "/images/test-cover-4.jpg",
        },
        {
            id: 4,
            title: "Economy Y1 TOEIC Test 2",
            description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
            duration: "120 phút",
            participants: 178,
            comments: 14,
            tags: ["Part 5", "Reading", "TOEIC", "Grammar"],
            difficulty: "Intermediate",
            popularity: 82,
            isFeatured: true,
            completionRate: 75,
            image: "/images/test-cover-5.jpg",
        },
        {
            id: 5,
            title: "Economy (old format) TOEIC 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 98,
            comments: 5,
            tags: ["Part 5", "TOEIC"],
            difficulty: "Advanced",
            popularity: 65,
            isFeatured: false,
            completionRate: 58,
            image: "/images/test-cover-6.jpg",
        },
        {
            id: 6,
            title: "Economy Longman TOEIC (old format) Test 3",
            description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
            duration: "120 phút",
            participants: 112,
            comments: 9,
            tags: ["Part 5", "Reading", "TOEIC"],
            difficulty: "Advanced",
            popularity: 70,
            isFeatured: false,
            completionRate: 62,
            image: "/images/test-cover-7.jpg",
        },
        {
            id: 7,
            title: "New Economy TOEIC(old format) Test 4",
            description: "Kiểm tra kiến thức về ngữ pháp tiếng Anh.",
            duration: "120 phút",
            participants: 145,
            comments: 11,
            tags: ["Part 5", "TOEIC", "Grammar"],
            difficulty: "Intermediate",
            popularity: 78,
            isFeatured: false,
            completionRate: 70,
            image: "/images/test-cover-8.jpg",
        },
        {
            id: 8,
            title: "Economy (old format) IELTS Simulation 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 87,
            comments: 6,
            tags: ["Part 5", "IELTS"],
            difficulty: "Expert",
            popularity: 60,
            isFeatured: false,
            completionRate: 45,
            image: "/images/test-cover-9.jpg",
        },
        {
            id: 9,
            title: "Economy Y1 TOEIC(old format) Test 2",
            description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
            duration: "120 phút",
            participants: 124,
            comments: 8,
            tags: ["Part 5", "Reading", "TOEIC"],
            difficulty: "Intermediate",
            popularity: 73,
            isFeatured: false,
            completionRate: 67,
            image: "/images/test-cover-10.jpg",
        },
        {
            id: 10,
            title: "New Economy (old format) IELTS Simulation 4 Test 2",
            description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
            duration: "120 phút",
            participants: 76,
            comments: 4,
            tags: ["Part 5", "IELTS"],
            difficulty: "Expert",
            popularity: 55,
            isFeatured: false,
            completionRate: 40,
            image: "/images/test-cover-11.jpg",
        },
        {
            id: 11,
            title: "New format Economy TOEIC Test 1",
            description:
                "Kiểm tra kiến thức về ngữ pháp và đọc và hiểu văn bản tiếng Anh.",
            duration: "120 phút",
            participants: 167,
            comments: 13,
            tags: ["Part 5", "TOEIC", "Grammar"],
            category: "Economy",
            difficulty: "Advanced",
            popularity: 80,
            isFeatured: true,
            completionRate: 72,
            image: "/images/test-cover-12.jpg",
        },
        {
            id: 12,
            title: "Bài Kiểm Tra TOEIC New Format Economy",
            description:
                "Bài test giúp luyện tập và kiểm tra khả năng sử dụng ngữ pháp và đọc hiểu.",
            duration: "120 phút",
            participants: 198,
            comments: 16,
            tags: ["TOEIC", "Grammar", "Reading"],
            category: "New Economy",
            difficulty: "Intermediate",
            popularity: 85,
            isFeatured: true,
            completionRate: 78,
            image: "/images/test-cover-1.jpg",
        },
        {
            id: 13,
            title: "Bài Kiểm Tra IELTS New Economy",
            description:
                "Bài test mô phỏng đề thi IELTS giúp kiểm tra khả năng đọc hiểu và sử dụng từ vựng",
            duration: "120 phút",
            participants: 154,
            comments: 12,
            tags: ["IELTS", "Reading", "Vocab"],
            category: "New Economy",
            difficulty: "Advanced",
            popularity: 77,
            isFeatured: false,
            completionRate: 68,
            image: "/images/test-cover-2.jpg",
        },
    ];

    // Filter tests based on search term, difficulty, and sort
    const filteredTests = tests
        .filter(
            (test) =>
                (searchTerm === "" ||
                    test.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    test.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )) &&
                (selectedDifficulty === "" ||
                    test.difficulty === selectedDifficulty)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.popularity - a.popularity;
                case "newest":
                    return b.id > a.id ? 1 : -1;
                case "completion":
                    return b.completionRate - a.completionRate;
                default:
                    return 0;
            }
        });

    // Get featured tests
    const featuredTests = tests.filter((test) => test.isFeatured);

    const handleCategoryClick = (category: string) => {
        if (category === "Tất cả") {
            setSearchTerm("");
        } else {
            setSearchTerm(category.toLowerCase());
        }
    };

    const handleDifficultyChange = (difficulty: string) => {
        setSelectedDifficulty(
            difficulty === selectedDifficulty ? "" : difficulty
        );
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <svg
                        className="absolute top-0 left-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <radialGradient
                                id="radialGradient"
                                cx="50%"
                                cy="50%"
                                r="50%"
                                fx="50%"
                                fy="50%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="white"
                                    stopOpacity="0.3"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="white"
                                    stopOpacity="0"
                                />
                            </radialGradient>
                        </defs>
                        <circle
                            cx="0"
                            cy="0"
                            r="20"
                            fill="url(#radialGradient)"
                            className="animate-float"
                        />
                        <circle
                            cx="100"
                            cy="30"
                            r="15"
                            fill="url(#radialGradient)"
                            className="animate-float-delay"
                        />
                        <circle
                            cx="50"
                            cy="70"
                            r="10"
                            fill="url(#radialGradient)"
                            className="animate-bounce-subtle"
                        />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Online Tests
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Improve your language skills with our comprehensive
                            tests and assessments
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for tests by name, tag, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/90 backdrop-blur-sm border-0 shadow-lg focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filter and Sort Controls */}
                <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Filter className="h-5 w-5 mr-2 text-purple-500" />
                            Filters & Sorting
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="px-4 py-2 rounded-lg bg-gray-100 border-0 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest</option>
                                <option value="completion">
                                    Highest Completion
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Categories
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                        className={`px-4 py-2 text-sm rounded-full transition-all ${
                                            searchTerm.toLowerCase() ===
                                            category.toLowerCase()
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Difficulty Level
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {difficultyLevels.map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() =>
                                            handleDifficultyChange(difficulty)
                                        }
                                        className={`px-4 py-2 text-sm rounded-full transition-all ${
                                            selectedDifficulty === difficulty
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Tests Section */}
                {featuredTests.length > 0 &&
                    searchTerm === "" &&
                    selectedDifficulty === "" && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Star className="h-6 w-6 mr-2 text-yellow-500" />
                                Featured Tests
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {featuredTests.slice(0, 3).map((test) => (
                                    <div
                                        key={test.id}
                                        className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                            Featured
                                        </div>
                                        <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-black opacity-20"></div>
                                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                                <div className="text-xs font-semibold bg-indigo-600 inline-block px-2 py-1 rounded mb-2">
                                                    {test.difficulty}
                                                </div>
                                                <h3 className="text-lg font-bold">
                                                    {test.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-600 text-sm mb-4">
                                                {test.description}
                                            </p>
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{test.duration}</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    <span>
                                                        {test.participants}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    <span>{test.comments}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {test.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${test.completionRate}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {test.completionRate}%
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/online-tests/${test.id}`
                                                        )
                                                    }
                                                    className="flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
                                                >
                                                    Start Test{" "}
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {/* All Tests Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <BookOpen className="h-6 w-6 mr-2 text-indigo-500" />
                        {searchTerm || selectedDifficulty
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
                                    className="bg-white rounded-xl overflow-hidden shadow animate-pulse"
                                >
                                    <div className="h-40 bg-gray-300"></div>
                                    <div className="p-5 space-y-4">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                        <div className="flex justify-between">
                                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="h-6 bg-gray-300 rounded w-16"></div>
                                            <div className="h-6 bg-gray-300 rounded w-16"></div>
                                        </div>
                                        <div className="h-8 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTests.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map((test) => (
                                <div
                                    key={test.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black opacity-20"></div>
                                        <div className="absolute top-3 right-3">
                                            <div
                                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                                    test.difficulty ===
                                                    "Beginner"
                                                        ? "bg-green-500 text-white"
                                                        : test.difficulty ===
                                                          "Intermediate"
                                                        ? "bg-blue-500 text-white"
                                                        : test.difficulty ===
                                                          "Advanced"
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-red-500 text-white"
                                                }`}
                                            >
                                                {test.difficulty}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 p-4 text-white">
                                            <h3 className="text-lg font-bold">
                                                {test.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {test.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>{test.duration}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>{test.participants}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                <span>{test.comments}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {test.tags
                                                .slice(0, 3)
                                                .map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            {test.tags.length > 3 && (
                                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                                    +{test.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center w-full">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${test.completionRate}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                    {test.completionRate}%
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/online-tests/${test.id}`
                                                )
                                            }
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                                        >
                                            Làm bài{" "}
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center shadow-md">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No tests found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We couldn't find any tests matching your search
                                criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedDifficulty("");
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tests;
