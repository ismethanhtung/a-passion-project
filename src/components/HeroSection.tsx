import React, { useState } from "react";
import {
    ArrowRight,
    Play,
    Languages,
    CheckCircle,
    Award,
    Globe,
    ChevronDown,
    Mic,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    const languages = [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 md:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHoiIC8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

                {/* Simplified gradient elements */}
                <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform">
                    <div className="h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/30 to-blue-400/30 blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 transform">
                    <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-purple-400/20 to-blue-500/20 blur-3xl"></div>
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 text-center lg:text-left fade-in-up">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                                <span className="relative flex h-3 w-3 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                </span>
                                Explore a New Era of Language Mastery
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight text-gray-900 fade-in-up">
                            Master{" "}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                    languages
                                </span>
                                <span className="absolute top-16 left-0 h-1 w-full bg-gradient-to-r from-purple-600 to-blue-500 animate-expand-line"></span>
                            </span>{" "}
                            with Passion & Precision
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed fade-in-up">
                            Embark on a transformative journey with AI-powered,
                            personalized lessons crafted to make you fluent in
                            any language. Your adventure starts here.
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 fade-in-up">
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg py-2.5 px-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90"
                            >
                                Start Learning Now{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center border-2 border-purple-600 text-purple-600 rounded-lg py-2 px-6 text-base font-medium hover:bg-purple-50 transition-all duration-300"
                            >
                                <Play className="mr-2 h-4 w-4" /> Watch Demo
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-8 fade-in-up">
                            {[
                                { value: "50+", label: "Languages" },
                                { value: "10M+", label: "Learners" },
                                { value: "5K+", label: "Courses" },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex items-center hover:-translate-y-1 transition-transform duration-300"
                                >
                                    <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="ml-2 text-sm text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Illustration Card */}
                    <div className="relative hidden lg:block fade-in-right px-8">
                        {/* Decorative elements with simple animations */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full animate-float"></div>
                        <div className="absolute -bottom-8 -right-4 w-20 h-20 bg-blue-400/20 rounded-full animate-float-delay"></div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg backdrop-blur-lg transition-all duration-500 hover:shadow-xl border border-gray-100/50 hover:-translate-y-1">
                            <div className="relative z-10">
                                <div className="absolute -top-20 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl"></div>

                                <div className="flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-300">
                                    <div className="h-20 w-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                                        <Globe className="h-10 w-10 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                    Immersive Language Journey
                                </h3>

                                {/* Feature grid with improved styling */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[
                                        {
                                            icon: (
                                                <Award className="h-5 w-5 text-purple-600" />
                                            ),
                                            text: "Certified Instructors",
                                            description:
                                                "Learn from qualified teachers",
                                        },
                                        {
                                            icon: (
                                                <Languages className="h-5 w-5 text-blue-500" />
                                            ),
                                            text: "Native Speakers",
                                            description:
                                                "Authentic pronunciation",
                                        },
                                        {
                                            icon: (
                                                <CheckCircle className="h-5 w-5 text-orange-500" />
                                            ),
                                            text: "Proven Methods",
                                            description:
                                                "Research-based learning",
                                        },
                                        {
                                            icon: (
                                                <Play className="h-5 w-5 text-green-500" />
                                            ),
                                            text: "Interactive Lessons",
                                            description: "Engage and practice",
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                        >
                                            <div className="flex items-center mb-2">
                                                <div className="mr-2 p-2 rounded-full bg-white shadow">
                                                    {item.icon}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {item.text}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 pl-8">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Assistant Chat Preview */}
                                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mr-2">
                                                <span className="text-white font-bold">
                                                    AI
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-800">
                                                    AI Language Coach
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Always Online
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                            Live
                                        </span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 mb-3">
                                        Hey there! Ready to practice your{" "}
                                        {selectedLanguage} skills with me?
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <Link
                                            href="/chat"
                                            className="flex justify-center items-center bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                                        >
                                            Start Chatting Now
                                        </Link>
                                        <Link
                                            href="/pronunciation"
                                            className="flex justify-center items-center bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                                        >
                                            <Mic className="mr-1 h-4 w-4" />
                                            Practice Pronunciation
                                        </Link>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                <div className="absolute -right-8 bottom-24 bg-white rounded-xl p-3 shadow-lg animate-float">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-6 rounded-full mx-0.5 ${
                                                        i === 4
                                                            ? "bg-gray-200"
                                                            : "bg-purple-600"
                                                    }`}
                                                ></div>
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            Day 3 Streak
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
