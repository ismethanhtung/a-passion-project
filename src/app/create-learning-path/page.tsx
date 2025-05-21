"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Book,
    Clock,
    Target,
    User,
    BookOpen,
    Rocket,
    Sparkles,
    LoaderCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const languageLevels = [
    "Beginner (A1)",
    "Elementary (A2)",
    "Intermediate (B1)",
    "Upper Intermediate (B2)",
    "Advanced (C1)",
    "Proficient (C2)",
];

const goalExamples = [
    "Giao tiếp cơ bản cho du lịch",
    "Chuẩn bị cho kỳ thi TOEIC",
    "Đạt trình độ B2 để đi du học",
    "Nâng cao kỹ năng nói chuyên nghiệp",
    "Đọc hiểu tài liệu chuyên ngành",
];

const interests = [
    { value: "business", label: "Kinh doanh" },
    { value: "technology", label: "Công nghệ" },
    { value: "travel", label: "Du lịch" },
    { value: "culture", label: "Văn hóa" },
    { value: "science", label: "Khoa học" },
    { value: "arts", label: "Nghệ thuật" },
    { value: "sports", label: "Thể thao" },
    { value: "education", label: "Giáo dục" },
    { value: "media", label: "Truyền thông" },
    { value: "medicine", label: "Y tế" },
];

const learningPreferences = [
    { value: "visual", label: "Học qua hình ảnh" },
    { value: "auditory", label: "Học qua nghe" },
    { value: "reading", label: "Học qua đọc" },
    { value: "interactive", label: "Học tương tác" },
    { value: "social", label: "Học nhóm" },
];

export default function CreateLearningPathPage() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);

    const [formData, setFormData] = useState({
        goal: "",
        currentLevel: "Beginner (A1)",
        targetLevel: "Intermediate (B1)",
        timeAvailable: "3-5 giờ mỗi tuần",
        interests: [] as string[],
        learningPreference: "",
        specialNeeds: "",
        previousExperience: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleInterestChange = (interest: string) => {
        if (formData.interests.includes(interest)) {
            setFormData({
                ...formData,
                interests: formData.interests.filter(
                    (item) => item !== interest
                ),
            });
        } else {
            setFormData({
                ...formData,
                interests: [...formData.interests, interest],
            });
        }
    };

    const handlePreferenceChange = (preference: string) => {
        setFormData({
            ...formData,
            learningPreference: preference,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (!formData.goal.trim()) {
            setError("Vui lòng nhập mục tiêu học tập của bạn");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Gọi API để tạo lộ trình học tập
            const response = await fetch("/api/learning-path", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Đã xảy ra lỗi khi tạo lộ trình"
                );
            }

            // Điều hướng đến trang lộ trình học tập
            router.push("/learning-paths?tab=personalized");
        } catch (error: any) {
            console.error("Lỗi khi tạo lộ trình:", error);
            setError(error.message || "Đã xảy ra lỗi khi tạo lộ trình");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Tạo Lộ Trình Học Tập Cá Nhân Hóa
                            </h1>
                            <p className="text-blue-100 max-w-2xl">
                                Chúng tôi sẽ tạo lộ trình học tập được cá nhân
                                hóa hoàn toàn dựa trên mục tiêu, trình độ và sở
                                thích của bạn.
                            </p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                            <Sparkles className="h-8 w-8 text-yellow-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Thông tin cơ bản */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Target className="h-5 w-5 mr-2 text-blue-600" />
                                Mục tiêu và trình độ
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="goal"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Mục tiêu học tập của bạn là gì?{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="goal"
                                        name="goal"
                                        rows={3}
                                        value={formData.goal}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: Tôi muốn có thể giao tiếp tự tin khi đi du lịch..."
                                        required
                                    />
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500">
                                            Gợi ý:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {goalExamples.map(
                                                (example, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                goal: example,
                                                            })
                                                        }
                                                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                                    >
                                                        {example}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="currentLevel"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Trình độ hiện tại{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="currentLevel"
                                            name="currentLevel"
                                            value={formData.currentLevel}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            {languageLevels.map((level) => (
                                                <option
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="targetLevel"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Trình độ mong muốn{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="targetLevel"
                                            name="targetLevel"
                                            value={formData.targetLevel}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            {languageLevels.map((level) => (
                                                <option
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thời gian và sở thích */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                Thời gian và sở thích
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="timeAvailable"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Bạn có thể dành bao nhiêu thời gian để
                                        học mỗi tuần?
                                    </label>
                                    <select
                                        id="timeAvailable"
                                        name="timeAvailable"
                                        value={formData.timeAvailable}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="1-2 giờ mỗi tuần">
                                            1-2 giờ mỗi tuần
                                        </option>
                                        <option value="3-5 giờ mỗi tuần">
                                            3-5 giờ mỗi tuần
                                        </option>
                                        <option value="6-10 giờ mỗi tuần">
                                            6-10 giờ mỗi tuần
                                        </option>
                                        <option value="Trên 10 giờ mỗi tuần">
                                            Trên 10 giờ mỗi tuần
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lĩnh vực quan tâm (chọn nhiều mục nếu
                                        muốn)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                        {interests.map((interest) => (
                                            <button
                                                key={interest.value}
                                                type="button"
                                                onClick={() =>
                                                    handleInterestChange(
                                                        interest.label
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    formData.interests.includes(
                                                        interest.label
                                                    )
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                }`}
                                            >
                                                {interest.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bạn thích học theo cách nào?
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                        {learningPreferences.map(
                                            (preference) => (
                                                <button
                                                    key={preference.value}
                                                    type="button"
                                                    onClick={() =>
                                                        handlePreferenceChange(
                                                            preference.label
                                                        )
                                                    }
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        formData.learningPreference ===
                                                        preference.label
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {preference.label}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                Thông tin bổ sung (không bắt buộc)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="specialNeeds"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Bạn có yêu cầu đặc biệt nào không?
                                    </label>
                                    <textarea
                                        id="specialNeeds"
                                        name="specialNeeds"
                                        rows={2}
                                        value={formData.specialNeeds}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: Tôi học tốt hơn với các bài đọc ngắn..."
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="previousExperience"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Kinh nghiệm học ngôn ngữ trước đây
                                    </label>
                                    <textarea
                                        id="previousExperience"
                                        name="previousExperience"
                                        rows={2}
                                        value={formData.previousExperience}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: Tôi đã từng học tiếng Anh 2 năm ở trung tâm..."
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-8 py-3 rounded-lg font-medium text-white flex items-center transition-colors ${
                                    isLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                        Đang tạo lộ trình...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="h-5 w-5 mr-2" />
                                        Tạo lộ trình cá nhân hóa
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
