"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    X,
    HelpCircle,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
}

interface PodcastQuizProps {
    questions: QuizQuestion[];
    podcastTitle: string;
    onClose: () => void;
    onComplete: (score: number) => void;
}

const PodcastQuiz: React.FC<PodcastQuizProps> = ({
    questions,
    podcastTitle,
    onClose,
    onComplete,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(questions.length).fill(null)
    );
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);

    // Tính điểm khi hoàn thành quiz
    const calculateScore = () => {
        let correctAnswers = 0;
        answers.forEach((answer, index) => {
            if (answer !== null && answer === questions[index].answer) {
                correctAnswers++;
            }
        });

        const finalScore = Math.round(
            (correctAnswers / questions.length) * 100
        );
        setScore(finalScore);
        return finalScore;
    };

    // Di chuyển đến câu hỏi tiếp theo
    const handleNextQuestion = () => {
        // Lưu câu trả lời hiện tại
        if (selectedOption !== null) {
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = selectedOption;
            setAnswers(newAnswers);
        }

        setShowExplanation(false);

        // Nếu đã là câu hỏi cuối, hiển thị kết quả
        if (currentQuestionIndex === questions.length - 1) {
            const finalScore = calculateScore();
            setQuizCompleted(true);
            onComplete(finalScore);
            return;
        }

        // Di chuyển đến câu hỏi tiếp theo
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(answers[currentQuestionIndex + 1]);
    };

    // Di chuyển đến câu hỏi trước đó
    const handlePreviousQuestion = () => {
        // Lưu câu trả lời hiện tại
        if (selectedOption !== null) {
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = selectedOption;
            setAnswers(newAnswers);
        }

        setShowExplanation(false);

        // Di chuyển đến câu hỏi trước đó
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setSelectedOption(answers[currentQuestionIndex - 1]);
    };

    // Chọn một lựa chọn
    const handleSelectOption = (optionIndex: number) => {
        setSelectedOption(optionIndex);
    };

    // Hiện kết quả cuối cùng
    if (quizCompleted) {
        const passThreshold = 70; // Ngưỡng đạt
        const passed = score >= passThreshold;

        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className={passed ? "bg-green-50" : "bg-amber-50"}>
                    <CardTitle className="flex items-center">
                        {passed ? (
                            <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                        ) : (
                            <AlertCircle className="mr-2 h-6 w-6 text-amber-500" />
                        )}
                        Kết quả Quiz: {podcastTitle}
                    </CardTitle>
                    <CardDescription>
                        Bạn đã hoàn thành bài kiểm tra kiến thức từ podcast
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-40 h-40 mb-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold">
                                    {score}%
                                </span>
                            </div>
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 100 100"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={passed ? "#10b981" : "#f59e0b"}
                                    strokeWidth="10"
                                    strokeDasharray={`${score * 2.83} 283`}
                                    strokeDashoffset="0"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                        </div>

                        <h3 className="text-xl font-medium mb-2">
                            {passed
                                ? "Chúc mừng! Bạn đã hoàn thành tốt bài kiểm tra"
                                : "Bạn cần cố gắng hơn"}
                        </h3>

                        <p className="text-gray-600 mb-4">
                            {passed
                                ? "Bạn đã nắm vững nội dung của podcast. Hãy tiếp tục học thêm các bài khác!"
                                : "Bạn có thể nghe lại podcast và thử lại bài kiểm tra để cải thiện kết quả."}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <Badge variant="outline">
                                Số câu đúng:{" "}
                                {
                                    answers.filter(
                                        (a, i) => a === questions[i].answer
                                    ).length
                                }
                                /{questions.length}
                            </Badge>
                            <Badge variant={passed ? "default" : "outline"}>
                                Kết quả: {passed ? "Đạt" : "Chưa đạt"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    {!passed && (
                        <Button
                            onClick={() => {
                                setQuizCompleted(false);
                                setCurrentQuestionIndex(0);
                                setSelectedOption(null);
                                setAnswers(Array(questions.length).fill(null));
                                setShowExplanation(false);
                            }}
                        >
                            Làm lại
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    // Hiển thị câu hỏi hiện tại
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    const hasAnswered = selectedOption !== null;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg">Quiz: {podcastTitle}</CardTitle>
                <CardDescription>
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                </CardDescription>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                            width: `${
                                ((currentQuestionIndex + 1) /
                                    questions.length) *
                                100
                            }%`,
                        }}
                    ></div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`
                                        p-3 border rounded-lg flex items-center cursor-pointer
                                        ${
                                            hasAnswered &&
                                            index === currentQuestion.answer
                                                ? "border-green-500 bg-green-50"
                                                : hasAnswered &&
                                                  index === selectedOption
                                                ? "border-red-500 bg-red-50"
                                                : selectedOption === index
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "hover:border-gray-400"
                                        }
                                    `}
                                    onClick={() =>
                                        !hasAnswered &&
                                        handleSelectOption(index)
                                    }
                                >
                                    <div className="flex-1">{option}</div>
                                    {hasAnswered &&
                                        index === currentQuestion.answer && (
                                            <Check className="h-5 w-5 text-green-500" />
                                        )}
                                    {hasAnswered &&
                                        index === selectedOption &&
                                        index !== currentQuestion.answer && (
                                            <X className="h-5 w-5 text-red-500" />
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {showExplanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center font-medium text-blue-800 mb-1">
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Giải thích:
                            </div>
                            <p className="text-blue-700 text-sm">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <div>
                    <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Trước
                    </Button>
                </div>

                <div className="space-x-2">
                    {!showExplanation && hasAnswered && (
                        <Button
                            variant="outline"
                            onClick={() => setShowExplanation(true)}
                        >
                            Xem giải thích
                        </Button>
                    )}

                    <Button
                        onClick={handleNextQuestion}
                        disabled={selectedOption === null}
                    >
                        {currentQuestionIndex === questions.length - 1
                            ? "Hoàn thành"
                            : "Tiếp theo"}
                        {currentQuestionIndex !== questions.length - 1 && (
                            <ChevronRight className="h-4 w-4 ml-1" />
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default PodcastQuiz;
