"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addConversation } from "@/api/conversation";
import { fetchUserById } from "@/api/user";
import { fetchCourses } from "@/api/courses";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.id;
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

                console.log(response1);
                const response = await addConversation(userId, "Chatbot");
                const data = await response.json();
                setConversationId(data.id);

                // Lấy lịch sử tin nhắn
                const messagesResponse = await fetch(
                    `http://localhost:5000/conversation/user/${userId}`
                );
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
    const isCourseQuery = (message: any) => {
        const normalizedMessage = removeVietnameseDiacritics(
            message.normalize("NFC").toLowerCase()
        );
        // Chuẩn hóa keywords: loại bỏ dấu và chuyển thành chữ thường
        const keywords = [
            "khoa hoc",
            "docs",
            "tài liệu",
            "test",
            "bài kiểm tra",
            "lo trinh",
            "learning path",
        ].map((keyword) => removeVietnameseDiacritics(keyword.toLowerCase()));
        // Dùng regex với ranh giới từ (\b) để khớp chính xác từng keyword
        return keywords.some((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            return regex.test(normalizedMessage);
        });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            await fetch(`http://localhost:5000/conversation/${conversationId}/message`, {
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
                    Recommended courses:
                    ${formatCoursesvar}      
                    nếu người học yêu cầu lộ trình hãy chọn các khoá học phù hợp và xây dựng lộ trình theo tuần để người dùng hoàn thành Specific goals.
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
                    temperature: 0.5,
                    max_tokens: 1000,
                }),
            });

            const data = await aiResponse.json();
            const responseText =
                data.choices?.[0]?.message?.content?.trim() || "Lỗi khi nhận phản hồi!";
            console.log(responseText);

            setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);

            await fetch(`http://localhost:5000/conversation/${conversationId}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: null, content: responseText }),
            });
        } catch (error) {
            console.log("❌ Error:", error);
        }
    };

    return (
        <>
            <button onClick={toggleChat} className="relative p-1.5 rounded-full focus:outline-none">
                <img className="w-7 h-7" src="/icons/chatbot.png" alt="chatbot" />
            </button>

            {showChat && (
                <div className="fixed bottom-10 right-10 w-1/3 h-2/3 bg-white rounded-xl shadow-lg p-4 border flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold">Chatbot</h3>
                        <button
                            onClick={toggleChat}
                            className="text-lg font-bold hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chat-box text-sm flex-grow overflow-y-auto p-3 border my-2 h-96 rounded-md bg-gray-100">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-full break-words leading-[2] ${
                                        msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-black"
                                    }`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            ol: ({ node, ...props }) => (
                                                <ol className="list-decimal ml-6" {...props} />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="list-disc ml-6" {...props} />
                                            ),
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <input
                            className="flex-1 p-2 border rounded-l-lg"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className="bg-blue-500 text-white p-2 rounded-r-lg"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
