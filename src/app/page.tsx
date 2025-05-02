"use client";
import { useState, useEffect } from "react";
import Course from "@/interfaces/course";
import CourseCard from "@/components/courseCard";
import { fetchLimitCourses } from "@/api/courses";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import CommentList from "@/components/ui/comment";
import CallToActionSection from "@/components/CallToActionSection";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetchLimitCourses();
            setCourses(response);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <HeroSection />

            {/* Stats Section */}
            <StatsSection />

            {/* Featured Courses */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center bg-[#6E59A5]/5 rounded-full px-4 py-2 mb-4">
                            <Sparkles className="h-4 w-4 text-[#6E59A5] mr-2" />
                            <span className="text-sm font-medium text-[#6E59A5]">
                                Featured Courses
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                            Most Popular Language Courses
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover our top-rated courses designed by language
                            experts to help you achieve fluency
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl h-96 animate-pulse"
                                >
                                    <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                                    <div className="p-5">
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {courses.map((course, index) => (
                                <CourseCard
                                    key={index}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description}
                                    thumbnail={course.thumbnail}
                                    price={course.price}
                                    newPrice={course.newPrice}
                                    tags={course.categoryId?.toString()}
                                    rating={4.5 + Math.random() * 0.5}
                                    time={Math.floor(Math.random() * 20) + 5}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-12">
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#6E59A5] text-[#6E59A5] rounded-lg font-medium hover:bg-[#6E59A5]/5 transition-colors"
                        >
                            View All Courses{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Testimonials */}
            <div className="bg-gray-50 py-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <CommentList />
                </div>
            </div>

            {/* Call to Action */}
            <CallToActionSection />
        </div>
    );
}
