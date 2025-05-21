"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Clock,
    Users,
    Tag,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    X,
} from "lucide-react";
import Link from "next/link";
import { TestType, TestDifficulty } from "@/interfaces/online-test";

// Loại bài thi
const TEST_TYPES: TestType[] = ["TOEIC", "IELTS", "Placement", "General"];
const TEST_DIFFICULTIES: TestDifficulty[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
];
const SORT_OPTIONS = [
    { value: "newest", label: "Mới nhất" },
    { value: "popularity", label: "Phổ biến nhất" },
    { value: "completion", label: "Tỷ lệ hoàn thành" },
];

type Test = {
    id: number;
    title: string;
    description: string;
    testType: TestType;
    difficulty: TestDifficulty;
    duration: number;
    tags: string;
    popularity: number;
    completionRate: number;
    isFeatured: boolean;
    isAIGenerated: boolean;
    thumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    creator: {
        id: number;
        name: string;
    };
    _count: {
        participants: number;
        testQuestions: number;
    };
};

const TestList = () => {
    // States
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Phân trang
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        page: 1,
        limit: 9,
    });

    // Bộ lọc
    const [filters, setFilters] = useState({
        search: "",
        testType: "All" as string,
        difficulty: "" as string,
        sort: "popularity" as string,
    });

    // Mobile filter drawer
    const [showFilters, setShowFilters] = useState(false);

    // Fetch dữ liệu từ API
    const fetchTests = async () => {
        try {
            setLoading(true);

            // Xây dựng URL với các tham số lọc
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append("search", filters.search);
            if (filters.testType !== "All")
                queryParams.append("testType", filters.testType);
            if (filters.difficulty)
                queryParams.append("difficulty", filters.difficulty);
            if (filters.sort) queryParams.append("sort", filters.sort);
            queryParams.append("page", pagination.page.toString());
            queryParams.append("limit", pagination.limit.toString());

            // Gọi API
            const response = await fetch(
                `/api/online-tests?${queryParams.toString()}`
            );

            if (!response.ok) {
                throw new Error("Không thể tải danh sách bài kiểm tra");
            }

            const data = await response.json();
            setTests(data.tests);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi khi tải bài kiểm tra");
            console.error("Error fetching tests:", err);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi filters hoặc pagination thay đổi
    useEffect(() => {
        fetchTests();
    }, [filters, pagination.page, pagination.limit]);

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        // Reset trang về 1 khi thay đổi bộ lọc
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Xử lý tìm kiếm
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Chuyển trang
    const goToPage = (page: number) => {
        if (page < 1 || page > pagination.pages) return;
        setPagination((prev) => ({ ...prev, page }));
    };

    // Format thời gian từ phút
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`;
        }
        return `${mins} phút`;
    };

    // Format tags
    const formatTags = (tags: string) => {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    };

    // Render UI
    return (
        <div>
            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="mb-6 flex flex-col lg:flex-row justify-between gap-4">
                <form
                    onSubmit={handleSearch}
                    className="flex w-full lg:w-1/2 md:max-w-md"
                >
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài kiểm tra..."
                            value={filters.search}
                            onChange={(e) =>
                                handleFilterChange("search", e.target.value)
                            }
                            className="w-full rounded-l-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 bottom-0 bg-transparent px-3 text-gray-500"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center rounded-r-lg bg-gray-100 px-4 text-gray-700 lg:hidden"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                </form>

                {/* Desktop filters */}
                <div className="hidden lg:flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={filters.testType}
                            onChange={(e) =>
                                handleFilterChange("testType", e.target.value)
                            }
                            className="appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="All">Tất cả</option>
                            {TEST_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={filters.difficulty}
                            onChange={(e) =>
                                handleFilterChange("difficulty", e.target.value)
                            }
                            className="appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Độ khó</option>
                            {TEST_DIFFICULTIES.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={filters.sort}
                            onChange={(e) =>
                                handleFilterChange("sort", e.target.value)
                            }
                            className="appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="h-4 w-4 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {showFilters && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:hidden">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Bộ lọc</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Loại bài kiểm tra
                            </label>
                            <select
                                value={filters.testType}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "testType",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="All">Tất cả</option>
                                {TEST_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Độ khó
                            </label>
                            <select
                                value={filters.difficulty}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "difficulty",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="">Tất cả</option>
                                {TEST_DIFFICULTIES.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Sắp xếp theo
                            </label>
                            <select
                                value={filters.sort}
                                onChange={(e) =>
                                    handleFilterChange("sort", e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Trạng thái loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            )}

            {/* Error message */}
            {error && !loading && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    <p>{error}</p>
                    <button
                        onClick={fetchTests}
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Danh sách bài kiểm tra */}
            {!loading && !error && tests.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tests.map((test) => (
                        <div
                            key={test.id}
                            className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-100"
                        >
                            <div
                                className={`h-32 flex items-center justify-center relative
                                ${
                                    test.testType === "TOEIC"
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                        : ""
                                }
                                ${
                                    test.testType === "IELTS"
                                        ? "bg-gradient-to-r from-green-500 to-teal-600"
                                        : ""
                                }
                                ${
                                    test.testType === "Placement"
                                        ? "bg-gradient-to-r from-orange-500 to-red-600"
                                        : ""
                                }
                                ${
                                    test.testType === "General"
                                        ? "bg-gradient-to-r from-purple-500 to-pink-600"
                                        : ""
                                }
                            `}
                            >
                                <div className="text-center text-white px-4">
                                    <h3 className="text-2xl font-bold">
                                        {test.testType}
                                    </h3>
                                    <p>{test.difficulty} Level</p>
                                </div>
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
                                    {test.testType}
                                </div>
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white">
                                    {test.difficulty}
                                </div>
                                {test.isAIGenerated && (
                                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-purple-800 text-white flex items-center">
                                        <SparkleIcon className="h-3 w-3 mr-1" />
                                        AI Generated
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                    {test.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {test.description}
                                </p>

                                {/* Tags */}
                                {test.tags && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {formatTags(test.tags)
                                            .slice(0, 3)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                                >
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        {formatTags(test.tags).length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +
                                                {formatTags(test.tags).length -
                                                    3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-700">
                                            {formatDuration(test.duration)}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-700">
                                            {test._count.participants} người
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/online-tests/${test.id}`}
                                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                                >
                                    Xem bài kiểm tra
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && tests.length === 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                    <Filter className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        Không tìm thấy bài kiểm tra
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh
                        bộ lọc.
                    </p>
                    <button
                        onClick={() => {
                            setFilters({
                                search: "",
                                testType: "All",
                                difficulty: "",
                                sort: "popularity",
                            });
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Phân trang */}
            {!loading && !error && tests.length > 0 && pagination.pages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Trang{" "}
                        <span className="font-medium">{pagination.page}</span>{" "}
                        trên{" "}
                        <span className="font-medium">{pagination.pages}</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => goToPage(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => goToPage(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Thêm chức năng Sparkle icon
const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
        </svg>
    );
};

export default TestList;
