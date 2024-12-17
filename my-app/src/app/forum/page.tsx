"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import ForumCard from "@/components/forum/ForumCard";
import { fetchForumThreads } from "@/utils/forumThread";
import ForumThread from "@/interfaces/forum/forumThread";

const ForumPage: React.FC = () => {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [filteredThreads, setFilteredThreads] = useState<ForumThread[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 12;

    const getThreads = async () => {
        setLoading(true);
        try {
            const response = await fetchForumThreads();
            setThreads(response);
            setFilteredThreads(response);
        } catch (error) {
            console.log("Error fetching threads: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getThreads();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterThreads(value);
    };

    const filterThreads = (search: string) => {
        const filtered = threads.filter((thread) =>
            thread.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredThreads(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredThreads.length / itemsPerPage);
    const displayedThreads = filteredThreads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-6">
            <div className="text-center my-12">
                <h1 className="text-5xl font-bold text-gray-800">
                    Welcome to the <span className="text-red-400">Forum</span>
                </h1>
                <p className="text-gray-600 mt-4 text-lg">
                    Engage in discussions, ask questions, and connect with others!
                </p>
            </div>

            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search threads..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-400 transition-all duration-300"
                />
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading threads...</div>
            ) : (
                <>
                    {displayedThreads.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {displayedThreads.map((thread) => (
                                <ForumCard key={thread.id} thread={thread} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            No threads found. Try searching for another keyword!
                        </div>
                    )}
                </>
            )}

            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ForumPage;
