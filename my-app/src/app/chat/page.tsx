"use client";
import React from "react";

const dummyConversations = [
    {
        id: 1,
        name: "Nguyễn Thanh Tùng",
        avatar: "/images/avatar/avatar1.png",
        lastMessage: "Hey, how are you?",
        lastTime: "2:45 PM",
    },
    {
        id: 2,
        name: "Tùng Thanh Nguyễn",
        avatar: "/images/avatar/avatar2.png",
        lastMessage: "Let's catch up tomorrow.",
        lastTime: "1:30 PM",
    },
    {
        id: 3,
        name: "Tùng Nguyễn Thanh",
        avatar: "/images/avatar/avatar3.png",
        lastMessage: "Can you send the files?",
        lastTime: "12:15 PM",
    },
];

const dummyMessages = [
    {
        id: 1,
        sender: "Nguyễn Thanh Tùng",
        text: "Hello! Chat có hoạt động hay không?",
        time: "2:40 PM",
        isMe: false,
    },
    {
        id: 2,
        sender: "Me",
        text: "Nếu rảnh, tôi sẽ code nó trong tương lai",
        time: "2:41 PM",
        isMe: true,
    },
    {
        id: 3,
        sender: "Alice Johnson",
        text: "Great! Are you free this weekend?",
        time: "2:42 PM",
        isMe: false,
    },
    {
        id: 4,
        sender: "Me",
        text: "Yes, nhưng tôi không muốn code chat.",
        time: "2:43 PM",
        isMe: true,
    },
];

const ChatPage: React.FC = () => {
    return (
        <div className="h-[calc(100vh-64px)] flex">
            {/* Sidebar - Danh sách cuộc trò chuyện */}
            <aside className="w-1/3 border-r border-gray-200 p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Conversations</h2>
                <ul className="space-y-4">
                    {dummyConversations.map((conv) => (
                        <li
                            key={conv.id}
                            className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            <img
                                src={conv.avatar}
                                alt={conv.name}
                                className="w-12 h-12 rounded-full p-1 border-2 mr-3 object-cover"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-gray-800">{conv.name}</h3>
                                    <span className="text-xs text-gray-500">{conv.lastTime}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Area */}
            <main className="flex flex-col flex-grow p-4">
                {/* Header của cuộc trò chuyện */}
                <header className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center">
                        <img
                            src="/images/avatar/avatar1.png"
                            alt="Alice Johnson"
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">
                                🎉 "Exciting things are coming! Chat feature is on its way!"{" "}
                            </h3>
                            <span className="text-xs text-green-500">Online</span>
                        </div>
                    </div>
                    <div>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            {/* Biểu tượng cài đặt */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Vùng tin nhắn */}
                <div className="flex-grow overflow-y-auto my-4 space-y-4 px-2">
                    {dummyMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs p-3 rounded-lg ${
                                    msg.isMe
                                        ? "bg-violet-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <span className="block text-xs mt-1 text-right">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Khu vực nhập tin nhắn */}
                <div className="border-t border-gray-200 pt-3 flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        {/* Icon Attachment */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L21 8.828a4 4 0 10-5.657-5.657L7 10.172"
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors">
                        Send
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
