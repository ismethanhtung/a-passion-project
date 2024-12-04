"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import Pagination from "@/components/Pagination";
import Course from "@/interfaces/course";

const Sources: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "price" | "rating">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchCourse = async () => {
        const response = await fetch("http://localhost:5000/courses");
        const data: Course[] = await response.json();
        setCourses(data);
        setFilteredCourses(data);
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
        <div className="container p-6 mx-auto ">
            <h1 className="text-3xl font-bold text-center mb-6">Our Courses</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-200 rounded-lg px-4 py-2 w-1/3"
                />
                <select
                    value={filter}
                    onChange={(e) =>
                        handleFilterChange(
                            e.target.value as "all" | "price" | "rating"
                        )
                    }
                    className="border border-gray-200 rounded-lg px-4 py-2"
                >
                    <option value="all">All</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>

            {/* Hiển thị khóa học */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {displayedCourses.map((course, index) => (
                    <CourseCard key={index} {...course} />
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

export default Sources;
