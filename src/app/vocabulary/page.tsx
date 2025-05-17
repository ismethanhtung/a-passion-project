"use client";

import React, { useState } from "react";

const vocabularySets = [
    {
        topic: "Công việc (Work)",
        words: [
            { word: "resume", meaning: "sơ yếu lý lịch" },
            { word: "promotion", meaning: "thăng chức" },
            { word: "colleague", meaning: "đồng nghiệp" },
            { word: "salary", meaning: "lương" },
            { word: "deadline", meaning: "hạn chót" },
        ],
    },
    {
        topic: "Du lịch (Travel)",
        words: [
            { word: "passport", meaning: "hộ chiếu" },
            { word: "luggage", meaning: "hành lý" },
            { word: "itinerary", meaning: "lịch trình" },
            { word: "souvenir", meaning: "quà lưu niệm" },
            { word: "destination", meaning: "điểm đến" },
        ],
    },
    {
        topic: "Ẩm thực (Food)",
        words: [
            { word: "ingredient", meaning: "nguyên liệu" },
            { word: "recipe", meaning: "công thức nấu ăn" },
            { word: "cuisine", meaning: "ẩm thực" },
            { word: "delicious", meaning: "ngon" },
            { word: "spicy", meaning: "cay" },
        ],
    },
];

export default function VocabularyBuilder() {
    const [index, setIndex] = useState(0);
    const set = vocabularySets[index];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-emerald-100">
                <h1 className="text-3xl font-bold text-emerald-800 mb-2 text-center">
                    Vocabulary Builder
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Học từ vựng theo chủ đề, có nghĩa tiếng Việt, giao diện đẹp,
                    dễ nhớ.
                </p>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-emerald-700 mb-2">
                        {set.topic}
                    </h2>
                    <ul className="list-disc pl-6 text-gray-800">
                        {set.words.map((w, i) => (
                            <li key={i} className="mb-1">
                                <span className="font-bold text-emerald-700">
                                    {w.word}
                                </span>
                                : {w.meaning}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === 0 ? vocabularySets.length - 1 : i - 1
                            )
                        }
                    >
                        Trước
                    </button>
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === vocabularySets.length - 1 ? 0 : i + 1
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
