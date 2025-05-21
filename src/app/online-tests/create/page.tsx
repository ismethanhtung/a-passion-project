"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    PlusCircle,
    MinusCircle,
    HelpCircle,
} from "lucide-react";
import Link from "next/link";
import {
    TestType,
    TestDifficulty,
    SectionType,
} from "@/interfaces/online-test";

type SectionConfig = {
    enabled: boolean;
    parts: number;
    questions: number;
};

type FormData = {
    title: string;
    description: string;
    instructions: string;
    testType: TestType;
    difficulty: TestDifficulty;
    duration: number;
    tags: string;
    sections: {
        [key in SectionType]?: SectionConfig;
    };
    thumbnail?: string;
};

const defaultSections: Record<SectionType, SectionConfig> = {
    listening: { enabled: false, parts: 0, questions: 0 },
    reading: { enabled: false, parts: 0, questions: 0 },
    writing: { enabled: false, parts: 0, questions: 0 },
    speaking: { enabled: false, parts: 0, questions: 0 },
};

const CreateTest = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        instructions: "",
        testType: "TOEIC",
        difficulty: "Intermediate",
        duration: 120,
        tags: "",
        sections: { ...defaultSections },
        thumbnail: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    // Cập nhật trường cơ bản
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Cập nhật trạng thái bật/tắt của section
    const toggleSection = (section: SectionType) => {
        setFormData((prev) => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: {
                    ...prev.sections[section],
                    enabled: !prev.sections[section]?.enabled,
                },
            },
        }));
    };

    // Cập nhật cấu hình của section
    const updateSectionConfig = (
        section: SectionType,
        field: "parts" | "questions",
        value: number
    ) => {
        setFormData((prev) => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: {
                    ...prev.sections[section],
                    [field]: value,
                },
            },
        }));
    };

    // Cấu hình mặc định cho loại bài kiểm tra
    const setDefaultConfigForTestType = (testType: TestType) => {
        if (testType === "TOEIC") {
            setFormData((prev) => ({
                ...prev,
                testType,
                duration: 120,
                sections: {
                    listening: { enabled: true, parts: 4, questions: 100 },
                    reading: { enabled: true, parts: 3, questions: 100 },
                    writing: { enabled: false, parts: 0, questions: 0 },
                    speaking: { enabled: false, parts: 0, questions: 0 },
                },
            }));
        } else if (testType === "IELTS") {
            setFormData((prev) => ({
                ...prev,
                testType,
                duration: 165,
                sections: {
                    listening: { enabled: true, parts: 4, questions: 40 },
                    reading: { enabled: true, parts: 3, questions: 40 },
                    writing: { enabled: true, parts: 2, questions: 2 },
                    speaking: { enabled: true, parts: 3, questions: 3 },
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                testType,
                sections: { ...defaultSections },
            }));
        }
    };

    const handleTestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTestType = e.target.value as TestType;
        setDefaultConfigForTestType(newTestType);
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (
                !formData.title ||
                !formData.description ||
                !formData.testType
            ) {
                setError("Vui lòng điền đầy đủ thông tin cơ bản");
                return false;
            }
        } else if (currentStep === 2) {
            // Kiểm tra ít nhất một section được bật
            const hasEnabledSection = Object.values(formData.sections).some(
                (section) => section?.enabled
            );
            if (!hasEnabledSection) {
                setError("Vui lòng bật ít nhất một phần cho bài kiểm tra");
                return false;
            }
        }
        setError("");
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate final step
        if (!validateStep(step)) return;

        try {
            setLoading(true);
            setError("");

            // Lọc sections để chỉ bao gồm những section được bật
            const enabledSections: Record<string, any> = {};
            Object.entries(formData.sections).forEach(([key, value]) => {
                if (value.enabled) {
                    enabledSections[key] = {
                        parts: value.parts,
                        questions: value.questions,
                    };
                }
            });

            // Chuẩn bị dữ liệu gửi lên server
            const requestData = {
                ...formData,
                sections: enabledSections,
            };

            // Gọi API tạo bài kiểm tra
            const response = await fetch("/api/online-tests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Lỗi khi tạo bài kiểm tra");
            }

            const data = await response.json();

            // Chuyển hướng đến trang thêm câu hỏi cho bài kiểm tra
            router.push(`/online-tests/${data.id}/edit`);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
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
                <h1 className="text-2xl font-bold">Tạo bài kiểm tra mới</h1>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex space-x-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                step >= 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            1
                        </div>
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                step >= 2
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            2
                        </div>
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                step >= 3
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            3
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {step === 1
                            ? "Thông tin cơ bản"
                            : step === 2
                            ? "Cấu trúc bài kiểm tra"
                            : "Hoàn tất"}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Thông tin cơ bản */}
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4 md:col-span-2">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Tiêu đề bài kiểm tra{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mô tả{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    rows={4}
                                    required
                                ></textarea>
                            </div>
                        </div>

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
                                onChange={handleTestTypeChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                required
                            >
                                <option value="TOEIC">TOEIC</option>
                                <option value="IELTS">IELTS</option>
                                <option value="Placement">Placement</option>
                                <option value="General">General</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Loại bài kiểm tra sẽ quyết định cấu trúc mặc
                                định của bài.
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
                                <option value="Intermediate">
                                    Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="duration"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Thời gian làm bài (phút){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tags"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tags (phân cách bằng dấu phẩy)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                placeholder="TOEIC, Speaking, Business..."
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="thumbnail"
                                className="block text-sm font-medium text-gray-700"
                            >
                                URL hình ảnh đại diện
                            </label>
                            <input
                                type="text"
                                id="thumbnail"
                                name="thumbnail"
                                value={formData.thumbnail || ""}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="instructions"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Hướng dẫn làm bài
                            </label>
                            <textarea
                                id="instructions"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                rows={4}
                                placeholder="Nhập hướng dẫn chi tiết cho người làm bài..."
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* Step 2: Cấu trúc bài kiểm tra */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h3 className="mb-4 text-lg font-semibold">
                                Cấu trúc bài kiểm tra
                            </h3>
                            <p className="mb-4 text-sm text-gray-600">
                                Chọn các phần cần có trong bài kiểm tra và thiết
                                lập số lượng phần (parts) và câu hỏi cho từng
                                phần.
                            </p>

                            {/* Listening Section */}
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-md font-medium">
                                        Phần Listening
                                    </h4>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                formData.sections.listening
                                                    ?.enabled
                                            }
                                            onChange={() =>
                                                toggleSection("listening")
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                    </label>
                                </div>

                                {formData.sections.listening?.enabled && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Số phần (parts)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.listening
                                                        ?.parts
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "listening",
                                                        "parts",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tổng số câu hỏi
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.listening
                                                        ?.questions
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "listening",
                                                        "questions",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reading Section */}
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-md font-medium">
                                        Phần Reading
                                    </h4>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                formData.sections.reading
                                                    ?.enabled
                                            }
                                            onChange={() =>
                                                toggleSection("reading")
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                    </label>
                                </div>

                                {formData.sections.reading?.enabled && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Số phần (parts)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.reading
                                                        ?.parts
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "reading",
                                                        "parts",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tổng số câu hỏi
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.reading
                                                        ?.questions
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "reading",
                                                        "questions",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Writing Section - Optional */}
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-md font-medium">
                                        Phần Writing (viết)
                                    </h4>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                formData.sections.writing
                                                    ?.enabled
                                            }
                                            onChange={() =>
                                                toggleSection("writing")
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                    </label>
                                </div>

                                {formData.sections.writing?.enabled && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Số phần (parts)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.writing
                                                        ?.parts
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "writing",
                                                        "parts",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tổng số câu hỏi
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.writing
                                                        ?.questions
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "writing",
                                                        "questions",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Speaking Section - Optional */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-md font-medium">
                                        Phần Speaking (nói)
                                    </h4>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                formData.sections.speaking
                                                    ?.enabled
                                            }
                                            onChange={() =>
                                                toggleSection("speaking")
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                    </label>
                                </div>

                                {formData.sections.speaking?.enabled && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Số phần (parts)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.speaking
                                                        ?.parts
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "speaking",
                                                        "parts",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tổng số câu hỏi
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    formData.sections.speaking
                                                        ?.questions
                                                }
                                                onChange={(e) =>
                                                    updateSectionConfig(
                                                        "speaking",
                                                        "questions",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Xem lại và tạo */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                            <h3 className="mb-4 text-lg font-semibold">
                                Thông tin bài kiểm tra
                            </h3>

                            <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Tiêu đề
                                    </p>
                                    <p className="text-md mt-1 font-medium">
                                        {formData.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Loại bài kiểm tra
                                    </p>
                                    <p className="text-md mt-1 font-medium">
                                        {formData.testType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Độ khó
                                    </p>
                                    <p className="text-md mt-1 font-medium">
                                        {formData.difficulty}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Thời gian
                                    </p>
                                    <p className="text-md mt-1 font-medium">
                                        {formData.duration} phút
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">
                                        Mô tả
                                    </p>
                                    <p className="text-md mt-1">
                                        {formData.description}
                                    </p>
                                </div>
                            </div>

                            <h4 className="mb-3 text-md font-medium">
                                Cấu trúc bài kiểm tra
                            </h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {Object.entries(formData.sections).map(
                                    ([key, value]) => {
                                        if (!value?.enabled) return null;
                                        return (
                                            <div
                                                key={key}
                                                className="rounded-lg border border-gray-200 bg-white p-4"
                                            >
                                                <h5 className="mb-2 text-lg font-medium capitalize">
                                                    {key}
                                                </h5>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">
                                                        {value.parts}
                                                    </span>{" "}
                                                    phần
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">
                                                        {value.questions}
                                                    </span>{" "}
                                                    câu hỏi
                                                </p>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
                            <div className="flex">
                                <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">
                                        Thông tin quan trọng
                                    </p>
                                    <p className="mt-1 text-sm">
                                        Sau khi tạo bài kiểm tra, bạn sẽ được
                                        chuyển đến trang thêm câu hỏi. Bạn cần
                                        thêm các câu hỏi trước khi có thể xuất
                                        bản bài kiểm tra.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Tiếp theo
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        className="mr-2 h-4 w-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : (
                                <span className="inline-flex items-center">
                                    <Save className="mr-2 h-4 w-4" />
                                    Tạo bài kiểm tra
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateTest;
