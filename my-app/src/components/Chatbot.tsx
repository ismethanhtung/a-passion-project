"use client";
import { useState } from "react";

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    const toggleChat = () => setShowChat((prev) => !prev);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        const payload = {
            model: "llama3-8b-8192",
            messages: [
                ...messages.map((m) => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text,
                })),
                { role: "user", content: input },
            ],
            temperature: 0.7,
            max_tokens: 200,
        };

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer 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`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            const responseText =
                data.choices?.[0]?.message?.content?.trim() || "Lỗi khi nhận phản hồi!";

            setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className="relative p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                <img className="w-7 h-7" src="/icons/chatbot.png" alt="chatbot" />
            </button>

            {showChat && (
                <div className="fixed bottom-10 right-10 w-1/3 h-2/3 bg-white rounded-xl shadow-lg p-4 border flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold">Chatbot</h3>
                        <button
                            onClick={toggleChat}
                            className="text-xl font-bold hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chat-box flex-grow overflow-y-auto p-3 border my-2 h-96 rounded-md bg-gray-100">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <span
                                    className={`p-2 rounded-lg ${
                                        msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-black"
                                    }`}
                                >
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <input
                            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                        />
                        <button
                            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
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
