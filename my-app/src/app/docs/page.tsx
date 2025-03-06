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
                        className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg"
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
