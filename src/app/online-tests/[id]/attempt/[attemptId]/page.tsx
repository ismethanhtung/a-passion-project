"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

interface Question {
    id: number;
    content: string;
    type: string;
    options: string[];
    correctAnswer?: string;
    part: number;
    sectionType: string;
    explanation: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    order: number;
    groupId: number;
}

interface TestAttempt {
    id: number;
    testId: number;
    userId: number;
    startTime: string;
    endTime?: string;
    score?: number;
    completed: boolean;
    answers: any[];
}

interface TestData {
    id: number;
    title: string;
    description: string;
    instructions: string;
    testType: string;
    difficulty: string;
    duration: number;
    sections: Record<string, any>;
    isPublished: boolean;
}

interface AttemptPageProps {
    params: {
        id: string;
        attemptId: string;
    };
}

const TestAttemptPage = ({ params }: AttemptPageProps) => {
    const router = useRouter();
    const [test, setTest] = useState<TestData | null>(null);
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [groupedQuestions, setGroupedQuestions] = useState<
        Record<string, Record<number, Question[]>>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentSection, setCurrentSection] = useState<string>("");
    const [currentPart, setCurrentPart] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // Tải thông tin bài kiểm tra và lần thử
    useEffect(() => {
        const fetchTestAttempt = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    `Fetching test attempt: ${params.id}/${params.attemptId}`
                );
                const response = await fetch(
                    `/api/online-tests/${params.id}/attempt/${params.attemptId}`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(
                            "Bài kiểm tra hoặc lần thử không tồn tại"
                        );
                    }
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                            "Không thể tải thông tin bài kiểm tra"
                    );
                }

                const data = await response.json();
                console.log("Successfully fetched test attempt data");

                setTest(data.test);
                setAttempt(data.attempt);
                setQuestions(data.questions.list);
                setGroupedQuestions(data.questions.grouped);

                // Thiết lập phần và part đầu tiên
                if (data.questions.list.length > 0) {
                    const firstSection = Object.keys(data.questions.grouped)[0];
                    setCurrentSection(firstSection);

                    const firstPart = Object.keys(
                        data.questions.grouped[firstSection]
                    )[0];
                    setCurrentPart(parseInt(firstPart));

                    console.log(
                        `Set initial section to ${firstSection} and part to ${firstPart}`
                    );
                }

                // Thiết lập thời gian làm bài
                if (data.test && data.attempt) {
                    const startTime = new Date(
                        data.attempt.startTime
                    ).getTime();
                    const duration = data.test.duration * 60 * 1000; // convert minutes to milliseconds
                    const endTime = startTime + duration;
                    const now = Date.now();
                    const remaining = Math.max(0, endTime - now);
                    setTimeLeft(Math.floor(remaining / 1000));
                }

                // Tải các câu trả lời đã có
                if (
                    data.attempt &&
                    data.attempt.answers &&
                    data.attempt.answers.length > 0
                ) {
                    const answers: Record<number, string> = {};
                    data.attempt.answers.forEach((answer: any) => {
                        answers[answer.questionId] = answer.answer;
                    });
                    setUserAnswers(answers);
                }
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi khi tải bài kiểm tra");
                console.error("Error fetching test attempt:", err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id && params.attemptId) {
            fetchTestAttempt();
        } else {
            setError("ID bài kiểm tra hoặc lần thử không hợp lệ");
            setLoading(false);
        }
    }, [params.id, params.attemptId]);

    // Đếm ngược thời gian làm bài
    useEffect(() => {
        if (timeLeft <= 0 || !test) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, test]);

    // Lưu câu trả lời
    const saveAnswer = async (questionId: number, answer: string) => {
        if (!attempt) return;

        setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));

        // Auto save answers
        try {
            setSaving(true);
            const response = await fetch(
                `/api/online-tests/${params.id}/attempt/${params.attemptId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        answers: [
                            {
                                questionId,
                                answer,
                                isCorrect: false, // Đánh giá sau khi nộp bài
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                console.error("Failed to save answer");
            }
        } catch (error) {
            console.error("Error saving answer:", error);
        } finally {
            setSaving(false);
        }
    };

    // Nộp bài và kết thúc bài kiểm tra
    const endTest = async () => {
        if (!attempt || !test) return;

        try {
            setSaving(true);

            // Tính điểm (giả sử)
            const score = Math.floor(Math.random() * 100);

            // Cập nhật trạng thái lần thử
            const response = await fetch(
                `/api/online-tests/${params.id}/attempt/${params.attemptId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        completed: true,
                        score,
                        sectionScores: {
                            listening: Math.floor(Math.random() * 100),
                            reading: Math.floor(Math.random() * 100),
                        },
                        feedback: "Bài làm của bạn đã được nộp.",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Không thể nộp bài kiểm tra");
            }

            // Chuyển đến trang kết quả
            router.push(
                `/online-tests/${params.id}/results/${params.attemptId}`
            );
        } catch (error) {
            console.error("Error ending test:", error);
            alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    // Format thời gian còn lại
    const formatTimeLeft = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        return `${hours > 0 ? `${hours}:` : ""}${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    // Chuyển phần
    const changeSection = (section: string) => {
        setCurrentSection(section);
        const firstPart = Object.keys(groupedQuestions[section])[0];
        setCurrentPart(parseInt(firstPart));
    };

    // Chuyển part trong phần
    const changePart = (part: number) => {
        setCurrentPart(part);
    };

    // Render câu trả lời dựa trên loại câu hỏi
    const renderAnswerInput = (question: Question) => {
        const answer = userAnswers[question.id] || "";

        switch (question.type) {
            case "single":
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`q${question.id}_${index}`}
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={answer === option}
                                    onChange={() =>
                                        saveAnswer(question.id, option)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`q${question.id}_${index}`}
                                    className="ml-3 block text-sm text-gray-700"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case "multiple":
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`q${question.id}_${index}`}
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={answer.includes(option)}
                                    onChange={(e) => {
                                        let newAnswer = answer
                                            ? answer.split(",")
                                            : [];
                                        if (e.target.checked) {
                                            newAnswer.push(option);
                                        } else {
                                            newAnswer = newAnswer.filter(
                                                (a) => a !== option
                                            );
                                        }
                                        saveAnswer(
                                            question.id,
                                            newAnswer.join(",")
                                        );
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`q${question.id}_${index}`}
                                    className="ml-3 block text-sm text-gray-700"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case "fill":
            case "essay":
                return (
                    <textarea
                        id={`q${question.id}`}
                        name={`question_${question.id}`}
                        value={answer}
                        onChange={(e) =>
                            saveAnswer(question.id, e.target.value)
                        }
                        rows={5}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Nhập câu trả lời của bạn..."
                    />
                );
            case "speaking":
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Ghi âm câu trả lời hoặc luyện tập nói. Chức năng này
                            chưa được hỗ trợ trong phiên bản thử nghiệm.
                        </p>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <svg
                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Ghi âm
                        </button>
                    </div>
                );
            default:
                return (
                    <p className="text-sm text-gray-500">
                        Loại câu hỏi không được hỗ trợ.
                    </p>
                );
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !test || !attempt) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link
                        href="/online-tests"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Quay lại danh sách bài kiểm tra
                    </Link>
                </div>
                <div className="bg-red-50 rounded-lg p-6 text-red-700">
                    <h2 className="text-xl font-semibold mb-2">
                        Đã xảy ra lỗi
                    </h2>
                    <p>{error || "Không thể tải thông tin bài kiểm tra"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {test.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {test.testType} - {test.difficulty}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-medium">{formatTimeLeft()}</span>
                    </div>

                    <button
                        onClick={endTest}
                        disabled={saving}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                        )}
                        Nộp bài
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar navigation */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-lg font-medium">
                                Phần thi
                            </h3>
                            <div className="space-y-2">
                                {Object.keys(groupedQuestions).map(
                                    (section) => (
                                        <button
                                            key={section}
                                            onClick={() =>
                                                changeSection(section)
                                            }
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                                                currentSection === section
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="capitalize">
                                                {section}
                                            </span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {currentSection && groupedQuestions[currentSection] && (
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <h3 className="mb-3 text-lg font-medium">
                                    Phần {currentSection}
                                </h3>
                                <div className="space-y-2">
                                    {Object.keys(
                                        groupedQuestions[currentSection]
                                    ).map((part) => (
                                        <button
                                            key={part}
                                            onClick={() =>
                                                changePart(parseInt(part))
                                            }
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                                                currentPart === parseInt(part)
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            Part {part}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-lg font-medium">
                                Tiến độ
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Câu hỏi đã trả lời:</span>
                                    <span className="font-medium">
                                        {Object.keys(userAnswers).length}/
                                        {questions.length}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{
                                            width: `${
                                                (Object.keys(userAnswers)
                                                    .length /
                                                    questions.length) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions content */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        {currentSection &&
                        currentPart &&
                        groupedQuestions[currentSection] &&
                        groupedQuestions[currentSection][currentPart] ? (
                            <div className="space-y-8">
                                <div className="border-b border-gray-200 pb-4">
                                    <h2 className="text-lg font-medium capitalize">
                                        {currentSection} - Part {currentPart}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {groupedQuestions[currentSection][
                                            currentPart
                                        ][0]?.explanation ||
                                            "Trả lời các câu hỏi dưới đây."}
                                    </p>
                                </div>

                                {groupedQuestions[currentSection][
                                    currentPart
                                ].map((question) => (
                                    <div
                                        key={question.id}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-md font-medium mb-2">
                                                Câu {question.order}:{" "}
                                                {question.content}
                                            </h3>
                                            {question.imageUrl && (
                                                <div className="mt-3 mb-4">
                                                    <img
                                                        src={question.imageUrl}
                                                        alt={`Hình minh họa cho câu ${question.order}`}
                                                        className="max-w-full rounded-md"
                                                    />
                                                </div>
                                            )}
                                            {question.audioUrl && (
                                                <div className="mt-3 mb-4">
                                                    <audio
                                                        controls
                                                        className="w-full"
                                                    >
                                                        <source
                                                            src={
                                                                question.audioUrl
                                                            }
                                                            type="audio/mpeg"
                                                        />
                                                        Trình duyệt của bạn
                                                        không hỗ trợ audio.
                                                    </audio>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-2">
                                            {renderAnswerInput(question)}
                                        </div>
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            {userAnswers[question.id] ? (
                                                <span className="flex items-center text-green-500">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Đã trả lời
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-yellow-500">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Chưa trả lời
                                                </span>
                                            )}
                                            {saving &&
                                                userAnswers[question.id] && (
                                                    <span className="ml-2 flex items-center text-gray-400">
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        Đang lưu...
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={() => {
                                            const parts = Object.keys(
                                                groupedQuestions[currentSection]
                                            ).map(Number);
                                            const currentIndex =
                                                parts.indexOf(currentPart);
                                            if (currentIndex > 0) {
                                                changePart(
                                                    parts[currentIndex - 1]
                                                );
                                            } else {
                                                const sections =
                                                    Object.keys(
                                                        groupedQuestions
                                                    );
                                                const sectionIndex =
                                                    sections.indexOf(
                                                        currentSection
                                                    );
                                                if (sectionIndex > 0) {
                                                    const prevSection =
                                                        sections[
                                                            sectionIndex - 1
                                                        ];
                                                    const prevParts =
                                                        Object.keys(
                                                            groupedQuestions[
                                                                prevSection
                                                            ]
                                                        ).map(Number);
                                                    changeSection(prevSection);
                                                    changePart(
                                                        prevParts[
                                                            prevParts.length - 1
                                                        ]
                                                    );
                                                }
                                            }
                                        }}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        disabled={
                                            currentSection ===
                                                Object.keys(
                                                    groupedQuestions
                                                )[0] &&
                                            currentPart ===
                                                Number(
                                                    Object.keys(
                                                        groupedQuestions[
                                                            currentSection
                                                        ]
                                                    )[0]
                                                )
                                        }
                                    >
                                        Phần trước
                                    </button>
                                    <button
                                        onClick={() => {
                                            const parts = Object.keys(
                                                groupedQuestions[currentSection]
                                            ).map(Number);
                                            const currentIndex =
                                                parts.indexOf(currentPart);
                                            if (
                                                currentIndex <
                                                parts.length - 1
                                            ) {
                                                changePart(
                                                    parts[currentIndex + 1]
                                                );
                                            } else {
                                                const sections =
                                                    Object.keys(
                                                        groupedQuestions
                                                    );
                                                const sectionIndex =
                                                    sections.indexOf(
                                                        currentSection
                                                    );
                                                if (
                                                    sectionIndex <
                                                    sections.length - 1
                                                ) {
                                                    const nextSection =
                                                        sections[
                                                            sectionIndex + 1
                                                        ];
                                                    const nextParts =
                                                        Object.keys(
                                                            groupedQuestions[
                                                                nextSection
                                                            ]
                                                        ).map(Number);
                                                    changeSection(nextSection);
                                                    changePart(
                                                        Number(nextParts[0])
                                                    );
                                                }
                                            }
                                        }}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        disabled={
                                            currentSection ===
                                                Object.keys(groupedQuestions)[
                                                    Object.keys(
                                                        groupedQuestions
                                                    ).length - 1
                                                ] &&
                                            currentPart ===
                                                Number(
                                                    Object.keys(
                                                        groupedQuestions[
                                                            currentSection
                                                        ]
                                                    )[
                                                        Object.keys(
                                                            groupedQuestions[
                                                                currentSection
                                                            ]
                                                        ).length - 1
                                                    ]
                                                )
                                        }
                                    >
                                        Phần tiếp
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">
                                    Không có câu hỏi nào trong phần này.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestAttemptPage;
