"use client";

import React, { useState } from "react";

const speakingPrompts = [
    {
        topic: "Introduce yourself",
        question: "Can you introduce yourself in English?",
        tips: "Nói về tên, tuổi, nghề nghiệp, sở thích. Ví dụ: My name is Anna. I am 20 years old. I like reading books.",
    },
    {
        topic: "Describe your hometown",
        question: "What is your hometown like?",
        tips: "Miêu tả vị trí, cảnh đẹp, con người. Ví dụ: My hometown is peaceful and beautiful. There are many green fields and friendly people.",
    },
    {
        topic: "Talk about your favorite food",
        question: "What is your favorite food and why?",
        tips: "Nói về món ăn, lý do yêu thích, hương vị. Ví dụ: My favorite food is Pho. It is delicious and healthy.",
    },
];

export default function SpeakingLab() {
    const [index, setIndex] = useState(0);
    const [showTip, setShowTip] = useState(false);
    const prompt = speakingPrompts[index];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-cyan-100">
                <h1 className="text-3xl font-bold text-cyan-800 mb-2 text-center">
                    Speaking Lab
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Luyện nói tiếng Anh với các chủ đề thực tế, có gợi ý và
                    tips.
                </p>
                <div className="mb-6 text-center">
                    <div className="text-xl font-semibold text-cyan-700 mb-1">
                        {prompt.topic}
                    </div>
                    <div className="text-gray-700 mb-2">{prompt.question}</div>
                    <button
                        className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold px-4 py-2 rounded-lg mb-2"
                        onClick={() => setShowTip((s) => !s)}
                    >
                        {showTip ? "Ẩn tips" : "Xem tips"}
                    </button>
                    {showTip && (
                        <div className="mt-2 text-cyan-800">{prompt.tips}</div>
                    )}
                </div>
                <div className="flex justify-between">
                    <button
                        className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === 0 ? speakingPrompts.length - 1 : i - 1
                            )
                        }
                    >
                        Trước
                    </button>
                    <button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg"
                        onClick={() =>
                            setIndex((i) =>
                                i === speakingPrompts.length - 1 ? 0 : i + 1
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
