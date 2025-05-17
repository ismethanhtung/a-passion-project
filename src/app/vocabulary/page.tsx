"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    BookOpen,
    Repeat,
    Play,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Save,
    Star,
    Plus,
    Search,
} from "lucide-react";

interface Word {
    id: number;
    word: string;
    meaning: string;
    example: string;
    pronunciation?: string;
    partOfSpeech: string;
    level: "basic" | "intermediate" | "advanced";
    lastReviewed?: Date | null;
    nextReview?: Date | null;
    repetitionCount: number;
}

interface VocabularySet {
    id: number;
    topic: string;
    description: string;
    words: Word[];
    level: "basic" | "intermediate" | "advanced";
}

const vocabularySets: VocabularySet[] = [
    {
        id: 1,
        topic: "Công việc (Work)",
        description: "Từ vựng về công việc, môi trường làm việc và sự nghiệp",
        level: "intermediate",
        words: [
            {
                id: 101,
                word: "resume",
                meaning: "sơ yếu lý lịch",
                example: "I updated my resume before applying for the job.",
                pronunciation: "/rɪˈzuːm/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 102,
                word: "promotion",
                meaning: "thăng chức",
                example:
                    "She received a promotion after three years at the company.",
                pronunciation: "/prəˈmoʊʃn/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 103,
                word: "colleague",
                meaning: "đồng nghiệp",
                example:
                    "My colleagues organized a surprise party for my birthday.",
                pronunciation: "/ˈkɑːliːɡ/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 104,
                word: "salary",
                meaning: "lương",
                example:
                    "She negotiated a higher salary during the job interview.",
                pronunciation: "/ˈsæləri/",
                partOfSpeech: "noun",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 105,
                word: "deadline",
                meaning: "hạn chót",
                example:
                    "I need to finish this report before the deadline tomorrow.",
                pronunciation: "/ˈdedlaɪn/",
                partOfSpeech: "noun",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 106,
                word: "negotiate",
                meaning: "đàm phán, thương lượng",
                example: "We need to negotiate better terms for this contract.",
                pronunciation: "/nɪˈɡoʊʃieɪt/",
                partOfSpeech: "verb",
                level: "advanced",
                repetitionCount: 0,
            },
            {
                id: 107,
                word: "proficient",
                meaning: "thành thạo, giỏi",
                example:
                    "The job requires someone who is proficient in graphic design.",
                pronunciation: "/prəˈfɪʃnt/",
                partOfSpeech: "adjective",
                level: "advanced",
                repetitionCount: 0,
            },
        ],
    },
    {
        id: 2,
        topic: "Du lịch (Travel)",
        description: "Từ vựng về du lịch, khách sạn và phương tiện di chuyển",
        level: "basic",
        words: [
            {
                id: 201,
                word: "passport",
                meaning: "hộ chiếu",
                example:
                    "Don't forget to bring your passport when traveling internationally.",
                pronunciation: "/ˈpæspɔːrt/",
                partOfSpeech: "noun",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 202,
                word: "luggage",
                meaning: "hành lý",
                example: "I packed all my luggage the night before the flight.",
                pronunciation: "/ˈlʌɡɪdʒ/",
                partOfSpeech: "noun",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 203,
                word: "itinerary",
                meaning: "lịch trình",
                example:
                    "Our travel agent prepared a detailed itinerary for our trip.",
                pronunciation: "/aɪˈtɪnəreri/",
                partOfSpeech: "noun",
                level: "advanced",
                repetitionCount: 0,
            },
            {
                id: 204,
                word: "souvenir",
                meaning: "quà lưu niệm",
                example: "I bought this magnet as a souvenir from Paris.",
                pronunciation: "/ˌsuːvəˈnɪr/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 205,
                word: "destination",
                meaning: "điểm đến",
                example:
                    "Thailand is a popular tourist destination in Southeast Asia.",
                pronunciation: "/ˌdestɪˈneɪʃn/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
        ],
    },
    {
        id: 3,
        topic: "Ẩm thực (Food)",
        description: "Từ vựng về ẩm thực, nấu ăn và nhà hàng",
        level: "basic",
        words: [
            {
                id: 301,
                word: "ingredient",
                meaning: "nguyên liệu",
                example: "This recipe requires only five ingredients.",
                pronunciation: "/ɪnˈɡriːdiənt/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 302,
                word: "recipe",
                meaning: "công thức nấu ăn",
                example:
                    "My grandmother gave me her secret recipe for apple pie.",
                pronunciation: "/ˈresəpi/",
                partOfSpeech: "noun",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 303,
                word: "cuisine",
                meaning: "ẩm thực",
                example:
                    "Thai cuisine is famous for its use of herbs and spices.",
                pronunciation: "/kwɪˈziːn/",
                partOfSpeech: "noun",
                level: "intermediate",
                repetitionCount: 0,
            },
            {
                id: 304,
                word: "delicious",
                meaning: "ngon",
                example: "The cake was absolutely delicious.",
                pronunciation: "/dɪˈlɪʃəs/",
                partOfSpeech: "adjective",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 305,
                word: "spicy",
                meaning: "cay",
                example: "I prefer spicy food with lots of chili peppers.",
                pronunciation: "/ˈspaɪsi/",
                partOfSpeech: "adjective",
                level: "basic",
                repetitionCount: 0,
            },
            {
                id: 306,
                word: "culinary",
                meaning: "thuộc về nấu nướng",
                example:
                    "He studied at a prestigious culinary school in France.",
                pronunciation: "/ˈkʌləneri/",
                partOfSpeech: "adjective",
                level: "advanced",
                repetitionCount: 0,
            },
        ],
    },
];

// Tính toán khoảng thời gian ôn tập dựa trên thuật toán spaced repetition đơn giản
function calculateNextReviewDate(repetitionCount: number): Date {
    const now = new Date();
    let daysToAdd = 0;

    // Thuật toán đơn giản: 1, 3, 7, 14, 30, 90, 180 ngày
    switch (repetitionCount) {
        case 0:
            daysToAdd = 1;
            break;
        case 1:
            daysToAdd = 3;
            break;
        case 2:
            daysToAdd = 7;
            break;
        case 3:
            daysToAdd = 14;
            break;
        case 4:
            daysToAdd = 30;
            break;
        case 5:
            daysToAdd = 90;
            break;
        default:
            daysToAdd = 180;
            break;
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysToAdd);

    return nextDate;
}

// Lấy danh sách từ vựng cần ôn tập từ local storage
function getDueWords(): Word[] {
    // Trong thực tế, dữ liệu này sẽ được lấy từ database
    const savedState = localStorage.getItem("vocabularyState");
    if (!savedState) return [];

    const parsedState = JSON.parse(savedState);
    const allWords: Word[] = [];

    vocabularySets.forEach((set) => {
        set.words.forEach((word) => {
            const savedWord = parsedState.words[word.id];
            if (savedWord) {
                const nextReview = savedWord.nextReview
                    ? new Date(savedWord.nextReview)
                    : null;

                // Nếu từ cần ôn tập (hoặc chưa từng ôn tập)
                if (!nextReview || nextReview <= new Date()) {
                    allWords.push({
                        ...word,
                        lastReviewed: savedWord.lastReviewed
                            ? new Date(savedWord.lastReviewed)
                            : null,
                        nextReview,
                        repetitionCount: savedWord.repetitionCount || 0,
                    });
                }
            } else {
                allWords.push(word); // Từ chưa được ôn tập
            }
        });
    });

    return allWords;
}

// Lưu trạng thái học từ mới và ôn tập vào local storage
function saveWordState(word: Word, knownCorrectly: boolean) {
    const savedState =
        localStorage.getItem("vocabularyState") || '{"words":{}}';
    const parsedState = JSON.parse(savedState);

    const newRepetitionCount = knownCorrectly
        ? (parsedState.words[word.id]?.repetitionCount || 0) + 1
        : 0;

    parsedState.words[word.id] = {
        lastReviewed: new Date().toISOString(),
        nextReview: calculateNextReviewDate(newRepetitionCount).toISOString(),
        repetitionCount: newRepetitionCount,
    };

    localStorage.setItem("vocabularyState", JSON.stringify(parsedState));
}

// Custom hook để xử lý flashcard
function useFlashcards(words: Word[]) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    const currentWord = words[currentIndex];

    const flipCard = () => setFlipped(!flipped);

    const nextCard = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
        } else {
            setCompleted(true);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setFlipped(false);
        setCompleted(false);
    };

    return {
        currentWord,
        currentIndex,
        flipped,
        completed,
        flipCard,
        nextCard,
        prevCard,
        restart,
        total: words.length,
    };
}

// Component Quiz Mode
const QuizMode = ({ words }: { words: Word[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentWord = words[currentIndex];

    // Tạo các đáp án cho câu hỏi
    const generateAnswers = (): string[] => {
        const correctAnswer = currentWord.meaning;
        const otherWords = words
            .filter((w) => w.id !== currentWord.id)
            .map((w) => w.meaning);

        // Lấy ngẫu nhiên 3 từ để làm đáp án nhiễu
        const shuffled = otherWords.sort(() => 0.5 - Math.random());
        const wrongAnswers = shuffled.slice(0, 3);

        // Kết hợp đáp án đúng và đáp án sai, sau đó xáo trộn
        return [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    };

    const answers = generateAnswers();

    const handleSelectAnswer = (answer: string) => {
        setSelectedAnswer(answer);

        // Kiểm tra đáp án
        const isCorrect = answer === currentWord.meaning;
        if (isCorrect) {
            setScore(score + 1);
        }

        // Lưu trạng thái học của từ
        saveWordState(currentWord, isCorrect);

        // Thông báo kết quả
        setTimeout(() => {
            if (isCorrect) {
                toast.success("Đúng rồi! Tiếp tục nào!");
            } else {
                toast.error(`Chưa đúng. Đáp án là: ${currentWord.meaning}`);
            }

            // Chuyển sang câu hỏi tiếp theo hoặc kết thúc
            setTimeout(() => {
                if (currentIndex < words.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setSelectedAnswer(null);
                } else {
                    setIsCompleted(true);
                }
            }, 1000);
        }, 500);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setIsCompleted(false);
    };

    // Hiển thị màn hình kết quả cuối cùng
    if (isCompleted) {
        return (
            <div className="text-center py-10">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Hoàn thành!</h3>
                <p className="text-xl mb-6">
                    Bạn đã trả lời đúng: {score}/{words.length} câu
                </p>
                <Button onClick={restartQuiz} className="gap-2">
                    <RefreshCw size={16} />
                    Làm lại
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Câu hỏi {currentIndex + 1}/{words.length}
                </span>
                <span className="text-sm font-medium">Điểm: {score}</span>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-1">
                        "{currentWord.word}" có nghĩa là gì?
                    </h3>
                    <p className="text-gray-500 mb-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {currentWord.partOfSpeech}
                        </span>{" "}
                        <span className="italic">
                            {currentWord.pronunciation}
                        </span>
                    </p>

                    <div className="space-y-2">
                        {answers.map((answer, idx) => (
                            <button
                                key={idx}
                                onClick={() =>
                                    selectedAnswer === null &&
                                    handleSelectAnswer(answer)
                                }
                                className={`w-full p-3 border rounded-md text-left transition-colors ${
                                    selectedAnswer === answer
                                        ? answer === currentWord.meaning
                                            ? "bg-green-100 border-green-300"
                                            : "bg-red-100 border-red-300"
                                        : "hover:bg-gray-50"
                                }`}
                                disabled={selectedAnswer !== null}
                            >
                                {answer}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Component Flashcard Mode
const FlashcardMode = ({ words }: { words: Word[] }) => {
    const {
        currentWord,
        currentIndex,
        flipped,
        completed,
        flipCard,
        nextCard,
        prevCard,
        restart,
        total,
    } = useFlashcards(words);

    // Xử lý đánh dấu đã biết hoặc chưa biết
    const handleResponse = (knownCorrectly: boolean) => {
        saveWordState(currentWord, knownCorrectly);
        nextCard();
    };

    if (completed) {
        return (
            <div className="text-center py-10">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Hoàn thành!</h3>
                <p className="mb-6">Bạn đã hoàn thành bộ flashcard này</p>
                <Button onClick={restart} className="gap-2">
                    <RefreshCw size={16} />
                    Bắt đầu lại
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Thẻ {currentIndex + 1}/{total}
                </span>
                <Badge variant="outline">
                    {currentWord.level === "basic"
                        ? "Cơ bản"
                        : currentWord.level === "intermediate"
                        ? "Trung bình"
                        : "Nâng cao"}
                </Badge>
            </div>

            <div
                className={`bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 perspective mb-6 ${
                    flipped ? "rotate-y-180" : ""
                }`}
                onClick={flipCard}
                style={{ height: "250px" }}
            >
                <div className="relative w-full h-full transform-style-3d">
                    {/* Mặt trước thẻ */}
                    <div
                        className={`absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 rounded-xl border ${
                            flipped ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <h3 className="text-2xl font-bold mb-2">
                            {currentWord.word}
                        </h3>
                        <p className="text-gray-500 text-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {currentWord.partOfSpeech}
                            </span>{" "}
                            <span className="italic">
                                {currentWord.pronunciation}
                            </span>
                        </p>
                        <p className="mt-6 text-sm text-gray-400">
                            Nhấp để xem nghĩa
                        </p>
                    </div>

                    {/* Mặt sau thẻ */}
                    <div
                        className={`absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 rounded-xl border rotate-y-180 ${
                            flipped ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <p className="text-2xl font-bold mb-2 text-center">
                            {currentWord.meaning}
                        </p>
                        <p className="text-gray-600 text-center italic">
                            "{currentWord.example}"
                        </p>
                    </div>
                </div>
            </div>

            {flipped ? (
                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleResponse(false)}
                        className="gap-2"
                    >
                        <X size={16} />
                        Chưa thuộc
                    </Button>
                    <Button
                        onClick={() => handleResponse(true)}
                        className="gap-2"
                    >
                        <Check size={16} />
                        Đã thuộc
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="gap-2"
                    >
                        <ChevronLeft size={16} />
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        onClick={nextCard}
                        className="gap-2"
                    >
                        Tiếp
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};

// Component List Mode
const ListMode = ({ words, setId }: { words: Word[]; setId: number }) => {
    return (
        <div>
            <div className="mb-4 border-b pb-2">
                <span className="text-sm text-gray-500">
                    {words.length} từ vựng
                </span>
            </div>

            <div className="divide-y">
                {words.map((word) => (
                    <div key={word.id} className="py-3">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-medium">{word.word}</h3>
                                <p className="text-gray-600">{word.meaning}</p>
                            </div>
                            <div>
                                <Badge
                                    variant={
                                        word.level === "basic"
                                            ? "outline"
                                            : word.level === "intermediate"
                                            ? "secondary"
                                            : "destructive"
                                    }
                                >
                                    {word.level === "basic"
                                        ? "Cơ bản"
                                        : word.level === "intermediate"
                                        ? "Trung bình"
                                        : "Nâng cao"}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            <span className="text-xs bg-gray-100 px-1 py-0.5 rounded mr-1">
                                {word.partOfSpeech}
                            </span>
                            <span className="italic">{word.pronunciation}</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-1 italic">
                            "{word.example}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component chính
export default function VocabularyBuilder() {
    const [activeSetId, setActiveSetId] = useState(vocabularySets[0].id);
    const [activeTab, setActiveTab] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");

    // Từ vựng cần ôn tập hôm nay
    const [dueWords, setDueWords] = useState<Word[]>([]);

    // Tính toán từ vựng cần ôn tập khi component mount
    useEffect(() => {
        const words = getDueWords();
        setDueWords(words);
    }, []);

    // Lấy bộ từ vựng hiện tại
    const currentSet = vocabularySets.find((set) => set.id === activeSetId);

    // Lọc từ vựng theo tìm kiếm
    const filteredWords = currentSet
        ? currentSet.words.filter(
              (word) =>
                  word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-emerald-800 mb-2 text-center">
                    Vocabulary Builder
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Học từ vựng theo chủ đề với flashcard, quiz và hệ thống ôn
                    tập thông minh
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Chức năng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div
                                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                                        activeTab === "list"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("list")}
                                >
                                    <BookOpen size={18} />
                                    <span>Danh sách từ vựng</span>
                                </div>

                                <div
                                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                                        activeTab === "flashcard"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("flashcard")}
                                >
                                    <Repeat size={18} />
                                    <span>Học với Flashcard</span>
                                </div>

                                <div
                                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                                        activeTab === "quiz"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("quiz")}
                                >
                                    <Play size={18} />
                                    <span>Kiểm tra với Quiz</span>
                                </div>

                                <div
                                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                                        activeTab === "review"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("review")}
                                >
                                    <Star size={18} />
                                    <span>
                                        Ôn tập hôm nay{" "}
                                        {dueWords.length > 0 && (
                                            <Badge className="ml-1">
                                                {dueWords.length}
                                            </Badge>
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bộ từ vựng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {vocabularySets.map((set) => (
                                    <div
                                        key={set.id}
                                        className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                                            activeSetId === set.id
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setActiveSetId(set.id)}
                                    >
                                        <span>{set.topic}</span>
                                        <Badge
                                            variant={
                                                set.level === "basic"
                                                    ? "outline"
                                                    : set.level ===
                                                      "intermediate"
                                                    ? "secondary"
                                                    : "destructive"
                                            }
                                        >
                                            {set.words.length}
                                        </Badge>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 mt-2"
                                >
                                    <Plus size={16} />
                                    Thêm bộ từ vựng mới
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Khu vực chính */}
                    <div className="md:col-span-3">
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle>{currentSet?.topic}</CardTitle>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {currentSet?.description}
                                    </p>
                                </div>

                                {activeTab === "list" && (
                                    <div className="relative">
                                        <Search
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tìm từ vựng..."
                                            className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                {/* Nội dung thay đổi theo tab */}
                                {activeTab === "list" && currentSet && (
                                    <ListMode
                                        words={filteredWords}
                                        setId={currentSet.id}
                                    />
                                )}

                                {activeTab === "flashcard" && currentSet && (
                                    <FlashcardMode words={filteredWords} />
                                )}

                                {activeTab === "quiz" && currentSet && (
                                    <QuizMode words={filteredWords} />
                                )}

                                {activeTab === "review" && (
                                    <>
                                        {dueWords.length > 0 ? (
                                            <FlashcardMode words={dueWords} />
                                        ) : (
                                            <div className="text-center py-10">
                                                <div className="text-6xl mb-4">
                                                    🎉
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">
                                                    Bạn đã hoàn thành các từ cần
                                                    ôn tập hôm nay!
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    Quay lại vào ngày mai để
                                                    tiếp tục học
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
