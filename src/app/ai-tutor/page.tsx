"use client";

import React, { useState } from "react";

export default function AiTutor() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Xin chào! Tôi là AI English Tutor. Bạn muốn luyện gì hôm nay? (ngữ pháp, từ vựng, viết, nói, dịch...)",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setLoading(true);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: `Bạn hỏi: "${input}". Đây là phản hồi mẫu từ AI Tutor. (Tích hợp AI thực tế sẽ trả lời chi tiết hơn)`,
                },
            ]);
            setLoading(false);
        }, 1000);
        setInput("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-sky-100 flex flex-col">
                <h1 className="text-3xl font-bold text-sky-800 mb-2 text-center">
                    AI English Tutor
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Trợ lý AI hỗ trợ luyện tập tiếng Anh mọi kỹ năng, phản hồi
                    tức thì.
                </p>
                <div className="flex-1 overflow-y-auto mb-4 max-h-80">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`mb-2 flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 max-w-xs ${
                                    msg.sender === "user"
                                        ? "bg-sky-600 text-white"
                                        : "bg-sky-100 text-sky-800"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-sky-400 text-sm">
                            AI Tutor đang trả lời...
                        </div>
                    )}
                </div>
                <form onSubmit={handleSend} className="flex gap-2 mt-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        placeholder="Nhập câu hỏi hoặc nội dung luyện tập..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md"
                        disabled={loading}
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}
