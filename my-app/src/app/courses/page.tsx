"use client";
import React, { use, useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import Course from "@/interfaces/course";

const sources: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const fetchCourse = async () => {
        const response = await fetch("http://localhost:5000/courses");
        const data: Course[] = await response.json();
        setCourses(data);
    };

    useEffect(() => {
        fetchCourse();
    }, []);
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Our Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                ))}
            </div>
        </div>
    );
};

export default sources;
