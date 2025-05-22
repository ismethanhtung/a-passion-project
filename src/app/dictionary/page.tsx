"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Search,
    Volume2,
    History,
    BookmarkPlus,
    Clock,
    RefreshCw,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Copy,
    BookOpen,
    Share2,
    ArrowRight,
} from "lucide-react";

// Interface cho từ điển
interface DictionaryEntry {
    word: string;
    phonetic?: string;
    audio?: string;
    meanings: {
        partOfSpeech: string;
        definition: string;
        example?: string;
        exampleTranslation?: string;
        synonyms: string[];
        antonyms: string[];
    }[];
    etymology?: string;
    relatedWords?: string[];
    level?: string;
    timestamp: number;
}

// Từ khóa tìm kiếm phổ biến
const commonSearches = [
    "hello",
    "world",
    "dictionary",
    "language",
    "learn",
    "pronunciation",
    "vocabulary",
    "grammar",
    "fluent",
    "idiom",
    "practice",
    "speak",
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
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);
    const [showSavedPanel, setShowSavedPanel] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Tải lịch sử tra cứu và từ đã lưu từ localStorage khi component mount
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
        const existingIndex = searchHistory.findIndex(
            (item) => item.word === entry.word
        );
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
        const existingIndex = savedWords.findIndex(
            (item) => item.word === entry.word
        );
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

    // Xử lý phát âm
    const playAudio = (audioUrl?: string) => {
        if (!audioUrl) {
            toast.error("Không có file phát âm cho từ này");
            return;
        }

        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current
                .play()
                .then(() => {
                    setAudioPlaying(true);
                })
                .catch((err) => {
                    console.error("Error playing audio:", err);
                    toast.error("Không thể phát âm thanh");
                });
        }
    };

    // Xử lý kết thúc phát âm
    useEffect(() => {
        const audioElement = audioRef.current;

        const handleEnded = () => {
            setAudioPlaying(false);
        };

        if (audioElement) {
            audioElement.addEventListener("ended", handleEnded);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener("ended", handleEnded);
            }
        };
    }, []);

    // Gọi API từ điển Groq qua API route
    const fetchDictionaryEntry = async (word: string) => {
        try {
            setLoading(true);

            const response = await fetch("/api/dictionary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ word }),
            });

            if (!response.ok) {
                throw new Error("Có lỗi khi gọi API");
            }

            const data = await response.json();

            // Thêm timestamp vào kết quả
            const entryWithTimestamp: DictionaryEntry = {
                ...data,
                timestamp: Date.now(),
            };

            // Cập nhật state
            setResult(entryWithTimestamp);
            setRelatedWords(data.relatedWords || []);

            // Thêm vào lịch sử
            updateSearchHistory(entryWithTimestamp);

            return entryWithTimestamp;
        } catch (error) {
            console.error("Error fetching dictionary:", error);
            toast.error("Không thể tra cứu từ điển. Vui lòng thử lại sau.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const searchTerm = query.trim().toLowerCase();
        await fetchDictionaryEntry(searchTerm);
    };

    // Xử lý tìm kiếm từ gợi ý hoặc lịch sử
    const handleQuickSearch = async (word: string) => {
        setQuery(word);
        await fetchDictionaryEntry(word);
    };

    // Sao chép định nghĩa
    const copyDefinition = () => {
        if (!result) return;

        const definitionText = result.meanings
            .map((meaning) => `${meaning.partOfSpeech}: ${meaning.definition}`)
            .join("\n");

        navigator.clipboard
            .writeText(definitionText)
            .then(() => toast.success("Đã sao chép định nghĩa"))
            .catch(() => toast.error("Không thể sao chép"));
    };

    // Format thời gian lịch sử
    const formatHistoryTime = (timestamp: number) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        );

        if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} ngày trước`;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <Card className="mb-8 border border-green-100 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-xl">
                        <CardTitle className="text-2xl font-bold text-center">
                            Từ điển Anh - Việt
                        </CardTitle>
                        <p className="text-green-100 text-center mt-2">
                            Tra cứu nghĩa, phát âm, ví dụ và từ đồng nghĩa
                        </p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form className="flex gap-2" onSubmit={handleSearch}>
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập từ cần tra cứu..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 px-6"
                                disabled={loading || !query.trim()}
                            >
                                {loading ? "Đang tra..." : "Tra từ"}
                            </Button>
                        </form>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {commonSearches.map((word) => (
                                <Badge
                                    key={word}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-green-50"
                                    onClick={() => handleQuickSearch(word)}
                                >
                                    {word}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Kết quả từ điển */}
                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Panel từ điển chính */}
                        <div className="md:col-span-3">
                            <Card className="shadow-md border border-green-100">
                                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                                    <div>
                                        <CardTitle className="text-2xl text-green-800">
                                            {result.word}
                                        </CardTitle>
                                        <div className="flex items-center mt-1 text-gray-500">
                                            {result.phonetic && (
                                                <span className="font-mono mr-2">
                                                    {result.phonetic}
                                                </span>
                                            )}
                                            {result.audio && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-green-600"
                                                    onClick={() =>
                                                        playAudio(result.audio)
                                                    }
                                                    disabled={audioPlaying}
                                                >
                                                    <Volume2 size={18} />
                                                </Button>
                                            )}
                                            {result.level && (
                                                <Badge
                                                    className="ml-2"
                                                    variant="outline"
                                                >
                                                    {result.level}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                toggleSaveWord(result)
                                            }
                                            title={
                                                savedWords.some(
                                                    (w) =>
                                                        w.word === result.word
                                                )
                                                    ? "Xóa khỏi danh sách đã lưu"
                                                    : "Lưu từ này"
                                            }
                                        >
                                            <BookmarkPlus
                                                size={18}
                                                className={
                                                    savedWords.some(
                                                        (w) =>
                                                            w.word ===
                                                            result.word
                                                    )
                                                        ? "fill-green-500 text-green-500"
                                                        : ""
                                                }
                                            />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={copyDefinition}
                                            title="Sao chép định nghĩa"
                                        >
                                            <Copy size={18} />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={setActiveTab}
                                        className="mt-2"
                                    >
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="definition">
                                                Định nghĩa
                                            </TabsTrigger>
                                            <TabsTrigger value="examples">
                                                Ví dụ
                                            </TabsTrigger>
                                            <TabsTrigger value="related">
                                                Từ liên quan
                                            </TabsTrigger>
                                            {result.etymology && (
                                                <TabsTrigger value="etymology">
                                                    Nguồn gốc
                                                </TabsTrigger>
                                            )}
                                        </TabsList>

                                        <TabsContent
                                            value="definition"
                                            className="space-y-4"
                                        >
                                            {result.meanings.map(
                                                (meaning, index) => (
                                                    <div
                                                        key={index}
                                                        className="pb-3 border-b border-gray-100 last:border-0"
                                                    >
                                                        <div className="flex items-center">
                                                            <Badge className="mr-2">
                                                                {
                                                                    meaning.partOfSpeech
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-2 text-gray-800">
                                                            {meaning.definition}
                                                        </p>

                                                        {/* Từ đồng nghĩa và trái nghĩa */}
                                                        {meaning.synonyms &&
                                                            meaning.synonyms
                                                                .length > 0 && (
                                                                <div className="mt-2">
                                                                    <span className="text-sm text-gray-500">
                                                                        Từ đồng
                                                                        nghĩa:{" "}
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {meaning.synonyms.map(
                                                                            (
                                                                                syn,
                                                                                i
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="cursor-pointer hover:bg-green-50"
                                                                                    onClick={() =>
                                                                                        handleQuickSearch(
                                                                                            syn
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        syn
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {meaning.antonyms &&
                                                            meaning.antonyms
                                                                .length > 0 && (
                                                                <div className="mt-2">
                                                                    <span className="text-sm text-gray-500">
                                                                        Từ trái
                                                                        nghĩa:{" "}
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {meaning.antonyms.map(
                                                                            (
                                                                                ant,
                                                                                i
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="cursor-pointer hover:bg-green-50"
                                                                                    onClick={() =>
                                                                                        handleQuickSearch(
                                                                                            ant
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        ant
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                )
                                            )}
                                        </TabsContent>

                                        <TabsContent value="examples">
                                            <div className="space-y-4">
                                                {result.meanings.map(
                                                    (meaning, index) =>
                                                        meaning.example ? (
                                                            <div
                                                                key={index}
                                                                className="p-3 bg-green-50 rounded-lg"
                                                            >
                                                                <p className="font-medium text-green-800">
                                                                    {
                                                                        meaning.example
                                                                    }
                                                                </p>
                                                                {meaning.exampleTranslation && (
                                                                    <p className="mt-1 text-gray-600 text-sm">
                                                                        {
                                                                            meaning.exampleTranslation
                                                                        }
                                                                    </p>
                                                                )}
                                                                <Badge
                                                                    className="mt-2"
                                                                    variant="outline"
                                                                >
                                                                    {
                                                                        meaning.partOfSpeech
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        ) : null
                                                )}
                                                {!result.meanings.some(
                                                    (m) => m.example
                                                ) && (
                                                    <p className="text-gray-500 italic">
                                                        Không có ví dụ cho từ
                                                        này.
                                                    </p>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="related">
                                            {relatedWords &&
                                            relatedWords.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {relatedWords.map(
                                                        (word, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="cursor-pointer hover:bg-green-50"
                                                                onClick={() =>
                                                                    handleQuickSearch(
                                                                        word
                                                                    )
                                                                }
                                                            >
                                                                {word}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">
                                                    Không có từ liên quan.
                                                </p>
                                            )}
                                        </TabsContent>

                                        {result.etymology && (
                                            <TabsContent value="etymology">
                                                <div className="p-4 bg-green-50 rounded-lg">
                                                    <h3 className="font-medium text-green-800 mb-2">
                                                        Nguồn gốc:
                                                    </h3>
                                                    <p className="text-gray-700">
                                                        {result.etymology}
                                                    </p>
                                                </div>
                                            </TabsContent>
                                        )}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            {/* Panel lịch sử */}
                            <Card className="mb-4 shadow-sm border border-green-100">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center">
                                            <History
                                                size={16}
                                                className="mr-2"
                                            />
                                            Lịch sử tra cứu
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowHistoryPanel(
                                                    !showHistoryPanel
                                                )
                                            }
                                        >
                                            {showHistoryPanel ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronRight size={18} />
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>

                                {showHistoryPanel &&
                                    searchHistory.length > 0 && (
                                        <CardContent className="pt-0">
                                            <div className="max-h-60 overflow-y-auto">
                                                {searchHistory
                                                    .slice(0, 10)
                                                    .map((entry, index) => (
                                                        <div
                                                            key={index}
                                                            className="py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-green-50 rounded px-2"
                                                            onClick={() =>
                                                                handleQuickSearch(
                                                                    entry.word
                                                                )
                                                            }
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">
                                                                    {entry.word}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatHistoryTime(
                                                                        entry.timestamp
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    )}

                                {showHistoryPanel &&
                                    searchHistory.length === 0 && (
                                        <CardContent>
                                            <p className="text-gray-500 text-sm italic">
                                                Chưa có lịch sử tra cứu.
                                            </p>
                                        </CardContent>
                                    )}
                            </Card>

                            {/* Panel từ đã lưu */}
                            <Card className="shadow-sm border border-green-100">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center">
                                            <BookmarkPlus
                                                size={16}
                                                className="mr-2"
                                            />
                                            Từ vựng đã lưu
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowSavedPanel(
                                                    !showSavedPanel
                                                )
                                            }
                                        >
                                            {showSavedPanel ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronRight size={18} />
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>

                                {showSavedPanel && savedWords.length > 0 && (
                                    <CardContent className="pt-0">
                                        <div className="max-h-60 overflow-y-auto">
                                            {savedWords.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-green-50 rounded px-2"
                                                    onClick={() =>
                                                        handleQuickSearch(
                                                            entry.word
                                                        )
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">
                                                            {entry.word}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSaveWord(
                                                                    entry
                                                                );
                                                            }}
                                                        >
                                                            <BookmarkPlus
                                                                size={16}
                                                                className="fill-green-500 text-green-500"
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}

                                {showSavedPanel && savedWords.length === 0 && (
                                    <CardContent>
                                        <p className="text-gray-500 text-sm italic">
                                            Chưa có từ nào được lưu.
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </div>
                    </div>
                )}

                {result === null && query && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-500 font-medium mb-2">
                            Không tìm thấy kết quả cho "{query}"
                        </p>
                        <p className="text-gray-600">
                            Vui lòng kiểm tra lại chính tả hoặc thử tìm kiếm từ
                            khác.
                        </p>
                    </div>
                )}

                {/* Audio element - hidden */}
                <audio ref={audioRef} className="hidden" />
            </div>
        </div>
    );
}
