"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Mic,
    MicOff,
    Send,
    Play,
    RefreshCcw,
    Award,
    Languages,
    MessageSquare,
    BookOpen,
    User,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Info,
    Settings,
    Save,
} from "lucide-react";
import { ConversationService } from "@/lib/conversation-service";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { Feedback } from "@/components/conversation/Feedback";
import { MessageList } from "@/components/conversation/MessageList";
import { TopicSelector } from "@/components/conversation/TopicSelector";

// Định nghĩa kiểu dữ liệu
export type Message = {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    audioUrl?: string;
};

export type ConversationState =
    | "idle" // Đang chờ hoặc mới bắt đầu
    | "recording" // Đang ghi âm
    | "processing" // Đang xử lý âm thanh/văn bản
    | "responding" // AI đang trả lời
    | "feedback" // Hiển thị đánh giá
    | "complete"; // Hoàn thành cuộc hội thoại

export type ConversationTopic = {
    id: string;
    title: string;
    description: string;
    level: "beginner" | "intermediate" | "advanced";
    category: string;
    initialPrompt: string;
};

const ConversationPage: React.FC = () => {
    // State cho cuộc trò chuyện
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationState, setConversationState] =
        useState<ConversationState>("idle");
    const [feedback, setFeedback] = useState<any>(null);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [customScenario, setCustomScenario] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [conversationLength, setConversationLength] = useState(5);
    const [difficulty, setDifficulty] = useState("intermediate");

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationService = useRef(ConversationService.getInstance());

    // Sử dụng custom hooks
    const {
        isRecording,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
        clearRecording,
    } = useVoiceRecorder();

    const { topics, selectedTopic, setSelectedTopic } = useConversationTopics();

    // Scroll xuống cuối danh sách tin nhắn
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Bắt đầu cuộc hội thoại mới
    const startConversation = async () => {
        if (conversationState !== "idle") return;

        // Reset state
        setMessages([]);
        setFeedback(null);
        setConversationState("processing");

        try {
            let initialPrompt: string;

            if (isCustom && customScenario.trim()) {
                initialPrompt = customScenario.trim();
            } else if (selectedTopic) {
                initialPrompt = selectedTopic.initialPrompt;
            } else {
                throw new Error(
                    "Vui lòng chọn chủ đề hoặc nhập kịch bản tùy chỉnh"
                );
            }

            // Thêm tin nhắn hệ thống thiết lập ngữ cảnh
            const systemMessage: Message = {
                id: Date.now().toString(),
                role: "system",
                content: `Hội thoại ${
                    isCustom ? "tùy chỉnh" : selectedTopic?.title
                }: ${initialPrompt}`,
            };

            // Thêm tin nhắn mở đầu từ AI
            const response =
                await conversationService.current.startConversation(
                    initialPrompt,
                    selectedLanguage,
                    difficulty,
                    conversationLength
                );

            // Cập nhật messages
            setMessages([
                systemMessage,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.message,
                },
            ]);

            setConversationState("idle");
        } catch (error) {
            console.error("Error starting conversation:", error);
            setConversationState("idle");
        }
    };

    // Xử lý khi người dùng gửi âm thanh
    const handleSubmitAudio = async () => {
        if (!audioBlob || conversationState !== "idle") return;

        setConversationState("processing");

        try {
            // Gửi âm thanh lên server để chuyển thành văn bản
            const transcript =
                await conversationService.current.transcribeAudio(
                    audioBlob,
                    selectedLanguage
                );

            // Thêm tin nhắn người dùng vào danh sách
            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: transcript,
                audioUrl: audioUrl || undefined,
            };

            setMessages((prev) => [...prev, userMessage]);

            // Đổi trạng thái
            setConversationState("responding");

            // Lấy phản hồi từ AI
            const response = await conversationService.current.sendMessage(
                transcript
            );

            // Thêm tin nhắn AI vào danh sách
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Kiểm tra xem cuộc hội thoại đã kết thúc chưa
            if (response.isCompleted) {
                setConversationState("feedback");

                // Lấy đánh giá từ AI
                const feedbackResponse =
                    await conversationService.current.getFeedback();
                setFeedback(feedbackResponse);
            } else {
                setConversationState("idle");
            }

            // Xóa bản ghi âm hiện tại
            clearRecording();
        } catch (error) {
            console.error("Error processing audio:", error);
            setConversationState("idle");
        }
    };

    // Toggle ghi âm
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
            setConversationState("recording");
        }
    };

    // Hoàn thành cuộc hội thoại và nhận đánh giá
    const completeConversation = () => {
        if (messages.length < 4) return; // Cần ít nhất 2 lượt trao đổi
        setConversationState("feedback");
    };

    // Reset lại cuộc hội thoại
    const resetConversation = () => {
        setMessages([]);
        setFeedback(null);
        setConversationState("idle");
        clearRecording();
    };

    // Lưu lịch sử hội thoại
    const saveConversationHistory = () => {
        const conversationData = {
            topic: isCustom ? "Tùy chỉnh" : selectedTopic?.title,
            messages: messages,
            feedback: feedback,
            language: selectedLanguage,
            difficulty: difficulty,
            timestamp: new Date().toISOString(),
        };

        // Trong môi trường thực tế, bạn có thể lưu vào cơ sở dữ liệu
        // Hiện tại chúng ta tạm lưu vào localStorage
        const history = JSON.parse(
            localStorage.getItem("conversationHistory") || "[]"
        );
        history.push(conversationData);
        localStorage.setItem("conversationHistory", JSON.stringify(history));

        alert("Đã lưu lịch sử hội thoại thành công!");
    };

    // Render
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <MessageSquare className="mr-2" />
                        Luyện tập hội thoại
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Thực hành giao tiếp với AI qua nhiều chủ đề và tình
                        huống khác nhau
                    </p>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
                {/* Left column - Settings and topic selection */}
                <div className="md:w-1/3 space-y-4">
                    {/* Language selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h2 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                            <Languages className="mr-2" size={18} />
                            Ngôn ngữ
                        </h2>
                        <select
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={selectedLanguage}
                            onChange={(e) =>
                                setSelectedLanguage(e.target.value)
                            }
                            disabled={conversationState !== "idle"}
                        >
                            <option value="en-US">Tiếng Anh (Mỹ)</option>
                            <option value="en-GB">Tiếng Anh (Anh)</option>
                            <option value="vi-VN">Tiếng Việt</option>
                            <option value="fr-FR">Tiếng Pháp</option>
                            <option value="ja-JP">Tiếng Nhật</option>
                        </select>
                    </div>

                    {/* Topic selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h2 className="font-medium text-gray-900 dark:text-white flex items-center mb-3">
                            <BookOpen className="mr-2" size={18} />
                            Chủ đề hội thoại
                        </h2>
                        <TopicSelector
                            topics={topics}
                            selectedTopic={selectedTopic}
                            setSelectedTopic={setSelectedTopic}
                            isCustom={isCustom}
                            setIsCustom={setIsCustom}
                            customScenario={customScenario}
                            setCustomScenario={setCustomScenario}
                        />
                    </div>

                    {/* Settings panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <button
                            className="flex items-center justify-between w-full font-medium text-gray-900 dark:text-white"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <span className="flex items-center">
                                <Settings className="mr-2" size={18} />
                                Cài đặt nâng cao
                            </span>
                            {showSettings ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </button>

                        {showSettings && (
                            <div className="mt-3 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Cấp độ khó
                                    </label>
                                    <select
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        value={difficulty}
                                        onChange={(e) =>
                                            setDifficulty(e.target.value)
                                        }
                                        disabled={conversationState !== "idle"}
                                    >
                                        <option value="beginner">Cơ bản</option>
                                        <option value="intermediate">
                                            Trung cấp
                                        </option>
                                        <option value="advanced">
                                            Nâng cao
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Độ dài hội thoại (lượt trao đổi)
                                    </label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="10"
                                        value={conversationLength}
                                        onChange={(e) =>
                                            setConversationLength(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        disabled={conversationState !== "idle"}
                                    />
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        <span>3</span>
                                        <span>{conversationLength}</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Start conversation button */}
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={startConversation}
                        disabled={
                            (isCustom && !customScenario.trim()) ||
                            (!isCustom && !selectedTopic) ||
                            conversationState !== "idle" ||
                            (messages.length > 0 &&
                                conversationState === "idle")
                        }
                    >
                        <Play className="mr-2" size={18} />
                        Bắt đầu hội thoại
                    </button>

                    {/* Reset button - only show if conversation has started */}
                    {messages.length > 0 && (
                        <button
                            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center"
                            onClick={resetConversation}
                            disabled={
                                conversationState === "processing" ||
                                conversationState === "responding"
                            }
                        >
                            <RefreshCcw className="mr-2" size={16} />
                            Bắt đầu lại
                        </button>
                    )}
                </div>

                {/* Right column - Conversation and feedback */}
                <div className="md:w-2/3 space-y-4">
                    {/* Conversation messages */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h2 className="font-medium text-gray-900 dark:text-white mb-3">
                            Tin nhắn
                        </h2>
                        <MessageList messages={messages} />
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Recording controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h2 className="font-medium text-gray-900 dark:text-white mb-3">
                            Điều khiển ghi âm
                        </h2>
                        <div className="flex items-center justify-between">
                            <div className="w-12">
                                {audioUrl && !isRecording && (
                                    <button
                                        onClick={() => {
                                            const audio = new Audio(audioUrl);
                                            audio.play();
                                        }}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Nghe lại"
                                    >
                                        <Play size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <button
                                    onClick={toggleRecording}
                                    disabled={
                                        conversationState !== "idle" &&
                                        conversationState !== "recording"
                                    }
                                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-full ${
                                        isRecording
                                            ? "bg-red-500 hover:bg-red-600"
                                            : conversationState !== "idle" &&
                                              conversationState !== "recording"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700"
                                    } text-white transition-colors shadow-lg relative`}
                                >
                                    {isRecording ? (
                                        <>
                                            <MicOff className="h-6 w-6" />
                                            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border-4 border-red-400 opacity-60 animate-ping"></div>
                                        </>
                                    ) : (
                                        <Mic className="h-6 w-6" />
                                    )}
                                </button>
                                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                                    {isRecording
                                        ? "Đang ghi âm..."
                                        : "Nhấn để nói"}
                                </span>
                            </div>

                            <div className="w-12 flex justify-end">
                                {audioBlob && !isRecording && (
                                    <button
                                        onClick={handleSubmitAudio}
                                        disabled={
                                            conversationState !== "idle" ||
                                            !audioBlob
                                        }
                                        className={`p-2 ${
                                            conversationState !== "idle"
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                                        } rounded-full transition-colors`}
                                        title="Gửi"
                                    >
                                        <Send size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status indicators */}
                        <div className="mt-4 text-center text-sm">
                            {conversationState === "processing" && (
                                <div className="text-blue-600 dark:text-blue-400">
                                    Đang xử lý...
                                </div>
                            )}
                            {conversationState === "responding" && (
                                <div className="text-purple-600 dark:text-purple-400">
                                    AI đang trả lời...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback display */}
                    {conversationState === "feedback" && feedback && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            <Feedback feedback={feedback} />
                            <div className="p-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={resetConversation}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
                                >
                                    <RefreshCcw
                                        className="inline mr-2"
                                        size={16}
                                    />
                                    Bắt đầu lại
                                </button>
                                <button
                                    onClick={saveConversationHistory}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    <Save className="inline mr-2" size={16} />
                                    Lưu lịch sử
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Conversation info */}
                    {messages.length > 0 &&
                        conversationState !== "feedback" && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start">
                                <Info
                                    size={20}
                                    className="text-blue-700 dark:text-blue-400 mt-0.5 flex-shrink-0 mr-3"
                                />
                                <div>
                                    <h3 className="font-medium text-blue-800 dark:text-blue-300">
                                        Ghi chú
                                    </h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                        Nhấn vào nút microphone để ghi âm câu
                                        trả lời của bạn. Sau khi hoàn thành, bạn
                                        có thể nghe lại và gửi để tiếp tục cuộc
                                        hội thoại.
                                        {messages.length > 2 && (
                                            <>
                                                {" "}
                                                Bạn có thể nhấn nút "Bắt đầu
                                                lại" để thử lại với chủ đề khác.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;
