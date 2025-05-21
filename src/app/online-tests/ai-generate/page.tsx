"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BrainCircuit,
    SparkleIcon,
    HelpCircle,
    CheckCircle2,
    CircleSlash,
    Lightbulb,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { TestType, TestDifficulty } from "@/interfaces/online-test";

type FormData = {
    testType: TestType;
    difficulty: TestDifficulty;
    isFullTest: boolean;
    specificSections: string[];
    specificTopics: string[];
};

const AiGenerateTest = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        testType: "TOEIC",
        difficulty: "Intermediate",
        isFullTest: true,
        specificSections: [],
        specificTopics: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    const [success, setSuccess] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [createdTestId, setCreatedTestId] = useState<number | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(false);

    // Kiểm tra trạng thái bài kiểm tra mới tạo
    useEffect(() => {
        if (!createdTestId) return;

        const checkTestStatus = async () => {
            try {
                setCheckingStatus(true);

                // Chờ 2 giây trước khi kiểm tra để cho phép server xử lý
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const response = await fetch(
                    `/api/online-tests/${createdTestId}/status`
                );

                if (response.ok) {
                    const statusData = await response.json();
                    console.log("Test status:", statusData);

                    if (statusData.isReady) {
                        setSuccess(
                            `Bài kiểm tra "${statusData.title}" đã được tạo thành công với ${statusData.questionCount} câu hỏi!`
                        );

                        // Chuyển hướng sau 2 giây
                        setTimeout(() => {
                            router.push(`/online-tests/${createdTestId}`);
                        }, 2000);
                    } else {
                        // Nếu chưa sẵn sàng, kiểm tra lại sau 3 giây
                        setTimeout(checkTestStatus, 3000);
                    }
                } else {
                    // Nếu không tìm thấy, có thể đã có lỗi
                    throw new Error(
                        "Không thể kiểm tra trạng thái bài kiểm tra"
                    );
                }
            } catch (error) {
                console.error("Error checking test status:", error);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkTestStatus();
    }, [createdTestId, router]);

    // Cập nhật các trường cơ bản
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Cập nhật trường isFullTest
    const handleTestTypeChange = (isFullTest: boolean) => {
        setFormData((prev) => ({ ...prev, isFullTest }));
    };

    // Cập nhật các mục section được chọn
    const handleSectionChange = (section: string) => {
        setFormData((prev) => {
            const sections = [...prev.specificSections];
            if (sections.includes(section)) {
                const filtered = sections.filter((s) => s !== section);
                return { ...prev, specificSections: filtered };
            } else {
                return { ...prev, specificSections: [...sections, section] };
            }
        });
    };

    // Thêm topic
    const addTopic = () => {
        if (
            topicInput.trim() &&
            !formData.specificTopics.includes(topicInput.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                specificTopics: [...prev.specificTopics, topicInput.trim()],
            }));
            setTopicInput("");
        }
    };

    // Xóa topic
    const removeTopic = (topic: string) => {
        setFormData((prev) => ({
            ...prev,
            specificTopics: prev.specificTopics.filter((t) => t !== topic),
        }));
    };

    // Xử lý khi nhấn Enter trong input topic
    const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTopic();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setErrorDetails("");
            setSuccess("");
            setCreatedTestId(null);

            // Kiểm tra nếu là mini test và không có section nào được chọn
            if (
                !formData.isFullTest &&
                formData.specificSections.length === 0
            ) {
                setError("Vui lòng chọn ít nhất một phần cho mini test");
                return;
            }

            // Thông báo cho người dùng biết quá trình có thể mất thời gian
            setSuccess(
                "Đang tạo bài kiểm tra bằng AI, quá trình này có thể mất từ 30-60 giây..."
            );

            // Gọi API để tạo bài kiểm tra với AI
            const response = await fetch("/api/online-tests/ai-generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Lỗi khi tạo bài kiểm tra");
            }

            // Lưu ID bài kiểm tra mới tạo để kiểm tra trạng thái
            setCreatedTestId(data.id);
            setSuccess(
                `Bài kiểm tra "${data.title}" đang được tạo. Chờ một chút để hoàn thành câu hỏi...`
            );
        } catch (err: any) {
            setSuccess("");
            setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
            // Hiển thị chi tiết lỗi nếu có
            if (
                err.message &&
                err.message.includes("Failed to parse AI response")
            ) {
                setErrorDetails(
                    "Trí tuệ nhân tạo không thể tạo bài kiểm tra phù hợp. Vui lòng thử lại với các tùy chọn khác hoặc thử lại sau."
                );
            } else if (
                err.message &&
                err.message.includes("Invalid test format")
            ) {
                setErrorDetails(
                    "Định dạng bài kiểm tra được tạo không đúng. Vui lòng thử lại hoặc chọn loại bài kiểm tra khác."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Các section có sẵn theo loại bài kiểm tra
    const availableSections = {
        TOEIC: ["listening", "reading"],
        IELTS: ["listening", "reading", "writing", "speaking"],
    };

    // Topic suggestions dựa trên loại bài kiểm tra
    const topicSuggestions = {
        TOEIC: [
            "Business",
            "Office",
            "Marketing",
            "Travel",
            "Technology",
            "Health",
            "Entertainment",
            "Environment",
            "Finance",
            "Education",
        ],
        IELTS: [
            "Education",
            "Environment",
            "Technology",
            "Health",
            "Globalization",
            "Arts",
            "Tourism",
            "Society",
            "Urban Planning",
            "Family",
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center">
                <Link
                    href="/online-tests"
                    className="mr-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold">Tạo bài kiểm tra bằng AI</h1>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                    <div className="flex">
                        <CircleSlash className="h-5 w-5 mr-2 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{error}</p>
                            {errorDetails && (
                                <p className="mt-1 text-sm">{errorDetails}</p>
                            )}
                            <p className="mt-2 text-sm">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-red-600 underline hover:text-red-800"
                                >
                                    Thử lại
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
                    <div className="flex">
                        {loading ? (
                            <Loader2 className="h-5 w-5 mr-2 flex-shrink-0 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                        )}
                        <span>{success}</span>
                    </div>
                </div>
            )}

            <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-indigo-800">
                <div className="flex">
                    <BrainCircuit className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                        <p className="font-medium">
                            Tạo bài kiểm tra với trí tuệ nhân tạo
                        </p>
                        <p className="mt-1 text-sm">
                            Hệ thống AI sẽ tự động tạo bài kiểm tra với nội dung
                            chất lượng cao, phù hợp với loại bài thi và độ khó
                            bạn chọn. Quá trình tạo bài có thể mất từ 30 giây
                            đến 1 phút.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="testType"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Loại bài kiểm tra{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="testType"
                            name="testType"
                            value={formData.testType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            required
                        >
                            <option value="TOEIC">TOEIC</option>
                            <option value="IELTS">IELTS</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Loại bài kiểm tra sẽ quyết định cấu trúc và nội dung
                            được tạo.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="difficulty"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Độ khó <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            required
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                        Cấu trúc bài kiểm tra
                    </h3>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div
                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                formData.isFullTest
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-300 bg-white hover:border-indigo-300"
                            }`}
                            onClick={() => handleTestTypeChange(true)}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${
                                        formData.isFullTest
                                            ? "bg-indigo-500 text-white"
                                            : "border border-gray-400"
                                    }`}
                                >
                                    {formData.isFullTest && (
                                        <span className="text-xs">✓</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium">Full Test</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Bài kiểm tra đầy đủ với tất cả các phần
                                        theo định dạng chuẩn
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                !formData.isFullTest
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-300 bg-white hover:border-indigo-300"
                            }`}
                            onClick={() => handleTestTypeChange(false)}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${
                                        !formData.isFullTest
                                            ? "bg-indigo-500 text-white"
                                            : "border border-gray-400"
                                    }`}
                                >
                                    {!formData.isFullTest && (
                                        <span className="text-xs">✓</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium">Mini Test</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Bài kiểm tra rút gọn, chỉ tập trung vào
                                        những phần bạn chọn
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!formData.isFullTest && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn các phần muốn bao gồm trong bài kiểm tra{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {availableSections[
                                    formData.testType as keyof typeof availableSections
                                ].map((section) => (
                                    <div
                                        key={section}
                                        className={`cursor-pointer rounded-md border p-3 text-center transition-colors ${
                                            formData.specificSections.includes(
                                                section
                                            )
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                                                : "border-gray-300 hover:border-indigo-300"
                                        }`}
                                        onClick={() =>
                                            handleSectionChange(section)
                                        }
                                    >
                                        <span className="capitalize">
                                            {section}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {formData.specificSections.length === 0 && (
                                <p className="mt-2 text-xs text-orange-600">
                                    Vui lòng chọn ít nhất một phần
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <div className="flex items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            Chủ đề bài kiểm tra
                        </h3>
                        <div className="ml-2 group relative">
                            <HelpCircle className="h-5 w-5 text-gray-400" />
                            <div className="absolute left-full top-0 ml-2 w-64 rounded-md bg-gray-800 p-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                Nếu bạn không chỉ định chủ đề, AI sẽ tự chọn chủ
                                đề phù hợp.
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={handleTopicKeyDown}
                                placeholder="Nhập chủ đề và nhấn Enter"
                                className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addTopic}
                                className="inline-flex items-center rounded-r-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Thêm
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Thêm các chủ đề cụ thể bạn muốn đưa vào bài kiểm
                            tra. Có thể để trống nếu không có yêu cầu đặc biệt.
                        </p>
                    </div>

                    {formData.specificTopics.length > 0 && (
                        <div className="mb-4">
                            <h4 className="mb-2 text-sm font-medium text-gray-700">
                                Các chủ đề đã chọn:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {formData.specificTopics.map((topic, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                                    >
                                        {topic}
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(topic)}
                                            className="ml-1.5 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                            Gợi ý chủ đề:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {topicSuggestions[
                                formData.testType as keyof typeof topicSuggestions
                            ].map((topic, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        if (
                                            !formData.specificTopics.includes(
                                                topic
                                            )
                                        ) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                specificTopics: [
                                                    ...prev.specificTopics,
                                                    topic,
                                                ],
                                            }));
                                        }
                                    }}
                                    className={`rounded-full px-3 py-1 text-sm ${
                                        formData.specificTopics.includes(topic)
                                            ? "bg-indigo-100 text-indigo-800 opacity-50"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                    disabled={formData.specificTopics.includes(
                                        topic
                                    )}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="inline-flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                AI đang tạo bài kiểm tra...
                            </span>
                        ) : (
                            <span className="inline-flex items-center">
                                <SparkleIcon className="mr-2 h-4 w-4" />
                                Tạo bài kiểm tra bằng AI
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AiGenerateTest;
