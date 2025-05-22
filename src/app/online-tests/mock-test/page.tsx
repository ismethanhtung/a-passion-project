"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "@/styles/test.css";
import {
    ArrowLeft,
    Clock,
    CheckSquare,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Save,
    FileText,
} from "lucide-react";
import QuestionDisplay from "@/components/test/QuestionDisplay";
import QuestionNavigation from "@/components/test/QuestionNavigation";
import TestResult from "@/components/test/TestResult";
import ConfirmSubmitModal from "@/components/modals/ConfirmSubmitModal";

interface Question {
    id: string;
    content: string;
    type: "single" | "multiple" | "fill" | "essay";
    options?: string;
    correctAnswer?: string;
    part: number;
    sectionType: string;
    explanation?: string;
    audioUrl?: string;
    imageUrl?: string;
    order: number;
    groupId?: number;
}

interface MockTest {
    id: string | number;
    testId: string | number;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

const MockTestPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("testId");
    const mockId = searchParams.get("mockId") || "default";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mockTest, setMockTest] = useState<MockTest | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [currentSection, setCurrentSection] = useState<string>("listening");
    const [sections, setSections] = useState<string[]>([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Load mock test data
    useEffect(() => {
        const loadMockTest = () => {
            try {
                setLoading(true);

                if (!testId) {
                    setError("Thiếu ID bài kiểm tra");
                    setLoading(false);
                    return;
                }

                console.log(`Loading mock test for testId: ${testId}`);

                // Attempt to load mock test from localStorage
                const storedMockTest = localStorage.getItem(
                    `mockTest_${testId}`
                );

                if (!storedMockTest) {
                    console.error(
                        `Mock test data not found for testId: ${testId}`
                    );
                    setError("Không tìm thấy bài kiểm tra này");
                    setLoading(false);
                    return;
                }

                try {
                    const mockTestData = JSON.parse(storedMockTest) as MockTest;

                    // Kiểm tra dữ liệu có hợp lệ không
                    if (
                        !mockTestData.questions ||
                        !Array.isArray(mockTestData.questions) ||
                        mockTestData.questions.length === 0
                    ) {
                        console.error(
                            "Invalid mock test data: missing or empty questions array"
                        );
                        setError("Dữ liệu bài kiểm tra không hợp lệ");
                        setLoading(false);
                        return;
                    }

                    console.log(
                        `Successfully loaded mock test with ${mockTestData.questions.length} questions`
                    );

                    // Initialize test
                    setMockTest(mockTestData);

                    // Set test duration (2 hours for TOEIC, 2.75 hours for IELTS)
                    const testType =
                        mockTestData.questions[0]?.sectionType?.includes(
                            "listening"
                        )
                            ? "TOEIC"
                            : "IELTS";
                    setTimeLeft(testType === "TOEIC" ? 7200 : 9900); // in seconds

                    // Extract available sections
                    const uniqueSections = Array.from(
                        new Set(
                            mockTestData.questions.map((q) => q.sectionType)
                        )
                    );
                    setSections(uniqueSections);

                    // Set initial section
                    if (uniqueSections.length > 0) {
                        setCurrentSection(uniqueSections[0]);
                    }

                    // Load saved answers if any
                    const savedAnswers = localStorage.getItem(
                        `mockTestAnswers_${testId}_${mockId}`
                    );
                    if (savedAnswers) {
                        setUserAnswers(JSON.parse(savedAnswers));
                    }

                    // Check if test is already completed
                    const isCompleted =
                        localStorage.getItem(
                            `mockTestCompleted_${testId}_${mockId}`
                        ) === "true";
                    setTestCompleted(isCompleted);
                } catch (parseError) {
                    console.error(
                        "Lỗi khi phân tích dữ liệu bài kiểm tra:",
                        parseError
                    );
                    setError("Dữ liệu bài kiểm tra không hợp lệ");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Lỗi khi tải bài kiểm tra:", err);
                setError("Đã xảy ra lỗi khi tải bài kiểm tra");
            } finally {
                setLoading(false);
            }
        };

        loadMockTest();
    }, [testId, mockId]);

    // Timer countdown
    useEffect(() => {
        if (loading || testCompleted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, testCompleted, timeLeft]);

    // Save answers to localStorage whenever they change
    useEffect(() => {
        if (Object.keys(userAnswers).length > 0 && testId && mockId) {
            localStorage.setItem(
                `mockTestAnswers_${testId}_${mockId}`,
                JSON.stringify(userAnswers)
            );
        }
    }, [userAnswers, testId, mockId]);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            updateCurrentSection(currentQuestionIndex - 1);
        }
    };

    const handleNextQuestion = () => {
        if (mockTest && currentQuestionIndex < mockTest.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            updateCurrentSection(currentQuestionIndex + 1);
        }
    };

    const updateCurrentSection = (index: number) => {
        if (mockTest) {
            setCurrentSection(mockTest.questions[index].sectionType);
        }
    };

    const handleSelectQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
        if (mockTest) {
            setCurrentSection(mockTest.questions[index].sectionType);
        }
    };

    const handleChangeSection = (section: string) => {
        if (mockTest) {
            // Find the first question of the selected section
            const firstQuestionIndex = mockTest.questions.findIndex(
                (q) => q.sectionType === section
            );
            if (firstQuestionIndex !== -1) {
                setCurrentQuestionIndex(firstQuestionIndex);
                setCurrentSection(section);
            }
        }
    };

    const handleSaveProgress = () => {
        if (!testId || !mockId) return;

        localStorage.setItem(
            `mockTestAnswers_${testId}_${mockId}`,
            JSON.stringify(userAnswers)
        );

        // Hiển thị thông báo lưu thành công
        alert("Đã lưu tiến độ bài làm của bạn");
    };

    const handleOpenSubmitModal = () => {
        setShowSubmitModal(true);
    };

    const handleCloseSubmitModal = () => {
        setShowSubmitModal(false);
    };

    const handleSubmitTest = () => {
        if (!testId || !mockId) return;

        // Đóng modal
        setShowSubmitModal(false);

        // Save completion status
        localStorage.setItem(`mockTestCompleted_${testId}_${mockId}`, "true");

        // Save submission timestamp
        localStorage.setItem(
            `mockTestSubmittedAt_${testId}_${mockId}`,
            new Date().toISOString()
        );

        setTestCompleted(true);
    };

    const handleRetakeTest = () => {
        if (!testId || !mockId) return;

        // Clear completion status to retake the test
        localStorage.removeItem(`mockTestCompleted_${testId}_${mockId}`);
        localStorage.removeItem(`mockTestAnswers_${testId}_${mockId}`);
        localStorage.removeItem(`mockTestSubmittedAt_${testId}_${mockId}`);

        // Reset state
        setTestCompleted(false);
        setUserAnswers({});
        setCurrentQuestionIndex(0);

        if (mockTest) {
            const testType = mockTest.questions[0]?.sectionType?.includes(
                "listening"
            )
                ? "TOEIC"
                : "IELTS";
            setTimeLeft(testType === "TOEIC" ? 7200 : 9900);

            if (sections.length > 0) {
                setCurrentSection(sections[0]);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getSectionColor = (section: string) => {
        switch (section) {
            case "listening":
                return "bg-blue-100 text-blue-800";
            case "reading":
                return "bg-green-100 text-green-800";
            case "writing":
                return "bg-purple-100 text-purple-800";
            case "speaking":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderQuestion = () => {
        if (!mockTest || currentQuestionIndex >= mockTest.questions.length) {
            return <div>Không có câu hỏi</div>;
        }

        const question = mockTest.questions[currentQuestionIndex];
        const userAnswer = userAnswers[question.id];

        return (
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                        Câu hỏi {currentQuestionIndex + 1}/
                        {mockTest.questions.length}
                    </span>
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${getSectionColor(
                            question.sectionType
                        )}`}
                    >
                        {question.sectionType.charAt(0).toUpperCase() +
                            question.sectionType.slice(1)}{" "}
                        - Phần {question.part}
                    </span>
                </div>

                <div className="mb-6">
                    {question.imageUrl && (
                        <div className="mb-4">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSifjsSKvcJ8UOy_0TrsS_rB-NdjOFFt73_pT0xAx-go41TeLundAOz6XKDb7nvkxHWuoo&usqp=CAU"
                                alt="Question Image"
                                className="max-w-full rounded-lg"
                            />
                        </div>
                    )}

                    {question.audioUrl && (
                        <div className="mb-4">
                            <audio controls className="w-full">
                                <source
                                    src={question.audioUrl}
                                    type="audio/mpeg"
                                />
                                Trình duyệt của bạn không hỗ trợ phát âm thanh.
                            </audio>
                        </div>
                    )}

                    <div className="prose max-w-none">
                        <p className="text-lg font-medium">
                            {question.content}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {question.type === "single" && question.options && (
                        <div className="space-y-3">
                            {JSON.parse(question.options).map(
                                (option: string, index: number) => (
                                    <label
                                        key={index}
                                        className={`flex items-start rounded-lg border p-4 cursor-pointer transition-colors ${
                                            userAnswer === index.toString()
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={index}
                                            checked={
                                                userAnswer === index.toString()
                                            }
                                            onChange={() =>
                                                handleAnswerChange(
                                                    question.id,
                                                    index.toString()
                                                )
                                            }
                                            className="mt-1 h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-3">{option}</span>
                                    </label>
                                )
                            )}
                        </div>
                    )}

                    {question.type === "multiple" && question.options && (
                        <div className="space-y-3">
                            {JSON.parse(question.options).map(
                                (option: string, index: number) => (
                                    <label
                                        key={index}
                                        className={`flex items-start rounded-lg border p-4 cursor-pointer transition-colors ${
                                            userAnswer &&
                                            userAnswer.includes(
                                                index.toString()
                                            )
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={`question-${question.id}`}
                                            value={index}
                                            checked={
                                                userAnswer &&
                                                userAnswer.includes(
                                                    index.toString()
                                                )
                                            }
                                            onChange={(e) => {
                                                const currentValues = userAnswer
                                                    ? [...userAnswer]
                                                    : [];
                                                if (e.target.checked) {
                                                    handleAnswerChange(
                                                        question.id,
                                                        [
                                                            ...currentValues,
                                                            index.toString(),
                                                        ]
                                                    );
                                                } else {
                                                    handleAnswerChange(
                                                        question.id,
                                                        currentValues.filter(
                                                            (v) =>
                                                                v !==
                                                                index.toString()
                                                        )
                                                    );
                                                }
                                            }}
                                            className="mt-1 h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-3">{option}</span>
                                    </label>
                                )
                            )}
                        </div>
                    )}

                    {question.type === "fill" && (
                        <div>
                            <input
                                type="text"
                                value={userAnswer || ""}
                                onChange={(e) =>
                                    handleAnswerChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                                placeholder="Nhập câu trả lời của bạn"
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                    )}

                    {question.type === "essay" && (
                        <div>
                            <textarea
                                value={userAnswer || ""}
                                onChange={(e) =>
                                    handleAnswerChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                                placeholder="Nhập câu trả lời của bạn"
                                rows={10}
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
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
                <div className="bg-red-50 rounded-lg p-6 text-red-700 mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Đã xảy ra lỗi
                    </h2>
                    <p>{error}</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
                    {testId && (
                        <Link
                            href={`/online-tests/${testId}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Quay lại trang bài kiểm tra
                        </Link>
                    )}

                    <Link
                        href="/online-tests"
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Quay lại danh sách bài kiểm tra
                    </Link>
                </div>
            </div>
        );
    }

    if (testCompleted) {
        const submittedAt = localStorage.getItem(
            `mockTestSubmittedAt_${testId}_${mockId}`
        );

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
                <TestResult
                    testId={testId || ""}
                    mockId={mockId}
                    totalQuestions={mockTest?.questions.length || 0}
                    answeredQuestions={Object.keys(userAnswers).length}
                    submittedAt={submittedAt}
                    onRetakeTest={handleRetakeTest}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <Link
                    href={`/online-tests/${testId}`}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Thoát bài kiểm tra
                </Link>
                <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="text-gray-800 font-medium">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar for navigation */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-5 sticky top-8">
                        <h3 className="text-lg font-semibold mb-4">Các phần</h3>
                        <div className="space-y-2 mb-6">
                            {sections.map((section) => (
                                <button
                                    key={section}
                                    onClick={() => handleChangeSection(section)}
                                    className={`w-full text-left px-4 py-2 rounded-lg ${
                                        currentSection === section
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {section.charAt(0).toUpperCase() +
                                        section.slice(1)}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mb-4">Tiến độ</h3>
                        <div className="mb-2">
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Hoàn thành</span>
                                <span>
                                    {Object.keys(userAnswers).length}/
                                    {mockTest?.questions.length || 0}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                        width: `${
                                            mockTest
                                                ? (Object.keys(userAnswers)
                                                      .length /
                                                      mockTest.questions
                                                          .length) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Hiển thị danh sách câu hỏi */}
                        {mockTest && (
                            <div className="mb-6">
                                <QuestionNavigation
                                    questions={mockTest.questions}
                                    currentQuestionIndex={currentQuestionIndex}
                                    userAnswers={userAnswers}
                                    onSelectQuestion={handleSelectQuestion}
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleSaveProgress}
                                className="w-full bg-blue-100 text-blue-700 rounded-lg py-2 flex items-center justify-center hover:bg-blue-200"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                Lưu tiến độ
                            </button>

                            <button
                                onClick={handleOpenSubmitModal}
                                className="w-full bg-green-600 text-white rounded-lg py-3 flex items-center justify-center hover:bg-green-700"
                            >
                                <CheckSquare className="h-5 w-5 mr-2" />
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="md:col-span-3">
                    {renderQuestion()}

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Câu trước
                        </button>

                        <button
                            onClick={handleNextQuestion}
                            disabled={
                                !mockTest ||
                                currentQuestionIndex ===
                                    mockTest.questions.length - 1
                            }
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            Câu tiếp
                            <ChevronRight className="h-5 w-5 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận nộp bài */}
            {mockTest && (
                <ConfirmSubmitModal
                    isOpen={showSubmitModal}
                    onClose={handleCloseSubmitModal}
                    onConfirm={handleSubmitTest}
                    totalQuestions={mockTest.questions.length}
                    answeredQuestions={Object.keys(userAnswers).length}
                />
            )}
        </div>
    );
};

export default MockTestPage;
