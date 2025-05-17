"use client";

import React, { useState } from "react";

const videoLessons = [
    {
        title: "Giao tiếp cơ bản tại sân bay",
        desc: "Học các mẫu câu, từ vựng và tình huống thực tế khi làm thủ tục tại sân bay.",
        video: "https://www.youtube.com/embed/8yQ2V3K2Q1w",
        level: "Beginner",
        transcript: [
            "A: Where is the check-in counter?",
            "B: It's over there, next to the information desk.",
            "A: Thank you!",
        ],
        vocab: [
            { word: "check-in counter", meaning: "quầy làm thủ tục" },
            { word: "information desk", meaning: "bàn thông tin" },
        ],
        quiz: {
            question: "What does 'check-in counter' mean?",
            options: [
                "Quầy làm thủ tục",
                "Bàn thông tin",
                "Cửa ra máy bay",
                "Phòng chờ",
            ],
            answer: 0,
        },
        highlight: true,
    },
    {
        title: "Phỏng vấn xin việc bằng tiếng Anh",
        desc: "Các tips, mẫu câu và lỗi thường gặp khi phỏng vấn xin việc.",
        video: "https://www.youtube.com/embed/1t8hG6hHh2w",
        level: "Intermediate",
        transcript: [
            "A: Tell me about yourself.",
            "B: I graduated from university last year and have experience in marketing...",
        ],
        vocab: [
            { word: "graduate", meaning: "tốt nghiệp" },
            { word: "experience", meaning: "kinh nghiệm" },
        ],
        quiz: {
            question:
                "What is a good way to start answering 'Tell me about yourself'?",
            options: [
                "Nói về sở thích",
                "Nói về kinh nghiệm và học vấn",
                "Nói về gia đình",
                "Nói về bạn bè",
            ],
            answer: 1,
        },
        highlight: false,
    },
    {
        title: "Luyện nghe IELTS Listening Part 1",
        desc: "Chiến lược, ví dụ thực tế và luyện tập nghe cho phần 1 IELTS.",
        video: "https://www.youtube.com/embed/2Xc9gXyf2G4",
        level: "Advanced",
        transcript: [
            "A: Can I book a table for two at 7pm?",
            "B: Certainly, may I have your name, please?",
        ],
        vocab: [
            { word: "book a table", meaning: "đặt bàn" },
            { word: "certainly", meaning: "chắc chắn rồi" },
        ],
        quiz: {
            question: "What does 'book a table' mean?",
            options: ["Đặt bàn", "Đặt vé", "Đặt phòng", "Đặt taxi"],
            answer: 0,
        },
        highlight: false,
    },
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function VideoLessons() {
    const [level, setLevel] = useState("All");
    const [selected, setSelected] = useState<number | null>(null);
    const [quizAnswer, setQuizAnswer] = useState<{
        [key: number]: number | null;
    }>({});
    const [showTranscript, setShowTranscript] = useState<{
        [key: number]: boolean;
    }>({});
    const filtered = videoLessons.filter(
        (v) => level === "All" || v.level === level
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full border border-indigo-100">
                <h1 className="text-3xl font-bold text-indigo-800 mb-2 text-center">
                    Video Lessons
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Học tiếng Anh qua video thực tế, có transcript, từ vựng,
                    quiz, highlight bài học quan trọng.
                </p>
                <div className="flex gap-4 mb-6 justify-center">
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="border border-indigo-200 rounded-lg px-3 py-2"
                    >
                        {levels.map((l) => (
                            <option key={l}>{l}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-6">
                    {filtered.map((v, idx) => (
                        <div
                            key={idx}
                            className={`transition border rounded-xl p-5 shadow-sm ${
                                v.highlight
                                    ? "border-indigo-400 bg-indigo-50/80"
                                    : "border-indigo-100 bg-white"
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                            v.level === "Beginner"
                                                ? "bg-green-100 text-green-700"
                                                : v.level === "Intermediate"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {v.level}
                                    </span>
                                    {v.highlight && (
                                        <span className="ml-2 text-indigo-600 font-bold animate-pulse">
                                            ★ Hot
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="text-indigo-600 underline text-sm"
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
                            <div className="mt-2 font-semibold text-lg text-indigo-800">
                                {v.title}
                            </div>
                            <div className="text-gray-700 mb-2">{v.desc}</div>
                            {selected === idx && (
                                <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                    <div className="aspect-video w-full mb-4">
                                        <iframe
                                            src={v.video}
                                            title={v.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-64 rounded-lg border"
                                        ></iframe>
                                    </div>
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        <button
                                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold"
                                            onClick={() =>
                                                setShowTranscript((s) => ({
                                                    ...s,
                                                    [idx]: !s[idx],
                                                }))
                                            }
                                        >
                                            {showTranscript[idx]
                                                ? "Ẩn transcript"
                                                : "Xem transcript"}
                                        </button>
                                    </div>
                                    {showTranscript[idx] && (
                                        <div className="mb-2 bg-white border border-indigo-100 rounded p-3 text-sm text-gray-700">
                                            {v.transcript.map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mb-2">
                                        <span className="font-semibold text-indigo-700">
                                            Từ vựng nổi bật:
                                        </span>
                                        <ul className="list-disc pl-6 text-gray-800">
                                            {v.vocab.map((vw, i) => (
                                                <li key={i}>
                                                    <span className="font-bold text-indigo-700">
                                                        {vw.word}
                                                    </span>
                                                    : {vw.meaning}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold text-indigo-700">
                                            Quiz:
                                        </span>
                                        <div className="mt-1">
                                            <div className="mb-1">
                                                {v.quiz.question}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {v.quiz.options.map(
                                                    (opt, oidx) => (
                                                        <button
                                                            key={oidx}
                                                            className={`text-left px-3 py-2 rounded border ${
                                                                quizAnswer[
                                                                    idx
                                                                ] === oidx
                                                                    ? oidx ===
                                                                      v.quiz
                                                                          .answer
                                                                        ? "bg-green-100 border-green-400"
                                                                        : "bg-red-100 border-red-400"
                                                                    : "border-indigo-100 hover:bg-indigo-50"
                                                            }`}
                                                            onClick={() =>
                                                                setQuizAnswer(
                                                                    (a) => ({
                                                                        ...a,
                                                                        [idx]: oidx,
                                                                    })
                                                                )
                                                            }
                                                            disabled={
                                                                quizAnswer[
                                                                    idx
                                                                ] !== undefined
                                                            }
                                                        >
                                                            {opt}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            {quizAnswer[idx] !== undefined && (
                                                <div
                                                    className={`mt-2 text-sm font-semibold ${
                                                        quizAnswer[idx] ===
                                                        v.quiz.answer
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {quizAnswer[idx] ===
                                                    v.quiz.answer
                                                        ? "Chính xác!"
                                                        : `Sai. Đáp án đúng: ${
                                                              v.quiz.options[
                                                                  v.quiz.answer
                                                              ]
                                                          }`}
                                                </div>
                                            )}
                                        </div>
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
