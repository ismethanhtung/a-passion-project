import React from "react";

const grammarTopics = [
    {
        title: "Thì hiện tại đơn (Present Simple)",
        desc: "Diễn tả thói quen, sự thật hiển nhiên, lịch trình.",
        example: ["I go to school every day.", "The sun rises in the east."],
    },
    {
        title: "Thì hiện tại tiếp diễn (Present Continuous)",
        desc: "Diễn tả hành động đang xảy ra tại thời điểm nói.",
        example: ["She is reading a book now.", "They are playing football."],
    },
    {
        title: "Câu điều kiện loại 1 (First Conditional)",
        desc: "Diễn tả điều kiện có thật ở hiện tại hoặc tương lai.",
        example: ["If it rains, I will stay at home."],
    },
    {
        title: "So sánh hơn (Comparative)",
        desc: "So sánh giữa hai đối tượng.",
        example: ["This book is cheaper than that one."],
    },
    {
        title: "Câu bị động (Passive Voice)",
        desc: "Nhấn mạnh hành động hơn là người thực hiện.",
        example: ["The cake was eaten by Tom."],
    },
];

export default function GrammarLibrary() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-pink-100">
                <h1 className="text-3xl font-bold text-pink-800 mb-2 text-center">
                    Grammar Library
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tổng hợp các chủ điểm ngữ pháp tiếng Anh quan trọng, ví dụ
                    minh hoạ rõ ràng.
                </p>
                <div className="space-y-6">
                    {grammarTopics.map((topic, idx) => (
                        <div
                            key={idx}
                            className="bg-pink-50 border border-pink-200 rounded-xl p-6"
                        >
                            <div className="text-lg font-semibold text-pink-700 mb-1">
                                {topic.title}
                            </div>
                            <div className="text-gray-700 mb-2">
                                {topic.desc}
                            </div>
                            <div className="text-sm text-gray-600">Ví dụ:</div>
                            <ul className="list-disc pl-6 text-gray-800">
                                {topic.example.map((ex, i) => (
                                    <li key={i}>{ex}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
