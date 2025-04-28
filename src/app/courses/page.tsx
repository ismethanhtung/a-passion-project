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

    useEffect(() => {
        const getCourses = async () => {
            try {
                const [coursesData, reviewsData] = await Promise.all([
                    fetchCourses(),
                    fetchReviews(),
                ]);
                const coursesWithRatings = coursesData.map((course: Course) => {
                    const courseReviews = reviewsData.filter(
                        (review: any) => review.courseId === course.id && review.rating > 0
                    );
                    const averageRating =
                        courseReviews.length > 0
                            ? courseReviews.reduce(
                                  (sum: number, review: any) => sum + review.rating,
                                  0
                              ) / courseReviews.length
                            : 0;
                    return { ...course, rating: Number(averageRating.toFixed(1)) };
                });
                setCourses(coursesWithRatings);
                setFilteredCourses(coursesWithRatings);
            } catch (error) {
                console.error(error);
            }
        };
        getCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchTerm, filter, selectedRating, isFree, selectedSkills]);

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skill = e.target.value;
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleLevelChange = (level: string) => {
        setSelectedLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
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
        let filtered = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : courses;

        if (selectedSkills.length > 0) {
            const skillResults = selectedSkills.flatMap((skill) =>
                fuse.search(skill).map((result) => result.item)
            );
            const skillSet = new Set(skillResults);
            filtered = filtered.filter((course) => skillSet.has(course));
        }

        if (filter === "price") {
            filtered.sort((a, b) => (a.newPrice || a.price) - (b.newPrice || b.price));
        } else if (filter === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        if (selectedRating !== null) {
            filtered = filtered.filter((course) => course.rating >= selectedRating);
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
            <div className="flex my-16">
                <div className="w-4/6 pt-12 px-10">
                    <h1 className="font-bold text-3xl">
                        Unlock Your Potential with <br />
                        <span className="text-red-400">Our Language Courses</span>
                    </h1>
                    <p className="text-gray-600 py-12">
                        Explore expertly designed courses tailored to improve your skills in
                        Speaking, Listening, Reading, and Writing. Whether you're a beginner or an
                        advanced learner, our programs help you grow at your own pace.
                    </p>
                    <p className="text-red-300 font-bold text-xl">
                        Start your journey today and achieve your language goals with ease!
                    </p>
                </div>
                <img
                    className="object-cover block w-5/12 pr-24 rounded-lg mb-1"
                    src="/images/course.png"
                    alt=""
                />
            </div>

            {/* Section Title */}
            <div className="flex justify-center text-4xl font-bold text-red-300 pb-24">
                All the skills you need in one place
            </div>

            {/* Filter and Main Content Layout */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/5 mt-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-4">Language Skills</h3>
                        <div className="space-y-2">
                            {["speaking", "listening", "reading", "writing"].map((skill) => (
                                <label key={skill} className="flex items-center text-gray-600">
                                    <input
                                        type="checkbox"
                                        value={skill}
                                        checked={selectedSkills.includes(skill)}
                                        onChange={handleSkillChange}
                                        className="mr-2"
                                    />
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ratings Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Ratings</h3>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <label key={rating} className="flex items-center text-gray-600">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={rating}
                                        checked={selectedRating === rating}
                                        onChange={() => handleRatingFilter(rating)}
                                        className="mr-2"
                                    />
                                    <div className="flex items-center mr-2">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <img
                                                key={i}
                                                src="/icons/star.png"
                                                alt="star"
                                                className={`size-4 mr-0.5 ${
                                                    i < rating ? "opacity-100" : "opacity-50"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="flex-grow">{`${rating} & up`}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Price</h3>
                        <div className="space-y-2">
                            <label className="block text-gray-600">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={isFree === true}
                                    onChange={() => handlePriceFilter(true)}
                                    className="mr-2"
                                />
                                Free
                            </label>
                            <label className="block text-gray-600">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={isFree === false}
                                    onChange={() => handlePriceFilter(false)}
                                    className="mr-2"
                                />
                                Paid
                            </label>
                        </div>
                    </div>

                    {/* Duration Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Duration</h3>
                        <select className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="short">0-1 Hour</option>
                            <option value="medium">1-3 Hours</option>
                            <option value="long">3+ Hours</option>
                        </select>
                    </div>

                    {/* Language Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Language</h3>
                        <select className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="english">English</option>
                            <option value="spanish">Español</option>
                            <option value="french">Français</option>
                            <option value="german">Vietnamese</option>
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Level</h3>
                        <div className="space-y-2">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                <label key={level} className="block text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={selectedLevels.includes(level)}
                                        onChange={() => handleLevelChange(level)}
                                        className="mr-2"
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Feature Filters */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-600 mb-2">Features</h3>
                        <select className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="subtitles">Subtitles</option>
                            <option value="quizzes">Quizzes</option>
                            <option value="certificates">Certificates</option>
                        </select>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-3/4 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-1/2"
                        />
                        <select
                            value={filter}
                            onChange={(e) =>
                                handleFilterChange(e.target.value as "all" | "price" | "rating")
                            }
                            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-1/4"
                        >
                            <option value="all">All</option>
                            <option value="price">Sort by Price</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="popularity">Most Popular</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            </div>
        </div>
    );
};

export default Sources;
