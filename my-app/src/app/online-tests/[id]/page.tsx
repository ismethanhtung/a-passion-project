"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addProgress } from "@/api/progress";

interface Question {
    id: number;
    question: string;
    options: string[];
    answer: string;
}

interface Test {
    id: string | number;
    title: string;
    description: string;
    duration: string;
    participants: number;
    comments: number;
    tags: string[];
    category?: string;
}

const tests: Test[] = [
    {
        id: "placement-test-1",
        title: "Bài Kiểm Tra Đầu Vào",
        description: "Đánh giá trình độ tiếng Anh trước khi học.",
        duration: "120 phút",
        participants: 0,
        comments: 0,
        tags: ["Placement Test", "TOEIC", "Grammar", "Reading"],
    },
    {
        id: "placement-test-2",
        title: "Bài Kiểm Tra Đầu Vào Từ Vựng",
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
        description: "Kiểm tra kiến thức về ngữ pháp và đọc hiểu văn bản tiếng Anh.",
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
const TestPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [score, setScore] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(1800);
    const [loading, setLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);

    const user = useSelector((state: RootState) => state.user.user);

    // Cảnh báo rời trang
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Nếu bạn rời khỏi trang, bài làm hiện tại sẽ không được lưu lại.";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (!user) {
            router.push("/auth/login");
            return;
        }
    }, [isMounted, user, router]);

    const userId = user ? parseInt(user.id) : 0;
    const currentTest = tests.find((t) => t.id.toString() === id);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`/questions/1.txt`);
                const text = await res.text();
                const parsedQuestions: Question[] = text.split("\n").map((line) => {
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
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [id]);

    // Đếm ngược thời gian
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSelect = (qId: number, option: string) => {
        setUserAnswers((prev) => ({ ...prev, [qId]: option }));
    };

    const handleSubmit = async () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn nộp bài?");
        if (!confirmed) return;

        let correctCount = 0;
        questions.forEach((q) => {
            if (userAnswers[q.id] === q.answer) {
                correctCount += 1;
            }
        });
        const calculatedScore = Math.round((correctCount / questions.length) * 1000);
        setScore(calculatedScore);
        setShowResult(true);

        try {
            await addProgress({
                userId: userId,
                lessonId: 1,
                enrollmentId: 1,
                status: currentTest?.title,
                score: calculatedScore,
                testScores: userAnswers,
            });
            console.log("Score updated successfully");
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    if (!isMounted || loading) {
        return <div className="container mx-auto p-6 text-center">Loading...</div>;
    }

    // Trang kết quả
    if (showResult) {
        return (
            <div className="container mx-auto max-w-4xl p-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                    Kết Quả: {currentTest?.title}
                </h1>
                <p className="text-xl font-semibold text-blue-700 mb-6 text-center">
                    Điểm số: {score}/990
                </p>
                <div className="space-y-6">
                    {questions.map((q, idx) => {
                        const userAns = userAnswers[q.id] || "Chưa trả lời";
                        const isCorrect = userAns === q.answer;
                        return (
                            <div
                                key={q.id}
                                className="p-5 bg-gray-50 rounded-lg shadow border border-gray-200"
                            >
                                <h2 className="text-lg font-medium mb-2">
                                    Câu {idx + 100}: {q.question}
                                </h2>
                                <div className="space-y-2">
                                    {q.options.map((opt, index) => {
                                        const optionValue = opt.charAt(0);
                                        const isOptionCorrect = optionValue === q.answer;
                                        return (
                                            <div
                                                key={index}
                                                className={`p-2 rounded border ${
                                                    isOptionCorrect
                                                        ? "bg-green-100 border-green-500"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-3">
                                    <p
                                        className={`font-medium ${
                                            isCorrect ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        Đáp án của bạn: {userAns}
                                    </p>
                                    {!isCorrect && (
                                        <p className="font-medium text-green-600">
                                            Đáp án đúng: {q.answer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Trang làm bài test
    return (
        <div className="container mx-auto max-w-7xl pt-8 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6 border border-violet-200">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">
                    Test: {currentTest?.title}
                </h1>
                {questions.length === 0 ? (
                    <p className="text-gray-600">No questions available.</p>
                ) : (
                    <div className="space-y-6">
                        {questions.map(({ id, question, options }) => (
                            <div
                                key={id}
                                className="p-5 bg-gray-50 rounded-lg shadow border border-gray-200"
                            >
                                <h2 className="text-lg font-medium mb-3">
                                    Câu {id + 100}: {question}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {options.map((opt, idx) => {
                                        const optionValue = opt.charAt(0);
                                        const selected = userAnswers[id] === optionValue;
                                        return (
                                            <button
                                                key={idx}
                                                className={`w-full p-3 rounded-lg border text-left font-medium transition-all ${
                                                    selected
                                                        ? "bg-blue-500 text-white border-blue-500"
                                                        : "border-gray-300 hover:bg-gray-100"
                                                }`}
                                                onClick={() => handleSelect(id, optionValue)}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg rounded-lg p-4 sticky top-24 h-fit border border-violet-200">
                <div className="text-center text-lg font-semibold text-red-500 mb-4 flex justify-center items-center gap-2">
                    <img className="w-6 h-6" src="/icons/clock.png" alt="Time" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                    {questions.map(({ id }) => (
                        <button
                            key={id}
                            className={`w-10 h-10 rounded-full font-bold transition-all text-gray-800 ${
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
            </div>
        </div>
    );
};

export default TestPage;
