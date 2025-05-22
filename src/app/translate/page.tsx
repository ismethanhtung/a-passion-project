"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpDown, Copy, History, Volume2 } from "lucide-react";

export default function TranslationTool() {
    const [text, setText] = useState("");
    const [translated, setTranslated] = useState("");
    const [from, setFrom] = useState("en");
    const [to, setTo] = useState("vi");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<
        Array<{
            original: string;
            translated: string;
            fromLang: string;
            toLang: string;
            timestamp: number;
        }>
    >([]);
    const [showHistory, setShowHistory] = useState(false);

    const handleTranslate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    sourceLang: from,
                    targetLang: to,
                }),
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gọi API dịch");
            }

            const data = await response.json();

            if (data.translation) {
                setTranslated(data.translation);

                // Lưu vào lịch sử
                const newEntry = {
                    original: text,
                    translated: data.translation,
                    fromLang: from,
                    toLang: to,
                    timestamp: Date.now(),
                };

                setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);

                // Lưu vào localStorage
                try {
                    const savedHistory = JSON.parse(
                        localStorage.getItem("translationHistory") || "[]"
                    );
                    localStorage.setItem(
                        "translationHistory",
                        JSON.stringify([newEntry, ...savedHistory.slice(0, 19)])
                    );
                } catch (e) {
                    // Xử lý lỗi localStorage
                    console.error("Không thể lưu lịch sử", e);
                }
            } else {
                toast.error("Không thể dịch văn bản");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Có lỗi xảy ra khi dịch văn bản");
        } finally {
            setLoading(false);
        }
    };

    const swapLanguages = () => {
        setFrom(to);
        setTo(from);
        setText(translated);
        setTranslated(text);
    };

    const copyToClipboard = (textToCopy: string) => {
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => toast.success("Đã sao chép vào clipboard"))
            .catch(() => toast.error("Không thể sao chép văn bản"));
    };

    const speakText = (textToSpeak: string, lang: string) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = lang === "en" ? "en-US" : "vi-VN";
            speechSynthesis.speak(utterance);
        } else {
            toast.error(
                "Trình duyệt của bạn không hỗ trợ chức năng đọc văn bản"
            );
        }
    };

    // Tải lịch sử từ localStorage khi component được mounted
    React.useEffect(() => {
        try {
            const savedHistory = localStorage.getItem("translationHistory");
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Không thể tải lịch sử", e);
        }
    }, []);

    // Format thời gian
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="border border-blue-100 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
                        <CardTitle className="text-2xl font-bold text-center">
                            Công cụ dịch tiếng Anh - Việt
                        </CardTitle>
                        <p className="text-blue-100 text-center mt-2">
                            Dịch văn bản tiếng Anh sang tiếng Việt và ngược lại,
                            hỗ trợ học từ vựng và luyện dịch
                        </p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <Badge
                                            variant="outline"
                                            className="mr-2"
                                        >
                                            {from === "en"
                                                ? "English"
                                                : "Tiếng Việt"}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() =>
                                                text && speakText(text, from)
                                            }
                                            title="Đọc văn bản"
                                        >
                                            <Volume2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() =>
                                            text && copyToClipboard(text)
                                        }
                                        title="Sao chép"
                                    >
                                        <Copy size={16} />
                                    </Button>
                                </div>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        from === "en"
                                            ? "Enter text to translate..."
                                            : "Nhập văn bản cần dịch..."
                                    }
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={swapLanguages}
                                    disabled={!text && !translated}
                                    className="my-2 rotate-90 md:rotate-0"
                                >
                                    <ArrowUpDown size={16} />
                                </Button>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <Badge
                                            variant="outline"
                                            className="mr-2"
                                        >
                                            {to === "vi"
                                                ? "Tiếng Việt"
                                                : "English"}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() =>
                                                translated &&
                                                speakText(translated, to)
                                            }
                                            title="Đọc văn bản"
                                        >
                                            <Volume2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() =>
                                            translated &&
                                            copyToClipboard(translated)
                                        }
                                        title="Sao chép"
                                    >
                                        <Copy size={16} />
                                    </Button>
                                </div>
                                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[150px] bg-gray-50">
                                    {translated || (
                                        <span className="text-gray-400">
                                            {to === "vi"
                                                ? "Bản dịch tiếng Việt"
                                                : "English translation"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngôn ngữ nguồn
                                </label>
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="en">English</option>
                                    <option value="vi">Tiếng Việt</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngôn ngữ đích
                                </label>
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Button
                                className="w-full sm:w-auto px-8 py-2.5"
                                onClick={handleTranslate}
                                disabled={loading || !text.trim()}
                            >
                                {loading ? "Đang dịch..." : "Dịch ngay"}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full sm:w-auto flex items-center gap-2"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                <History size={16} />
                                {showHistory ? "Ẩn lịch sử" : "Lịch sử dịch"}
                            </Button>
                        </div>

                        {showHistory && history.length > 0 && (
                            <div className="mt-8 border-t pt-4">
                                <h3 className="text-lg font-medium mb-4">
                                    Lịch sử dịch gần đây
                                </h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {history.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-blue-50 rounded-lg"
                                        >
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>
                                                    {item.fromLang === "en"
                                                        ? "Anh → Việt"
                                                        : "Việt → Anh"}
                                                </span>
                                                <span>
                                                    {formatTime(item.timestamp)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div className="text-sm">
                                                    <div className="font-medium text-blue-800">
                                                        Văn bản gốc:
                                                    </div>
                                                    <div className="line-clamp-2">
                                                        {item.original}
                                                    </div>
                                                </div>
                                                <div className="text-sm">
                                                    <div className="font-medium text-blue-800">
                                                        Bản dịch:
                                                    </div>
                                                    <div className="line-clamp-2">
                                                        {item.translated}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setText(item.original);
                                                        setTranslated(
                                                            item.translated
                                                        );
                                                        setFrom(item.fromLang);
                                                        setTo(item.toLang);
                                                    }}
                                                >
                                                    Dùng lại
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
