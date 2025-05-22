import React from "react";

interface Question {
    id: string;
    content: string;
    type: "single" | "multiple" | "fill" | "essay";
    part: number;
    sectionType: string;
    order: number;
}

interface QuestionNavigationProps {
    questions: Question[];
    currentQuestionIndex: number;
    userAnswers: Record<string, any>;
    onSelectQuestion: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
    questions,
    currentQuestionIndex,
    userAnswers,
    onSelectQuestion,
}) => {
    // Nhóm các câu hỏi theo phần và section
    const groupedQuestions = questions.reduce((acc, question) => {
        const key = `${question.sectionType}-${question.part}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(question);
        return acc;
    }, {} as Record<string, Question[]>);

    const getButtonColor = (questionId: string, index: number) => {
        if (index === currentQuestionIndex) {
            return "bg-blue-600 text-white";
        }

        if (userAnswers[questionId]) {
            return "bg-green-100 text-green-800 border-green-500";
        }

        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    };

    const getSectionTitle = (key: string) => {
        const [section, part] = key.split("-");
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        return `${sectionName} - Phần ${part}`;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Điều hướng câu hỏi</h3>

            {Object.keys(groupedQuestions).map((key) => (
                <div key={key} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {getSectionTitle(key)}
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                        {groupedQuestions[key].map((question, idx) => {
                            const questionNumber =
                                questions.findIndex(
                                    (q) => q.id === question.id
                                ) + 1;
                            return (
                                <button
                                    key={question.id}
                                    onClick={() =>
                                        onSelectQuestion(
                                            questions.findIndex(
                                                (q) => q.id === question.id
                                            )
                                        )
                                    }
                                    className={`w-full h-9 flex items-center justify-center rounded-md border ${getButtonColor(
                                        question.id,
                                        questions.findIndex(
                                            (q) => q.id === question.id
                                        )
                                    )}`}
                                    title={
                                        question.content.length > 30
                                            ? question.content
                                            : undefined
                                    }
                                >
                                    {questionNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuestionNavigation;
