"use client";
import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import LinkItem from "@/components/LinkItem";
import Course from "@/interfaces/course";
import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import CommentList from "@/components/ui/comment";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
    const [courses, setCourses] = useState<Course[]>([]);

    // const fetchCourses = async () => {
    //     const response = await fetch("http://localhost:5000/courses");
    //     const data: Course[] = await response.json();
    //     setCourses(data.slice(0, 4));
    // };

    // useEffect(() => {
    //     fetchCourses();
    // });

    return (
        <div>
            <div className="container p-6 mx-auto ">
                <div className="flex mt-8">
                    <div className="w-2/4 h-auto ">
                        <h1 className="text-7xl font-bold text-red-400 pl-16 pt-12">
                            Online <br />
                            Learning
                        </h1>
                        <p className="px-16 py-12 text-gray-500 text-lg text-justify">
                            "Transform your skills and unlock new opportunities
                            with our flexible, engaging courses. Learn what you
                            love, at your own pace, and achieve your personal or
                            professional goals today."
                        </p>
                        <div className="px-16">
                            <Button text="Get Started" href="/courses"></Button>
                        </div>
                    </div>
                    <img
                        className="object-cover block h-full rounded-lg mb-6 w-2/4 pb-6"
                        src="/images/home.png"
                        alt=""
                    />{" "}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 w-full mt-28 mb-28">
                    <div className=" text-center  flex flex-col justify-center w-full">
                        <h1 className="text-4xl font-extrabold  text-center">
                            Master New Skills with LinguaX <br />
                            <span className="text-red-300">
                                Explore, Create, and Achieve with Our
                                Comprehensive Curriculum
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-36 border-b-2 border-gray-300">
                    <div className="bg-cyan-50 p-8 py-12 rounded-3xl shadow-lg flex flex-col ">
                        <h2 className="text-2xl text-gray-700 font-bold mb-8">
                            Learn at your own pace with hands-on creative
                            classes
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Looking to expand your skills and explore your
                            creativity? Our hands-on creative classes are the
                            perfect way to learn at your own pace and discover
                            new talents.
                        </p>
                    </div>

                    <div className="bg-red-50 p-8 py-12 rounded-3xl shadow-lg flex flex-col justify-between text-justify">
                        <h2 className="text-2xl text-gray-700 font-bold mb-8">
                            LinguaX teachers are everyday creatives and
                            professionals who want to share their passion.
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            At LinguaX, our teachers are not just experts in
                            their field; they are passionate about helping
                            others discover their own creativity. They tailor
                            their instruction to meet individual needs and
                            goals.
                        </p>
                    </div>

                    <div className="bg-yellow-100 p-8 py-12 rounded-3xl shadow-lg flex flex-col justify-between text-justify">
                        <h2 className="text-2xl text-gray-700 font-bold mb-8">
                            Discover the joy of learning
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            With a variety of courses, you'll find something to
                            spark your interest and inspire your creativity.
                            Learn from experts and take your skills to the next
                            level.
                        </p>
                    </div>
                </div>
                <div className="container">
                    <h1 className="text-5xl font-bold text-red-300 text-center py-24">
                        Popular Courses
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {/* {courses.map((course, index) => (
                            <CourseCard key={index} {...course} />
                        ))} */}
                    </div>
                    <div className="flex justify-center items-center mt-16 h-full">
                        <Button text="All Courses" href="courses"></Button>
                    </div>
                </div>
                <div className="container flex mt-24">
                    <img className="w-1/2" src="/images/home1.png" alt="" />

                    <div className="w-1/2 h-auto mt-24">
                        <h1 className="text-5xl text-red-300 font-bold">
                            Why Choose CourseCo for Your Learning Journey
                        </h1>
                        <p className="text-gray-500 mt-8 text-xl text-justify">
                            Unlock your potential and achieve your goals with
                            our dynamic, interactive classes designed to inspire
                            growth and creativity. Learn from the best, at your
                            own pace, and take your skills to the next level.
                        </p>
                        <p className="mt-6 text-blue-500">
                            ✔ Learn From Industry Leaders
                        </p>
                        <p className="mt-3 text-blue-500">
                            ✔ Engage in Real-World Projects{" "}
                        </p>
                        <p className="mt-3 text-blue-500">
                            ✔ Comprehensive and Flexible Curriculum
                        </p>
                        <p className="mt-6 text-gray-500 text-xl">
                            Empower yourself with the knowledge and tools to
                            succeed, guided by passionate instructors and a
                            supportive community. Your journey starts here!
                        </p>
                    </div>
                </div>
                <div className=" container mt-24">
                    <h1 className="font-bold text-5xl text-red-300 py-8 text-center">
                        Unlock Your Potential with LinguaX
                    </h1>
                    <p className="text-gray-500 text-xl text-center mb-16">
                        Discover how LearnEasy's innovative courses empower you
                        to gain new skills,
                        <br />
                        boost confidence, and excel in both personal and
                        professional pursuits.
                    </p>
                    <CommentList />
                </div>
            </div>
        </div>
    );
}
