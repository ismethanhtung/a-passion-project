import React from "react";

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

interface QuestionDisplayProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    userAnswer: any;
    onAnswerChange: (questionId: string, answer: any) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    question,
    questionNumber,
    totalQuestions,
    userAnswer,
    onAnswerChange,
}) => {
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

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-4 flex justify-between">
                <span className="text-sm text-gray-500">
                    Câu hỏi {questionNumber}/{totalQuestions}
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
                            <source src={question.audioUrl} type="audio/mpeg" />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                        </audio>
                    </div>
                )}

                <div className="prose max-w-none">
                    <p className="text-lg font-medium">{question.content}</p>
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
                                            onAnswerChange(
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
                                        userAnswer.includes(index.toString())
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
                                                onAnswerChange(question.id, [
                                                    ...currentValues,
                                                    index.toString(),
                                                ]);
                                            } else {
                                                onAnswerChange(
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
                                onAnswerChange(question.id, e.target.value)
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
                                onAnswerChange(question.id, e.target.value)
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

export default QuestionDisplay;
