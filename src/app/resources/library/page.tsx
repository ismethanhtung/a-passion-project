import React from "react";

const resources = [
    {
        title: "Tài liệu luyện thi TOEIC",
        desc: "Tổng hợp đề thi, sách, file nghe TOEIC mới nhất.",
        link: "/public/docs/a.pdf",
    },
    {
        title: "Ebook ngữ pháp tiếng Anh",
        desc: "Sách PDF ngữ pháp cơ bản đến nâng cao.",
        link: "/public/docs/docs.txt",
    },
    {
        title: "Flashcards từ vựng",
        desc: "Bộ flashcard từ vựng thông dụng, tải về miễn phí.",
        link: "/public/flashcards.txt",
    },
];

export default function ResourceLibrary() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
                    Resource Library
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tải tài liệu, ebook, flashcard miễn phí phục vụ học tiếng
                    Anh.
                </p>
                <div className="space-y-6">
                    {resources.map((res, idx) => (
                        <a
                            key={idx}
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-slate-100 transition"
                        >
                            <div className="text-lg font-semibold text-slate-700 mb-1">
                                {res.title}
                            </div>
                            <div className="text-gray-500 text-sm mb-1">
                                {res.desc}
                            </div>
                            <div className="text-xs text-blue-600 underline">
                                Tải về
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
