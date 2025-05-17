"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Search, Volume2, History, BookmarkPlus, Clock, Refresh, ChevronDown, ChevronRight, ExternalLink, Copy } from "lucide-react";

interface DictionaryEntry {
    word: string;
    phonetic?: string;
    pronunciationAudio?: string;
    meanings: {
        partOfSpeech: string;
        definition: string;
        example?: string;
        synonyms: string[];
        antonyms: string[];
    }[];
    etymology?: string;
    timestamp: number;
}

// Từ điển mẫu với các từ cơ bản
const mockDictionary: Record<string, DictionaryEntry> = {
    "hello": {
        word: "hello",
        phonetic: "/həˈloʊ/",
        pronunciationAudio: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3",
        meanings: [
            {
                partOfSpeech: "interjection",
                definition: "Used as a greeting or to begin a phone conversation.",
                example: "Hello! How are you?",
                synonyms: ["hi", "greetings", "howdy", "hey"],
                antonyms: ["goodbye", "bye"]
            },
            {
                partOfSpeech: "noun",
                definition: "An utterance of "hello"; a greeting.",
                example: "She gave me a warm hello.",
                synonyms: ["greeting", "salutation", "welcome"],
                antonyms: []
            }
        ],
        etymology: "From English dialectal hallo, hullo, alteration of obsolete holla, hollo. Related to holler.",
        timestamp: Date.now()
    },
    "world": {
        word: "world",
        phonetic: "/wɜːrld/",
        pronunciationAudio: "https://api.dictionaryapi.dev/media/pronunciations/en/world-us.mp3",
        meanings: [
            {
                partOfSpeech: "noun",
                definition: "The Earth, together with all of its countries, peoples, and natural features.",
                example: "He traveled all over the world.",
                synonyms: ["earth", "globe", "planet"],
                antonyms: []
            },
            {
                partOfSpeech: "noun",
                definition: "All of the people, societies, and institutions on the Earth.",
                example: "The news shocked the world.",
                synonyms: ["humankind", "humanity", "society", "civilization"],
                antonyms: []
            }
        ],
        etymology: "From Middle English world, weoreld, from Old English world, woruld, worold ('world, age, men, humanity'), from Proto-West Germanic *waraldi, from Proto-Germanic *weraldiz ('lifetime, worldly existence, world').",
        timestamp: Date.now()
    },
    "dictionary": {
        word: "dictionary",
        phonetic: "/ˈdɪkʃənɛri/",
        pronunciationAudio: "https://api.dictionaryapi.dev/media/pronunciations/en/dictionary-us.mp3",
        meanings: [
            {
                partOfSpeech: "noun",
                definition: "A reference work with a list of words from one or more languages, normally ordered alphabetically, explaining each word's meaning, and sometimes containing information on its etymology, pronunciation, usage, and translations.",
                example: "I looked up the word in the dictionary.",
                synonyms: ["lexicon", "wordbook", "glossary"],
                antonyms: []
            }
        ],
        etymology: "From Medieval Latin dictiōnārium, from Latin dictiō, from dīcō ("to say").",
        timestamp: Date.now()
    }
};

// Từ đồng nghĩa cho từ gọi ý
const commonSearches = [
    "hello", "world", "dictionary", "language", "learn", "pronunciation",
    "vocabulary", "grammar", "fluent", "idiom", "practice", "speak"
];

export default function Dictionary() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<DictionaryEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("definition");
    const [relatedWords, setRelatedWords] = useState<string[]>([]);
    const [searchHistory, setSearchHistory] = useState<DictionaryEntry[]>([]);
    const [savedWords, setSavedWords] = useState<DictionaryEntry[]>([]);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [showFullDefinition, setShowFullDefinition] = useState(false);
    
    // Tải lịch sử tra cứu từ localStorage khi component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("dictionaryHistory");
        const savedFavorites = localStorage.getItem("dictionarySaved");
        
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setSearchHistory(parsed);
            } catch (error) {
                console.error("Error parsing search history:", error);
            }
        }
        
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                setSavedWords(parsed);
            } catch (error) {
                console.error("Error parsing saved words:", error);
            }
        }
    }, []);
    
    // Cập nhật lịch sử tra cứu
    const updateSearchHistory = (entry: DictionaryEntry) => {
        // Kiểm tra nếu từ đã có trong lịch sử
        const existingIndex = searchHistory.findIndex(item => item.word === entry.word);
        let newHistory = [...searchHistory];
        
        if (existingIndex !== -1) {
            // Nếu từ đã tồn tại, xóa bỏ vị trí cũ
            newHistory.splice(existingIndex, 1);
        }
        
        // Thêm từ mới vào đầu lịch sử
        newHistory = [entry, ...newHistory].slice(0, 20); // Giới hạn 20 từ
        setSearchHistory(newHistory);
        
        // Lưu vào localStorage
        localStorage.setItem("dictionaryHistory", JSON.stringify(newHistory));
    };
    
    // Lưu từ vào danh sách yêu thích
    const toggleSaveWord = (entry: DictionaryEntry) => {
        const existingIndex = savedWords.findIndex(item => item.word === entry.word);
        let newSavedList = [...savedWords];
        
        if (existingIndex !== -1) {
            // Nếu từ đã được lưu, xóa khỏi danh sách
            newSavedList.splice(existingIndex, 1);
            toast.info(`Đã xóa "${entry.word}" khỏi danh sách từ vựng đã lưu`);
        } else {
            // Thêm từ mới vào danh sách
            newSavedList = [entry, ...newSavedList];
            toast.success(`Đã lưu "${entry.word}" vào danh sách từ vựng`);
        }
        
        setSavedWords(newSavedList);
        localStorage.setItem("dictionarySaved", JSON.stringify(newSavedList));
    };
    
    // Gọi API thông qua Groq để lấy định nghĩa từ điển nâng cao
    const fetchAdvancedDefinition = async (word: string) => {
        try {
            const response = await fetch('/api/dictionary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            });
            
            if (!response.ok) {
                throw new Error('Có lỗi khi gọi API');
            }
            
            const data = await response.json();

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
