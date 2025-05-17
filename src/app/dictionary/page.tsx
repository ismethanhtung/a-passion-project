"use client";

import React, { useState } from "react";

const mockDictionary = {
    hello: {
        word: "hello",
        phonetic: "/həˈloʊ/",
        type: "interjection",
        meaning: "used as a greeting or to begin a phone conversation",
        example: "Hello! How are you?",
    },
    world: {
        word: "world",
        phonetic: "/wɜːrld/",
        type: "noun",
        meaning: "the earth, together with all of its countries and peoples",
        example: "He traveled all over the world.",
    },
};

export default function Dictionary() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setResult(mockDictionary[query.toLowerCase()] || null);
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-green-100">
                <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
                    Dictionary
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tra cứu nghĩa, phát âm, ví dụ của từ tiếng Anh.
                </p>
                <form className="flex gap-2 mb-6" onSubmit={handleSearch}>
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Nhập từ cần tra..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Đang tra..." : "Tra từ"}
                    </button>
                </form>
                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                        <div className="text-xl font-bold mb-1">
                            {result.word}
                        </div>
                        <div className="mb-1">
                            Phonetic:{" "}
                            <span className="font-mono">{result.phonetic}</span>
                        </div>
                        <div className="mb-1">
                            Type: <span className="italic">{result.type}</span>
                        </div>
                        <div className="mb-1">Meaning: {result.meaning}</div>
                        <div>
                            Example:{" "}
                            <span className="italic">{result.example}</span>
                        </div>
                    </div>
                )}
                {result === null && query && !loading && (
                    <div className="text-red-500 mt-4 text-center">
                        Không tìm thấy kết quả cho "{query}"
                    </div>
                )}
            </div>
        </div>
    );
}
