import React, { useState } from "react";

const games = [
    {
        name: "Word Match",
        desc: "Nối từ tiếng Anh với nghĩa tiếng Việt đúng.",
        comingSoon: false,
    },
    {
        name: "Grammar Quiz",
        desc: "Trắc nghiệm ngữ pháp theo chủ đề.",
        comingSoon: false,
    },
    {
        name: "Listening Bingo",
        desc: "Nghe và đánh dấu từ đúng trên bảng Bingo.",
        comingSoon: true,
    },
    {
        name: "Picture Vocabulary",
        desc: "Chọn từ đúng cho hình ảnh minh hoạ.",
        comingSoon: true,
    },
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-purple-100">
                <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">
                    Games & Quizzes
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Vừa học vừa chơi với các trò chơi tiếng Anh thú vị, luyện từ
                    vựng, ngữ pháp, nghe hiểu.
                </p>
                <div className="space-y-6">
                    {games.map((game, idx) => (
                        <div
                            key={idx}
                            className="bg-purple-50 border border-purple-200 rounded-xl p-6 flex items-center justify-between"
                        >
                            <div>
                                <div className="text-lg font-semibold text-purple-700 mb-1">
                                    {game.name}
                                </div>
                                <div className="text-gray-700 mb-2">
                                    {game.desc}
                                </div>
                            </div>
                            {game.comingSoon ? (
                                <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Sắp ra mắt
                                </span>
                            ) : (
                                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg">
                                    Chơi ngay
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
