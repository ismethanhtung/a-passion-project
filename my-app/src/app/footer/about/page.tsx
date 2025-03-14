import React from "react";

const AboutPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-6 mt-10 py-12 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold mb-4">About Us</h1>
            <p className="text-gray-700 mb-4">
                Welcome to Language Mastery, your one-stop destination for learning new languages
                through comprehensive and engaging courses. Our mission is to make language learning
                accessible, fun, and effective for everyone, regardless of their background or
                learning style.
            </p>
            <p className="text-gray-700 mb-4">
                Our Story: Language Mastery was founded in 2015 by a group of language enthusiasts
                who believed that learning a new language should be an enjoyable and rewarding
                experience. Starting from a small team, we have grown to become a leading platform
                in online language education, serving thousands of students worldwide.
            </p>
            <p className="text-gray-700 mb-4">
                Our Mission: At Language Mastery, we are committed to empowering individuals to
                communicate effectively in multiple languages. We achieve this by providing
                high-quality, interactive courses that cater to various proficiency levels and
                learning preferences.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us:</h2>
            <ul className="list-disc pl-4 mb-4 text-gray-700">
                <li>
                    Expert Instructors: Our courses are taught by experienced language teachers and
                    native speakers who bring real-world insights and practical knowledge.
                </li>
                <li>
                    Interactive Learning: We use a blend of video lessons, quizzes, and interactive
                    exercises to keep learners engaged and motivated.
                </li>
                <li>
                    Flexible Scheduling: Our courses are designed to fit into any schedule, allowing
                    learners to study at their own pace.
                </li>
                <li>
                    Community Support: Join our vibrant community of learners and instructors to
                    share experiences, ask questions, and get support.
                </li>
                <li>
                    Continuous Updates: We regularly update our courses to ensure they remain
                    relevant and aligned with the latest teaching methodologies.
                </li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Contact Us:</h2>
            <p className="text-gray-700 mb-2">Email: info@languagemastery.com</p>
            <p className="text-gray-700 mb-2">Phone: +1 (123) 456-7890</p>
            <p className="text-gray-700">Social Media: Facebook, Twitter, Instagram</p>
        </div>
    );
};

export default AboutPage;
