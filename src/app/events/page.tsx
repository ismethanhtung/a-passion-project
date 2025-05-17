import React from "react";

const events = [
    {
        title: "Webinar: Luyện Speaking với AI",
        date: "25/05/2025",
        desc: "Tham gia buổi học trực tuyến, luyện nói với AI, nhận phản hồi trực tiếp.",
        link: "#",
    },
    {
        title: "Workshop: Viết email chuyên nghiệp",
        date: "01/06/2025",
        desc: "Hướng dẫn viết email tiếng Anh cho công việc, thực hành và sửa bài.",
        link: "#",
    },
    {
        title: "Mini Game: Đố vui từ vựng",
        date: "Hàng tuần",
        desc: "Tham gia game, nhận quà tặng hấp dẫn, mở rộng vốn từ.",
        link: "#",
    },
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-orange-100">
                <h1 className="text-3xl font-bold text-orange-700 mb-2 text-center">
                    Events & Webinars
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tham gia sự kiện, webinar, mini game để học tiếng Anh hiệu
                    quả hơn!
                </p>
                <div className="space-y-6">
                    {events.map((ev, idx) => (
                        <div
                            key={idx}
                            className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-orange-700 mb-1">
                                    {ev.title}
                                </div>
                                <div className="text-gray-700 mb-2">
                                    {ev.desc}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Thời gian: {ev.date}
                                </div>
                            </div>
                            <a
                                href={ev.link}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                Đăng ký
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
