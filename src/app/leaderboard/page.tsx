import React from "react";

const mockLeaders = [
    { name: "Nguyen Van A", points: 1200, avatar: "/images/avatar/ceo.png" },
    { name: "Tran Thi B", points: 1100, avatar: "/images/avatar/cto.png" },
    { name: "Le Van C", points: 1050, avatar: "/images/avatar/lead.png" },
    { name: "Pham D", points: 950, avatar: "/images/avatar/ceo.png" },
    { name: "Hoang E", points: 900, avatar: "/images/avatar/cto.png" },
];

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-yellow-100">
                <h1 className="text-3xl font-bold text-yellow-700 mb-2 text-center">
                    Leaderboard
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Bảng xếp hạng học viên tích cực nhất tuần này.
                </p>
                <ol className="space-y-4">
                    {mockLeaders.map((user, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                        >
                            <div className="text-2xl font-bold text-yellow-700 w-8 text-center">
                                {idx + 1}
                            </div>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-yellow-300"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-yellow-800">
                                    {user.name}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {user.points} điểm
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
