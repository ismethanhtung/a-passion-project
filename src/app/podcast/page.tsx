import React from "react";

const podcasts = [
    {
        title: "Everyday English Conversations",
        desc: "Luyện nghe hội thoại thực tế, tốc độ tự nhiên, có transcript.",
        audio: "/audio/mock-podcast-1.mp3",
        duration: "8:30",
        level: "Beginner",
    },
    {
        title: "Business English Podcast",
        desc: "Từ vựng và mẫu câu giao tiếp trong môi trường công sở.",
        audio: "/audio/mock-podcast-2.mp3",
        duration: "12:10",
        level: "Intermediate",
    },
    {
        title: "IELTS Listening Practice",
        desc: "Chủ đề học thuật, luyện nghe cho kỳ thi IELTS.",
        audio: "/audio/mock-podcast-3.mp3",
        duration: "15:00",
        level: "Advanced",
    },
];

export default function PodcastPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-indigo-100">
                <h1 className="text-3xl font-bold text-indigo-800 mb-2 text-center">
                    Podcast tiếng Anh
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Luyện nghe tiếng Anh với các podcast chọn lọc, có transcript
                    và phân cấp trình độ.
                </p>
                <div className="space-y-6">
                    {podcasts.map((pod, idx) => (
                        <div
                            key={idx}
                            className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-indigo-700 mb-1">
                                    {pod.title}
                                </div>
                                <div className="text-gray-700 mb-2">
                                    {pod.desc}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Trình độ: {pod.level} • Thời lượng:{" "}
                                    {pod.duration}
                                </div>
                                <audio controls className="w-full mt-2">
                                    <source src={pod.audio} type="audio/mp3" />
                                    Trình duyệt của bạn không hỗ trợ audio.
                                </audio>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
