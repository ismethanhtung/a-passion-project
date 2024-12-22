"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
// import Blog from "@/interfaces/blog";
import fetchBlogs from "@/api/blogs";

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const data = await fetchBlogs();
                setBlogs(data);
                setFilteredBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        getBlogs();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        filterBlogs(e.target.value);
    };

    const filterBlogs = (search: string) => {
        const filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBlogs(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const displayedBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-6xl font-bold text-center my-12 text-red-300">Latest Blogs</h1>

            <div className="flex justify-center mb-12">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedBlogs.map((blog, index) => (
                    <div
                        key={index}
                        className="flex flex-col border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            <img
                                src={blog.urlToImage}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </h2>
                        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                        <p className="text-gray-600 mb-4">{blog.description}</p>
                        <div className="flex justify-between mt-auto">
                            <a
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Read More
                            </a>
                            <p className="text-gray-400 text-sm">
                                Published on: {new Date(blog.publishedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Blogs;
