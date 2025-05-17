"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Book,
    Check,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    RefreshCw,
    RotateCcw,
    Save,
    Volume2,
    X,
    Bookmark,
    Calendar,
    Clock,
    Settings,
    CheckCircle,
    ListFilter,
    Home,
    Tag,
    Plus,
    BarChart2,
    PieChart,
    Star,
    Heart,
    Filter,
    Search,
    SlidersHorizontal,
    Shuffle,
    Flame,
    Layout,
    Grid,
    List,
} from "lucide-react";
import Link from "next/link";

interface Flashcard {
    id?: number;
    word: string;
    meaning: string;
    example: string;
    exampleVi: string;
    tags?: string[];
    difficulty?: "easy" | "medium" | "hard";
    lastReviewed?: string;
    reviewCount?: number;
    mastered?: boolean;
    favorited?: boolean;
}

interface FlashcardDeck {
    id: number;
    name: string;
    description: string;
    cardCount: number;
    tags: string[];
    lastReviewed?: string;
}

// Mock data for decks
const mockDecks: FlashcardDeck[] = [
    {
        id: 1,
        name: "TOEIC Essential Vocabulary",
        description: "Essential words for TOEIC exam preparation",
        cardCount: 120,
        tags: ["TOEIC", "Vocabulary", "Business"],
        lastReviewed: "2024-05-10",
    },
    {
        id: 2,
        name: "Business English",
        description: "Common phrases used in business context",
        cardCount: 85,
        tags: ["Business", "Phrases", "Professional"],
        lastReviewed: "2024-05-12",
    },
    {
        id: 3,
        name: "Academic Vocabulary",
        description: "Words commonly used in academic papers and essays",
        cardCount: 150,
        tags: ["Academic", "Essay", "IELTS"],
        lastReviewed: "2024-05-08",
    },
    {
        id: 4,
        name: "Daily Conversations",
        description: "Phrases for everyday conversations",
        cardCount: 75,
        tags: ["Daily", "Conversation", "Casual"],
    },
    {
        id: 5,
        name: "IELTS Speaking",
        description: "Useful expressions for IELTS speaking test",
        cardCount: 95,
        tags: ["IELTS", "Speaking", "Test"],
        lastReviewed: "2024-05-05",
    },
];

const FlashcardPage: React.FC = () => {
    // State for cards and study session
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [knownCards, setKnownCards] = useState<Flashcard[]>([]);
    const [unknownCards, setUnknownCards] = useState<Flashcard[]>([]);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // State for UI and preferences
    const [view, setView] = useState<"decks" | "study">("decks");
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(
        null
    );
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTag, setFilterTag] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<"name" | "count" | "recent">(
        "recent"
    );
    const [showSettings, setShowSettings] = useState(false);
    const [studyPreferences, setStudyPreferences] = useState({
        autoPlayAudio: true,
        shuffleCards: true,
        cardsPerSession: 20,
        showHints: false,
        autoFlip: false,
        autoFlipDelay: 5, // seconds
    });

    // Refs
    const audioRef = useRef<HTMLAudioElement>(null);
    const autoFlipTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                setIsLoading(true);
                if (selectedDeck) {
                    // In a real app, fetch cards for the selected deck
                    // For now, we'll use our generic loading logic
                    let parsedFlashcards: Flashcard[] = [];

                    try {
                        const res = await fetch("/flashcards.txt");
                        const text = await res.text();
                        parsedFlashcards = text
                            .split("\n")
                            .map((line, index) => {
                                const [word, meaning, example, exampleVi] =
                                    line.split("|");
                                return {
                                    id: index + 1,
                                    word,
                                    meaning,
                                    example,
                                    exampleVi,
                                    tags: getRandomTags(),
                                    difficulty: getRandomDifficulty(),
                                    lastReviewed: getRandomDate(),
                                    reviewCount: Math.floor(Math.random() * 10),
                                    mastered: Math.random() > 0.7,
                                    favorited: Math.random() > 0.8,
                                };
                            });
                    } catch (error) {
                        console.error(
                            "Lỗi khi tải file flashcards.txt:",
                            error
                        );
                        // Dữ liệu dự phòng khi không thể tải từ file
                        parsedFlashcards = [
                            {
                                id: 1,
                                word: "accommodate",
                                meaning: "cung cấp chỗ ở hoặc không gian cho",
                                example:
                                    "The hotel can accommodate up to 500 guests",
                                exampleVi:
                                    "Khách sạn có thể cung cấp chỗ ở cho tối đa 500 khách",
                                tags: ["TOEIC", "accommodation"],
                                difficulty: "medium" as
                                    | "easy"
                                    | "medium"
                                    | "hard",
                                lastReviewed: getRandomDate(),
                                reviewCount: 3,
                                mastered: false,
                                favorited: false,
                            },
                            {
                                id: 2,
                                word: "address",
                                meaning: "giải quyết (một vấn đề)",
                                example:
                                    "The company is addressing the customer complaints",
                                exampleVi:
                                    "Công ty đang giải quyết các khiếu nại của khách hàng",
                                tags: ["TOEIC", "business"],
                                difficulty: "easy" as
                                    | "easy"
                                    | "medium"
                                    | "hard",
                                lastReviewed: getRandomDate(),
                                reviewCount: 5,
                                mastered: true,
                                favorited: false,
                            },
                            {
                                id: 3,
                                word: "approximately",
                                meaning: "xấp xỉ, khoảng chừng",
                                example:
                                    "The project will take approximately two weeks to complete",
                                exampleVi:
                                    "Dự án sẽ mất khoảng hai tuần để hoàn thành",
                                tags: ["TOEIC", "general"],
                                difficulty: "medium" as
                                    | "easy"
                                    | "medium"
                                    | "hard",
                                lastReviewed: getRandomDate(),
                                reviewCount: 2,
                                mastered: false,
                                favorited: true,
                            },
                            {
                                id: 4,
                                word: "attitude",
                                meaning: "thái độ, tư thế",
                                example:
                                    "She has a positive attitude towards her work",
                                exampleVi:
                                    "Cô ấy có thái độ tích cực đối với công việc của mình",
                                tags: ["TOEIC", "personality"],
                                difficulty: "easy" as
                                    | "easy"
                                    | "medium"
                                    | "hard",
                                lastReviewed: getRandomDate(),
                                reviewCount: 7,
                                mastered: true,
                                favorited: true,
                            },
                            {
                                id: 5,
                                word: "attribute",
                                meaning: "thuộc tính, đặc điểm",
                                example:
                                    "Attention to detail is an attribute of a good programmer",
                                exampleVi:
                                    "Chú ý đến chi tiết là một đặc điểm của lập trình viên giỏi",
                                tags: ["TOEIC", "characteristics"],
                                difficulty: "hard" as
                                    | "easy"
                                    | "medium"
                                    | "hard",
                                lastReviewed: getRandomDate(),
                                reviewCount: 1,
                                mastered: false,
                                favorited: false,
                            },
                        ];
                    }

                    // Apply shuffling if enabled
                    const cardsToStudy = studyPreferences.shuffleCards
                        ? shuffleArray(parsedFlashcards)
                        : parsedFlashcards;

                    // Limit cards per session if needed
                    setFlashcards(
                        cardsToStudy.slice(
                            0,
                            Math.min(
                                studyPreferences.cardsPerSession,
                                cardsToStudy.length
                            )
                        )
                    );
                    setProgress(0);
                }
            } catch (error) {
                console.error("Lỗi tải flashcard:", error);
                // Đảm bảo không còn hiển thị loading khi có lỗi
                setFlashcards([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (view === "study" && selectedDeck) {
            fetchFlashcards();
        } else {
            // Đảm bảo isLoading được đặt về false nếu không phải view study
            setIsLoading(false);
        }
    }, [
        view,
        selectedDeck,
        studyPreferences.shuffleCards,
        studyPreferences.cardsPerSession,
    ]);

    useEffect(() => {
        if (flashcards.length > 0) {
            setProgress(
                ((knownCards.length + unknownCards.length) /
                    flashcards.length) *
                    100
            );
        }
    }, [flashcards.length, knownCards.length, unknownCards.length]);

    // Auto-flip card effect
    useEffect(() => {
        if (studyPreferences.autoFlip && !isFlipped && view === "study") {
            autoFlipTimerRef.current = setTimeout(() => {
                setIsFlipped(true);
            }, studyPreferences.autoFlipDelay * 1000);
        }

        return () => {
            if (autoFlipTimerRef.current) {
                clearTimeout(autoFlipTimerRef.current);
            }
        };
    }, [
        currentIndex,
        isFlipped,
        studyPreferences.autoFlip,
        studyPreferences.autoFlipDelay,
        view,
    ]);

    const speakWord = () => {
        if (flashcards.length === 0) return;

        const currentWord = flashcards[currentIndex].word;
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);

        // Auto-play audio when card is shown, if enabled
        if (studyPreferences.autoPlayAudio && !isFlipped) {
            speechSynthesis.speak(utterance);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < flashcards.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setReviewMode(true);
            }
        }, 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }, 200);
    };

    const markAsKnown = () => {
        if (flashcards.length === 0) return;

        const currentCard = flashcards[currentIndex];
        setKnownCards([...knownCards, currentCard]);

        const newFlashcards = [...flashcards];
        newFlashcards.splice(currentIndex, 1);

        if (newFlashcards.length === 0) {
            setReviewMode(true);
        } else {
            setFlashcards(newFlashcards);
            setCurrentIndex(
                currentIndex >= newFlashcards.length
                    ? newFlashcards.length - 1
                    : currentIndex
            );
        }
    };

    const markAsUnknown = () => {
        if (flashcards.length === 0) return;

        const currentCard = flashcards[currentIndex];
        setUnknownCards([...unknownCards, currentCard]);

        const newFlashcards = [...flashcards];
        newFlashcards.splice(currentIndex, 1);

        if (newFlashcards.length === 0) {
            setReviewMode(true);
        } else {
            setFlashcards(newFlashcards);
            setCurrentIndex(
                currentIndex >= newFlashcards.length
                    ? newFlashcards.length - 1
                    : currentIndex
            );
        }
    };

    const resetStudySession = () => {
        // Kết hợp tất cả các thẻ và trộn lại
        const allCards = [...knownCards, ...unknownCards, ...flashcards];
        const shuffledCards = studyPreferences.shuffleCards
            ? shuffleArray(allCards)
            : allCards;

        setFlashcards(shuffledCards);
        setKnownCards([]);
        setUnknownCards([]);
        setCurrentIndex(0);
        setReviewMode(false);
        setIsFlipped(false);
    };

    const reviewUnknownCards = () => {
        setFlashcards(unknownCards);
        setUnknownCards([]);
        setCurrentIndex(0);
        setReviewMode(false);
        setIsFlipped(false);
    };

    const startStudySession = (deck: FlashcardDeck) => {
        setSelectedDeck(deck);
        setView("study");
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCards([]);
        setUnknownCards([]);
        setReviewMode(false);
    };

    const endStudySession = () => {
        setView("decks");
        setSelectedDeck(null);
        setFlashcards([]);
    };

    const toggleFavorite = (cardId: number) => {
        setFlashcards((cards) =>
            cards.map((card) =>
                card.id === cardId
                    ? { ...card, favorited: !card.favorited }
                    : card
            )
        );
    };

    const updateStudyPreference = (
        key: keyof typeof studyPreferences,
        value: any
    ) => {
        setStudyPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Helper functions
    const getRandomTags = () => {
        const allTags = [
            "vocabulary",
            "business",
            "casual",
            "academic",
            "TOEIC",
            "IELTS",
            "speaking",
            "writing",
        ];
        const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
        const shuffled = shuffleArray(allTags);
        return shuffled.slice(0, numTags);
    };

    const getRandomDifficulty = (): "easy" | "medium" | "hard" => {
        const difficulties: ("easy" | "medium" | "hard")[] = [
            "easy",
            "medium",
            "hard",
        ];
        return difficulties[Math.floor(Math.random() * difficulties.length)];
    };

    const getRandomDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split("T")[0];
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Filter and sort decks
    const filteredDecks = mockDecks.filter((deck) => {
        const matchesSearch =
            deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deck.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !filterTag || deck.tags.includes(filterTag);
        return matchesSearch && matchesTag;
    });

    const sortedDecks = [...filteredDecks].sort((a, b) => {
        if (sortOption === "name") {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "count") {
            return b.cardCount - a.cardCount;
        } else {
            // recent
            const dateA = a.lastReviewed
                ? new Date(a.lastReviewed).getTime()
                : 0;
            const dateB = b.lastReviewed
                ? new Date(b.lastReviewed).getTime()
                : 0;
            return dateB - dateA;
        }
    });

    // Get all unique tags from decks
    const allTags = Array.from(new Set(mockDecks.flatMap((deck) => deck.tags)));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // Deck selection view
    if (view === "decks") {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Flashcards
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Luyện từ vựng và cụm từ với các bộ thẻ ghi
                                    nhớ
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setShowSettings(!showSettings)
                                    }
                                    className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    title="Cài đặt"
                                >
                                    <Settings className="h-5 w-5" />
                                </button>
                                <Link href="/dashboard">
                                    <button
                                        className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        title="Về trang chủ"
                                    >
                                        <Home className="h-5 w-5" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Search and filters */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bộ thẻ..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(
                                            e.target.value as
                                                | "name"
                                                | "count"
                                                | "recent"
                                        )
                                    }
                                    className="py-2.5 px-3 pr-8 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="recent">Mới nhất</option>
                                    <option value="name">Tên (A-Z)</option>
                                    <option value="count">Số thẻ</option>
                                </select>
                                <button
                                    onClick={() =>
                                        setViewMode(
                                            viewMode === "grid"
                                                ? "list"
                                                : "grid"
                                        )
                                    }
                                    className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {viewMode === "grid" ? (
                                        <List className="h-5 w-5" />
                                    ) : (
                                        <Grid className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tags filter */}
                    <div className="mb-6 flex items-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-1 flex items-center">
                            <Tag className="h-4 w-4 mr-1.5" />
                            Tags:
                        </span>
                        <button
                            onClick={() => setFilterTag(null)}
                            className={`px-3 py-1.5 text-sm rounded-full ${
                                filterTag === null
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } transition-colors`}
                        >
                            Tất cả
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setFilterTag(tag)}
                                className={`px-3 py-1.5 text-sm rounded-full ${
                                    filterTag === tag
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                } transition-colors`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Decks grid/list */}
                    <div
                        className={`${
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                        }`}
                    >
                        {/* Create new deck card */}
                        <div
                            className={`${
                                viewMode === "grid"
                                    ? "border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center h-64 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                                    : "border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                            }`}
                        >
                            <div>
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    Tạo bộ thẻ mới
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Tạo bộ thẻ tùy chỉnh với từ vựng của riêng
                                    bạn
                                </p>
                            </div>
                        </div>

                        {/* Deck cards */}
                        {sortedDecks.map((deck) => (
                            <div
                                key={deck.id}
                                onClick={() => startStudySession(deck)}
                                className={`${
                                    viewMode === "grid"
                                        ? "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition"
                                        : "bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-md hover:border-blue-300 cursor-pointer transition"
                                }`}
                            >
                                {viewMode === "grid" ? (
                                    <>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {deck.name}
                                                </h3>
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-800">
                                                    {deck.cardCount}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                {deck.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {deck.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 flex items-center">
                                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                    {deck.lastReviewed
                                                        ? `Last: ${new Date(
                                                              deck.lastReviewed
                                                          ).toLocaleDateString()}`
                                                        : "Not studied yet"}
                                                </span>
                                                <button
                                                    className="text-blue-600 font-medium flex items-center hover:text-blue-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startStudySession(deck);
                                                    }}
                                                >
                                                    Học ngay
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-800 font-medium mr-4">
                                                {deck.cardCount}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {deck.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                                                    {deck.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {deck.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {deck.lastReviewed && (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(
                                                        deck.lastReviewed
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startStudySession(deck);
                                                }}
                                            >
                                                Học ngay
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Study settings modal */}
                    {showSettings && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Tùy chỉnh học tập
                                    </h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Tự động phát âm
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Tự động đọc từ khi lật thẻ
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    studyPreferences.autoPlayAudio
                                                }
                                                onChange={(e) =>
                                                    updateStudyPreference(
                                                        "autoPlayAudio",
                                                        e.target.checked
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Trộn thẻ
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Thay đổi thứ tự thẻ mỗi lần học
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    studyPreferences.shuffleCards
                                                }
                                                onChange={(e) =>
                                                    updateStudyPreference(
                                                        "shuffleCards",
                                                        e.target.checked
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Tự động lật thẻ
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Tự động lật thẻ sau thời gian đã
                                                định
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    studyPreferences.autoFlip
                                                }
                                                onChange={(e) =>
                                                    updateStudyPreference(
                                                        "autoFlip",
                                                        e.target.checked
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {studyPreferences.autoFlip && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Thời gian lật thẻ (giây)
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={
                                                    studyPreferences.autoFlipDelay
                                                }
                                                onChange={(e) =>
                                                    updateStudyPreference(
                                                        "autoFlipDelay",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>1s</span>
                                                <span>
                                                    {
                                                        studyPreferences.autoFlipDelay
                                                    }
                                                    s
                                                </span>
                                                <span>10s</span>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số thẻ mỗi phiên học
                                        </label>
                                        <select
                                            value={
                                                studyPreferences.cardsPerSession
                                            }
                                            onChange={(e) =>
                                                updateStudyPreference(
                                                    "cardsPerSession",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={10}>10 thẻ</option>
                                            <option value={20}>20 thẻ</option>
                                            <option value={30}>30 thẻ</option>
                                            <option value={50}>50 thẻ</option>
                                            <option value={100}>100 thẻ</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No results */}
                    {sortedDecks.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Không tìm thấy bộ thẻ nào
                            </h3>
                            <p className="text-gray-500">
                                Hãy thử tìm kiếm với từ khóa khác hoặc loại bỏ
                                bộ lọc
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (reviewMode) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">
                                    Study Session Completed!
                                </h1>
                                <p className="text-blue-100">
                                    You have completed{" "}
                                    {knownCards.length + unknownCards.length}{" "}
                                    cards from the {selectedDeck?.name} deck
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-green-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {knownCards.length}
                                    </div>
                                    <div className="text-gray-700">
                                        Remembered
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-red-600 mb-2">
                                        {unknownCards.length}
                                    </div>
                                    <div className="text-gray-700">
                                        Need to Study
                                    </div>
                                </div>
                            </div>

                            {/* Hiệu suất học tập */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                    <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                                    Study Performance
                                </h2>
                                <div className="w-full h-2.5 bg-gray-200 rounded-full mb-2">
                                    <div
                                        className="h-2.5 bg-green-500 rounded-full"
                                        style={{
                                            width: `${
                                                (knownCards.length /
                                                    (knownCards.length +
                                                        unknownCards.length)) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>0%</span>
                                    <span>
                                        {Math.round(
                                            (knownCards.length /
                                                (knownCards.length +
                                                    unknownCards.length)) *
                                                100
                                        )}
                                        % remembered
                                    </span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {unknownCards.length > 0 && (
                                    <button
                                        onClick={reviewUnknownCards}
                                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Study {unknownCards.length} cards again
                                    </button>
                                )}
                                <button
                                    onClick={resetStudySession}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Study again
                                </button>
                                <button
                                    onClick={endStudySession}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Return to List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <Book className="h-8 w-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        No more words to study!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        You have studied all the words. You can start a new
                        study session or go back to the home page.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={resetStudySession}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Start new session
                        </button>
                        <Link href="/">
                            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                                Return to home page
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <div className="flex items-center">
                            <button
                                onClick={endStudySession}
                                className="mr-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">
                                {selectedDeck?.name}
                            </h1>
                        </div>
                        <p className="text-gray-600 mt-1 ml-11">
                            {currentIndex + 1}/
                            {flashcards.length +
                                knownCards.length +
                                unknownCards.length}{" "}
                            cards
                        </p>
                    </div>
                    <div className="ml-11 sm:ml-0 mt-4 sm:mt-0 flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                            {Math.round(progress)}% completed
                        </span>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Settings className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div
                        className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Card */}
                <div className="mb-8 perspective">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div
                                className={`flip-card w-full mx-auto min-h-[400px] bg-white rounded-xl ${
                                    isFlipped ? "flipped" : ""
                                }`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <div className="flip-card-inner">
                                    {/* Front */}
                                    <div className="flip-card-front rounded-xl shadow-md border border-gray-200 p-8 relative">
                                        {/* Card badges */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            {flashcards[currentIndex]
                                                .difficulty && (
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium 
                                                    ${
                                                        flashcards[currentIndex]
                                                            .difficulty ===
                                                        "easy"
                                                            ? "bg-green-100 text-green-800"
                                                            : flashcards[
                                                                  currentIndex
                                                              ].difficulty ===
                                                              "medium"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {
                                                        flashcards[currentIndex]
                                                            .difficulty
                                                    }
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(
                                                        flashcards[currentIndex]
                                                            .id || 0
                                                    );
                                                }}
                                                className={`p-1.5 rounded-full 
                                                    ${
                                                        flashcards[currentIndex]
                                                            .favorited
                                                            ? "bg-red-100 text-red-500"
                                                            : "bg-gray-100 text-gray-400 hover:text-gray-600"
                                                    }`}
                                            >
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center justify-center h-full pt-40">
                                            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                                                {flashcards[currentIndex].word}
                                            </h2>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speakWord();
                                                }}
                                                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 hover:bg-blue-200 transition-colors"
                                            >
                                                <Volume2 className="h-6 w-6 text-blue-600" />
                                            </button>

                                            {/* Tags */}
                                            {flashcards[currentIndex].tags &&
                                                flashcards[currentIndex].tags
                                                    .length > 0 && (
                                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                        {flashcards[
                                                            currentIndex
                                                        ].tags.map(
                                                            (tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            <p className="text-gray-500 italic text-sm mb-4">
                                                Nhấp vào thẻ để xem nghĩa
                                            </p>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div className="flip-card-back bg-white rounded-xl shadow-md border border-gray-200 p-8">
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                Meaning
                                            </h3>
                                            <p className="text-2xl font-semibold text-blue-600">
                                                {
                                                    flashcards[currentIndex]
                                                        .meaning
                                                }
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                Example
                                            </h3>
                                            <p className="text-lg text-gray-700 italic mb-2">
                                                "
                                                {
                                                    flashcards[currentIndex]
                                                        .example
                                                }
                                                "
                                            </p>
                                            <p className="text-base text-blue-600">
                                                {
                                                    flashcards[currentIndex]
                                                        .exampleVi
                                                }
                                            </p>
                                        </div>

                                        <p className="text-gray-500 italic text-sm text-center mt-12">
                                            Click on the card to see the word
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-3 mb-10">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className={`p-3 rounded-full ${
                            currentIndex === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={markAsUnknown}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center font-medium transition-colors"
                    >
                        <X className="h-5 w-5 mr-2 text-red-500" />
                        <span>Not Remembered</span>
                    </button>

                    <button
                        onClick={markAsKnown}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center font-medium transition-colors"
                    >
                        <Check className="h-5 w-5 mr-2" />
                        <span>Remembered</span>
                    </button>

                    <button
                        onClick={nextCard}
                        className="p-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                {/* Card count indicators */}
                <div className="flex justify-center items-center gap-8 text-center">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                            <HelpCircle className="h-5 w-5 text-gray-500" />
                        </div>
                        <span className="text-xl font-medium text-gray-800">
                            {flashcards.length}
                        </span>
                        <p className="text-sm text-gray-500">Remaining</p>
                    </div>

                    <div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                            <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-xl font-medium text-gray-800">
                            {knownCards.length}
                        </span>
                        <p className="text-sm text-gray-500">Remembered</p>
                    </div>

                    <div>
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                            <X className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-xl font-medium text-gray-800">
                            {unknownCards.length}
                        </span>
                        <p className="text-sm text-gray-500">Not Remembered</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective {
                    perspective: 1000px;
                }

                .flip-card {
                    cursor: pointer;
                }

                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                }

                .flip-card.flipped .flip-card-inner {
                    transform: rotateY(180deg);
                }

                .flip-card-front,
                .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }

                .flip-card-back {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

export default FlashcardPage;
