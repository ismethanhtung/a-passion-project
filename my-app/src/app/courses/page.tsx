"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import Course from "@/interfaces/course";

const Sources: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "price" | "rating">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số lượng khóa học hiển thị mỗi trang

    const fetchCourse = async () => {
        const response = await fetch("http://localhost:5000/courses");
        const data: Course[] = await response.json();
        setCourses(data);
        setFilteredCourses(data); // Mặc định hiển thị tất cả khóa học
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        filterCourses(e.target.value, filter);
    };

    const handleFilterChange = (newFilter: "all" | "price" | "rating") => {
        setFilter(newFilter);
        filterCourses(searchTerm, newFilter);
    };

    const filterCourses = (
        search: string,
        filter: "all" | "price" | "rating"
    ) => {
        let filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(search.toLowerCase())
        );
        if (filter === "price") {
            filtered = filtered.sort(
                (a, b) => (a.newPrice || a.price) - (b.newPrice || b.price)
            );
        } else if (filter === "rating") {
            filtered = filtered.sort((a, b) => b.rating - a.rating);
        }
        setFilteredCourses(filtered);
    };

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const displayedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Our Courses</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
                />
                <select
                    value={filter}
                    onChange={(e) =>
                        handleFilterChange(
                            e.target.value as "all" | "price" | "rating"
                        )
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="all">All</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>

            {/* Hiển thị danh sách khóa học */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {displayedCourses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-6">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 text-sm ${
                            currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        } rounded mx-1`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Sources;
