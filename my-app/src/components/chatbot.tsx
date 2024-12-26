"use client";
import { useState, useEffect, useRef } from "react";

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return; // Không gửi tin nhắn nếu input rỗng

        const userMessage = { role: "user", content: trimmedInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Giả lập tin nhắn từ bot
        const botReply = { role: "bot", content: `You said: "${trimmedInput}"` };
        setTimeout(() => {
            setMessages((prev) => [...prev, botReply]);
        }, 1000); // Đợi 1 giây trước khi bot trả lời
    };

    return (
        <div className="fixed bottom-4 right-4 w-full border-2 border-gray-200 max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
                <h2 className="text-xl font-semibold">Chat with AI</h2>
                <button
                    onClick={() => setMessages([])}
                    className="text-sm bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Clear Chat
                </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-[300px]">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`max-w-xl px-6 py-3 rounded-lg text-white ${
                                msg.role === "bot" ? "bg-gray-400" : "bg-blue-500"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {/* Vị trí cuộn tới cuối */}
                <div ref={messageEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 shadow-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
