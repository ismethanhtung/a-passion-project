"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addConversation } from "@/api/conversation";
import { fetchUserById } from "@/api/user";
import { fetchCourses } from "@/api/courses";
import ReactMarkdown from "react-markdown";
import { updatePath } from "@/api/learningPath";

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId: any = user?.id;
    const toggleChat = () => setShowChat((prev) => !prev);

    function formatCourses(courseList) {
        if (!Array.isArray(courseList) || courseList.length === 0) {
            return "No courses available.";
        }

        return courseList
            .map((rawText, index) => {
                const item = JSON.parse(rawText); // Chuyển từ string JSON thành object
                return `[Course ${index + 1} begin]
    Name: ${item.title}
    Description: ${item.description}
    Objectives: ${item.objectives}
    Origin Price: ${item.price}
    Discounted Price: ${item.newPrice}
    Tags (Category): ${item.tags}
    Link: ${item.linkCourse}
    [Course ${index + 1} end]`;
            })
            .join("\n\n"); // Ghép lại thành 1 chuỗi với khoảng trắng giữa các khóa học
    }

    useEffect(() => {
        const initConversation = async () => {
            try {
                const response1 = await fetchCourses();
                console.log("🍪🍪🍪🍪🍪", document.cookie);

                console.log(response1);
                const response = await addConversation(userId, "Chatbot");
                const data = await response.json();
                setConversationId(data.id);

                // Lấy lịch sử tin nhắn
                const messagesResponse = await fetch(`${API_BASE_URL}/conversation/user/${userId}`);
                const messagesData = await messagesResponse.json();
                setMessages(
                    messagesData.map((msg) => ({
                        sender: msg.senderId === userId ? "user" : "bot",
                        text: msg.content,
                    }))
                );
            } catch (error) {
                console.error("❌ Error:", error);
            }
        };
        initConversation();
    }, [userId]);
    const removeVietnameseDiacritics = (str: string): string => {
        return str
            .normalize("NFD") // Tách dấu khỏi ký tự gốc
            .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
            .replace(/đ/g, "d") // Chuyển "đ" thành "d"
            .replace(/Đ/g, "D"); // Chuyển "Đ" thành "D"
    };

    let isRequestPath = false;

    const isCourseQuery = (message: any) => {
        const normalizedMessage = removeVietnameseDiacritics(
            message.normalize("NFC").toLowerCase()
        );
        const keywords = [
            "khoa hoc",
            "docs",
            "tài liệu",
            "test",
            "bài kiểm tra",
            "lo trinh",
            "learning path",
        ].map((keyword) => removeVietnameseDiacritics(keyword.toLowerCase()));

        return keywords.some((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            if (regex.test(normalizedMessage)) {
                if (keyword === "lo trinh" || keyword === "learning path") {
                    isRequestPath = true;
                }
                return true;
            }
            return false;
        });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            await fetch(`${API_BASE_URL}/conversation/${conversationId}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: userId, content: input }),
            });

            let relevantCourses: any = [];
            // Nếu là câu hỏi về khóa học
            console.log("🟢 Có phải hỏi về khoá học:", isCourseQuery(input));

            if (isCourseQuery(input)) {
                console.log("🟢 input:", input);
                const findCoursesInVectorDB = await fetch(`http://localhost:8000/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: input, top_k: 5 }),
                });

                relevantCourses = await findCoursesInVectorDB.json();
            }
            const userProfile = await fetchUserById(userId);

            console.log("🟢 relevantCourses:", relevantCourses);
            console.log("🟢 userProfile:", userProfile);

            let formatCoursesvar = formatCourses(relevantCourses.results);

            // Tạo prompt
            const promptMessages = [
                ...messages.slice(-5).map((m) => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text,
                })),
                { role: "user", content: input },
            ];

            if (relevantCourses.results && userProfile) {
                promptMessages.push({
                    role: "system",
                    content: `Dưới đây là thông tin học viên và các khoá học được gợi ý.
                    User level: ${userProfile.skillLevel}.
                    Specific goals: ${userProfile.specificGoals}.
                    Priority skills: ${userProfile.prioritySkills}.
                    Known vocabulary: ${userProfile.knownVocabulary}.
                    Assessment test results: ${userProfile.assessmentTest}.
                    Learning purpose: ${userProfile.learningPurpose}.
                    User goals: ${userProfile.learningGoals}.
                    Recommended courses: ${formatCoursesvar}.
                    Từ những khoá học được gợi ý này, hãy chọn những khoá học phù hợp với học viên, và đưa cả link khoá học.
                    Trả lời theo định dạng ReactMarkdown.
                    `,
                });
            } else if (userProfile) {
                promptMessages.push({
                    role: "system",
                    content: `Dưới đây là thông tin học viên.
                User level: ${userProfile.skillLevel}.
                Specific goals: ${userProfile.specificGoals}.
                Priority skills: ${userProfile.prioritySkills}.
                Known vocabulary: ${userProfile.knownVocabulary}.
                Assessment test results: ${userProfile.assessmentTest}.
                Learning purpose: ${userProfile.learningPurpose}.
                User goals: ${userProfile.learningGoals}.
                Bạn là một trợ lý AI thân thiện, supportive cho một nền tảng học tiếng Anh.
                Trả lời theo định dạng ReactMarkdown.
                `,
                });
            }
            console.log("🟢 promptMessages:", promptMessages);

            // Gửi prompt đến Groq API
            const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer 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`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: promptMessages,
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });

            const data = await aiResponse.json();
            const responseText =
                data.choices?.[0]?.message?.content?.trim() || "Lỗi khi nhận phản hồi!";

            console.log(responseText);
            if (isRequestPath) updatePath(userId, { pathDetails: responseText });

            await fetch(`${API_BASE_URL}/conversation/${conversationId}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: null, content: responseText }),
            });

            setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
        } catch (error) {
            console.log("❌ Error:", error);
        }
    };
    const formatMarkdown = (text: string) => {
        return text.replace(/-?\s*(http[^\s]+)/g, (_, url) => {
            return ` [Xem khóa học](${url})`;
        });
    };
    return (
        <>
            <button onClick={toggleChat} className="relative p-1.5 rounded-full focus:outline-none">
                <img className="w-7 h-7" src="/icons/chatbot.png" alt="chatbot" />
            </button>

            {showChat && (
                <div className="fixed bottom-10 right-10 w-1/3 h-[700px] bg-white rounded-xl shadow-xl p-4 border border-violet-300 flex flex-col">
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">Chatbot</div>
                        <button
                            onClick={toggleChat}
                            className="text-2xl font-bold hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chat-box text-sm flex-grow overflow-y-auto border-y my-2 h-96">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`px-3 rounded-lg max-w-full break-words leading-[2] ${
                                        msg.sender === "user"
                                            ? "bg-purple-400 text-white ml-10"
                                            : "bg-gray-300 text-black mr-10"
                                    }`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => (
                                                <h1
                                                    className="text-3xl font-bold my-4"
                                                    {...props}
                                                />
                                            ),

                                            p: ({ node, ...props }) => (
                                                <p
                                                    className="text-base leading-relaxed my-2"
                                                    {...props}
                                                />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol className="list-decimal ml-6 my-2" {...props} />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="list-disc ml-6 my-2" {...props} />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a
                                                    {...props}
                                                    className="text-blue-500 underline hover:text-blue-700"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote
                                                    className="border-l-4 border-gray-300 pl-4 italic my-4"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {formatMarkdown(msg.text)}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <input
                            className="flex-1 p-1 rounded-l-lg focus:outline-none"
                            placeholder="Send to Chatbot"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className="" onClick={sendMessage}>
                            <img src="/icons/send.png" className="w-7 h-7 mr-3" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
