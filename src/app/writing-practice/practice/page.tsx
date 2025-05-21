"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { WritingService, WritingTopic } from "@/lib/writing/writing-service";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Định nghĩa các bước trong quá trình luyện tập
type WritingStep = "select-topic" | "writing" | "submitting";

export default function PracticePage() {
    const router = useRouter();
    const [step, setStep] = useState<WritingStep>("select-topic");
    const [topics, setTopics] = useState<WritingTopic[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">("en");
    const [selectedLevel, setSelectedLevel] = useState<
        "beginner" | "intermediate" | "advanced"
    >("intermediate");
    const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(
        null
    );
    const [customDescription, setCustomDescription] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [writingContent, setWritingContent] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [wordCount, setWordCount] = useState(0);
    const [isTimerVisible, setIsTimerVisible] = useState(true);
    const writingService = useRef(WritingService.getInstance());
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Lấy chủ đề dựa trên ngôn ngữ và cấp độ
    useEffect(() => {
        const topics = writingService.current.getTopics(
            selectedLevel,
            undefined,
            selectedLanguage
        );
        setTopics(topics);
    }, [selectedLanguage, selectedLevel]);

    // Tính toán số từ khi nội dung thay đổi
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

        let timer: NodeJS.Timeout;
        if (timeLeft !== null && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            toast.error(
                selectedLanguage === "en"
                    ? "Time's up! Please submit your writing now."
                    : "Hết giờ! Vui lòng nộp bài viết ngay."
            );
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timeLeft, step, selectedTopic, selectedLanguage]);

    // Focus vào textarea khi chuyển sang bước writing
    useEffect(() => {
        if (step === "writing" && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [step]);

    // Xử lý chọn chủ đề
    const handleSelectTopic = (topic: WritingTopic) => {
        setSelectedTopic(topic);
        setStep("writing");
        setTimeLeft(null); // Reset timer
    };

    // Xử lý tạo chủ đề tùy chỉnh
    const handleCreateCustomTopic = async () => {
        if (customDescription.trim().length < 10) {
            toast.error(
                selectedLanguage === "en"
                    ? "Please enter a more detailed description"
                    : "Vui lòng nhập mô tả chi tiết hơn"
            );
            return;
        }

        setIsLoading(true);
        try {
            const newTopic = await writingService.current.createCustomTopic(
                customDescription,
                selectedLevel,
                selectedLanguage
            );
            setSelectedTopic(newTopic);
            setStep("writing");
            setTimeLeft(null); // Reset timer
        } catch (error) {
            console.error("Error creating custom topic:", error);
            toast.error(
                selectedLanguage === "en"
                    ? "Failed to create custom topic. Please try again."
                    : "Không thể tạo chủ đề tùy chỉnh. Vui lòng thử lại."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý nộp bài viết
    const handleSubmitWriting = async () => {
        if (!selectedTopic || writingContent.trim().length < 50) {
            toast.error(
                selectedLanguage === "en"
                    ? "Your writing is too short. Please write more before submitting."
                    : "Bài viết của bạn quá ngắn. Vui lòng viết thêm trước khi nộp."
            );
            return;
        }

        setStep("submitting");
        try {
            // Lưu bài viết vào localStorage
            const writingResponse = writingService.current.saveWritingResponse(
                writingContent,
                selectedTopic.id,
                selectedTopic.prompt,
                selectedLanguage
            );

            // Chuyển hướng đến trang feedback
            router.push(`/writing-practice/feedback?id=${writingResponse.id}`);
        } catch (error) {
            console.error("Error submitting writing:", error);
            setStep("writing");
            toast.error(
                selectedLanguage === "en"
                    ? "Failed to submit your writing. Please try again."
                    : "Không thể nộp bài viết. Vui lòng thử lại."
            );
        }
    };

    // Component hiển thị chọn chủ đề
    const renderTopicSelection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-6">
                    {selectedLanguage === "en"
                        ? "Choose a Writing Topic"
                        : "Chọn Chủ Đề Viết"}
                </h1>

                <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:justify-between items-center mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
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

                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setSelectedLevel("beginner")}
                            className={`px-4 py-2 rounded-full ${
                                selectedLevel === "beginner"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {selectedLanguage === "en" ? "Beginner" : "Cơ bản"}
                        </button>
                        <button
                            onClick={() => setSelectedLevel("intermediate")}
                            className={`px-4 py-2 rounded-full ${
                                selectedLevel === "intermediate"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {selectedLanguage === "en"
                                ? "Intermediate"
                                : "Trung cấp"}
                        </button>
                        <button
                            onClick={() => setSelectedLevel("advanced")}
                            className={`px-4 py-2 rounded-full ${
                                selectedLevel === "advanced"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {selectedLanguage === "en"
                                ? "Advanced"
                                : "Nâng cao"}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="flex space-x-4">
                        <Button
                            variant={!isCustom ? "primary" : "outline"}
                            onClick={() => setIsCustom(false)}
                        >
                            {selectedLanguage === "en"
                                ? "Suggested Topics"
                                : "Chủ Đề Có Sẵn"}
                        </Button>
                        <Button
                            variant={isCustom ? "primary" : "outline"}
                            onClick={() => setIsCustom(true)}
                        >
                            {selectedLanguage === "en"
                                ? "Create Custom Topic"
                                : "Tạo Chủ Đề Mới"}
                        </Button>
                    </div>
                </div>

                {!isCustom ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <motion.div
                                key={topic.id}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                }}
                                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all"
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
                                                : topic.level === "intermediate"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {topic.level === "beginner"
                                            ? selectedLanguage === "en"
                                                ? "Beginner"
                                                : "Cơ bản"
                                            : topic.level === "intermediate"
                                            ? selectedLanguage === "en"
                                                ? "Intermediate"
                                                : "Trung cấp"
                                            : selectedLanguage === "en"
                                            ? "Advanced"
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
                                            {selectedLanguage === "en"
                                                ? "Time"
                                                : "Thời gian"}
                                            : {topic.timeLimit}{" "}
                                            {selectedLanguage === "en"
                                                ? "minutes"
                                                : "phút"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">📏</span>
                                        <span>
                                            {selectedLanguage === "en"
                                                ? "Words"
                                                : "Số từ"}
                                            : {topic.wordCount?.min} -{" "}
                                            {topic.wordCount?.max}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedLanguage === "en"
                                ? "Create a Custom Topic"
                                : "Tạo Chủ Đề Tùy Chỉnh"}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {selectedLanguage === "en"
                                    ? "Topic Description"
                                    : "Mô Tả Chủ Đề"}
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder={
                                    selectedLanguage === "en"
                                        ? "Example: The role of technology in modern education"
                                        : "Ví dụ: Vai trò của công nghệ trong giáo dục hiện đại"
                                }
                                value={customDescription}
                                onChange={(e) =>
                                    setCustomDescription(e.target.value)
                                }
                            ></textarea>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                onClick={handleCreateCustomTopic}
                                disabled={
                                    !customDescription.trim() || isLoading
                                }
                            >
                                {isLoading
                                    ? selectedLanguage === "en"
                                        ? "Creating..."
                                        : "Đang tạo..."
                                    : selectedLanguage === "en"
                                    ? "Create Topic"
                                    : "Tạo Chủ Đề"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    // Component hiển thị giao diện viết bài
    const renderWritingInterface = () => {
        if (!selectedTopic) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        size="small"
                        onClick={() => setStep("select-topic")}
                    >
                        ← {selectedLanguage === "en" ? "Back" : "Quay lại"}
                    </Button>
                    <div className="flex items-center space-x-4">
                        {timeLeft !== null && isTimerVisible && (
                            <div
                                className={`text-lg font-mono ${
                                    timeLeft < 60
                                        ? "text-red-600 animate-pulse"
                                        : ""
                                }`}
                            >
                                {Math.floor(timeLeft / 60)
                                    .toString()
                                    .padStart(2, "0")}
                                :{(timeLeft % 60).toString().padStart(2, "0")}
                            </div>
                        )}
                        <button
                            onClick={() => setIsTimerVisible(!isTimerVisible)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isTimerVisible ? "🕒" : "👁️"}
                        </button>
                        <Button
                            variant="primary"
                            onClick={handleSubmitWriting}
                            disabled={writingContent.trim().length < 50}
                        >
                            {selectedLanguage === "en" ? "Submit" : "Nộp bài"}
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {selectedTopic.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span
                            className={`px-2 py-1 text-xs rounded ${
                                selectedTopic.level === "beginner"
                                    ? "bg-green-100 text-green-800"
                                    : selectedTopic.level === "intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {selectedTopic.level === "beginner"
                                ? selectedLanguage === "en"
                                    ? "Beginner"
                                    : "Cơ bản"
                                : selectedTopic.level === "intermediate"
                                ? selectedLanguage === "en"
                                    ? "Intermediate"
                                    : "Trung cấp"
                                : selectedLanguage === "en"
                                ? "Advanced"
                                : "Nâng cao"}
                        </span>
                        <span className="text-sm text-gray-500">
                            {selectedLanguage === "en"
                                ? "Category"
                                : "Thể loại"}
                            : {selectedTopic.category}
                        </span>
                        <span className="text-sm text-gray-500">
                            {selectedLanguage === "en"
                                ? "Language"
                                : "Ngôn ngữ"}
                            :{" "}
                            {selectedTopic.language === "en"
                                ? "English"
                                : "Tiếng Việt"}
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md mb-6 border-l-4 border-blue-500">
                        <p className="text-gray-700 whitespace-pre-line">
                            {selectedTopic.prompt}
                        </p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <div>
                            <span className="mr-1">📏</span>
                            <span>
                                {selectedLanguage === "en" ? "Words" : "Số từ"}:{" "}
                                {selectedTopic.wordCount?.min} -{" "}
                                {selectedTopic.wordCount?.max}
                            </span>
                        </div>
                        <div>
                            <span className="mr-1">🕒</span>
                            <span>
                                {selectedLanguage === "en"
                                    ? "Time"
                                    : "Thời gian"}
                                : {selectedTopic.timeLimit}{" "}
                                {selectedLanguage === "en" ? "minutes" : "phút"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
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
                        {selectedLanguage === "en" ? "Words" : "Số từ"}:{" "}
                        {wordCount} / {selectedTopic.wordCount?.min} -{" "}
                        {selectedTopic.wordCount?.max}
                    </div>
                </div>

                <textarea
                    ref={textareaRef}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[300px]"
                    rows={15}
                    placeholder={
                        selectedLanguage === "en"
                            ? "Write your response here..."
                            : "Viết bài của bạn ở đây..."
                    }
                    value={writingContent}
                    onChange={(e) => setWritingContent(e.target.value)}
                ></textarea>
            </motion.div>
        );
    };

    // Hiển thị state đang nộp bài
    const renderSubmittingState = () => (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-700">
                {selectedLanguage === "en"
                    ? "Submitting your writing..."
                    : "Đang nộp bài viết của bạn..."}
            </p>
        </div>
    );

    // Hiển thị giao diện dựa trên step hiện tại
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {step === "select-topic" && renderTopicSelection()}
            {step === "writing" && renderWritingInterface()}
            {step === "submitting" && renderSubmittingState()}
        </div>
    );
}
