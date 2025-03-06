"use client";

import { useState } from "react";

type QuestionProps = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    onSelect: (id: string, answer: string) => void;
};

export default function Question({
    id,
    question,
    options,
    correctAnswer,
    onSelect,
}: QuestionProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (answer: string) => {
        setSelected(answer);
        onSelect(id, answer);
    };

    return (
        <div className="border p-4 rounded-lg shadow-md">
            <p className="font-semibold">
                {id}. {question}
            </p>
            <div className="mt-2">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)}
                        className={`block w-full text-left p-2 rounded-md border ${
                            selected === option ? "bg-blue-500 text-white" : "bg-gray-100"
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
