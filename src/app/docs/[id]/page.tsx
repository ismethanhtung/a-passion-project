"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Download,
    Eye,
    Clock,
    FileText,
    User,
    CalendarDays,
    Share2,
} from "lucide-react";
import Link from "next/link";

interface DocFileDetails {
    id: number;
    title: string;
    description: string;
    url: string;
    fileType: string;
    category: string;
    tags: string[];
    size: string;
    publishedDate: string;
    author?: string;
    downloads: number;
    isNew?: boolean;
    isFeatured?: boolean;
}

const DocViewer = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [doc, setDoc] = useState<DocFileDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập việc lấy dữ liệu từ API
        const fetchDocument = () => {
            setLoading(true);

            // Giả lập dữ liệu cho demo
            setTimeout(() => {
                const dummyDoc: DocFileDetails = {
                    id: 1,
                    title: "English for Absolute Beginners",
                    description:
                        "A step-by-step guide for those starting from scratch, with essential vocabulary, grammar, and pronunciation tips.",
                    url: "/sample.pdf",
                    fileType: "pdf",
                    category: "Beginner",
                    tags: [
                        "starter",
                        "vocabulary",
                        "grammar",
                        "listening",
                        "pronunciation",
                        "speaking",
                    ],
                    size: "2.8 MB",
                    publishedDate: "2024-04-01",
                    author: "Anna Richards",
                    downloads: 129,
                    isNew: true,
                    isFeatured: true,
                };
                setDoc(dummyDoc);
                setLoading(false);
            }, 800);
        };

        fetchDocument();
    }, [params.id]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-700 mb-2">
                    Tài liệu không tồn tại
                </h1>
                <p className="text-gray-500 mb-6 text-center">
                    Không tìm thấy tài liệu bạn yêu cầu hoặc đã bị xóa.
                </p>
                <Link
                    href="/docs"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Quay lại thư viện
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb và nút quay lại */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span>Quay lại tài liệu</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Document header */}
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                    {doc.title}
                                </h1>
                                <p className="text-gray-600 mb-4">
                                    {doc.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {doc.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{doc.author || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>
                                            {formatDate(doc.publishedDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{doc.downloads} lượt tải</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row md:flex-col gap-3 sm:gap-4">
                                <a
                                    href={doc.url}
                                    download
                                    className=" bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <span>Tải xuống</span>
                                </a>
                                <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
                                    <span>Chia sẻ</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PDF Viewer */}
                    <div className="p-6">
                        <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <iframe
                                src="/docs/a.pdf"
                                className="w-full h-[800px]"
                                title={doc.title}
                            ></iframe>
                        </div>
                    </div>

                    {/* Related documents section could be added here */}
                </div>
            </div>
        </div>
    );
};

export default DocViewer;
