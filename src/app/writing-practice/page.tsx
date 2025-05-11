"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function WritingPracticePage() {
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">("en");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-extrabold text-gradient mb-4">
                    {selectedLanguage === "en"
                        ? "Master Your Writing Skills"
                        : "Nâng Cao Kỹ Năng Viết"}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {selectedLanguage === "en"
                        ? "Improve your writing abilities with AI-powered feedback and personalized practice sessions."
                        : "Cải thiện khả năng viết của bạn với phản hồi từ AI và các bài tập cá nhân hóa."}
                </p>

                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={() => setSelectedLanguage("en")}
                        className={`px-4 py-2 rounded-full ${
                            selectedLanguage === "en"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setSelectedLanguage("vi")}
                        className={`px-4 py-2 rounded-full ${
                            selectedLanguage === "vi"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        Tiếng Việt
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8 mb-12"
            >
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedLanguage === "en"
                                ? "AI-Powered Writing Evaluation"
                                : "Đánh Giá Bài Viết Bằng AI"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {selectedLanguage === "en"
                                ? "Our advanced AI system analyzes your writing and provides detailed feedback on grammar, vocabulary, structure, and coherence to help you improve your skills."
                                : "Hệ thống AI tiên tiến của chúng tôi phân tích bài viết và đưa ra phản hồi chi tiết về ngữ pháp, từ vựng, cấu trúc và tính mạch lạc để giúp bạn nâng cao kỹ năng."}
                        </p>
                        <Link href="/writing-practice/practice">
                            <Button
                                variant="primary"
                                className="w-full md:w-auto"
                            >
                                {selectedLanguage === "en"
                                    ? "Start Practicing"
                                    : "Bắt Đầu Luyện Tập"}
                            </Button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                                <div className="h-4 bg-blue-100 rounded w-full"></div>
                                <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                                    <div className="h-3 bg-green-100 rounded w-full"></div>
                                    <div className="h-3 bg-red-100 rounded w-full"></div>
                                    <div className="h-3 bg-yellow-100 rounded w-full"></div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="h-6 bg-blue-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-blue-200 rounded-full w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-center mb-8">
                    {selectedLanguage === "en"
                        ? "Key Features"
                        : "Tính Năng Chính"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon="✨"
                        title={
                            selectedLanguage === "en"
                                ? "Detailed Feedback"
                                : "Phản Hồi Chi Tiết"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Get comprehensive analysis of your writing with specific suggestions for improvement."
                                : "Nhận phân tích toàn diện về bài viết với các đề xuất cụ thể để cải thiện."
                        }
                    />
                    <FeatureCard
                        icon="🌍"
                        title={
                            selectedLanguage === "en"
                                ? "Multiple Languages"
                                : "Đa Ngôn Ngữ"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Practice writing in English, Vietnamese, and expand your language abilities."
                                : "Luyện tập viết bằng tiếng Anh, tiếng Việt và mở rộng khả năng ngôn ngữ của bạn."
                        }
                    />
                    <FeatureCard
                        icon="📊"
                        title={
                            selectedLanguage === "en"
                                ? "Progress Tracking"
                                : "Theo Dõi Tiến Độ"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Monitor your improvement over time with detailed statistics and history."
                                : "Theo dõi sự tiến bộ của bạn theo thời gian với thống kê chi tiết và lịch sử."
                        }
                    />
                    <FeatureCard
                        icon="🎯"
                        title={
                            selectedLanguage === "en"
                                ? "Custom Topics"
                                : "Chủ Đề Tùy Chỉnh"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Create personalized writing prompts tailored to your interests and goals."
                                : "Tạo đề bài viết cá nhân hóa phù hợp với sở thích và mục tiêu của bạn."
                        }
                    />
                    <FeatureCard
                        icon="🔄"
                        title={
                            selectedLanguage === "en"
                                ? "Real-time Analysis"
                                : "Phân Tích Thời Gian Thực"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Get instant feedback on your writing as you type, helping you learn faster."
                                : "Nhận phản hồi tức thì về bài viết khi bạn đang gõ, giúp bạn học nhanh hơn."
                        }
                    />
                    <FeatureCard
                        icon="📝"
                        title={
                            selectedLanguage === "en"
                                ? "Skill-focused Practice"
                                : "Luyện Tập Theo Kỹ Năng"
                        }
                        description={
                            selectedLanguage === "en"
                                ? "Target specific areas of improvement with exercises designed to strengthen your skills."
                                : "Nhắm vào các lĩnh vực cụ thể cần cải thiện với các bài tập được thiết kế để nâng cao kỹ năng của bạn."
                        }
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-16 text-center"
            >
                <h2 className="text-2xl font-bold mb-4">
                    {selectedLanguage === "en"
                        ? "Ready to improve your writing?"
                        : "Sẵn sàng cải thiện kỹ năng viết của bạn?"}
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {selectedLanguage === "en"
                        ? "Join thousands of learners who have enhanced their writing skills through our AI-powered platform."
                        : "Tham gia cùng hàng ngàn người học đã nâng cao kỹ năng viết thông qua nền tảng AI của chúng tôi."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/writing-practice/practice">
                        <Button variant="primary" size="large">
                            {selectedLanguage === "en"
                                ? "Start Writing Now"
                                : "Bắt Đầu Viết Ngay"}
                        </Button>
                    </Link>
                    <Link href="/writing-practice/my-writings">
                        <Button variant="outline" size="large">
                            {selectedLanguage === "en"
                                ? "View My Writings"
                                : "Xem Bài Viết Của Tôi"}
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl p-6 shadow-md transition-all"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
}
