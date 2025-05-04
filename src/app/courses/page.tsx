"use client";
import React, { useEffect, useState, useCallback } from "react";
import { fetchCourses } from "@/api/courses";
import { fetchReviews } from "@/api/review";
import { fetchCategories } from "@/api/category";
import Course from "@/interfaces/course";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { Grid2X2, List, ArrowUpDown, Filter, X } from "lucide-react";

// Components
import CourseSearch from "@/components/courses/CourseSearch";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseSorting, { SortOption } from "@/components/courses/CourseSorting";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseListView from "@/components/courses/CourseListView";
import EmptyState from "@/components/courses/EmptyState";
import ActiveFilters from "@/components/courses/ActiveFilters";
import Pagination from "@/components/Pagination";

// Utils
import { extractAllTags, getCourseDuration } from "@/lib/utils";

const CoursesPage: React.FC = () => {
    // State for courses data
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // State for view options
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0, 10000000,
    ]);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(
        null
    );
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // Fetch courses data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [coursesData, reviewsData, categoriesData] =
                    await Promise.all([
                        fetchCourses(),
                        fetchReviews(),
                        fetchCategories(),
                    ]);

                if (!coursesData || !Array.isArray(coursesData)) {
                    throw new Error("Invalid course data");
                }

                if (!reviewsData || !Array.isArray(reviewsData)) {
                    throw new Error("Invalid review data");
                }

                // Calculate average rating for each course
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

                // Set max price for price range filter
                const highestPrice = Math.max(
                    ...coursesWithRatings.map((course) => course.price)
                );
                setMaxPrice(highestPrice > 0 ? highestPrice : 10000000);
                setPriceRange([0, highestPrice > 0 ? highestPrice : 10000000]);

                // Extract all unique tags from courses
                const tags = extractAllTags(coursesWithRatings);
                setAvailableTags(tags);

                // Set categories
                if (categoriesData && Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                }

                setCourses(coursesWithRatings);
                setFilteredCourses(coursesWithRatings);
            } catch (error) {
                console.error(error);
                setError(
                    (error as Error).message ||
                        "An error occurred while loading courses"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter courses when filters change
    useEffect(() => {
        filterCourses();
    }, [
        searchTerm,
        sortOption,
        selectedCategories,
        priceRange,
        selectedRating,
        selectedLevels,
        selectedLanguages,
        selectedDuration,
        selectedTags,
    ]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCourses]);

    // Filter courses based on all criteria
    const filterCourses = useCallback(() => {
        if (!courses || courses.length === 0) return;

        // Setup Fuse.js for fuzzy search
        const options = {
            keys: [
                "title",
                "description",
                "teacher.name",
                "creator.name",
                "tags",
            ],
            threshold: 0.4,
            distance: 200,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
            findAllMatches: true,
            shouldSort: true,
        };

        const fuse = new Fuse(courses, options);

        // Apply search filter
        let filtered = searchTerm
            ? fuse.search(searchTerm).map((result) => result.item)
            : [...courses];

        // Apply category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((course) =>
                selectedCategories.includes(course.categoryId)
            );
        }

        // Apply price range filter
        filtered = filtered.filter(
            (course) =>
                (course.newPrice || course.price) >= priceRange[0] &&
                (course.newPrice || course.price) <= priceRange[1]
        );

        // Apply rating filter
        if (selectedRating !== null) {
            filtered = filtered.filter(
                (course) => course.rating >= selectedRating
            );
        }

        // Apply level filter
        if (selectedLevels.length > 0) {
            filtered = filtered.filter(
                (course) =>
                    course.level && selectedLevels.includes(course.level)
            );
        }

        // Apply language filter
        if (selectedLanguages.length > 0) {
            filtered = filtered.filter(
                (course) =>
                    course.language &&
                    selectedLanguages.includes(course.language)
            );
        }

        // Apply duration filter
        if (selectedDuration !== null) {
            filtered = filtered.filter((course) => {
                const duration = getCourseDuration(course.time);
                return duration === selectedDuration;
            });
        }

        // Apply tags filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter((course) => {
                if (!course.tags) return false;
                const courseTags = course.tags
                    .split(",")
                    .map((tag) => tag.trim());
                return selectedTags.some((tag) => courseTags.includes(tag));
            });
        }

        // Apply sorting
        switch (sortOption) {
            case "newest":
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                );
                break;
            case "popularity":
                // Sort by number of reviews as a proxy for popularity
                filtered.sort(
                    (a, b) =>
                        (b.reviews?.length || 0) - (a.reviews?.length || 0)
                );
                break;
            case "price-low":
                filtered.sort(
                    (a, b) => (a.newPrice || a.price) - (b.newPrice || b.price)
                );
                break;
            case "price-high":
                filtered.sort(
                    (a, b) => (b.newPrice || b.price) - (a.newPrice || a.price)
                );
                break;
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "duration-short":
                filtered.sort((a, b) => {
                    const aTime = a.time
                        ? parseInt(a.time.match(/\d+/)?.[0] || "0")
                        : 0;
                    const bTime = b.time
                        ? parseInt(b.time.match(/\d+/)?.[0] || "0")
                        : 0;
                    return aTime - bTime;
                });
                break;
            case "duration-long":
                filtered.sort((a, b) => {
                    const aTime = a.time
                        ? parseInt(a.time.match(/\d+/)?.[0] || "0")
                        : 0;
                    const bTime = b.time
                        ? parseInt(b.time.match(/\d+/)?.[0] || "0")
                        : 0;
                    return bTime - aTime;
                });
                break;
        }

        setFilteredCourses(filtered);
    }, [
        courses,
        searchTerm,
        selectedCategories,
        priceRange,
        selectedRating,
        selectedLevels,
        selectedLanguages,
        selectedDuration,
        selectedTags,
        sortOption,
    ]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSearchTerm("");
        setSelectedCategories([]);
        setPriceRange([0, maxPrice]);
        setSelectedRating(null);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setSelectedDuration(null);
        setSelectedTags([]);
        setSortOption("newest");
    }, [maxPrice]);

    // Handle pagination
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const displayedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Remove individual filters
    const removeCategory = (id: number) => {
        setSelectedCategories((prev) =>
            prev.filter((categoryId) => categoryId !== id)
        );
    };

    const removeLevel = (level: string) => {
        setSelectedLevels((prev) => prev.filter((l) => l !== level));
    };

    const removeLanguage = (language: string) => {
        setSelectedLanguages((prev) => prev.filter((l) => l !== language));
    };

    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const removeRating = () => {
        setSelectedRating(null);
    };

    const removeDuration = () => {
        setSelectedDuration(null);
    };

    const resetPriceRange = () => {
        setPriceRange([0, maxPrice]);
    };

    // Get category names for active filters display
    const selectedCategoryObjects = categories.filter((category) =>
        selectedCategories.includes(category.id)
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover quality courses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Improve your skills with hundreds of courses from
                            top experts
                        </p>
                        <CourseSearch
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Search courses, skills, or teachers..."
                        />
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    {/* Mobile Filter Toggle */}
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileFilterOpen(!isMobileFilterOpen)
                            }
                            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <Filter size={18} className="mr-2" />
                            <span>Filters</span>
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${
                                    viewMode === "grid"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                <Grid2X2 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${
                                    viewMode === "list"
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Course Count and View Toggle (Desktop) */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                All courses
                            </h2>
                            <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                {filteredCourses.length} courses
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <CourseSorting
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                            />

                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg ${
                                        viewMode === "grid"
                                            ? "bg-indigo-100 text-indigo-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    <Grid2X2 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg ${
                                        viewMode === "list"
                                            ? "bg-indigo-100 text-indigo-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <ActiveFilters
                        selectedCategories={selectedCategoryObjects}
                        selectedLevels={selectedLevels}
                        selectedLanguages={selectedLanguages}
                        selectedTags={selectedTags}
                        selectedRating={selectedRating}
                        selectedDuration={selectedDuration}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        removeCategory={removeCategory}
                        removeLevel={removeLevel}
                        removeLanguage={removeLanguage}
                        removeTag={removeTag}
                        removeRating={removeRating}
                        removeDuration={removeDuration}
                        resetPriceRange={resetPriceRange}
                        clearAllFilters={clearAllFilters}
                    />

                    {/* Mobile Filters (Slide-in) */}
                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white overflow-y-auto">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="text-lg font-bold">
                                        Filters
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setIsMobileFilterOpen(false)
                                        }
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <CourseFilters
                                        categories={categories}
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={
                                            setSelectedCategories
                                        }
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        maxPrice={maxPrice}
                                        selectedRating={selectedRating}
                                        setSelectedRating={setSelectedRating}
                                        selectedLevels={selectedLevels}
                                        setSelectedLevels={setSelectedLevels}
                                        selectedLanguages={selectedLanguages}
                                        setSelectedLanguages={
                                            setSelectedLanguages
                                        }
                                        selectedDuration={selectedDuration}
                                        setSelectedDuration={
                                            setSelectedDuration
                                        }
                                        selectedTags={selectedTags}
                                        setSelectedTags={setSelectedTags}
                                        availableTags={availableTags}
                                        clearAllFilters={clearAllFilters}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Layout */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters (Desktop) */}
                        <div className="hidden md:block md:w-1/4">
                            <CourseFilters
                                categories={categories}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                maxPrice={maxPrice}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                                selectedLevels={selectedLevels}
                                setSelectedLevels={setSelectedLevels}
                                selectedLanguages={selectedLanguages}
                                setSelectedLanguages={setSelectedLanguages}
                                selectedDuration={selectedDuration}
                                setSelectedDuration={setSelectedDuration}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                availableTags={availableTags}
                                clearAllFilters={clearAllFilters}
                            />
                        </div>

                        {/* Course List */}
                        <div className="md:w-3/4">
                            {isLoading ? (
                                viewMode === "grid" ? (
                                    <CourseGrid isLoading={true} courses={[]} />
                                ) : (
                                    <CourseListView
                                        isLoading={true}
                                        courses={[]}
                                    />
                                )
                            ) : displayedCourses.length === 0 ? (
                                <EmptyState resetFilters={clearAllFilters} />
                            ) : (
                                <>
                                    {viewMode === "grid" ? (
                                        <CourseGrid
                                            courses={displayedCourses}
                                        />
                                    ) : (
                                        <CourseListView
                                            courses={displayedCourses}
                                        />
                                    )}

                                    {totalPages > 1 && (
                                        <div className="mt-8">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
