"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const TestPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1800);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`/questions/1.txt`);
                const text = await res.text();
                const parsedQuestions: any = text.split("\n").map((line) => {
                    const parts = line.split("|");
                    return {
                        id: parseInt(parts[0]),
                        question: parts[1],
                        options: parts.slice(2, 6),
                        answer: parts[6],
                    };
                });
                setQuestions(parsedQuestions);
            } catch (error) {
                console.error("Lỗi tải câu hỏi:", error);
            }
        };
        fetchQuestions();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSelect = (qId, option) => {
        setUserAnswers((prev) => ({ ...prev, [qId]: option }));
    };

    const handleSubmit = () => {
        let correctCount: any = 0;
        questions.forEach((q: any) => {
            if (userAnswers[q.id] === q.answer) {
                correctCount += 1;
            }
        });
        setScore(correctCount);
    };

    return (
        <div className="container mx-auto max-w-7xl p-6 flex gap-6">
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Test {id}</h1>
                <div className="space-y-6">
                    {questions.map((q: any) => (
                        <div key={q.id} className="p-5 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-3">{q.question}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {q.options.map((opt, index) => (
                                    <button
                                        key={index}
                                        className={`w-full p-3 rounded-lg border text-left font-medium transition-all
                                            ${
                                                userAnswers[q.id] === opt.charAt(0)
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "border-gray-300 hover:bg-gray-200"
                                            }`}
                                        onClick={() => handleSelect(q.id, opt.charAt(0))}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-64 bg-white shadow-lg rounded-lg p-4 sticky top-24 h-fit">
                <div className="text-center text-lg font-semibold text-red-500 mb-4">
                    <img
                        className="inline-block w-6 h-6 mr-4"
                        src="/icons/clock.png"
                        alt="Notifications"
                    />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                    {questions.map((q: any) => (
                        <button
                            key={q.id}
                            className={`w-10 h-10 rounded-full font-bold transition-all
                                ${
                                    userAnswers[q.id]
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {q.id}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-green-500 text-white text-lg font-semibold px-4 py-3 rounded-lg w-full hover:bg-green-600 transition"
                >
                    Finish Test
                </button>
                {score !== null && (
                    <p className="text-center mt-4 text-xl font-bold text-blue-600">
                        Điểm số: {score}/{questions.length}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TestPage;
