"use client";

import React, { useState } from "react";

const grammarTopics = [
    {
        title: "Present Simple (Thì hiện tại đơn)",
        desc: "Diễn tả thói quen, sự thật hiển nhiên, lịch trình.",
        level: "Beginner",
        tags: ["Tenses", "Basic"],
        structure: "S + V(s/es) + ...",
        example: ["I go to school every day.", "The sun rises in the east."],
        tips: "Động từ thêm 's/es' với chủ ngữ số ít. Thường dùng với: always, usually, often, every...",
        highlight: true,
    },
    {
        title: "Present Continuous (Thì hiện tại tiếp diễn)",
        desc: "Diễn tả hành động đang xảy ra tại thời điểm nói.",
        level: "Beginner",
        tags: ["Tenses", "Action"],
        structure: "S + am/is/are + V-ing + ...",
        example: ["She is reading a book now.", "They are playing football."],
        tips: "Dùng với now, at the moment. Động từ thêm -ing.",
        highlight: false,
    },
    {
        title: "First Conditional (Câu điều kiện loại 1)",
        desc: "Diễn tả điều kiện có thật ở hiện tại hoặc tương lai.",
        level: "Intermediate",
        tags: ["Conditional", "If-clause"],
        structure: "If + S + V (hiện tại), S + will/can/may + V",
        example: ["If it rains, I will stay at home."],
        tips: "Mệnh đề if dùng thì hiện tại, mệnh đề chính dùng will/can/may + V.",
        highlight: false,
    },
    {
        title: "Comparative (So sánh hơn)",
        desc: "So sánh giữa hai đối tượng.",
        level: "Beginner",
        tags: ["Comparison", "Adjective"],
        structure: "S + be + adj-er/more adj + than ...",
        example: ["This book is cheaper than that one."],
        tips: "Tính từ ngắn thêm -er, tính từ dài dùng more. Đừng quên 'than'!",
        highlight: false,
    },
    {
        title: "Passive Voice (Câu bị động)",
        desc: "Nhấn mạnh hành động hơn là người thực hiện.",
        level: "Intermediate",
        tags: ["Passive", "Transformation"],
        structure: "S + be + V3/ed (+ by O)",
        example: ["The cake was eaten by Tom."],
        tips: "Chủ động → bị động: tân ngữ thành chủ ngữ, động từ về V3/ed.",
        highlight: true,
    },
    {
        title: "Relative Clauses (Mệnh đề quan hệ)",
        desc: "Nối hai mệnh đề, bổ nghĩa cho danh từ.",
        level: "Advanced",
        tags: ["Clause", "Connector"],
        structure: "N (person/thing) + who/which/that + V ...",
        example: ["The man who called you is my uncle."],
        tips: "Who cho người, which cho vật, that thay thế cả hai.",
        highlight: false,
    },
    // ...có thể bổ sung thêm nhiều chủ điểm khác
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const allTags = Array.from(new Set(grammarTopics.flatMap((t) => t.tags)));

export default function GrammarLibrary() {
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("All");
    const [tag, setTag] = useState("All");
    const [selected, setSelected] = useState<number | null>(null);

    const filtered = grammarTopics.filter(
        (t) =>
            (level === "All" || t.level === level) &&
            (tag === "All" || t.tags.includes(tag)) &&
            (t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.desc.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full border border-pink-100">
                <h1 className="text-3xl font-bold text-pink-800 mb-2 text-center">
                    Grammar Library
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tổng hợp các chủ điểm ngữ pháp tiếng Anh quan trọng, có tìm
                    kiếm, lọc, ví dụ, tips, highlight.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        className="flex-1 border border-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                        placeholder="Tìm kiếm chủ điểm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="border border-pink-200 rounded-lg px-3 py-2"
                    >
                        {levels.map((l) => (
                            <option key={l}>{l}</option>
                        ))}
                    </select>
                    <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="border border-pink-200 rounded-lg px-3 py-2"
                    >
                        <option>All</option>
                        {allTags.map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-4">
                    {filtered.length === 0 && (
                        <div className="text-center text-gray-400">
                            Không tìm thấy chủ điểm phù hợp.
                        </div>
                    )}
                    {filtered.map((topic, idx) => (
                        <div
                            key={idx}
                            className={`transition border rounded-xl p-5 shadow-sm ${
                                topic.highlight
                                    ? "border-pink-400 bg-pink-50/80"
                                    : "border-pink-100 bg-white"
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                            topic.level === "Beginner"
                                                ? "bg-green-100 text-green-700"
                                                : topic.level === "Intermediate"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {topic.level}
                                    </span>
                                    {topic.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full ml-1"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                    {topic.highlight && (
                                        <span className="ml-2 text-pink-600 font-bold animate-pulse">
                                            ★ Hot
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="text-pink-600 underline text-sm"
                                    onClick={() =>
                                        setSelected(
                                            selected === idx ? null : idx
                                        )
                                    }
                                >
                                    {selected === idx
                                        ? "Ẩn chi tiết"
                                        : "Xem chi tiết"}
                                </button>
                            </div>
                            <div className="mt-2 font-semibold text-lg text-pink-800">
                                {topic.title}
                            </div>
                            <div className="text-gray-700 mb-2">
                                {topic.desc}
                            </div>
                            {selected === idx && (
                                <div className="mt-2 bg-pink-50 border border-pink-200 rounded-lg p-4">
                                    <div className="mb-2">
                                        <span className="font-semibold text-pink-700">
                                            Cấu trúc:
                                        </span>{" "}
                                        <span className="font-mono">
                                            {topic.structure}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold text-pink-700">
                                            Ví dụ:
                                        </span>
                                        <ul className="list-disc pl-6 text-gray-800">
                                            {topic.example.map((ex, i) => (
                                                <li key={i}>{ex}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold text-pink-700">
                                            Tips:
                                        </span>{" "}
                                        <span className="italic">
                                            {topic.tips}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
