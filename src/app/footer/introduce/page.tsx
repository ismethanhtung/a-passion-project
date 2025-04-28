import React from "react";
// import { courses } from "../data/courses";

const IntroducePage = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 mt-10 py-12 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-4">Our Courses</h1>
            <p className="text-gray-700 mb-4">
                At Language Mastery, we offer a wide range of language courses designed to help you
                achieve your language learning goals. Whether you're a beginner looking to start
                from scratch or an advanced learner seeking to refine your skills, we have something
                for everyone.
            </p>
            <h2 className="text-2xl font-semibold mb-4 mt-8">How Our Courses Work:</h2>
            <ul className="list-disc pl-4 mb-4 text-gray-700">
                <li>Each course is divided into modules that cover specific topics.</li>
                <li>
                    You can access course materials, including videos, PDFs, and quizzes, at any
                    time.
                </li>
                <li>
                    Participate in live sessions with instructors for real-time interaction and
                    doubt clarification.
                </li>
                <li>Track your progress and receive certifications upon completing courses.</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Why Our Courses Are Different:</h2>
            <ul className="list-disc pl-4 mb-4 text-gray-700">
                <li>
                    Personalized Learning: Tailored content and pacing to suit individual learning
                    styles.
                </li>
                <li>
                    Real-World Application: Practical lessons that you can apply in everyday
                    situations.
                </li>
                <li>
                    Community Engagement: Connect with fellow learners and instructors for support
                    and collaboration.
                </li>
                <li>
                    Continuous Support: Access to instructors and support staff throughout your
                    learning journey.
                </li>
            </ul>
            <p className="text-gray-700">
                Explore our courses and start your language learning adventure today!
            </p>
        </div>
    );
};

export default IntroducePage;
