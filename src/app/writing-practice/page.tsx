"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    PenTool,
    BookOpen,
    CheckCircle,
    BarChart,
    TrendingUp,
    Users,
    ArrowRight,
    MessageSquare,
    FileText,
    Clock,
    Star,
    Target,
} from "lucide-react";

export default function WritingPracticePage() {
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">("en");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-0 w-full h-full opacity-10 bg-[url('/images/bg-pattern.png')] bg-repeat"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        y: isLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: isLoaded ? 1 : 0,
                                scale: isLoaded ? 1 : 0.9,
                            }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                                <PenTool className="h-4 w-4 mr-2 text-indigo-300" />
                                <span className="text-sm font-medium text-indigo-100">
                                    Writing Practice
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                                {selectedLanguage === "en"
                                    ? "Master Your Writing Skills"
                                    : "Nâng Cao Kỹ Năng Viết"}
                            </h1>

                            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                                {selectedLanguage === "en"
                                    ? "Improve your writing abilities with AI-powered feedback and personalized practice sessions."
                                    : "Cải thiện khả năng viết của bạn với phản hồi từ AI và các bài tập cá nhân hóa."}
                            </p>
                        </motion.div>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Link href="/writing-practice/practice">
                                    <Button
                                        variant="primary"
                                        size="large"
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all py-3 px-8 rounded-xl text-base"
                                    >
                                        {selectedLanguage === "en"
                                            ? "Start Practicing"
                                            : "Bắt Đầu Luyện Tập"}
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Link href="/writing-practice/my-writings">
                                    <Button
                                        variant="secondary"
                                        size="large"
                                        className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm py-3 px-8 rounded-xl text-base"
                                    >
                                        {selectedLanguage === "en"
                                            ? "My Writings"
                                            : "Bài Viết Của Tôi"}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex justify-center mt-6 space-x-4"
                        >
                            <button
                                onClick={() => setSelectedLanguage("en")}
                                className={`px-4 py-2 rounded-full transition-all ${
                                    selectedLanguage === "en"
                                        ? "bg-white text-indigo-800"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setSelectedLanguage("vi")}
                                className={`px-4 py-2 rounded-full transition-all ${
                                    selectedLanguage === "vi"
                                        ? "bg-white text-indigo-800"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                Tiếng Việt
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Key features section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            y: isLoaded ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {selectedLanguage === "en"
                                ? "Key Features"
                                : "Tính Năng Chính"}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {selectedLanguage === "en"
                                ? "Our platform offers a comprehensive set of tools designed to improve your writing skills."
                                : "Nền tảng của chúng tôi cung cấp một bộ công cụ toàn diện được thiết kế để cải thiện kỹ năng viết của bạn."}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: (
                                    <MessageSquare className="h-8 w-8 text-indigo-600" />
                                ),
                                title:
                                    selectedLanguage === "en"
                                        ? "Detailed Feedback"
                                        : "Phản Hồi Chi Tiết",
                                description:
                                    selectedLanguage === "en"
                                        ? "Get comprehensive analysis of your writing with specific suggestions for improvement."
                                        : "Nhận phân tích toàn diện về bài viết với các đề xuất cụ thể để cải thiện.",
                                delay: 0.7,
                            },
                            {
                                icon: (
                                    <Target className="h-8 w-8 text-indigo-600" />
                                ),
                                title:
                                    selectedLanguage === "en"
                                        ? "Personalized Learning"
                                        : "Học Tập Cá Nhân Hóa",
                                description:
                                    selectedLanguage === "en"
                                        ? "Our AI adapts to your skill level and provides customized exercises to help you improve faster."
                                        : "AI của chúng tôi thích ứng với trình độ của bạn và cung cấp các bài tập tùy chỉnh để giúp bạn tiến bộ nhanh hơn.",
                                delay: 0.8,
                            },
                            {
                                icon: (
                                    <BarChart className="h-8 w-8 text-indigo-600" />
                                ),
                                title:
                                    selectedLanguage === "en"
                                        ? "Progress Tracking"
                                        : "Theo Dõi Tiến Độ",
                                description:
                                    selectedLanguage === "en"
                                        ? "Monitor your improvement over time with detailed statistics and performance insights."
                                        : "Theo dõi sự tiến bộ của bạn theo thời gian với thống kê chi tiết và phân tích hiệu suất.",
                                delay: 0.9,
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: feature.delay,
                                }}
                                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="bg-indigo-100 p-3 rounded-xl inline-block mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI-Powered section */}
            <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{
                                opacity: isLoaded ? 1 : 0,
                                x: isLoaded ? 0 : -30,
                            }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="lg:w-1/2"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                {selectedLanguage === "en"
                                    ? "AI-Powered Writing Evaluation"
                                    : "Đánh Giá Bài Viết Bằng AI"}
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                {selectedLanguage === "en"
                                    ? "Our advanced AI system analyzes your writing and provides detailed feedback on grammar, vocabulary, structure, and coherence to help you improve your skills."
                                    : "Hệ thống AI tiên tiến của chúng tôi phân tích bài viết và đưa ra phản hồi chi tiết về ngữ pháp, từ vựng, cấu trúc và tính mạch lạc để giúp bạn nâng cao kỹ năng."}
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    selectedLanguage === "en"
                                        ? "Grammar and spelling corrections"
                                        : "Sửa lỗi ngữ pháp và chính tả",
                                    selectedLanguage === "en"
                                        ? "Vocabulary enhancement suggestions"
                                        : "Đề xuất cải thiện từ vựng",
                                    selectedLanguage === "en"
                                        ? "Structure and coherence analysis"
                                        : "Phân tích cấu trúc và tính mạch lạc",
                                    selectedLanguage === "en"
                                        ? "Style and tone recommendations"
                                        : "Gợi ý về phong cách và giọng điệu",
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/writing-practice/practice">
                                <Button
                                    variant="primary"
                                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                    {selectedLanguage === "en"
                                        ? "Try It Now"
                                        : "Dùng Thử Ngay"}
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{
                                opacity: isLoaded ? 1 : 0,
                                x: isLoaded ? 0 : 30,
                            }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                            className="lg:w-1/2"
                        >
                            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                                <div className="flex items-center mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm text-gray-500 mb-2 font-medium">
                                        Your Essay
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                                        <p className="text-gray-700">
                                            The internet have became an
                                            essential part of modern life. Many
                                            people cannot imagine there day
                                            without using internet for work,
                                            entertainment or communication with
                                            others.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm text-gray-500 mb-2 font-medium">
                                        AI Feedback
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start">
                                            <div className="p-1 bg-red-100 rounded mr-3 mt-0.5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-red-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-red-700">
                                                    Grammar Error
                                                </div>
                                                <p className="text-xs text-red-600">
                                                    "The internet{" "}
                                                    <span className="line-through">
                                                        have
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        has
                                                    </span>{" "}
                                                    <span className="line-through">
                                                        became
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        become
                                                    </span>{" "}
                                                    an essential part..."
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                                            <div className="p-1 bg-blue-100 rounded mr-3 mt-0.5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-blue-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-blue-700">
                                                    Word Choice
                                                </div>
                                                <p className="text-xs text-blue-600">
                                                    "Many people cannot imagine{" "}
                                                    <span className="line-through">
                                                        there
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        their
                                                    </span>{" "}
                                                    day without..."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
                                        <div className="text-xs text-indigo-600 mb-1">
                                            Score
                                        </div>
                                        <div className="text-lg font-bold text-indigo-700">
                                            75/100
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                                        View Full Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Writing topics section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            y: isLoaded ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {selectedLanguage === "en"
                                ? "Available Writing Topics"
                                : "Chủ Đề Viết Hiện Có"}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {selectedLanguage === "en"
                                ? "Practice with a variety of topics suited for different levels and interests."
                                : "Luyện tập với nhiều chủ đề khác nhau phù hợp với các cấp độ và sở thích khác nhau."}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title:
                                    selectedLanguage === "en"
                                        ? "Academic Essays"
                                        : "Luận Văn Học Thuật",
                                description:
                                    selectedLanguage === "en"
                                        ? "Practice formal academic writing skills"
                                        : "Luyện kỹ năng viết học thuật chính thống",
                                count: 42,
                                icon: <BookOpen className="h-6 w-6" />,
                                color: "from-blue-500 to-cyan-400",
                            },
                            {
                                title:
                                    selectedLanguage === "en"
                                        ? "Business Writing"
                                        : "Viết Thương Mại",
                                description:
                                    selectedLanguage === "en"
                                        ? "Emails, reports and business documents"
                                        : "Email, báo cáo và tài liệu kinh doanh",
                                count: 38,
                                icon: <FileText className="h-6 w-6" />,
                                color: "from-emerald-500 to-green-400",
                            },
                            {
                                title:
                                    selectedLanguage === "en"
                                        ? "Creative Writing"
                                        : "Viết Sáng Tạo",
                                description:
                                    selectedLanguage === "en"
                                        ? "Stories, poetry and creative exercises"
                                        : "Truyện, thơ và bài tập sáng tạo",
                                count: 56,
                                icon: <PenTool className="h-6 w-6" />,
                                color: "from-purple-500 to-pink-400",
                            },
                            {
                                title:
                                    selectedLanguage === "en"
                                        ? "IELTS & TOEFL"
                                        : "IELTS & TOEFL",
                                description:
                                    selectedLanguage === "en"
                                        ? "Prepare for international exams"
                                        : "Chuẩn bị cho các kỳ thi quốc tế",
                                count: 64,
                                icon: <Star className="h-6 w-6" />,
                                color: "from-amber-500 to-yellow-400",
                            },
                        ].map((topic, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 1.3 + index * 0.1,
                                }}
                                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100"
                            >
                                <div
                                    className={`p-6 bg-gradient-to-r ${topic.color} text-white`}
                                >
                                    <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
                                        {topic.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">
                                        {topic.title}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-white/80 text-sm">
                                            {topic.description}
                                        </p>
                                        <div className="bg-white/30 px-2 py-1 rounded text-xs font-medium">
                                            {topic.count}{" "}
                                            {selectedLanguage === "en"
                                                ? "topics"
                                                : "chủ đề"}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white">
                                    <Link href="/writing-practice/practice">
                                        <Button
                                            variant="outline"
                                            className="w-full group-hover:bg-gray-50 transition-colors"
                                        >
                                            {selectedLanguage === "en"
                                                ? "Browse Topics"
                                                : "Xem Chủ Đề"}
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            y: isLoaded ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, delay: 1.7 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            {selectedLanguage === "en"
                                ? "Ready to improve your writing skills?"
                                : "Sẵn sàng cải thiện kỹ năng viết của bạn?"}
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                            {selectedLanguage === "en"
                                ? "Join thousands of learners who have enhanced their writing skills through our AI-powered platform."
                                : "Tham gia cùng hàng ngàn người học đã nâng cao kỹ năng viết thông qua nền tảng AI của chúng tôi."}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/writing-practice/practice">
                                <Button
                                    variant="secondary"
                                    size="large"
                                    className="bg-white text-indigo-700 hover:bg-indigo-50 py-3 px-8 shadow-lg hover:shadow-xl transition-all rounded-xl"
                                >
                                    {selectedLanguage === "en"
                                        ? "Start Writing Now"
                                        : "Bắt Đầu Viết Ngay"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
