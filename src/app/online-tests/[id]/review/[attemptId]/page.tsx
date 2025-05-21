"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Award,
    HelpCircle,
} from "lucide-react";

interface ReviewPageProps {
    params: {
        id: string;
        attemptId: string;
    };
}

const TestReviewPage = ({ params }: ReviewPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [testData, setTestData] = useState<any>(null);
    const [attemptData, setAttemptData] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [groupedQuestions, setGroupedQuestions] = useState<any>({});
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentSection, setCurrentSection] = useState<string>("");
    const [currentPart, setCurrentPart] = useState<number>(0);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    `Fetching test review: ${params.id}/${params.attemptId}`
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
                            "Không thể tải thông tin xem lại bài kiểm tra"
                    );
                }

                const data = await response.json();
                console.log("Successfully fetched test review data");

                setTestData(data.test);
                setAttemptData(data.attempt);
                setQuestions(data.questions.list);
                setGroupedQuestions(data.questions.grouped);

                // Chuyển đổi câu trả lời vào đối tượng dễ truy cập
                const answerMap: Record<number, string> = {};
                if (data.attempt && data.attempt.answers) {
                    data.attempt.answers.forEach((answer: any) => {
                        answerMap[answer.questionId] = answer.answer;
                    });
                }
                setAnswers(answerMap);

                // Thiết lập phần và part đầu tiên
                if (data.questions.list.length > 0) {
                    const firstSection = Object.keys(data.questions.grouped)[0];
                    setCurrentSection(firstSection);

                    const firstPart = Object.keys(
                        data.questions.grouped[firstSection]
                    )[0];
                    setCurrentPart(parseInt(firstPart));
                }
            } catch (err: any) {
                setError(
                    err.message || "Đã xảy ra lỗi khi tải xem lại bài kiểm tra"
                );
                console.error("Error fetching test review:", err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id && params.attemptId) {
            fetchReview();
        } else {
            setError("ID bài kiểm tra hoặc lần thử không hợp lệ");
            setLoading(false);
        }
    }, [params.id, params.attemptId]);

    // Chuyển đổi section
    const changeSection = (section: string) => {
        setCurrentSection(section);
        const firstPart = Object.keys(groupedQuestions[section])[0];
        setCurrentPart(parseInt(firstPart));
    };

    // Chuyển đổi part
    const changePart = (part: number) => {
        setCurrentPart(part);
    };

    // Kiểm tra câu trả lời đúng/sai
    const isAnswerCorrect = (question: any): boolean | null => {
        const userAnswer = answers[question.id];
        if (!userAnswer) return null; // Chưa trả lời

        return userAnswer === question.correctAnswer;
    };

    // Tính tổng số câu trả lời đúng
    const countCorrectAnswers = (): number => {
        return questions.filter(
            (q) => answers[q.id] && answers[q.id] === q.correctAnswer
        ).length;
    };

    // Tính phần trăm chính xác
    const calculateAccuracy = (): number => {
        const answeredQuestions = questions.filter((q) => answers[q.id]);
        if (answeredQuestions.length === 0) return 0;

        return Math.round(
            (countCorrectAnswers() / answeredQuestions.length) * 100
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !testData || !attemptData) {
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
                    <p>{error || "Không thể tải xem lại bài kiểm tra"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        href={`/online-tests/${params.id}/results/${params.attemptId}`}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Quay lại kết quả
                    </Link>
                    <h1 className="text-2xl font-bold">Xem lại bài làm</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        <Award className="h-4 w-4 mr-1" />
                        Điểm: {attemptData.score || 0}
                    </div>
                    <div className="text-sm flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Độ chính xác: {calculateAccuracy()}%
                    </div>
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
                                Tóm tắt
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Tổng số câu hỏi:</span>
                                    <span className="font-medium">
                                        {questions.length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Câu hỏi đã trả lời:</span>
                                    <span className="font-medium">
                                        {Object.keys(answers).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Câu trả lời đúng:</span>
                                    <span className="font-medium text-green-600">
                                        {countCorrectAnswers()}
                                    </span>
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
                                            "Xem lại các câu hỏi và đáp án."}
                                    </p>
                                </div>

                                {groupedQuestions[currentSection][
                                    currentPart
                                ].map((question: any) => {
                                    const userAnswer =
                                        answers[question.id] || "";
                                    const isCorrect = isAnswerCorrect(question);
                                    const answerStatus =
                                        isCorrect === true
                                            ? "correct"
                                            : isCorrect === false
                                            ? "incorrect"
                                            : "unanswered";

                                    return (
                                        <div
                                            key={question.id}
                                            className={`rounded-lg border p-4 ${
                                                answerStatus === "correct"
                                                    ? "border-green-200 bg-green-50"
                                                    : answerStatus ===
                                                      "incorrect"
                                                    ? "border-red-200 bg-red-50"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <div className="mb-4">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-md font-medium mb-2">
                                                        Câu {question.order}:{" "}
                                                        {question.content}
                                                    </h3>
                                                    {answerStatus ===
                                                    "correct" ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                    ) : answerStatus ===
                                                      "incorrect" ? (
                                                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                                    )}
                                                </div>

                                                {question.imageUrl && (
                                                    <div className="mt-3 mb-4">
                                                        <img
                                                            src={
                                                                question.imageUrl
                                                            }
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

                                            {/* Hiển thị câu trả lời của người dùng */}
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Câu trả lời của bạn:
                                                </h4>
                                                {question.type === "single" && (
                                                    <div className="space-y-2">
                                                        {question.options.map(
                                                            (
                                                                option: string,
                                                                idx: number
                                                            ) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`flex items-center p-2 rounded-md ${
                                                                        userAnswer ===
                                                                        option
                                                                            ? isCorrect
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-red-100 text-red-800"
                                                                            : question.correctAnswer ===
                                                                              option
                                                                            ? "bg-green-100 text-green-800"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="mr-2">
                                                                        {userAnswer ===
                                                                        option ? (
                                                                            isCorrect ? (
                                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                            ) : (
                                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                                            )
                                                                        ) : question.correctAnswer ===
                                                                          option ? (
                                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                        ) : (
                                                                            <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                                                                        )}
                                                                    </div>
                                                                    <span>
                                                                        {option}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                                {question.type ===
                                                    "multiple" && (
                                                    <div className="space-y-2">
                                                        {/* Xử lý hiển thị câu trả lời nhiều lựa chọn */}
                                                        <p>
                                                            {userAnswer
                                                                ? userAnswer
                                                                : "Không có câu trả lời"}
                                                        </p>
                                                    </div>
                                                )}
                                                {(question.type === "fill" ||
                                                    question.type === "essay" ||
                                                    question.type ===
                                                        "speaking") && (
                                                    <div className="p-3 bg-gray-50 rounded-md">
                                                        <p>
                                                            {userAnswer
                                                                ? userAnswer
                                                                : "Không có câu trả lời"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hiển thị đáp án đúng và giải thích */}
                                            <div className="mt-4">
                                                <div className="bg-blue-50 p-3 rounded-md">
                                                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                                                        Đáp án đúng:
                                                    </h4>
                                                    <p className="text-blue-700">
                                                        {question.correctAnswer}
                                                    </p>
                                                </div>
                                                {question.explanation && (
                                                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                                                            Giải thích:
                                                        </h4>
                                                        <p className="text-gray-600 text-sm">
                                                            {
                                                                question.explanation
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

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

export default TestReviewPage;
