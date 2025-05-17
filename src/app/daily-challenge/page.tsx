"use client";
import React, { useState } from "react";

const challenges = [
    {
        title: "Từ vựng trong ngày",
        description: "Học 5 từ vựng mới về chủ đề công việc.",
        example: ["resume", "interview", "promotion", "salary", "colleague"],
    },
    {
        title: "Viết câu hoàn chỉnh",
        description: "Viết một câu sử dụng thì hiện tại hoàn thành.",
        example: [
            "I have finished my homework.",
            "She has just left the office.",
        ],
    },
    {
        title: "Nghe hiểu ngắn",
        description: "Nghe đoạn audio và chọn đáp án đúng.",
        example: ["Audio: 'The meeting starts at 9.' → Đáp án: 9 o'clock"],
    },
    {
        title: "Phát âm chuẩn",
        description: "Luyện phát âm từ 'through' và 'though'.",
        example: ["through", "though"],
    },
];

export default function DailyChallenge() {
    const [index, setIndex] = useState(0);
    const challenge = challenges[index];

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full border border-yellow-100">
                <h1 className="text-3xl font-bold text-yellow-700 mb-2 text-center">
                    Daily Challenge
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Thử thách mỗi ngày giúp bạn duy trì động lực học tiếng Anh!
                </p>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-yellow-700 mb-2">
                        {challenge.title}
                    </h2>
                    <p className="text-gray-700 mb-2">
                        {challenge.description}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                        <div className="font-semibold mb-1">Ví dụ:</div>
                        <ul className="list-disc pl-5">
                            {challenge.example.map((ex, i) => (
                                <li key={i}>{ex}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === 0 ? challenges.length - 1 : i - 1
                            )
                        }
                    >
                        Trước
                    </button>
                    <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === challenges.length - 1 ? 0 : i + 1
                            )
                        }
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}
