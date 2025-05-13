"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import ForumCard from "@/components/forum/ForumCard";
import { fetchForumThreads } from "@/api/forumThread";
import ForumThread from "@/interfaces/forum/forumThread";
import Link from "next/link";

const ForumPage: React.FC = () => {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [filteredThreads, setFilteredThreads] = useState<ForumThread[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [sortOption, setSortOption] = useState<
        "newest" | "oldest" | "popular"
    >("newest");
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState("");
    const [newThreadContent, setNewThreadContent] = useState("");
    const [newThreadCategory, setNewThreadCategory] = useState("general");

    const itemsPerPage = 9;

    // Mẫu dữ liệu danh mục
    const categories = [
        {
            id: "general",
            name: "Chung",
            count: 24,
            color: "bg-blue-100 text-blue-800",
        },
        {
            id: "grammar",
            name: "Ngữ pháp",
            count: 18,
            color: "bg-green-100 text-green-800",
        },
        {
            id: "vocabulary",
            name: "Từ vựng",
            count: 15,
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            id: "pronunciation",
            name: "Phát âm",
            count: 12,
            color: "bg-purple-100 text-purple-800",
        },
        {
            id: "speaking",
            name: "Nói",
            count: 9,
            color: "bg-pink-100 text-pink-800",
        },
        {
            id: "listening",
            name: "Nghe",
            count: 7,
            color: "bg-indigo-100 text-indigo-800",
        },
        {
            id: "writing",
            name: "Viết",
            count: 5,
            color: "bg-red-100 text-red-800",
        },
        {
            id: "resources",
            name: "Tài liệu",
            count: 11,
            color: "bg-orange-100 text-orange-800",
        },
    ];

    const getThreads = async () => {
        try {
            setIsLoading(true);
            const response = await fetchForumThreads();
            setThreads(response);
            setFilteredThreads(response);
            setIsLoading(false);
        } catch (error) {
            console.log("Error fetching threads: ", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getThreads();
    }, []);

    useEffect(() => {
        // Apply filtering and sorting
        let filtered = [...threads];

        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(
                (thread) =>
                    thread.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    thread.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(
                (thread) => thread.category === selectedCategory
            );
        }

        // Sort threads
        switch (sortOption) {
            case "newest":
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
            case "oldest":
                filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
                break;
            case "popular":
                filtered.sort(
                    (a, b) =>
                        (b.forumPosts?.length || 0) -
                        (a.forumPosts?.length || 0)
                );
                break;
        }

        setFilteredThreads(filtered);
        setCurrentPage(1);
    }, [threads, searchTerm, selectedCategory, sortOption]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateThread = () => {
        // Tạo chủ đề mới (sẽ thêm chức năng API sau)
        alert(`Tạo chủ đề mới: ${newThreadTitle}`);
        setShowNewThreadModal(false);
        setNewThreadTitle("");
        setNewThreadContent("");
    };

    const totalPages = Math.ceil(filteredThreads.length / itemsPerPage);
    const displayedThreads = filteredThreads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Cộng đồng học tập
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Tham gia thảo luận, đặt câu hỏi và kết nối với những
                            người học khác
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => setShowNewThreadModal(true)}
                                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Tạo chủ đề mới
                            </button>
                            <Link href="/forum/guidelines">
                                <button className="px-6 py-3 bg-blue-700/30 text-white font-medium rounded-lg hover:bg-blue-700/50 transition-colors flex items-center justify-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Hướng dẫn diễn đàn
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Chủ đề
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                                            selectedCategory === null
                                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span>Tất cả chủ đề</span>
                                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {threads.length}
                                        </span>
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() =>
                                                setSelectedCategory(category.id)
                                            }
                                            className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                                                selectedCategory === category.id
                                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span>{category.name}</span>
                                            <span
                                                className={`${category.color} text-xs font-medium px-2.5 py-1 rounded-full`}
                                            >
                                                {category.count}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Thống kê
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Chủ đề:</span>
                                    <span className="font-medium">
                                        {threads.length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Bài viết:</span>
                                    <span className="font-medium">
                                        {threads.reduce(
                                            (sum, thread) =>
                                                sum +
                                                (thread.forumPosts?.length ||
                                                    0),
                                            0
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Thành viên:</span>
                                    <span className="font-medium">247</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Thành viên mới nhất:</span>
                                    <span className="font-medium text-blue-600">
                                        user123
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="md:w-3/4">
                        {/* Search and filters */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm chủ đề..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(
                                            e.target.value as
                                                | "newest"
                                                | "oldest"
                                                | "popular"
                                        )
                                    }
                                    className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                    <option value="popular">
                                        Phổ biến nhất
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Thread list */}
                        {isLoading ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">
                                    Đang tải chủ đề...
                                </p>
                            </div>
                        ) : displayedThreads.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {displayedThreads.map((thread) => (
                                    <ForumCard
                                        key={thread.id}
                                        thread={thread}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Không tìm thấy chủ đề nào
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Không có chủ đề nào phù hợp với tìm kiếm của
                                    bạn
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory(null);
                                    }}
                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create new thread modal */}
            {showNewThreadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-900">
                                Tạo chủ đề mới
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    value={newThreadTitle}
                                    onChange={(e) =>
                                        setNewThreadTitle(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Nhập tiêu đề chủ đề"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nội dung
                                </label>
                                <textarea
                                    value={newThreadContent}
                                    onChange={(e) =>
                                        setNewThreadContent(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-40"
                                    placeholder="Nhập nội dung chủ đề"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục
                                </label>
                                <select
                                    value={newThreadCategory}
                                    onChange={(e) =>
                                        setNewThreadCategory(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4 rounded-b-xl">
                            <button
                                onClick={() => setShowNewThreadModal(false)}
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateThread}
                                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Tạo chủ đề
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumPage;
