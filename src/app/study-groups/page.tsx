import React from "react";

const groups = [
    {
        name: "Nhóm Speaking - Buổi tối",
        desc: "Luyện nói tiếng Anh qua Zoom, 20h-21h thứ 2-4-6.",
        members: 18,
        link: "#",
    },
    {
        name: "Nhóm IELTS Writing",
        desc: "Chia sẻ bài viết, nhận góp ý từ thành viên và giáo viên.",
        members: 25,
        link: "#",
    },
    {
        name: "Nhóm Vocabulary Challenge",
        desc: "Học từ vựng qua game, thử thách mỗi ngày.",
        members: 30,
        link: "#",
    },
];

export default function StudyGroups() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-lime-100">
                <h1 className="text-3xl font-bold text-lime-700 mb-2 text-center">
                    Study Groups
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Tham gia nhóm học, luyện tập cùng bạn bè, tăng động lực và
                    hiệu quả.
                </p>
                <div className="space-y-6">
                    {groups.map((g, idx) => (
                        <div
                            key={idx}
                            className="bg-lime-50 border border-lime-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-lime-700 mb-1">
                                    {g.name}
                                </div>
                                <div className="text-gray-700 mb-2">
                                    {g.desc}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Thành viên: {g.members}
                                </div>
                            </div>
                            <a
                                href={g.link}
                                className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                Tham gia
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
