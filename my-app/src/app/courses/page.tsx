"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/courseCard";
import Pagination from "@/components/Pagination";
import Course from "@/interfaces/course";
import { fetchCourses } from "@/api/courses";

const Sources: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "price" | "rating">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const getCourses = async () => {
        try {
            const response = await fetchCourses();
            setCourses(response);
            setFilteredCourses(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        filterCourses(e.target.value, filter);
    };

    const handleFilterChange = (newFilter: "all" | "price" | "rating") => {
        setFilter(newFilter);
        filterCourses(searchTerm, newFilter);
    };

    const filterCourses = (search: string, filter: "all" | "price" | "rating") => {
        let filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(search.toLowerCase())
        );
        if (filter === "price") {
            filtered = filtered.sort((a, b) => (a.newPrice || a.price) - (b.newPrice || b.price));
        } else if (filter === "rating") {
            // filtered = filtered.sort((a, b) => b.rating - a.rating);
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
        <div className="container mx-auto ">
            <div className="flex my-16">
                <div className="w-4/6 pt-12 px-10">
                    <h1 className="font-bold text-6xl">
                        Unlock Your Potential with <br />
                        <p className="text-red-400">Our English Courses</p>
                    </h1>
                    <p className="text-lg text-gray-600 py-12">
                        Explore expertly designed courses tailored to improve your English skills in
                        Listening, Reading, Speaking, and Writing. Whether you're a beginner or an
                        advanced learner, our programs help you grow at your own pace.
                    </p>
                    <p className="text-red-300 font-bold text-xl">
                        Start your journey today and achieve your language goals with ease!
                    </p>
                </div>
                <img
                    className="object-cover block w-5/12 pr-24 rounded-lg mb-6 "
                    src="/images/course.png"
                    alt=""
                />
            </div>

            <div className="flex justify-center text-6xl font-bold text-red-300 pb-24">
                Get Started!
            </div>

            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border-2 border-gray-200 rounded-lg px-4 py-2 w-1/3"
                />
                <select
                    value={filter}
                    onChange={(e) =>
                        handleFilterChange(e.target.value as "all" | "price" | "rating")
                    }
                    className="border-2 border-gray-200 rounded-lg px-4 py-2"
                >
                    <option value="all">All</option>
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {displayedCourses.map((course, index) => (
                    <CourseCard key={index} {...course} />
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

export default Sources;
