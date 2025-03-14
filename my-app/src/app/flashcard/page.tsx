"use client";

import React, { useState, useEffect } from "react";

interface Flashcard {
    word: string;
    meaning: string;
    example: string;
    exampleVi: string;
}

const FlashcardPage: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const res = await fetch("/flashcards.txt");
                const text = await res.text();
                const parsedFlashcards = text.split("\n").map((line) => {
                    const [word, meaning, example, exampleVi] = line.split("|");
                    return { word, meaning, example, exampleVi };
                });
                setFlashcards(parsedFlashcards);
            } catch (error) {
                console.error("Lỗi tải flashcard:", error);
            }
        };
        fetchFlashcards();
    }, []);

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const markAsKnown = () => {
        setFlashcards((prev) => prev.filter((_, index) => index !== currentIndex));
        setCurrentIndex(0);
    };

    if (flashcards.length === 0)
        return <p className="text-center text-xl mt-10">Bạn đã học hết từ vựng!</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Flashcard</h1>
            <div className="w-[420px] min-h-[280px] bg-white shadow-2xl rounded-xl p-6 text-center border border-gray-300">
                <p className="text-3xl font-extrabold text-black">
                    {flashcards[currentIndex].word}
                </p>
                <p className="text-2xl text-green-700 font-semibold mt-4">
                    {flashcards[currentIndex].meaning}
                </p>
                <hr className="my-3 border-gray-300" />
                <p className="text-lg text-gray-700 italic">"{flashcards[currentIndex].example}"</p>
                <p className="text-lg text-gray-500 mt-2">{flashcards[currentIndex].exampleVi}</p>
            </div>
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={nextCard}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"
                >
                    Tiếp theo
                </button>
                <button
                    onClick={markAsKnown}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg"
                >
                    Đã nhớ
                </button>
            </div>
        </div>
    );
};

export default FlashcardPage;
