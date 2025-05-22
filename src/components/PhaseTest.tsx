"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface TestQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface PhaseTestProps {
    phaseNumber: number;
    phaseTitle: string;
    testType: string; // 'ielts', 'toeic', 'general', etc.
    onComplete: (passed: boolean, score: number) => void;
    onCancel: () => void;
}

const generateQuestions = (
    testType: string,
    phaseNumber: number
): TestQuestion[] => {
    // Tạo các câu hỏi dựa trên loại bài kiểm tra và giai đoạn
    const questions: TestQuestion[] = [];

    if (testType === "ielts") {
        questions.push(
            {
                id: `ielts-${phaseNumber}-1`,
                question:
                    "What is the main purpose of an IELTS introduction paragraph?",
                options: [
                    "To present your personal opinion in detail",
                    "To restate the question and provide your general position",
                    "To list all examples you will discuss",
                    "To analyze the topic from multiple perspectives",
                ],
                correctAnswer: 1,
            },
            {
                id: `ielts-${phaseNumber}-2`,
                question:
                    "Which tense is most appropriate for describing a graph showing past trends?",
                options: [
                    "Present simple",
                    "Present perfect",
                    "Past simple",
                    "Future continuous",
                ],
                correctAnswer: 2,
            },
            {
                id: `ielts-${phaseNumber}-3`,
                question:
                    "In the IELTS listening test, what should you do during the 30 seconds before each section?",
                options: [
                    "Close your eyes and relax",
                    "Read the questions for that section",
                    "Take notes on the previous section",
                    "Discuss answers with other test-takers",
                ],
                correctAnswer: 1,
            },
            {
                id: `ielts-${phaseNumber}-4`,
                question:
                    "Which of these is NOT one of the IELTS speaking assessment criteria?",
                options: [
                    "Fluency and coherence",
                    "Lexical resource",
                    "Grammatical range and accuracy",
                    "Cultural knowledge",
                ],
                correctAnswer: 3,
            },
            {
                id: `ielts-${phaseNumber}-5`,
                question:
                    "What is the recommended word count for IELTS Writing Task 2?",
                options: [
                    "At least 150 words",
                    "At least 250 words",
                    "Exactly 300 words",
                    "No more than 200 words",
                ],
                correctAnswer: 1,
            }
        );
    } else if (testType === "toeic") {
        questions.push(
            {
                id: `toeic-${phaseNumber}-1`,
                question:
                    "In a TOEIC listening Part 3 (Conversations), how many questions are typically asked about each conversation?",
                options: [
                    "1 question",
                    "2 questions",
                    "3 questions",
                    "4 questions",
                ],
                correctAnswer: 2,
            },
            {
                id: `toeic-${phaseNumber}-2`,
                question:
                    "Which of these is NOT a common topic in TOEIC Reading Part 7?",
                options: [
                    "Business correspondence",
                    "Scientific research papers",
                    "Advertisements",
                    "Notices and announcements",
                ],
                correctAnswer: 1,
            },
            {
                id: `toeic-${phaseNumber}-3`,
                question:
                    "Which grammar point is frequently tested in TOEIC Part 5 (Incomplete Sentences)?",
                options: [
                    "Subjunctive mood",
                    "Prepositions",
                    "Literary metaphors",
                    "Poetic devices",
                ],
                correctAnswer: 1,
            },
            {
                id: `toeic-${phaseNumber}-4`,
                question:
                    "What is the total duration of the TOEIC Listening and Reading test?",
                options: ["1 hour", "2 hours", "2.5 hours", "3 hours"],
                correctAnswer: 1,
            },
            {
                id: `toeic-${phaseNumber}-5`,
                question:
                    "In the TOEIC test, which part involves looking at pictures and selecting the statement that best describes them?",
                options: [
                    "Listening Part 1",
                    "Listening Part 3",
                    "Reading Part 5",
                    "Reading Part 7",
                ],
                correctAnswer: 0,
            }
        );
    } else {
        // Bài kiểm tra chung cho các giai đoạn khác
        questions.push(
            {
                id: `general-${phaseNumber}-1`,
                question:
                    "Which learning strategy is most effective for vocabulary acquisition?",
                options: [
                    "Memorizing word lists without context",
                    "Learning words in context through reading",
                    "Studying only the dictionary definitions",
                    "Focusing only on pronunciation",
                ],
                correctAnswer: 1,
            },
            {
                id: `general-${phaseNumber}-2`,
                question:
                    "What is the recommended daily practice time for language learning?",
                options: [
                    "At least 4 hours in one session",
                    "15-30 minutes of focused practice",
                    "Only on weekends for several hours",
                    "Only when feeling motivated",
                ],
                correctAnswer: 1,
            },
            {
                id: `general-${phaseNumber}-3`,
                question:
                    "Which approach is most effective for improving listening skills?",
                options: [
                    "Listening to content at your current level",
                    "Only listening to slow, simplified content",
                    "Focusing exclusively on written materials",
                    "Listening only to unfamiliar accents",
                ],
                correctAnswer: 0,
            },
            {
                id: `general-${phaseNumber}-4`,
                question:
                    "What is the best way to practice speaking when learning alone?",
                options: [
                    "Never practice speaking without a partner",
                    "Read texts aloud and record yourself",
                    "Focus only on grammar rules",
                    "Speak only when you're 100% confident",
                ],
                correctAnswer: 1,
            },
            {
                id: `general-${phaseNumber}-5`,
                question:
                    "Which is a sign of effective language learning progress?",
                options: [
                    "Being able to understand everything immediately",
                    "Never making mistakes when speaking",
                    "Recognizing patterns and making connections",
                    "Feeling comfortable only with familiar topics",
                ],
                correctAnswer: 2,
            }
        );
    }

    return questions;
};

const PhaseTest: React.FC<PhaseTestProps> = ({
    phaseNumber,
    phaseTitle,
    testType,
    onComplete,
    onCancel,
}) => {
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    // Khởi tạo câu hỏi
    useEffect(() => {
        const generatedQuestions = generateQuestions(testType, phaseNumber);
        setQuestions(generatedQuestions);
        setSelectedAnswers(new Array(generatedQuestions.length).fill(-1));
    }, [testType, phaseNumber]);

    // Đếm ngược thời gian
    useEffect(() => {
        if (timeLeft > 0 && !showResults) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResults) {
            handleSubmit();
        }
    }, [timeLeft, showResults]);

    const handleAnswerSelect = (answerIndex: number) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestionIndex] = answerIndex;
        setSelectedAnswers(newSelectedAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Tính điểm
        let correctAnswers = 0;
        selectedAnswers.forEach((selected, index) => {
            if (selected === questions[index]?.correctAnswer) {
                correctAnswers++;
            }
        });

        const finalScore = Math.round(
            (correctAnswers / questions.length) * 100
        );
        setScore(finalScore);
        setShowResults(true);

        // Xác định đạt/không đạt (>= 70% là đạt)
        const passed = finalScore >= 70;
        setTimeout(() => {
            onComplete(passed, finalScore);
        }, 5000); // Hiển thị kết quả trong 5 giây trước khi chuyển tiếp
    };

    // Format thời gian
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
    };

    // Hiển thị kết quả
    if (showResults) {
        const passed = score >= 70;

        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader
                    className={`${
                        passed ? "bg-green-50" : "bg-red-50"
                    } rounded-t-lg`}
                >
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            {passed ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                            )}
                            <span>
                                {passed ? "Chúc mừng!" : "Cần cố gắng thêm"}
                            </span>
                        </div>
                        <Badge variant={passed ? "default" : "destructive"}>
                            Điểm: {score}/100
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-medium">
                                {passed
                                    ? `Bạn đã hoàn thành xuất sắc giai đoạn ${phaseNumber}!`
                                    : `Bạn cần ôn tập lại giai đoạn ${phaseNumber}`}
                            </h3>
                            <p className="text-gray-500 mt-1">
                                {passed
                                    ? "Bạn đã sẵn sàng cho giai đoạn tiếp theo"
                                    : "Hãy xem lại các tài liệu và thử lại"}
                            </p>
                        </div>

                        <Progress value={score} className="h-2" />

                        <div className="flex justify-center space-x-3 mt-6">
                            <Button variant="outline" onClick={onCancel}>
                                {passed
                                    ? "Quay lại lộ trình"
                                    : "Học lại giai đoạn này"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Hiển thị câu hỏi
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>
                        Kiểm tra giai đoạn {phaseNumber}: {phaseTitle}
                    </CardTitle>
                    <Badge variant="outline" className="text-red-500">
                        {formatTime(timeLeft)}
                    </Badge>
                </div>
                <div className="mt-2">
                    <Progress
                        value={
                            ((currentQuestionIndex + 1) / questions.length) *
                            100
                        }
                        className="h-1"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        Câu hỏi {currentQuestionIndex + 1}/{questions.length}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {currentQuestion ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                        selectedAnswers[
                                            currentQuestionIndex
                                        ] === index
                                            ? "border-blue-500 bg-blue-50"
                                            : "hover:border-gray-400"
                                    }`}
                                    onClick={() => handleAnswerSelect(index)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Câu trước
                            </Button>

                            {currentQuestionIndex < questions.length - 1 ? (
                                <Button onClick={handleNext}>
                                    Câu tiếp theo
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={selectedAnswers.some(
                                        (answer) => answer === -1
                                    )}
                                >
                                    Nộp bài
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">Đang tải câu hỏi...</div>
                )}
            </CardContent>
        </Card>
    );
};

export default PhaseTest;
