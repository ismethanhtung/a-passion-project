"use client";
import React, { useState } from "react";

export default function TranslationTool() {
    const [text, setText] = useState("");
    const [translated, setTranslated] = useState("");
    const [from, setFrom] = useState("en");
    const [to, setTo] = useState("vi");
    const [loading, setLoading] = useState(false);

    const handleTranslate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Fake translation for demo, replace with real API
        setTimeout(() => {
            setTranslated(
                from === "en" && to === "vi"
                    ? `Bản dịch tiếng Việt: ${text}`
                    : `English translation: ${text}`
            );
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
                    Translation Tool
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Dịch nhanh Anh - Việt, Việt - Anh. Hỗ trợ học từ vựng và
                    luyện dịch chuyên sâu.
                </p>
                <form className="space-y-4" onSubmit={handleTranslate}>
                    <div className="flex gap-2">
                        <select
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="en">English</option>
                            <option value="vi">Tiếng Việt</option>
                        </select>
                        <span className="px-2 py-2">→</span>
                        <select
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows={4}
                        placeholder="Nhập nội dung cần dịch..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Đang dịch..." : "Dịch ngay"}
                    </button>
                </form>
                {translated && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                        <div className="font-semibold mb-1">Kết quả dịch:</div>
                        <div>{translated}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
