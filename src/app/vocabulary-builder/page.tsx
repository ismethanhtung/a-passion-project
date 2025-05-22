"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Book,
    Bookmark,
    BookmarkPlus,
    Brain,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Filter,
    ListMusic,
    Plus,
    Search,
    Trash,
    Volume2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { speakText } from "@/lib/text-to-speech";

interface Vocabulary {
    id: number;
    word: string;
    meaning: string;
    exampleSentences: string[];
    relatedWords: string[];
    level: string;
    pronunciation: string;
    topic: string;
    createdAt: string;
    isSaved?: boolean;
}

const topics = [
    "Tất cả",
    "Kinh doanh",
    "Du lịch",
    "Học thuật",
    "Công nghệ",
    "Thể thao",
    "Ẩm thực",
    "Y tế",
    "Văn hóa",
];

const levels = ["Beginner", "Intermediate", "Advanced", "All"];

// Mẫu từ vựng ban đầu
const sampleVocabulary: Vocabulary[] = [
    {
        id: 1,
        word: "Acquire",
        meaning: "Có được, đạt được, thu được",
        exampleSentences: [
            "She acquired a taste for fine wines during her stay in France.",
            "The company acquired three smaller firms last year.",
        ],
        relatedWords: ["acquisition", "acquirement", "acquisitive"],
        level: "Intermediate",
        pronunciation: "/əˈkwaɪər/",
        topic: "Kinh doanh",
        createdAt: "2023-08-15",
    },
    {
        id: 2,
        word: "Itinerary",
        meaning: "Lịch trình, hành trình",
        exampleSentences: [
            "We planned our itinerary for the European vacation very carefully.",
            "The tour guide provided a detailed itinerary for the day.",
        ],
        relatedWords: ["journey", "schedule", "plan", "route"],
        level: "Advanced",
        pronunciation: "/aɪˈtɪnəˌreri/",
        topic: "Du lịch",
        createdAt: "2023-09-05",
    },
    {
        id: 3,
        word: "Hypothesis",
        meaning: "Giả thuyết, giả định",
        exampleSentences: [
            "The scientist developed a hypothesis about climate change.",
            "Our hypothesis was confirmed by the experimental results.",
        ],
        relatedWords: ["theory", "supposition", "proposition", "conjecture"],
        level: "Advanced",
        pronunciation: "/haɪˈpɒθəsɪs/",
        topic: "Học thuật",
        createdAt: "2023-07-22",
    },
    {
        id: 4,
        word: "Innovative",
        meaning: "Đổi mới, sáng tạo",
        exampleSentences: [
            "The company is known for its innovative products.",
            "We need innovative solutions to solve these complex problems.",
        ],
        relatedWords: ["innovation", "innovate", "novel", "creative"],
        level: "Intermediate",
        pronunciation: "/ˈɪnəveɪtɪv/",
        topic: "Công nghệ",
        createdAt: "2023-10-01",
    },
    {
        id: 5,
        word: "Budget",
        meaning: "Ngân sách, dự toán",
        exampleSentences: [
            "We need to stay within our budget for this project.",
            "The government has announced a new budget for education.",
        ],
        relatedWords: ["allocate", "finance", "fund", "expenditure"],
        level: "Beginner",
        pronunciation: "/ˈbʌdʒɪt/",
        topic: "Kinh doanh",
        createdAt: "2023-06-10",
    },
];

export default function VocabularyBuilderPage() {
    const [vocabularyList, setVocabularyList] =
        useState<Vocabulary[]>(sampleVocabulary);
    const [savedVocabulary, setSavedVocabulary] = useState<Vocabulary[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [activeLevel, setActiveLevel] = useState("All");
    const [activeTopic, setActiveTopic] = useState("Tất cả");
    const [searchQuery, setSearchQuery] = useState("");
    const [generatingVocabulary, setGeneratingVocabulary] = useState(false);
    const [word, setWord] = useState("");
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("Intermediate");
    const [showTopicFilter, setShowTopicFilter] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    // Lọc từ vựng theo các tiêu chí
    const filteredVocabulary = vocabularyList.filter((vocab) => {
        // Lọc theo cấp độ
        if (activeLevel !== "All" && vocab.level !== activeLevel) {
            return false;
        }

        // Lọc theo chủ đề
        if (activeTopic !== "Tất cả" && vocab.topic !== activeTopic) {
            return false;
        }

        // Lọc theo từ khóa tìm kiếm
        if (
            searchQuery &&
            !vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false;
        }

        return true;
    });

    // Phát âm từ vựng
    const pronounceWord = (word: string, pronunciation: string) => {
        speakText(word, {
            voice: "en-US",
            rate: 0.9,
            onStart: () => {
                console.log("Bắt đầu phát âm");
            },
            onEnd: () => {
                console.log("Kết thúc phát âm");
            },
            onError: (error) => {
                console.error("Lỗi phát âm:", error);
                toast.error("Không thể phát âm từ này");
            },
        });
    };

    // Lưu từ vựng
    const toggleSaveVocabulary = (vocab: Vocabulary) => {
        if (savedVocabulary.some((item) => item.id === vocab.id)) {
            // Xóa khỏi danh sách đã lưu
            setSavedVocabulary(
                savedVocabulary.filter((item) => item.id !== vocab.id)
            );
            toast.info(`Đã xóa "${vocab.word}" khỏi danh sách từ vựng đã lưu`);
        } else {
            // Thêm vào danh sách đã lưu
            setSavedVocabulary([
                ...savedVocabulary,
                { ...vocab, isSaved: true },
            ]);
            toast.success(`Đã lưu "${vocab.word}" vào danh sách từ vựng`);
        }
    };

    // Tạo từ vựng mới với AI
    const generateVocabulary = async () => {
        if (!word.trim()) {
            toast.error("Vui lòng nhập từ cần tạo");
            return;
        }

        setGeneratingVocabulary(true);
        console.log("Đang gửi yêu cầu tạo từ vựng...");

        try {
            const requestData = {
                word: word.trim(),
                topic: topic || "Chung",
                level: level,
            };

            console.log("Dữ liệu gửi đi:", requestData);

            const response = await fetch("/api/vocabulary/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            console.log("Nhận phản hồi từ API:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Lỗi từ server:", errorText);
                throw new Error(
                    `Có lỗi khi tạo từ vựng: ${response.status} ${errorText}`
                );
            }

            const data = await response.json();
            console.log("Dữ liệu nhận được:", data);

            // Đảm bảo định dạng dữ liệu là mảng
            const exampleSentences = Array.isArray(data.exampleSentences)
                ? data.exampleSentences
                : data.example
                ? [data.example]
                : [];

            const relatedWords = Array.isArray(data.relatedWords)
                ? data.relatedWords
                : [];

            const newVocab: Vocabulary = {
                id: Date.now(), // Sử dụng timestamp làm ID để đảm bảo duy nhất
                word: data.word || word.trim(),
                meaning: data.meaning || "Không có nghĩa",
                exampleSentences: exampleSentences,
                relatedWords: relatedWords,
                level: data.level || level,
                pronunciation: data.pronunciation || "/không có phát âm/",
                topic: data.topic || topic || "Chung",
                createdAt: new Date().toISOString().split("T")[0],
            };

            console.log("Từ vựng đã tạo:", newVocab);

            setVocabularyList((prev) => {
                const updated = [newVocab, ...prev];
                console.log("Danh sách từ vựng cập nhật:", updated.length);
                return updated;
            });

            toast.success(`Đã tạo từ mới "${newVocab.word}" thành công!`);
            setShowCreateDialog(false);
            setWord("");
            setTopic("");
        } catch (error) {
            console.error("Error generating vocabulary:", error);
            toast.error("Có lỗi xảy ra khi tạo từ vựng: " + String(error));
        } finally {
            setGeneratingVocabulary(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">
                        Vocabulary Builder
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                        Xây dựng vốn từ vựng tiếng Anh phong phú với các ví dụ,
                        cách phát âm và từ liên quan. Tạo và lưu từ mới để học
                        hiệu quả.
                    </p>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tạo từ vựng mới với AI
                    </Button>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="all">Tất cả từ vựng</TabsTrigger>
                        <TabsTrigger value="saved">
                            Từ vựng đã lưu ({savedVocabulary.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <Card className="sticky top-4">
                                    <CardHeader>
                                        <CardTitle>Bộ lọc</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative mb-4">
                                            <Search
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tìm từ vựng..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium">
                                                    Chủ đề
                                                </h3>
                                                <button
                                                    onClick={() =>
                                                        setShowTopicFilter(
                                                            !showTopicFilter
                                                        )
                                                    }
                                                    className="md:hidden text-blue-600 flex items-center gap-1"
                                                >
                                                    <Filter size={16} />
                                                    <ChevronDown size={16} />
                                                </button>
                                            </div>
                                            <div
                                                className={`space-y-1 ${
                                                    showTopicFilter
                                                        ? "block"
                                                        : "hidden md:block"
                                                }`}
                                            >
                                                {topics.map((topicItem) => (
                                                    <div
                                                        key={topicItem}
                                                        className={`cursor-pointer p-2 rounded-md ${
                                                            activeTopic ===
                                                            topicItem
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "hover:bg-gray-100"
                                                        }`}
                                                        onClick={() =>
                                                            setActiveTopic(
                                                                topicItem
                                                            )
                                                        }
                                                    >
                                                        {topicItem}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="font-medium mb-2">
                                                Trình độ
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {levels.map((levelItem) => (
                                                    <Badge
                                                        key={levelItem}
                                                        variant={
                                                            activeLevel ===
                                                            levelItem
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            setActiveLevel(
                                                                levelItem
                                                            )
                                                        }
                                                    >
                                                        {levelItem}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-3">
                                {filteredVocabulary.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredVocabulary.map((vocab) => (
                                            <VocabularyCard
                                                key={vocab.id}
                                                vocabulary={vocab}
                                                onSave={() =>
                                                    toggleSaveVocabulary(vocab)
                                                }
                                                isSaved={savedVocabulary.some(
                                                    (item) =>
                                                        item.id === vocab.id
                                                )}
                                                onPronounce={() =>
                                                    pronounceWord(
                                                        vocab.word,
                                                        vocab.pronunciation
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Book className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500">
                                            Không tìm thấy từ vựng nào phù hợp
                                            với tìm kiếm của bạn.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="saved">
                        {savedVocabulary.length > 0 ? (
                            <div className="space-y-4">
                                {savedVocabulary.map((vocab) => (
                                    <VocabularyCard
                                        key={vocab.id}
                                        vocabulary={vocab}
                                        onSave={() =>
                                            toggleSaveVocabulary(vocab)
                                        }
                                        isSaved={true}
                                        onPronounce={() =>
                                            pronounceWord(
                                                vocab.word,
                                                vocab.pronunciation
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8">
                                <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500 mb-2">
                                    Bạn chưa lưu từ vựng nào.
                                </p>
                                <p className="text-sm text-gray-400 mb-4">
                                    Lưu các từ vựng quan trọng để xem lại sau
                                    này
                                </p>
                                <Button
                                    onClick={() => setActiveTab("all")}
                                    variant="outline"
                                >
                                    Quay lại danh sách từ vựng
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>Tạo từ vựng mới</DialogTitle>
                        <DialogDescription>
                            Nhập từ cần tạo để AI tạo nội dung từ vựng chi tiết
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log("Form submit - tạo từ vựng mới");
                            generateVocabulary();
                        }}
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Từ vựng
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập từ tiếng Anh (VD: Acquire)"
                                    value={word}
                                    onChange={(e) => setWord(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Chủ đề
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                >
                                    <option value="">Chọn chủ đề</option>
                                    {topics
                                        .filter((t) => t !== "Tất cả")
                                        .map((topicItem) => (
                                            <option
                                                key={topicItem}
                                                value={topicItem}
                                            >
                                                {topicItem}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Trình độ
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    {levels
                                        .filter((l) => l !== "All")
                                        .map((levelItem) => (
                                            <option
                                                key={levelItem}
                                                value={levelItem}
                                            >
                                                {levelItem}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateDialog(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={generatingVocabulary || !word.trim()}
                            >
                                {generatingVocabulary ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang tạo...
                                    </>
                                ) : (
                                    "Tạo từ vựng"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Component thẻ từ vựng
function VocabularyCard({
    vocabulary,
    onSave,
    isSaved,
    onPronounce,
}: {
    vocabulary: Vocabulary;
    onSave: () => void;
    isSaved: boolean;
    onPronounce: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center">
                            <CardTitle className="text-xl mr-1">
                                {vocabulary.word}
                            </CardTitle>
                            <span
                                className="text-sm text-gray-500 cursor-pointer hover:text-blue-500"
                                onClick={onPronounce}
                            >
                                {vocabulary.pronunciation}
                                <Volume2 size={16} className="inline ml-1" />
                            </span>
                        </div>
                        <CardDescription className="text-base mt-1">
                            {vocabulary.meaning}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSave}
                            className={
                                isSaved ? "text-amber-500" : "text-gray-400"
                            }
                        >
                            {isSaved ? (
                                <Bookmark size={18} />
                            ) : (
                                <BookmarkPlus size={18} />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50">
                        {vocabulary.level}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                        {vocabulary.topic}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                {vocabulary.exampleSentences &&
                    vocabulary.exampleSentences.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Ví dụ:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {vocabulary.exampleSentences
                                    .slice(0, showDetails ? undefined : 1)
                                    .map((example, index) => (
                                        <li key={index}>{example}</li>
                                    ))}
                            </ul>
                        </div>
                    )}

                {showDetails &&
                    vocabulary.relatedWords &&
                    vocabulary.relatedWords.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Từ liên quan:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {vocabulary.relatedWords.map((word, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-gray-50"
                                    >
                                        {word}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
            </CardContent>

            <CardFooter className="pt-0 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                    Thêm ngày: {vocabulary.createdAt}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-600 text-sm"
                >
                    {showDetails ? "Thu gọn" : "Xem thêm"}
                    {showDetails ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
