"use client";

import React, { useState, useEffect } from "react";
import { WritingService, WritingTopic } from "@/lib/writing/writing-service";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function PracticePage() {
    const [step, setStep] = useState<"select-topic" | "writing" | "feedback">(
        "select-topic"
    );
    const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(
        null
    );
    const [topics, setTopics] = useState<WritingTopic[]>([]);
    const [customDescription, setCustomDescription] = useState("");
    const [customLevel, setCustomLevel] = useState<
        "beginner" | "intermediate" | "advanced"
    >("intermediate");
    const [isCustom, setIsCustom] = useState(false);
    const [writingContent, setWritingContent] = useState("");
    const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [wordCount, setWordCount] = useState(0);

    const writingService = WritingService.getInstance();

    // Lấy danh sách chủ đề
    useEffect(() => {
        // Lấy 6 chủ đề ngẫu nhiên để hiển thị
        const randomTopics: WritingTopic[] = [];
        for (let i = 0; i < 6; i++) {
            const topic = writingService.getRandomTopic();
            // Tránh trùng lặp
            if (!randomTopics.some((t) => t.id === topic.id)) {
                randomTopics.push(topic);
            }
        }
        setTopics(randomTopics);
    }, []);

    // Tính số từ
    useEffect(() => {
        const words =
            writingContent.trim() === ""
                ? 0
                : writingContent.trim().split(/\s+/).length;
        setWordCount(words);
    }, [writingContent]);

    // Đếm ngược thời gian
    useEffect(() => {
        if (
            step === "writing" &&
            selectedTopic?.timeLimit &&
            timeLeft === null
        ) {
            setTimeLeft(selectedTopic.timeLimit * 60); // Chuyển phút thành giây
        }

        if (timeLeft !== null && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, step, selectedTopic]);

    const handleSelectTopic = (topic: WritingTopic) => {
        setSelectedTopic(topic);
        setStep("writing");
    };

    const handleCreateCustomTopic = async () => {
        if (!customDescription) return;

        setIsGeneratingTopic(true);
        try {
            const newTopic = await writingService.createCustomTopic(
                customDescription,
                customLevel
            );
            setSelectedTopic(newTopic);
            setStep("writing");
        } catch (error) {
            console.error("Error creating custom topic:", error);
        } finally {
            setIsGeneratingTopic(false);
        }
    };

    const handleSubmitWriting = () => {
        if (!selectedTopic || !writingContent.trim()) return;

        // Lưu bài viết
        writingService.saveWritingResponse(
            writingContent,
            selectedTopic.prompt
        );

        // Chuyển sang bước nhận feedback
        setStep("feedback");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {step === "select-topic" && (
                <div>
                    <h1 className="text-3xl font-bold text-center mb-8">
                        Chọn chủ đề viết
                    </h1>

                    <div className="flex justify-center mb-8">
                        <div className="flex space-x-4">
                            <Button
                                variant={!isCustom ? "primary" : "outline"}
                                onClick={() => setIsCustom(false)}
                            >
                                Chủ đề có sẵn
                            </Button>
                            <Button
                                variant={isCustom ? "primary" : "outline"}
                                onClick={() => setIsCustom(true)}
                            >
                                Tạo chủ đề mới
                            </Button>
                        </div>
                    </div>

                    {!isCustom ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-white rounded-lg shadow p-6 hover:shadow-md cursor-pointer transition-shadow"
                                    onClick={() => handleSelectTopic(topic)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">
                                            {topic.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${
                                                topic.level === "beginner"
                                                    ? "bg-green-100 text-green-800"
                                                    : topic.level ===
                                                      "intermediate"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {topic.level === "beginner"
                                                ? "Cơ bản"
                                                : topic.level === "intermediate"
                                                ? "Trung cấp"
                                                : "Nâng cao"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {topic.description}
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        <div className="flex items-center mb-1">
                                            <span className="mr-2">🕒</span>
                                            <span>
                                                Thời gian: {topic.timeLimit}{" "}
                                                phút
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">📏</span>
                                            <span>
                                                Số từ: {topic.wordCount?.min} -{" "}
                                                {topic.wordCount?.max}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Tạo chủ đề tùy chỉnh
                            </h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả chủ đề
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Ví dụ: Viết về vai trò của công nghệ trong giáo dục hiện đại"
                                    value={customDescription}
                                    onChange={(e) =>
                                        setCustomDescription(e.target.value)
                                    }
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cấp độ
                                </label>
                                <div className="flex space-x-4">
                                    {[
                                        "beginner",
                                        "intermediate",
                                        "advanced",
                                    ].map((level) => (
                                        <div
                                            key={level}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="radio"
                                                id={level}
                                                name="level"
                                                checked={customLevel === level}
                                                onChange={() =>
                                                    setCustomLevel(level as any)
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={level}
                                                className="ml-2 text-sm text-gray-700"
                                            >
                                                {level === "beginner"
                                                    ? "Cơ bản"
                                                    : level === "intermediate"
                                                    ? "Trung cấp"
                                                    : "Nâng cao"}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleCreateCustomTopic}
                                    disabled={
                                        !customDescription || isGeneratingTopic
                                    }
                                >
                                    {isGeneratingTopic
                                        ? "Đang tạo..."
                                        : "Tạo chủ đề"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === "writing" && selectedTopic && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/writing-practice/practice">
                            <Button variant="outline" size="small">
                                ← Quay lại
                            </Button>
                        </Link>
                        <div className="flex items-center">
                            {timeLeft !== null && (
                                <div
                                    className={`mr-4 text-lg font-semibold ${
                                        timeLeft < 60 ? "text-red-600" : ""
                                    }`}
                                >
                                    {Math.floor(timeLeft / 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    :
                                    {(timeLeft % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                </div>
                            )}
                            <Button
                                onClick={handleSubmitWriting}
                                disabled={!writingContent.trim()}
                            >
                                Nộp bài
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            {selectedTopic.title}
                        </h1>
                        <div className="flex items-center mb-4">
                            <span
                                className={`px-2 py-1 text-xs rounded mr-2 ${
                                    selectedTopic.level === "beginner"
                                        ? "bg-green-100 text-green-800"
                                        : selectedTopic.level === "intermediate"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {selectedTopic.level === "beginner"
                                    ? "Cơ bản"
                                    : selectedTopic.level === "intermediate"
                                    ? "Trung cấp"
                                    : "Nâng cao"}
                            </span>
                            <span className="text-sm text-gray-500">
                                Thể loại: {selectedTopic.category}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <p className="text-gray-700">
                                {selectedTopic.prompt}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center justify-between">
                            <div>
                                <span className="mr-1">📏</span>
                                <span>
                                    Yêu cầu số từ:{" "}
                                    {selectedTopic.wordCount?.min} -{" "}
                                    {selectedTopic.wordCount?.max}
                                </span>
                            </div>
                            <div>
                                <span className="mr-1">🕒</span>
                                <span>
                                    Thời gian: {selectedTopic.timeLimit} phút
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex justify-end">
                        <div
                            className={`text-sm ${
                                wordCount < (selectedTopic.wordCount?.min || 0)
                                    ? "text-red-600"
                                    : wordCount >
                                      (selectedTopic.wordCount?.max || 0)
                                    ? "text-orange-600"
                                    : "text-green-600"
                            }`}
                        >
                            Số từ: {wordCount} / {selectedTopic.wordCount?.min}{" "}
                            - {selectedTopic.wordCount?.max}
                        </div>
                    </div>

                    <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={15}
                        placeholder="Viết bài của bạn ở đây..."
                        value={writingContent}
                        onChange={(e) => setWritingContent(e.target.value)}
                    ></textarea>
                </div>
            )}

            {step === "feedback" && selectedTopic && (
                <div>
                    <Link
                        href="/writing-practice/feedback"
                        className="block w-full"
                    >
                        <Button className="w-full py-3 text-lg">
                            Xem đánh giá bài viết
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
