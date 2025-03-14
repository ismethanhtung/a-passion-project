"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { addProgress } from "@/api/progress";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addEnrollment } from "@/api/enrollment";

interface Question {
    id: number;
    question: string;
    options: string[];
    answer: string;
}

const tests = [
    {
        id: "placement-test-1",
        title: " Bài Kiểm Tra Đầu Vào",
        description: "Đánh giá trình độ tiếng Anh trước khi học.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Placement Test", "TOEIC", "Grammar", "Reading"],
    },
    {
        id: "placement-test-2",
        title: " Bài Kiểm Tra Đầu Vào Từ Vựng",
        description: "Đánh giá kiến thức từ vựng trước khi học.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Placement Test", "Vocabulary"],
    },
    {
        id: 2,
        title: "Economy (old format) TOEIC 4 Test 1",
        description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "TOEIC"],
    },
    {
        id: 3,
        title: "Longman TOEIC (old format) Test 2",
        description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "Reading", "TOEIC"],
    },
    {
        id: 4,
        title: "Economy Y1 TOEIC Test 2",
        description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "Reading", "TOEIC", "Grammar"],
    },
    {
        id: 5,
        title: "Economy (old format) TOEIC 4 Test 2",
        description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "TOEIC"],
    },
    {
        id: 6,
        title: "Economy Longman TOEIC (old format) Test 3",
        description: "Bài test đánh giá kỹ năng nghe tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "Reading", "TOEIC"],
    },
    {
        id: 7,
        title: "New Economy TOEIC(old format) Test 4",
        description: "Kiểm tra kiến thức về ngữ pháp tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "TOEIC", "Grammar"],
    },
    {
        id: 8,
        title: "Economy (old format) IELTS Simulation 4 Test 2",
        description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "IELTS"],
    },
    {
        id: 9,
        title: "Economy Y1 TOEIC(old format) Test 2",
        description: "Kiểm tra kỹ năng đọc và hiểu văn bản tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "Reading", "TOEIC"],
    },
    {
        id: 10,
        title: "New Economy (old format) IELTS Simulation 4 Test 2",
        description: "Đánh giá khả năng ghi nhớ và sử dụng từ vựng.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "IELTS"],
    },
    {
        id: 11,
        title: "New format Economy TOEIC Test 1",
        description: "Kiểm tra kiến thức về ngữ pháp và đọc và hiểu văn bản tiếng Anh.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Part 5", "TOEIC", "Grammar"],
        category: "Economy",
    },
    {
        id: 12,
        title: "Bài Kiểm Tra TOEIC New Format Economy",
        description: "Bài test giúp luyện tập và kiểm tra khả năng sử dụng ngữ pháp và đọc hiểu.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["TOEIC", "Grammar", "Reading"],
        category: "New Economy",
    },
    {
        id: 13,
        title: "Bài Kiểm Tra IELTS New Economy",
        description:
            "Bài test mô phỏng đề thi IELTS giúp kiểm tra khả năng đọc hiểu và sử dụng từ vựng",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["IELTS", "Reading", "Vocab"],
        category: "New Economy",
    },
];

const TestPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(1800);
    const user = useSelector((state: RootState) => state.user.user);
    if (!user) {
        router.push("/auth/login");
        return;
    }
    console.log(user);
    const userId = parseInt(user.id);

    const test = tests.find((t) => t.id.toString() === id);

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

    const handleSubmit = async () => {
        let correctCount: any = 0;
        questions.forEach((q: any) => {
            if (userAnswers[q.id] === q.answer) {
                correctCount += 1;
            }
        });

        const toeicScore: any = Math.round((correctCount / questions.length) * 1000);
        setScore(toeicScore);

        try {
            await addProgress({
                userId: userId,
                lessonId: 1,
                enrollmentId: 1,
                status: test?.title,
                score: toeicScore,
                testScores: userAnswers,
            });

            console.log("Score updated successfully");
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    return (
        <div className="container mx-auto max-w-7xl p-6 flex gap-6">
            {/* Nội dung bài test */}
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Test {test?.title}</h1>
                <div className="space-y-6">
                    {questions.map(({ id, question, options }) => (
                        <div key={id} className="p-5 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-3">{question}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {options.map((opt, idx) => {
                                    const selected = userAnswers[id] === opt.charAt(0);
                                    return (
                                        <button
                                            key={idx}
                                            className={`w-full p-3 rounded-lg border text-left font-medium transition-all 
                                            ${
                                                selected
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "border-gray-300 hover:bg-gray-200"
                                            }`}
                                            onClick={() => handleSelect(id, opt.charAt(0))}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg rounded-lg p-4 sticky top-24 h-fit">
                <div className="text-center text-lg font-semibold text-red-500 mb-4 flex justify-center items-center gap-2">
                    <img className="w-6 h-6" src="/icons/clock.png" alt="Time" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                    {questions.map(({ id }) => (
                        <button
                            key={id}
                            className={`w-10 h-10 rounded-full font-bold transition-all 
                            ${
                                userAnswers[id]
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {id}
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
                        Điểm số: {score}/990
                    </p>
                )}
            </div>
        </div>
    );
};

export default TestPage;
