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
import { useRef } from "react";

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId: any = user?.id;
    const toggleChat = () => setShowChat((prev) => !prev);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    function formatCourses(courseList, scores = []) {
        if (!Array.isArray(courseList) || courseList.length === 0) {
            return "Không tìm thấy khóa học phù hợp.";
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
    Learning Outcomes: ${item.learning_outcomes}
    Level: ${item.level}
    Tags (Category): ${item.tags}
    Link: ${item.linkCourse || `http://localhost:3000/courses/${item.id}`}`;
            })
            .join("\n\n");
    }

    useEffect(() => {
        const initConversation = async () => {
            try {
                const response1 = await fetchCourses();
                console.log("🍪🍪🍪🍪", document.cookie);

                console.log(response1);
                const response = await addConversation(userId, "Chatbot");
                const data = await response.json();
                setConversationId(data.id);

                // Lấy lịch sử tin nhắn
                const messagesResponse = await fetch(
                    `${API_BASE_URL}/conversation/user/${userId}`
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
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);
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
            // Lưu tin nhắn người dùng
            await fetch(
                `${API_BASE_URL}/conversation/${conversationId}/message`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ senderId: userId, content: input }),
                }
            );

            // Hiển thị trạng thái đang nhập
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Đang tìm kiếm thông tin...",
                    isTyping: true,
                },
            ]);

            // Lấy thông tin người dùng
            const userProfile = await fetchUserById(userId);
            console.log("🟢 userProfile:", userProfile);

            // Khởi tạo biến vectorDB
            let relevantCourses = {
                results: [],
                scores: [],
                query_analysis: {},
            };

            // Kiểm tra xem có phải hỏi về khóa học không
            const isQueryAboutCourses = isCourseQuery(input);
            console.log("🟢 Có phải hỏi về khoá học:", isQueryAboutCourses);

            if (isQueryAboutCourses) {
                try {
                    // Gọi đến vectorDB với các thông số
                    const findCoursesInVectorDB = await fetch(
                        `http://localhost:8000/search`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                query: input,
                                top_k: 5,
                                // min_score: 0.3,
                                // filters: {
                                //     level:
                                //         userProfile?.skillLevel?.toLowerCase() ||
                                //         undefined,
                                // },
                            }),
                        }
                    );

                    // Xử lý kết quả từ vectorDB
                    relevantCourses = await findCoursesInVectorDB.json();
                    console.log("🟢 Kết quả vectorDB:", relevantCourses);
                } catch (error) {
                    console.error("❌ Lỗi khi tìm kiếm khóa học:", error);
                }
            }

            // Format các khóa học với điểm số tương ứng
            let formatCoursesVar = "";
            if (relevantCourses.results && relevantCourses.results.length > 0) {
                formatCoursesVar = formatCourses(
                    relevantCourses.results,
                    relevantCourses.scores
                );
            }

            // Tạo prompt cho LLM
            const promptMessages = [
                ...messages.slice(-5).map((m) => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text,
                })),
                { role: "user", content: input },
            ];

            // Thêm thông tin ngữ cảnh vào prompt
            if (
                relevantCourses.results &&
                relevantCourses.results.length > 0 &&
                userProfile
            ) {
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
                    Recommended courses: ${formatCoursesVar}.
                    Từ những khoá học được gợi ý này, hãy chọn những khoá học phù hợp với học viên, và đưa cả link khoá học.
                    Trả lời theo định dạng ReactMarkdown.
                    
                    Hãy phân tích truy vấn của người dùng và chọn những khóa học phù hợp nhất. Dành ưu tiên cho các khóa học có độ phù hợp cao nhất.
                    Giải thích ngắn gọn tại sao những khóa học này phù hợp với nhu cầu và trình độ của người học.
                    Nhớ cung cấp thông tin về giá gốc, giá khuyến mãi nếu có.
                    Đảm bảo đưa ra link đến khóa học để người dùng có thể dễ dàng truy cập.
                    Hãy trả lời bằng tiếng Việt và định dạng theo ReactMarkdown.
                    Hãy sử dụng văn phong chuyên nghiệp, thân thiện và khuyến khích.
                    `,
                });
            } else if (userProfile) {
                // Nếu không có khóa học phù hợp hoặc không phải câu hỏi về khóa học
                promptMessages.push({
                    role: "system",
                    content: `Dưới đây là thông tin học viên.
                    Tên người dùng: ${userProfile.name || "không rõ"}
                    Trình độ: ${userProfile.skillLevel || "không rõ"}.
                    Mục tiêu cụ thể: ${userProfile.specificGoals || "không rõ"}.
                    Kỹ năng ưu tiên: ${
                        userProfile.prioritySkills || "không rõ"
                    }.
                    Từ vựng đã biết: ${
                        userProfile.knownVocabulary || "không rõ"
                    }.
                    Kết quả kiểm tra đánh giá: ${
                        userProfile.assessmentTest || "không rõ"
                    }.
                    Mục đích học tập: ${
                        userProfile.learningPurpose || "không rõ"
                    }.
                    Mục tiêu người dùng: ${
                        userProfile.learningGoals || "không rõ"
                    }.
                    
                    Bạn là một trợ lý AI chuyên về học tiếng Anh, hãy trả lời câu hỏi của người dùng một cách thân thiện và hữu ích.
                    Hãy đề xuất các phương pháp học tập, nguồn tài liệu, hoặc lời khuyên phù hợp với trình độ và mục tiêu của người học.
                    Hãy trả lời bằng tiếng Việt và định dạng theo ReactMarkdown.
                    Sử dụng văn phong thân thiện, khuyến khích và đưa ra lời khuyên cụ thể.
                    `,
                });
            } else {
                // Trường hợp không có thông tin người dùng
                promptMessages.push({
                    role: "system",
                    content: `Bạn là một trợ lý AI chuyên về học tiếng Anh, hãy trả lời câu hỏi của người dùng một cách thân thiện và hữu ích.
                    Hãy trả lời bằng tiếng Việt và định dạng theo ReactMarkdown.
                    Sử dụng văn phong thân thiện và khuyến khích.
                    `,
                });
            }

            console.log("🟢 promptMessages:", promptMessages);

            // Gửi prompt đến LLM
            const aiResponse = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
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
                }
            );

            const data = await aiResponse.json();
            const responseText =
                data.choices?.[0]?.message?.content?.trim() ||
                "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này!";

            console.log("🟢 Phản hồi AI:", responseText);

            // Cập nhật lộ trình học tập nếu đó là yêu cầu về lộ trình
            if (isRequestPath) {
                try {
                    await updatePath(userId, { pathDetails: responseText });
                    console.log("🟢 Đã cập nhật lộ trình học tập");
                } catch (error) {
                    console.error("❌ Lỗi khi cập nhật lộ trình:", error);
                }
            }

            // Lưu tin nhắn phản hồi từ bot
            await fetch(
                `${API_BASE_URL}/conversation/${conversationId}/message`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        senderId: null,
                        content: responseText,
                    }),
                }
            );

            // Cập nhật UI với tin nhắn bot mới và xóa tin nhắn "đang nhập"
            setMessages((prev) =>
                prev
                    .filter((msg) => !msg.isTyping) // Xóa tin nhắn "đang nhập"
                    .concat([{ sender: "bot", text: responseText }])
            );
        } catch (error) {
            console.error("❌ Lỗi trong quá trình xử lý:", error);

            // Xử lý lỗi và cập nhật UI
            setMessages((prev) =>
                prev
                    .filter((msg) => !msg.isTyping)
                    .concat([
                        {
                            sender: "bot",
                            text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                        },
                    ])
            );
        }
    };
    const formatMarkdown = (text: string) => {
        return text.replace(/-?\s*(http[^\s]+)/g, (_, url) => {
            return ` [Xem khóa học](${url})`;
        });
    };
    return (
        <>
            <button
                onClick={toggleChat}
                className="relative p-1.5 rounded-full focus:outline-none hover:bg-purple-100 transition-all duration-300"
            >
                <div className="relative">
                    <img
                        className="w-7 h-7"
                        src="/icons/chatbot.png"
                        alt="AI Assistant"
                    />
                    {!showChat && messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            !
                        </span>
                    )}
                </div>
            </button>

            {showChat && (
                <div className="fixed top-64 right-10 w-1/3 h-[700px] bg-white rounded-xl shadow-xl p-4 border border-violet-300 flex flex-col animate-slideIn z-50">
                    <div className="flex justify-between items-center border-b border-violet-100 pb-2">
                        <div className="flex items-center">
                            <img
                                className="w-6 h-6 mr-2"
                                src="/icons/chatbot.png"
                                alt="AI Assistant"
                            />
                            <div className="text-lg font-semibold text-violet-700">
                                AI Assistant
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-2xl font-semibold hover:text-violet-500 transition-colors"
                        >
                            ×
                        </button>
                    </div>

                    <div
                        ref={chatBoxRef}
                        className="chat-box text-sm flex-grow overflow-y-auto my-3 pr-2 h-full"
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-700 p-3 py-20">
                                <h2 className="text-lg font-semibold text-violet-500 mb-3">
                                    Chào mừng đến với Trợ Lý Học Ngôn Ngữ!
                                </h2>
                                <img
                                    src="/icons/welcome.png"
                                    alt="Welcome"
                                    className="w-32 h-32 mx-auto mb-4 opacity-80"
                                />
                                <p className="text-sm mt-1 text-gray-600">
                                    Tôi có thể giúp bạn với:
                                </p>
                                <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside text-violet-600 max-w-xs mx-auto text-left">
                                    <li>Trả lời câu hỏi về học ngôn ngữ</li>
                                    <li>
                                        Đề xuất lộ trình học tập cá nhân hóa
                                    </li>
                                    <li>Gợi ý khóa học, tài liệu học tập</li>
                                    <li>Hỗ trợ bạn đạt mục tiêu học tập</li>
                                </ul>
                                <p className="text-sm mt-4 text-gray-500">
                                    Hãy nhắn tin cho tôi hoặc chọn một trong các
                                    mẫu dưới đây! 👇
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {msg.sender === "bot" && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                                <img
                                                    src="/icons/chatbot.png"
                                                    alt="AI"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                                                msg.sender === "user"
                                                    ? "bg-violet-500 text-white"
                                                    : msg.isTyping
                                                    ? "bg-gray-200 text-gray-500 flex items-center"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {msg.isTyping ? (
                                                <div className="typing-animation flex space-x-1">
                                                    <span className="dot animate-bounce">
                                                        ●
                                                    </span>
                                                    <span
                                                        className="dot animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.2s",
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    <span
                                                        className="dot animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.4s",
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                </div>
                                            ) : (
                                                <ReactMarkdown
                                                    components={{
                                                        h1: (props) => (
                                                            <h1
                                                                className="text-xl font-bold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        h2: (props) => (
                                                            <h2
                                                                className="text-lg font-semibold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        p: (props) => (
                                                            <p
                                                                className="text-base my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        ol: (props) => (
                                                            <ol
                                                                className="list-decimal ml-5 my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        ul: (props) => (
                                                            <ul
                                                                className="list-disc ml-5 my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        li: (props) => (
                                                            <li
                                                                className="my-0.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        a: (props) => (
                                                            <a
                                                                className="text-blue-500 underline hover:text-blue-700"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                {...props}
                                                            />
                                                        ),
                                                        blockquote: (props) => (
                                                            <blockquote
                                                                className="border-l-4 border-violet-300 pl-3 italic my-2 text-gray-600"
                                                                {...props}
                                                            />
                                                        ),
                                                        code: (props) => (
                                                            <code
                                                                className="bg-gray-200 px-1 rounded text-sm"
                                                                {...props}
                                                            />
                                                        ),
                                                        pre: (props) => (
                                                            <pre
                                                                className="bg-gray-800 text-white p-2 rounded my-2 overflow-x-auto text-sm"
                                                                {...props}
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {formatMarkdown(msg.text)}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                        {msg.sender === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-violet-200 ml-2 flex items-center justify-center flex-shrink-0">
                                                <span className="text-violet-600 font-medium text-sm">
                                                    {user?.name?.[0]?.toUpperCase() ||
                                                        "U"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatBoxRef} />
                            </div>
                        )}
                        {messages.length === 0 && (
                            <div className="p-2 flex flex-wrap gap-2 mt-auto overflow-x-auto justify-center">
                                {[
                                    "Làm sao để bắt đầu học tiếng Anh?",
                                    "Khóa học phù hợp với người mới?",
                                    "Tạo lộ trình học cá nhân hoá",
                                    "Làm sao để luyện phát âm?",
                                    "Tài liệu học IELTS hiệu quả",
                                ].map((s, i) => (
                                    <button
                                        key={i}
                                        className="bg-violet-100 px-3 py-1.5 rounded-full text-sm hover:bg-violet-200 whitespace-nowrap transition-colors duration-200"
                                        onClick={() => {
                                            setInput(s);
                                            setTimeout(
                                                () => sendMessage(),
                                                100
                                            );
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-300 bg-gray-50">
                        <input
                            className="flex-1 p-2.5 focus:outline-none bg-transparent"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="p-2 text-white bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 transition-colors duration-200"
                        >
                            <img
                                src="/icons/send.png"
                                className="w-5 h-5"
                                alt="Send"
                            />
                        </button>
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-2">
                        Powered by AI - Designed to help you learn better
                    </div>
                </div>
            )}

            <style jsx>{`
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .dot {
                    font-size: 10px;
                }

                .typing-animation {
                    padding: 0 4px;
                }
            `}</style>
        </>
    );
}
