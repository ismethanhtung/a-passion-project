"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Headphones,
    PauseCircle,
    PlayCircle,
    Volume2,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle,
    HelpCircle,
    AlertCircle,
    Save,
    List,
    BookOpen,
    Settings,
    Check,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type QuestionType = "single" | "multiple" | "fill";
type SectionType = "listening" | "reading";

interface Answer {
    questionId: number;
    selectedOption?: string | string[];
    isCorrect?: boolean;
    isMarked?: boolean;
}

interface Question {
    id: number;
    type: QuestionType;
    text: string;
    options?: string[];
    correctAnswer: string | string[];
    image?: string;
    audio?: string;
    part: number;
    explanation?: string;
    sectionType: SectionType;
    groupId?: number; // Dùng để nhóm các câu hỏi theo cùng một bài đọc/nghe
}

interface TestData {
    id: string;
    title: string;
    description: string;
    instructions: string;
    duration: number; // in minutes
    sections: {
        listening?: {
            parts: number;
            questions: number;
        };
        reading?: {
            parts: number;
            questions: number;
        };
    };
    questions: Question[];
}

const TestPage = () => {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;

    // States
    const [test, setTest] = useState<TestData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [activeSection, setActiveSection] =
        useState<SectionType>("listening");
    const [showInstructions, setShowInstructions] = useState<boolean>(true);
    const [testCompleted, setTestCompleted] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [currentAudio, setCurrentAudio] = useState<string | null>(null);
    const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fetch test data
    useEffect(() => {
        const fetchTestData = async () => {
            setLoading(true);
            try {
                // Mock data for now
                const mockTest: TestData = generateMockTest(testId);
                setTest(mockTest);
                setTimeLeft(mockTest.duration * 60); // Convert to seconds

                // Initialize answers array
                const initialAnswers = mockTest.questions.map((q) => ({
                    questionId: q.id,
                    isMarked: false,
                }));
                setAnswers(initialAnswers);

                // Set first question's audio if it exists
                if (mockTest.questions[0].audio) {
                    setCurrentAudio(mockTest.questions[0].audio);
                }
            } catch (error) {
                console.error("Error fetching test data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [testId]);

    // Timer effect
    useEffect(() => {
        if (!test || showInstructions || testCompleted) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up, submit the test
                    if (timerRef.current) clearInterval(timerRef.current);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [test, showInstructions, testCompleted]);

    // Format time for display (MM:SS)
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours > 0 ? hours + ":" : ""}${
            minutes < 10 ? "0" : ""
        }${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Handle start test
    const startTest = () => {
        setShowInstructions(false);
    };

    // Navigate to next question
    const goToNextQuestion = () => {
        if (!test) return;

        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);

            // Update audio if the next question has audio
            const nextQuestion = test.questions[currentQuestion + 1];
            if (nextQuestion.audio && nextQuestion.audio !== currentAudio) {
                setCurrentAudio(nextQuestion.audio);
                setAutoPlayAudio(true);
            } else if (!nextQuestion.audio) {
                setCurrentAudio(null);
            }
        } else {
            // If it's the last question
            submitTest();
        }
    };

    // Navigate to previous question
    const goToPreviousQuestion = () => {
        if (!test || currentQuestion === 0) return;

        setCurrentQuestion(currentQuestion - 1);

        // Update audio if the previous question has audio
        const prevQuestion = test.questions[currentQuestion - 1];
        if (prevQuestion.audio && prevQuestion.audio !== currentAudio) {
            setCurrentAudio(prevQuestion.audio);
            setAutoPlayAudio(false); // Don't autoplay when going back
        } else if (!prevQuestion.audio) {
            setCurrentAudio(null);
        }
    };

    // Handle selecting answer
    const handleSelectAnswer = (questionId: number, option: string) => {
        setAnswers((prev) =>
            prev.map((answer) =>
                answer.questionId === questionId
                    ? { ...answer, selectedOption: option }
                    : answer
            )
        );
    };

    // Handle marking a question for review
    const toggleMarkQuestion = (questionId: number) => {
        setAnswers((prev) =>
            prev.map((answer) =>
                answer.questionId === questionId
                    ? { ...answer, isMarked: !answer.isMarked }
                    : answer
            )
        );
    };

    // Switch from listening to reading section
    const switchToReadingSection = () => {
        if (!test) return;

        setActiveSection("reading");

        // Find the first reading question
        const firstReadingIndex = test.questions.findIndex(
            (q) => q.sectionType === "reading"
        );
        if (firstReadingIndex !== -1) {
            setCurrentQuestion(firstReadingIndex);
            setCurrentAudio(null); // No audio in reading section
        }
    };

    // Go to specific question
    const goToQuestion = (index: number) => {
        if (!test) return;

        setCurrentQuestion(index);
        setSidebarOpen(false);

        // Update audio if needed
        const targetQuestion = test.questions[index];
        if (targetQuestion.audio && targetQuestion.audio !== currentAudio) {
            setCurrentAudio(targetQuestion.audio);
            setAutoPlayAudio(false); // Don't autoplay when jumping to questions
        } else if (!targetQuestion.audio) {
            setCurrentAudio(null);
        }
    };

    // Submit test
    const submitTest = () => {
        if (!test) return;

        // Calculate results
        const gradedAnswers = answers.map((answer) => {
            const question = test.questions.find(
                (q) => q.id === answer.questionId
            );
            if (!question || !answer.selectedOption)
                return { ...answer, isCorrect: false };

            let isCorrect = false;
            if (
                Array.isArray(question.correctAnswer) &&
                Array.isArray(answer.selectedOption)
            ) {
                // Check multiple answers
                isCorrect = question.correctAnswer.every(
                    (correct, index) => correct === answer.selectedOption[index]
                );
            } else {
                // Check single answer
                isCorrect = question.correctAnswer === answer.selectedOption;
            }

            return { ...answer, isCorrect };
        });

        setAnswers(gradedAnswers);
        setTestCompleted(true);
        setShowResults(true);

        // Clear timer
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Calculate score
    const getScore = () => {
        if (!test) return { correct: 0, total: 0, percentage: 0 };

        const correctCount = answers.filter((a) => a.isCorrect).length;
        const total = test.questions.length;
        const percentage = Math.round((correctCount / total) * 100);

        return { correct: correctCount, total, percentage };
    };

    // Generate mock test for development
    const generateMockTest = (id: string): TestData => {
        return {
            id,
            title: "Full Online Test",
            description:
                "A full test with a structure and difficulty equivalent to the real test.",
            instructions:
                "The test consists of 2 parts: Listening (100 questions) and Reading (100 questions). Total time: 120 minutes. Follow the instructions for each part.",
            duration: 120, // 120 minutes
            sections: {
                listening: {
                    parts: 4,
                    questions: 100,
                },
                reading: {
                    parts: 3,
                    questions: 100,
                },
            },
            questions: generateMockQuestions(),
        };
    };

    // Generate mock questions for the test
    const generateMockQuestions = (): Question[] => {
        const questions: Question[] = [];

        // Generate Listening questions (Parts 1-4)
        for (let i = 1; i <= 100; i++) {
            let part = 1;
            if (i <= 6) part = 1; // Part 1: 6 questions
            else if (i <= 31) part = 2; // Part 2: 25 questions
            else if (i <= 70) part = 3; // Part 3: 39 questions
            else part = 4; // Part 4: 30 questions

            let groupId;
            // Group questions for Parts 3 and 4 (conversations and talks)
            if (part === 3) {
                groupId = Math.ceil((i - 31) / 3); // 3 questions per conversation
            } else if (part === 4) {
                groupId = Math.ceil((i - 70) / 3); // 3 questions per talk
            }

            questions.push({
                id: i,
                type: "single",
                text: `Listening Question ${i}${
                    part === 1
                        ? " (Look at the picture and select the statement that best describes what you see)"
                        : part === 2
                        ? " (Listen to the question and select the best response)"
                        : part === 3
                        ? " (Listen to the conversation and answer the question)"
                        : " (Listen to the talk and answer the question)"
                }`,
                options: ["A", "B", "C", "D"],
                correctAnswer: ["A", "B", "C", "D"][
                    Math.floor(Math.random() * 4)
                ],
                audio: `/audio/mock-audio-${i % 10}.mp3`, // Mock audio files
                image: part === 1 ? `/images/mock-image-${i}.jpg` : undefined,
                part,
                explanation: `Explanation for question ${i}`,
                sectionType: "listening",
                groupId,
            });
        }

        // Generate Reading questions (Parts 5-7)
        for (let i = 101; i <= 200; i++) {
            let part = 5;
            if (i <= 130) part = 5; // Part 5: 30 questions (grammar/vocabulary)
            else if (i <= 146)
                part = 6; // Part 6: 16 questions (text completion)
            else part = 7; // Part 7: 54 questions (reading comprehension)

            let groupId;
            // Group questions for Parts 6 and 7
            if (part === 6) {
                groupId = Math.ceil((i - 130) / 4); // 4 questions per text
            } else if (part === 7) {
                const questionInPart = i - 146;
                // Mix of single, double and triple passages
                if (questionInPart <= 29) {
                    groupId = 100 + Math.ceil(questionInPart / 2); // 2 questions per passage
                } else {
                    groupId = 115 + Math.ceil((questionInPart - 29) / 5); // 5 questions per passage
                }
            }

            questions.push({
                id: i,
                type: "single",
                text: `Reading Question ${i}${
                    part === 5
                        ? " (Select the word or phrase that best completes the sentence)"
                        : part === 6
                        ? " (Select the word or phrase that best completes the text)"
                        : " (Read the passage and answer the questions)"
                }`,
                options: ["A", "B", "C", "D"],
                correctAnswer: ["A", "B", "C", "D"][
                    Math.floor(Math.random() * 4)
                ],
                image:
                    part === 7
                        ? `/images/mock-reading-${Math.ceil((i - 146) / 5)}.jpg`
                        : undefined,
                part,
                explanation: `Explanation for question ${i}`,
                sectionType: "reading",
                groupId,
            });
        }

        return questions;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Đang tải bài thi...</p>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Không tìm thấy bài thi
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Không thể tìm thấy bài thi với ID {testId}
                    </p>
                    <Link href="/online-tests">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                            Quay lại danh sách bài thi
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (showInstructions) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
                            {test.title}
                        </h1>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                                <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                                Instructions for the test
                            </h2>
                            <p className="text-blue-700 mb-2">
                                {test.instructions}
                            </p>
                            <ul className="list-disc list-inside text-blue-700 space-y-1">
                                <li>Thời gian làm bài: {test.duration} phút</li>
                                {test.sections.listening && (
                                    <li>
                                        Listening part:{" "}
                                        {test.sections.listening.questions}{" "}
                                        questions,{" "}
                                        {test.sections.listening.parts} parts
                                    </li>
                                )}
                                {test.sections.reading && (
                                    <li>
                                        Reading part:{" "}
                                        {test.sections.reading.questions}{" "}
                                        questions, {test.sections.reading.parts}{" "}
                                        parts
                                    </li>
                                )}
                                <li>
                                    You can move between questions during the
                                    test
                                </li>
                                <li>
                                    Don't forget to mark the questions you want
                                    to review
                                </li>
                                <li>
                                    When the time is up, the test will
                                    automatically submit
                                </li>
                            </ul>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Test structure:
                            </h2>

                            {test.sections.listening && (
                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                                        <Headphones className="h-4 w-4 mr-2 text-blue-600" />
                                        Listening part (
                                        {test.sections.listening.questions}{" "}
                                        questions)
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 ml-6 space-y-1">
                                        <li>
                                            Part 1: Photographs (6 questions)
                                        </li>
                                        <li>
                                            Part 2: Question-Response (25
                                            questions)
                                        </li>
                                        <li>
                                            Part 3: Conversations (39 questions)
                                        </li>
                                        <li>Part 4: Talks (30 questions)</li>
                                    </ul>
                                </div>
                            )}

                            {test.sections.reading && (
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                                        Reading part (
                                        {test.sections.reading.questions}{" "}
                                        questions)
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 ml-6 space-y-1">
                                        <li>
                                            Part 5: Incomplete Sentences (30
                                            questions)
                                        </li>
                                        <li>
                                            Part 6: Text Completion (16
                                            questions)
                                        </li>
                                        <li>
                                            Part 7: Reading Comprehension (54
                                            questions)
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={startTest}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Start the test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = getScore();
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                                <CheckCircle className="h-10 w-10 text-blue-600" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Test completed!
                            </h1>
                            <p className="text-gray-600">{test.title}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-blue-700 mb-2">
                                    {score.percentage}%
                                </div>
                                <p className="text-blue-600 font-medium mb-4">
                                    {score.correct} / {score.total} questions
                                    answered correctly
                                </p>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${score.percentage}%`,
                                        }}
                                    ></div>
                                </div>

                                <div className="flex justify-center space-x-4 flex-wrap">
                                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="text-xl font-bold text-green-600">
                                            {
                                                answers.filter(
                                                    (a) => a.isCorrect
                                                ).length
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Correct
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="text-xl font-bold text-red-500">
                                            {
                                                answers.filter(
                                                    (a) => a.isCorrect === false
                                                ).length
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Incorrect
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="text-xl font-bold text-gray-400">
                                            {
                                                answers.filter(
                                                    (a) =>
                                                        a.selectedOption ===
                                                        undefined
                                                ).length
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Skipped
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Results by part
                            </h2>

                            {test.sections.listening && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <Headphones className="h-5 w-5 mr-2 text-blue-600" />
                                        Listening part
                                    </h3>

                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((part) => {
                                            const partQuestions =
                                                test.questions.filter(
                                                    (q) =>
                                                        q.sectionType ===
                                                            "listening" &&
                                                        q.part === part
                                                );
                                            const partAnswers = answers.filter(
                                                (a) =>
                                                    partQuestions.some(
                                                        (q) =>
                                                            q.id ===
                                                            a.questionId
                                                    )
                                            );
                                            const correctCount =
                                                partAnswers.filter(
                                                    (a) => a.isCorrect
                                                ).length;
                                            const partPercentage = Math.round(
                                                (correctCount /
                                                    partQuestions.length) *
                                                    100
                                            );

                                            return (
                                                <div
                                                    key={`listening-part-${part}`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Part {part}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            {correctCount}/
                                                            {
                                                                partQuestions.length
                                                            }{" "}
                                                            ({partPercentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${partPercentage}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {test.sections.reading && (
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                                        Reading part
                                    </h3>

                                    <div className="space-y-3">
                                        {[5, 6, 7].map((part) => {
                                            const partQuestions =
                                                test.questions.filter(
                                                    (q) =>
                                                        q.sectionType ===
                                                            "reading" &&
                                                        q.part === part
                                                );
                                            const partAnswers = answers.filter(
                                                (a) =>
                                                    partQuestions.some(
                                                        (q) =>
                                                            q.id ===
                                                            a.questionId
                                                    )
                                            );
                                            const correctCount =
                                                partAnswers.filter(
                                                    (a) => a.isCorrect
                                                ).length;
                                            const partPercentage = Math.round(
                                                (correctCount /
                                                    partQuestions.length) *
                                                    100
                                            );

                                            return (
                                                <div
                                                    key={`reading-part-${part}`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Part {part}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            {correctCount}/
                                                            {
                                                                partQuestions.length
                                                            }{" "}
                                                            ({partPercentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${partPercentage}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => setShowResults(false)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Review the test
                            </button>
                            <Link href="/online-tests">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Back to the list of tests
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main test interface
    const currentQ = test.questions[currentQuestion];
    const currentAnswer = answers.find((a) => a.questionId === currentQ.id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                if (
                                    confirm(
                                        "Bạn có chắc chắn muốn thoát khỏi bài kiểm tra?"
                                    )
                                ) {
                                    window.location.href = "/online-tests";
                                }
                            }}
                            className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline font-medium">
                                Thoát
                            </span>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800 ml-4 hidden sm:block truncate max-w-md">
                            {test.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium text-sm">
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <List className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline font-medium">
                                Câu hỏi
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                if (confirm("Bạn có chắc chắn muốn nộp bài?")) {
                                    submitTest();
                                }
                            }}
                            className="ml-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors"
                        >
                            <Save className="h-4 w-4 mr-1" />
                            <span className="font-medium">Nộp bài</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-200">
                <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                        width: `${
                            (currentQuestion / test.questions.length) * 100
                        }%`,
                    }}
                ></div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar for question navigation */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
                        sidebarOpen
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transition-transform ${
                            sidebarOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800">
                                Danh sách câu hỏi
                            </h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                                    <span className="text-gray-600">
                                        Đã trả lời
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
                                    <span className="text-gray-600">
                                        Đánh dấu
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-1.5"></div>
                                    <span className="text-gray-600">
                                        Chưa trả lời
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1.5"></div>
                                    <span className="text-gray-600">
                                        Hiện tại
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="overflow-y-auto"
                            style={{ height: "calc(100% - 148px)" }}
                        >
                            {/* Listening Section */}
                            {test.sections.listening && (
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <Headphones className="h-4 w-4 mr-2 text-blue-600" />
                                        Phần Nghe
                                    </h3>

                                    <div className="grid grid-cols-6 gap-2">
                                        {test.questions
                                            .filter(
                                                (q) =>
                                                    q.sectionType ===
                                                    "listening"
                                            )
                                            .map((q, index) => {
                                                const answer = answers.find(
                                                    (a) => a.questionId === q.id
                                                );
                                                let bgColor = "bg-gray-200";

                                                if (
                                                    currentQuestion ===
                                                    test.questions.indexOf(q)
                                                ) {
                                                    bgColor =
                                                        "bg-indigo-500 text-white";
                                                } else if (answer?.isMarked) {
                                                    bgColor =
                                                        "bg-yellow-400 text-white";
                                                } else if (
                                                    answer?.selectedOption
                                                ) {
                                                    bgColor =
                                                        "bg-green-500 text-white";
                                                }

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() =>
                                                            goToQuestion(
                                                                test.questions.indexOf(
                                                                    q
                                                                )
                                                            )
                                                        }
                                                        className={`w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium ${bgColor} hover:opacity-90 transition-opacity`}
                                                    >
                                                        {q.id}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            {/* Reading Section */}
                            {test.sections.reading && (
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                                        Phần Đọc
                                    </h3>

                                    <div className="grid grid-cols-6 gap-2">
                                        {test.questions
                                            .filter(
                                                (q) =>
                                                    q.sectionType === "reading"
                                            )
                                            .map((q, index) => {
                                                const answer = answers.find(
                                                    (a) => a.questionId === q.id
                                                );
                                                let bgColor = "bg-gray-200";

                                                if (
                                                    currentQuestion ===
                                                    test.questions.indexOf(q)
                                                ) {
                                                    bgColor =
                                                        "bg-indigo-500 text-white";
                                                } else if (answer?.isMarked) {
                                                    bgColor =
                                                        "bg-yellow-400 text-white";
                                                } else if (
                                                    answer?.selectedOption
                                                ) {
                                                    bgColor =
                                                        "bg-green-500 text-white";
                                                }

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() =>
                                                            goToQuestion(
                                                                test.questions.indexOf(
                                                                    q
                                                                )
                                                            )
                                                        }
                                                        className={`w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium ${bgColor} hover:opacity-90 transition-opacity`}
                                                    >
                                                        {q.id}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Question and answer area */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Part indicator */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center">
                                    {currentQ.sectionType === "listening" ? (
                                        <div className="flex items-center">
                                            <Headphones className="h-5 w-5 mr-2 text-blue-600" />
                                            <span className="font-medium text-gray-800">
                                                Phần Nghe - Part {currentQ.part}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                                            <span className="font-medium text-gray-800">
                                                Phần Đọc - Part {currentQ.part}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-3">
                                        Câu {currentQ.id}/200
                                    </span>
                                    <button
                                        onClick={() =>
                                            toggleMarkQuestion(currentQ.id)
                                        }
                                        className={`p-1.5 rounded-full ${
                                            currentAnswer?.isMarked
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        } transition-colors`}
                                        title={
                                            currentAnswer?.isMarked
                                                ? "Bỏ đánh dấu"
                                                : "Đánh dấu để xem lại sau"
                                        }
                                    >
                                        <Flag className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Audio player for listening questions */}
                            {currentQ.sectionType === "listening" &&
                                currentAudio && (
                                    <div className="px-6 pt-6 pb-2">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center">
                                            <Headphones className="h-5 w-5 text-blue-600 mr-2" />
                                            <span className="text-sm text-blue-700">
                                                Nghe đoạn ghi âm và trả lời câu
                                                hỏi bên dưới
                                            </span>
                                        </div>
                                        {/* Audio Player Component would go here in a real implementation */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <button className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors">
                                                    <PlayCircle className="h-6 w-6 text-indigo-700" />
                                                </button>
                                                <div className="flex-1 mx-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-indigo-600 h-2 rounded-full transition-all"
                                                            style={{
                                                                width: "0%",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium">
                                                    0:00 / 0:00
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Question image if available */}
                            {currentQ.image && (
                                <div className="px-6 pt-6 pb-2">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-center">
                                        <img
                                            src="/a.png"
                                            alt={`Question ${currentQ.id}`}
                                            className="max-w-full h-auto max-h-80 object-contain rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Question text */}
                            <div className="px-6 pt-6 pb-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Câu {currentQ.id}
                                </h2>
                                <p className="text-gray-700">{currentQ.text}</p>
                            </div>

                            {/* Answer options */}
                            {currentQ.options && (
                                <div className="px-6 pb-6">
                                    <div className="space-y-3">
                                        {currentQ.options.map(
                                            (option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handleSelectAnswer(
                                                            currentQ.id,
                                                            option
                                                        )
                                                    }
                                                    className={`w-full text-left p-4 rounded-lg border ${
                                                        currentAnswer?.selectedOption ===
                                                        option
                                                            ? "bg-indigo-50 border-indigo-300 text-indigo-800 ring-1 ring-indigo-300"
                                                            : "border-gray-200 hover:bg-gray-50"
                                                    } transition-colors`}
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-6 h-6 flex-shrink-0 rounded-full mr-3 flex items-center justify-center border ${
                                                                currentAnswer?.selectedOption ===
                                                                option
                                                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                                                    : "border-gray-300 bg-white"
                                                            }`}
                                                        >
                                                            {currentAnswer?.selectedOption ===
                                                            option ? (
                                                                <Check className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <span className="text-gray-500 font-medium">
                                                                    {option}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-gray-800">
                                                            {`Option text for ${option}`}
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={goToPreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className={`flex items-center px-4 py-2.5 rounded-lg ${
                                        currentQuestion === 0
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    } transition-colors`}
                                >
                                    <ChevronLeft className="h-5 w-5 mr-1" />
                                    <span className="font-medium">
                                        Câu trước
                                    </span>
                                </button>

                                <button
                                    onClick={goToNextQuestion}
                                    className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                    <span className="font-medium">
                                        {currentQuestion <
                                        test.questions.length - 1
                                            ? "Câu tiếp theo"
                                            : "Hoàn thành"}
                                    </span>
                                    <ChevronRight className="h-5 w-5 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
