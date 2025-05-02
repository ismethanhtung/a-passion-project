"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/courseCard";
import Pagination from "@/components/Pagination";
import Course from "@/interfaces/course";
import { fetchCourses } from "@/api/courses";
import { fetchReviews } from "@/api/review";
import Fuse from "fuse.js";

const Sources: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "price" | "rating">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [isFree, setIsFree] = useState<boolean | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCourses = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [coursesData, reviewsData] = await Promise.all([
                    fetchCourses(),
                    fetchReviews(),
                ]);

                if (!coursesData || !Array.isArray(coursesData)) {
                    throw new Error("Dữ liệu khóa học không hợp lệ");
                }

                if (!reviewsData || !Array.isArray(reviewsData)) {
                    throw new Error("Dữ liệu đánh giá không hợp lệ");
                }

                const coursesWithRatings = coursesData.map((course: Course) => {
                    const courseReviews = reviewsData.filter(
                        (review: any) =>
                            review.courseId === course.id && review.rating > 0
                    );
                    const averageRating =
                        courseReviews.length > 0
                            ? courseReviews.reduce(
                                  (sum: number, review: any) =>
                                      sum + review.rating,
                                  0
                              ) / courseReviews.length
                            : 0;
                    return {
                        ...course,
                        rating: Number(averageRating.toFixed(1)),
                    };
                });

                setCourses(coursesWithRatings);
                setFilteredCourses(coursesWithRatings);
            } catch (error) {
                console.error(error);
                setError(
                    (error as Error).message || "Đã xảy ra lỗi khi tải khóa học"
                );
            } finally {
                setIsLoading(false);
            }
        };

        getCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [
        searchTerm,
        filter,
        selectedRating,
        isFree,
        selectedSkills,
        selectedLevels,
    ]);

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skill = e.target.value;
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    const handleLevelChange = (level: string) => {
        setSelectedLevels((prev) =>
            prev.includes(level)
                ? prev.filter((l) => l !== level)
                : [...prev, level]
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (newFilter: any) => {
        setFilter(newFilter);
    };

    const handleRatingFilter = (rating: number | null) => {
        setSelectedRating(rating);
    };

    const handlePriceFilter = (free: boolean | null) => {
        setIsFree(free);
    };

    const filterCourses = () => {
        if (!courses || courses.length === 0) return;

        const options = {
            keys: ["title", "description"],
            threshold: 0.4,
            distance: 200,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
            findAllMatches: true,
            shouldSort: true,
        };

        const fuse = new Fuse(courses, options);
        let filtered = searchTerm
            ? fuse.search(searchTerm).map((result) => result.item)
            : courses;

        if (selectedSkills.length > 0) {
            const skillResults = selectedSkills.flatMap((skill) =>
                fuse.search(skill).map((result) => result.item)
            );
            const skillSet = new Set(skillResults);
            filtered = filtered.filter((course) => skillSet.has(course));
        }

        if (filter === "price") {
            filtered.sort(
                (a, b) => (a.newPrice || a.price) - (b.newPrice || b.price)
            );
        } else if (filter === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        if (selectedRating !== null) {
            filtered = filtered.filter(
                (course) => course.rating >= selectedRating
            );
        }

        if (isFree !== null) {
            filtered = filtered.filter((course) =>
                isFree ? course.newPrice === 0 : course.price > 0
            );
        }

        if (selectedLevels.length > 0) {
            const levelResults = selectedLevels.flatMap((level) =>
                fuse.search(level).map((result) => result.item)
            );
            const levelSet = new Set(levelResults);
            filtered = filtered.filter((course) => levelSet.has(course));
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
        <div className="container mx-auto">
            {isLoading ? (
                <div className="flex justify-center items-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
                </div>
            ) : (
                /* Filter and Main Content Layout */
                <div className="flex">
                    <div className="w-3/4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <select
                                value={filter}
                                onChange={(e) =>
                                    handleFilterChange(
                                        e.target.value as
                                            | "all"
                                            | "price"
                                            | "rating"
                                    )
                                }
                            >
                                <option value="all">All</option>
                                <option value="price">Sort by Price</option>
                                <option value="rating">Sort by Rating</option>
                                <option value="popularity">Most Popular</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>

                        {displayedCourses.length === 0 ? (
                            <div className="text-center p-10 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">
                                    Không tìm thấy khóa học phù hợp.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {displayedCourses.map((course, index) => (
                                    <CourseCard key={index} {...course} />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sources;
