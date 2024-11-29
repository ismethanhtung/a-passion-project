"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Course from "@/interfaces/course";

const CourseDetail: React.FC = () => {
    const params = useParams();
    const id = params.id;

    const [course, setCourse] = useState<Course | null>(null);

    const fetchCourseDetail = async () => {
        if (!id) return;

        try {
            const response = await fetch(`http://localhost:5000/courses/${id}`);
            const data = await response.json();
            setCourse(data);
        } catch (error) {
            console.error("Error fetching course data:", error);
        }
    };

    useEffect(() => {
        fetchCourseDetail();
    }, [id]);

    if (!course) {
        return <div>404</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">
                {course.title}
            </h1>
            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full md:w-1/2 h-64 object-cover rounded-lg"
                />
                <div className="md:w-1/2">
                    <div className="text-lg font-semibold text-gray-600 mb-4">
                        {course.tag}
                    </div>
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-gray-900">
                            {course.newPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                            {course.price}
                        </span>
                    </div>
                    <button className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
