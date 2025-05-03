import React from "react";
import { User, Bot } from "lucide-react";
import { Message } from "@/app/conversation/page";

interface MessageListProps {
    messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    // Lọc ra những tin nhắn hiển thị (bỏ qua system messages)
    const displayMessages = messages.filter((msg) => msg.role !== "system");

    return (
        <div className="flex flex-col space-y-4 py-4">
            {displayMessages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                    }`}
                >
                    <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                            message.role === "user"
                                ? "flex-row-reverse space-x-reverse"
                                : "flex-row"
                        }`}
                    >
                        <div
                            className={`rounded-full p-2 ${
                                message.role === "user"
                                    ? "bg-blue-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            {message.role === "user" ? (
                                <User size={16} className="text-white" />
                            ) : (
                                <Bot
                                    size={16}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            )}
                        </div>
                        <div
                            className={`flex flex-col space-y-1 ${
                                message.role === "user"
                                    ? "items-end"
                                    : "items-start"
                            }`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 ${
                                    message.role === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>

                            {/* Hiển thị audio player nếu có */}
                            {message.audioUrl && (
                                <audio
                                    src={message.audioUrl}
                                    controls
                                    className="h-8 w-full max-w-[200px]"
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
