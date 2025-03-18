"use client";

import React, { useState } from "react";
import Pagination from "@/components/Pagination";

const docsData = [
    {
        id: 1,
        title: "Bắt đầu học tiếng Anh",
        description: "Hướng dẫn cho người mới bắt đầu học tiếng Anh từ con số 0.",
        url: "/docs/a.pdf",
    },
    {
        id: 2,
        title: "Ngữ pháp cơ bản",
        description: "Tổng hợp các quy tắc ngữ pháp tiếng Anh quan trọng nhất.",
        url: "/docs/a.pdf",
    },
    {
        id: 3,
        title: "Phát âm chuẩn Anh - Mỹ",
        description: "Học cách phát âm chuẩn theo giọng Anh - Mỹ cùng bài tập thực hành.",
        url: "/docs/a.pdf",
    },
    {
        id: 4,
        title: "Từ vựng theo chủ đề",
        description: "Danh sách từ vựng thông dụng theo các chủ đề phổ biến.",
        url: "/docs/a.pdf",
    },
    {
        id: 5,
        title: "Luyện nghe tiếng Anh",
        description: "Phương pháp luyện nghe hiệu quả giúp bạn cải thiện kỹ năng nghe.",
        url: "/docs/a.pdf",
    },
    {
        id: 6,
        title: "Luyện nói tiếng Anh",
        description: "Các bài tập luyện nói giúp bạn giao tiếp tự tin hơn.",
        url: "/docs/a.pdf",
    },
    {
        id: 7,
        title: "Kỹ năng viết tiếng Anh",
        description: "Hướng dẫn viết email, báo cáo và bài luận một cách chuyên nghiệp.",
        url: "/docs/a.pdf",
    },
    {
        id: 8,
        title: "Giao tiếp tiếng Anh cơ bản",
        description: "Phát triển kỹ năng giao tiếp cơ bản cho người mới học.",
        url: "/docs/a.pdf",
    },
    {
        id: 9,
        title: "Giao tiếp tiếng Anh nâng cao",
        description: "Cải thiện kỹ năng giao tiếp cho môi trường chuyên nghiệp.",
        url: "/docs/a.pdf",
    },
    {
        id: 10,
        title: "Từ vựng IELTS cơ bản",
        description: "Danh sách từ vựng cần thiết cho kỳ thi IELTS.",
        url: "/docs/a.pdf",
    },
    {
        id: 11,
        title: "Ngữ pháp nâng cao",
        description: "Các cấu trúc ngữ pháp phức tạp giúp bạn viết và nói chính xác.",
        url: "/docs/a.pdf",
    },
    {
        id: 12,
        title: "Kỹ năng đọc hiểu tiếng Anh",
        description: "Chiến lược đọc hiểu hiệu quả cho văn bản tiếng Anh.",
        url: "/docs/a.pdf",
    },
    {
        id: 13,
        title: "Phân tích bài báo tiếng Anh",
        description: "Học cách phân tích và hiểu các bài báo tiếng Anh.",
        url: "/docs/a.pdf",
    },
    {
        id: 14,
        title: "Phát triển từ vựng chuyên ngành",
        description: "Từ vựng chuyên ngành cho các lĩnh vực cụ thể.",
        url: "/docs/a.pdf",
    },
    {
        id: 15,
        title: "Luyện phát âm chuyên sâu",
        description: "Các bài tập luyện phát âm nâng cao cho người học.",
        url: "/docs/a.pdf",
    },
    {
        id: 16,
        title: "Khóa học TOEIC cơ bản",
        description: "Chuẩn bị cho kỳ thi TOEIC với các bài tập và bài kiểm tra.",
        url: "/docs/a.pdf",
    },
    {
        id: 17,
        title: "Khóa học TOEIC nâng cao",
        description: "Tăng cường kỹ năng để đạt điểm cao trong kỳ thi TOEIC.",
        url: "/docs/a.pdf",
    },
    {
        id: 18,
        title: "Học tiếng Anh qua phim ảnh",
        description: "Sử dụng phim ảnh để cải thiện kỹ năng nghe và từ vựng.",
        url: "/docs/a.pdf",
    },
    {
        id: 19,
        title: "Học tiếng Anh qua nhạc",
        description: "Học qua lời bài hát và giai điệu để làm quen với ngữ điệu tiếng Anh.",
        url: "/docs/a.pdf",
    },
    {
        id: 20,
        title: "Học tiếng Anh qua truyện ngắn",
        description: "Đọc và phân tích truyện ngắn để nâng cao khả năng đọc hiểu.",
        url: "/docs/a.pdf",
    },
];

const Docs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredDocs = docsData.filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
    const displayedDocs = filteredDocs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-6xl font-bold text-center my-12 text-blue-500">Documentation</h1>

            <div className="flex justify-center mb-12">
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                />
            </div>

            <div className="space-y-6">
                {displayedDocs.map((doc) => (
                    <div
                        key={doc.id}
                        className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-violet-300"
                    >
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{doc.title}</h2>
                        <p className="text-gray-600 mb-4">{doc.description}</p>
                        <a href={doc.url} className="text-blue-500 underline">
                            Read More
                        </a>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Docs;
