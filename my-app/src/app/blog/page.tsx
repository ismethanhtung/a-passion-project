"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

interface Blog {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    urlToImage: string;
}

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Hàm lấy dữ liệu từ NewsAPI
    const fetchBlogs = async () => {
        try {
            const response = await fetch(
                "https://newsapi.org/v2/everything?q=technology&from=2024-11-04&sortBy=publishedAt&apiKey=ac4bd79fc7c547ec9964d7e43f0f823b"
            );
            const data = await response.json();
            setBlogs(data.articles); // Lấy danh sách bài viết
            setFilteredBlogs(data.articles); // Mặc định hiển thị tất cả bài viết
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Hàm tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        filterBlogs(e.target.value);
    };

    // Hàm lọc bài viết dựa trên từ khóa
    const filterBlogs = (search: string) => {
        const filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBlogs(filtered);
        setCurrentPage(1); // Reset về trang đầu tiên sau khi lọc
    };

    // Phân trang
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const displayedBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">
                Latest Blogs
            </h1>

            {/* Tìm kiếm */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                />
            </div>

            {/* Hiển thị danh sách blogs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedBlogs.map((blog, index) => (
                    <div
                        key={index}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            <img
                                src={blog.urlToImage}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </h2>
                        <h2 className="text-xl font-semibold mb-2">
                            {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{blog.description}</p>
                        <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            Read More
                        </a>
                        <p className="text-gray-400 text-sm mt-2">
                            Published on:{" "}
                            {new Date(blog.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Blogs;
