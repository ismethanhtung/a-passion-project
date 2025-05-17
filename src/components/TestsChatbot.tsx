"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Search, Bot, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

// Lấy dữ liệu từ online-tests/page.tsx
type TestType = "TOEIC" | "IELTS" | "General" | "Placement";
type TestDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

interface TestItem {
    id: string | number;
    title: string;
    description: string;
    duration: string;
    questions: number;
    participants: number;
    testType: TestType;
    tags: string[];
    difficulty: TestDifficulty;
    popularity: number;
    isFeatured: boolean;
    completionRate: number;
    sections?: {
        listening?: {
            parts: number;
            questions: number;
        };
        reading?: {
            parts: number;
            questions: number;
        };
    };
    lastUpdated?: string;
}

export default function TestsChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string }[]
    >([
        {
            role: "assistant",
            content:
                "Xin chào! Tôi có thể giúp bạn tìm kiếm bài kiểm tra phù hợp với nhu cầu của bạn. Hãy cho tôi biết bạn đang tìm kiếm bài thi nào? (VD: TOEIC, IELTS, bài thi đầu vào, hoặc mô tả nhu cầu của bạn)",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Mock data lấy từ page.tsx
    const tests: TestItem[] = [
        {
            id: "toeic-1",
            title: "TOEIC Full Test",
            description:
                "Bài thi TOEIC đầy đủ với cấu trúc và độ khó tương đương đề thi thật.",
            duration: "120 phút",
            questions: 200,
            participants: 1245,
            testType: "TOEIC",
            tags: ["TOEIC", "Full Test", "ETS Format"],
            difficulty: "Intermediate",
            popularity: 98,
            isFeatured: true,
            completionRate: 87,
            sections: {
                listening: {
                    parts: 4,
                    questions: 100,
                },
                reading: {
                    parts: 3,
                    questions: 100,
                },
            },
            lastUpdated: "2023-11-15",
        },
        {
            id: "toeic-2",
            title: "TOEIC Mini Test - Listening Focus",
            description:
                "Bài thi tập trung vào phần Listening với các câu hỏi phổ biến.",
            duration: "60 phút",
            questions: 100,
            participants: 876,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Practice"],
            difficulty: "Intermediate",
            popularity: 85,
            isFeatured: true,
            completionRate: 92,
            sections: {
                listening: {
                    parts: 4,
                    questions: 100,
                },
            },
            lastUpdated: "2023-10-20",
        },
        {
            id: "toeic-3",
            title: "TOEIC Mini Test - Reading Focus",
            description:
                "Luyện tập phần Reading với các dạng câu hỏi thường gặp.",
            duration: "75 phút",
            questions: 100,
            participants: 735,
            testType: "TOEIC",
            tags: ["TOEIC", "Reading", "Grammar", "Practice"],
            difficulty: "Intermediate",
            popularity: 82,
            isFeatured: false,
            completionRate: 78,
            sections: {
                reading: {
                    parts: 3,
                    questions: 100,
                },
            },
            lastUpdated: "2023-09-05",
        },
        {
            id: "ielts-1",
            title: "IELTS Academic Test Simulation",
            description:
                "Bài thi mô phỏng IELTS Academic với đầy đủ 4 kỹ năng.",
            duration: "165 phút",
            questions: 120,
            participants: 562,
            testType: "IELTS",
            tags: ["IELTS", "Academic", "Full Test"],
            difficulty: "Advanced",
            popularity: 90,
            isFeatured: true,
            completionRate: 75,
            lastUpdated: "2023-11-28",
        },
        {
            id: "placement-1",
            title: "English Placement Test",
            description:
                "Bài kiểm tra phân loại trình độ tiếng Anh từ A1 đến C2.",
            duration: "45 phút",
            questions: 60,
            participants: 2145,
            testType: "Placement",
            tags: ["Placement", "CEFR", "All Levels"],
            difficulty: "Beginner",
            popularity: 95,
            isFeatured: false,
            completionRate: 96,
            lastUpdated: "2023-12-01",
        },
        {
            id: "toeic-4",
            title: "TOEIC Part 5 & 6 Practice",
            description:
                "Tập trung luyện tập ngữ pháp và cấu trúc câu trong TOEIC.",
            duration: "40 phút",
            questions: 50,
            participants: 895,
            testType: "TOEIC",
            tags: ["TOEIC", "Grammar", "Part 5", "Part 6"],
            difficulty: "Intermediate",
            popularity: 88,
            isFeatured: false,
            completionRate: 90,
            sections: {
                reading: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-08-15",
        },
        {
            id: "toeic-5",
            title: "TOEIC Part 7 Reading Comprehension",
            description:
                "Luyện đọc hiểu với các dạng bài đọc đa dạng trong TOEIC.",
            duration: "55 phút",
            questions: 54,
            participants: 723,
            testType: "TOEIC",
            tags: ["TOEIC", "Reading", "Part 7"],
            difficulty: "Advanced",
            popularity: 80,
            isFeatured: false,
            completionRate: 72,
            sections: {
                reading: {
                    parts: 1,
                    questions: 54,
                },
            },
            lastUpdated: "2023-07-22",
        },
        {
            id: "ielts-2",
            title: "IELTS Reading Practice",
            description: "Luyện đọc hiểu với các bài đọc theo format IELTS.",
            duration: "60 phút",
            questions: 40,
            participants: 638,
            testType: "IELTS",
            tags: ["IELTS", "Reading", "Academic"],
            difficulty: "Advanced",
            popularity: 85,
            isFeatured: false,
            completionRate: 78,
            lastUpdated: "2023-10-10",
        },
        {
            id: "toeic-6",
            title: "TOEIC Listening Parts 1-2",
            description:
                "Tập trung vào Photographs và Question-Response trong TOEIC.",
            duration: "30 phút",
            questions: 50,
            participants: 912,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Part 1", "Part 2"],
            difficulty: "Beginner",
            popularity: 87,
            isFeatured: false,
            completionRate: 94,
            sections: {
                listening: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-09-18",
        },
        {
            id: "toeic-7",
            title: "TOEIC Listening Parts 3-4",
            description: "Luyện nghe với Conversations và Talks trong TOEIC.",
            duration: "45 phút",
            questions: 50,
            participants: 786,
            testType: "TOEIC",
            tags: ["TOEIC", "Listening", "Part 3", "Part 4"],
            difficulty: "Intermediate",
            popularity: 84,
            isFeatured: false,
            completionRate: 82,
            sections: {
                listening: {
                    parts: 2,
                    questions: 50,
                },
            },
            lastUpdated: "2023-10-05",
        },
        {
            id: "general-1",
            title: "Business English Test",
            description:
                "Kiểm tra kỹ năng tiếng Anh trong môi trường doanh nghiệp.",
            duration: "60 phút",
            questions: 80,
            participants: 456,
            testType: "General",
            tags: ["Business", "Professional", "Workplace"],
            difficulty: "Advanced",
            popularity: 75,
            isFeatured: false,
            completionRate: 68,
            lastUpdated: "2023-08-30",
        },
        {
            id: "general-2",
            title: "CEFR B2 Level Test",
            description: "Đánh giá trình độ theo khung tham chiếu châu Âu B2.",
            duration: "90 phút",
            questions: 100,
            participants: 528,
            testType: "General",
            tags: ["CEFR", "B2", "European Framework"],
            difficulty: "Intermediate",
            popularity: 82,
            isFeatured: false,
            completionRate: 88,
            lastUpdated: "2023-11-05",
        },
        {
            id: "placement-2",
            title: "Bài kiểm tra đầu vào",
            description: "Bài kiểm tra phân loại trình độ tiếng Anh.",
            duration: "55 phút",
            questions: 54,
            participants: 697,
            testType: "Placement",
            tags: ["Placement", "CEFR", "All Levels"],
            difficulty: "Beginner",
            popularity: 78,
            isFeatured: false,
            completionRate: 88,
            lastUpdated: "2023-11-15",
        },
    ];

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const searchTests = (query: string) => {
        const searchTerms = query.toLowerCase().split(" ");

        // Tìm theo type
        if (query.toLowerCase().includes("toeic")) {
            return tests.filter((test) => test.testType === "TOEIC");
        }

        if (query.toLowerCase().includes("ielts")) {
            return tests.filter((test) => test.testType === "IELTS");
        }

        if (
            query.toLowerCase().includes("placement") ||
            query.toLowerCase().includes("đầu vào") ||
            query.toLowerCase().includes("phân loại")
        ) {
            return tests.filter((test) => test.testType === "Placement");
        }

        // Tìm theo listening/reading
        if (query.toLowerCase().includes("listening")) {
            return tests.filter(
                (test) =>
                    test.tags.some((tag) =>
                        tag.toLowerCase().includes("listening")
                    ) || test.sections?.listening !== undefined
            );
        }

        if (query.toLowerCase().includes("reading")) {
            return tests.filter(
                (test) =>
                    test.tags.some((tag) =>
                        tag.toLowerCase().includes("reading")
                    ) || test.sections?.reading !== undefined
            );
        }

        // Tìm theo độ khó
        if (
            query.toLowerCase().includes("beginner") ||
            query.toLowerCase().includes("cơ bản") ||
            query.toLowerCase().includes("dễ")
        ) {
            return tests.filter((test) => test.difficulty === "Beginner");
        }

        if (
            query.toLowerCase().includes("intermediate") ||
            query.toLowerCase().includes("trung cấp")
        ) {
            return tests.filter((test) => test.difficulty === "Intermediate");
        }

        if (
            query.toLowerCase().includes("advanced") ||
            query.toLowerCase().includes("nâng cao") ||
            query.toLowerCase().includes("khó")
        ) {
            return tests.filter((test) => test.difficulty === "Advanced");
        }

        // Tìm theo nhiều điều kiện
        return tests.filter((test) => {
            return searchTerms.some(
                (term) =>
                    test.title.toLowerCase().includes(term) ||
                    test.description.toLowerCase().includes(term) ||
                    test.tags.some((tag) => tag.toLowerCase().includes(term))
            );
        });
    };

    const generateResponse = (query: string) => {
        const matchedTests = searchTests(query);

        if (matchedTests.length === 0) {
            return "Tôi không tìm thấy bài kiểm tra nào phù hợp với yêu cầu của bạn. Vui lòng thử với từ khóa khác hoặc mô tả chi tiết hơn về nhu cầu của bạn.";
        }

        let response = `Tôi đã tìm thấy ${matchedTests.length} bài kiểm tra phù hợp với yêu cầu của bạn:\n\n`;

        matchedTests.slice(0, 3).forEach((test, index) => {
            response += `**${index + 1}. [${test.title}](/online-tests/${
                test.id
            })**\n`;
            response += `- **Loại bài thi:** ${test.testType}\n`;
            response += `- **Độ khó:** ${test.difficulty}\n`;
            response += `- **Thời gian:** ${test.duration}\n`;
            response += `- **Số câu hỏi:** ${test.questions}\n`;
            response += `- ${test.description}\n\n`;
        });

        if (matchedTests.length > 3) {
            response += `... và ${
                matchedTests.length - 3
            } bài kiểm tra khác.\n\n`;
        }

        response +=
            "Bạn có thể nhấp vào tên bài kiểm tra để bắt đầu làm bài. Hoặc nếu bạn cần tìm bài kiểm tra khác, hãy mô tả chi tiết hơn.";

        return response;
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = { role: "user" as const, content: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Simulate API response time
        setTimeout(() => {
            const response = generateResponse(userMessage.content);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response },
            ]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat toggle button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Bot className="h-6 w-6" />
                )}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex items-center">
                        <Bot className="h-6 w-6 mr-2" />
                        <h3 className="font-semibold">
                            Trợ lý tìm kiếm bài kiểm tra
                        </h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            a: ({ node, ...props }) => (
                                                <a
                                                    className="text-blue-600 underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    {...props}
                                                />
                                            ),
                                            strong: ({ node, ...props }) => (
                                                <strong
                                                    className="font-semibold"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Bạn cần tìm bài kiểm tra nào?"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className={`ml-2 p-2 rounded-full ${
                                    !inputValue.trim() || isLoading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
