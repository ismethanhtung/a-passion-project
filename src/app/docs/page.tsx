"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    FileText,
    BookOpen,
    Download,
    Filter,
    Check,
    X,
    ChevronDown,
    Tag,
    Clock,
    File,
    FileArchive,
    FileImage,
    FileAudio,
    FileVideo,
    LayoutGrid,
    LayoutList,
    SlidersHorizontal,
    Eye,
    ListFilter,
    Star,
    Calendar,
    Type,
    FileUp,
    FolderOpen,
} from "lucide-react";
import Pagination from "@/components/Pagination";

interface DocFile {
    id: number;
    title: string;
    description: string;
    url: string;
    fileType:
        | "pdf"
        | "docx"
        | "xlsx"
        | "pptx"
        | "zip"
        | "image"
        | "audio"
        | "video"
        | "text";
    category: string;
    tags: string[];
    size: string;
    publishedDate: string;
    author?: string;
    downloads: number;
    isNew?: boolean;
    isFeatured?: boolean;
}

// Dữ liệu mẫu nâng cao
const docsData: DocFile[] = [
    {
        id: 1,
        title: "Bắt đầu học tiếng Anh",
        description:
            "Hướng dẫn toàn diện cho người mới bắt đầu học tiếng Anh từ con số 0, bao gồm các bài tập và nguồn tài liệu.",
        url: "/docs/a.pdf",
        fileType: "pdf",
        category: "Beginner",
        tags: ["starter", "basic", "pronunciation"],
        size: "2.4 MB",
        publishedDate: "2024-04-15",
        author: "Emma Thompson",
        downloads: 1245,
        isNew: true,
        isFeatured: true,
    },
    {
        id: 2,
        title: "Ngữ pháp cơ bản",
        description:
            "Tổng hợp các quy tắc ngữ pháp tiếng Anh quan trọng nhất, được giải thích rõ ràng với nhiều ví dụ minh họa.",
        url: "/docs/a.pdf",
        fileType: "pdf",
        category: "Grammar",
        tags: ["grammar", "basic", "rules"],
        size: "3.1 MB",
        publishedDate: "2024-03-28",
        author: "David Wilson",
        downloads: 2350,
    },
    {
        id: 3,
        title: "Phát âm chuẩn Anh - Mỹ",
        description:
            "Học cách phát âm chuẩn theo giọng Anh - Mỹ cùng bài tập thực hành và file âm thanh minh họa.",
        url: "/docs/audio-course.zip",
        fileType: "zip",
        category: "Pronunciation",
        tags: ["pronunciation", "accent", "speaking"],
        size: "48.5 MB",
        publishedDate: "2024-04-02",
        author: "Sarah Johnson",
        downloads: 1876,
        isFeatured: true,
    },
    {
        id: 4,
        title: "Từ vựng theo chủ đề",
        description:
            "Danh sách từ vựng thông dụng theo các chủ đề phổ biến, được phân loại dễ dàng tra cứu.",
        url: "/docs/a.xlsx",
        fileType: "xlsx",
        category: "Vocabulary",
        tags: ["vocabulary", "thematic", "words"],
        size: "1.8 MB",
        publishedDate: "2024-03-20",
        author: "Michael Chen",
        downloads: 3120,
    },
    {
        id: 5,
        title: "Luyện nghe tiếng Anh",
        description:
            "Phương pháp luyện nghe hiệu quả giúp bạn cải thiện kỹ năng nghe với các bài tập từ cơ bản đến nâng cao.",
        url: "/docs/listening-practice.mp3",
        fileType: "audio",
        category: "Listening",
        tags: ["listening", "comprehension", "practice"],
        size: "56.2 MB",
        publishedDate: "2024-04-10",
        author: "James Taylor",
        downloads: 1560,
        isNew: true,
    },
    {
        id: 6,
        title: "Luyện nói tiếng Anh",
        description:
            "Các bài tập luyện nói giúp bạn giao tiếp tự tin hơn, kèm theo mẫu câu và tình huống thực tế.",
        url: "/docs/speaking-guide.docx",
        fileType: "docx",
        category: "Speaking",
        tags: ["speaking", "conversation", "fluency"],
        size: "2.7 MB",
        publishedDate: "2024-03-15",
        downloads: 2180,
    },
    {
        id: 7,
        title: "Kỹ năng viết tiếng Anh",
        description:
            "Hướng dẫn viết email, báo cáo và bài luận một cách chuyên nghiệp, với nhiều mẫu và cấu trúc tham khảo.",
        url: "/docs/writing-templates.docx",
        fileType: "docx",
        category: "Writing",
        tags: ["writing", "essay", "report"],
        size: "3.5 MB",
        publishedDate: "2024-04-05",
        author: "Emily Davis",
        downloads: 1890,
    },
    {
        id: 8,
        title: "Giao tiếp tiếng Anh cơ bản",
        description:
            "Phát triển kỹ năng giao tiếp cơ bản cho người mới học với các tình huống thực tế hàng ngày.",
        url: "/docs/basic-communication.pdf",
        fileType: "pdf",
        category: "Communication",
        tags: ["communication", "beginner", "practical"],
        size: "4.2 MB",
        publishedDate: "2024-03-10",
        downloads: 2750,
    },
    {
        id: 9,
        title: "Giao tiếp tiếng Anh nâng cao",
        description:
            "Cải thiện kỹ năng giao tiếp cho môi trường chuyên nghiệp và các tình huống kinh doanh.",
        url: "/docs/advanced-communication.pdf",
        fileType: "pdf",
        category: "Business",
        tags: ["business", "advanced", "professional"],
        size: "5.1 MB",
        publishedDate: "2024-02-28",
        author: "Robert Garcia",
        downloads: 1450,
    },
    {
        id: 10,
        title: "Từ vựng IELTS cơ bản",
        description:
            "Danh sách từ vựng cần thiết cho kỳ thi IELTS, được phân loại theo chủ đề và cấp độ.",
        url: "/docs/ielts-vocabulary.xlsx",
        fileType: "xlsx",
        category: "IELTS",
        tags: ["IELTS", "vocabulary", "exam"],
        size: "2.3 MB",
        publishedDate: "2024-04-01",
        author: "Lisa Wong",
        downloads: 4320,
        isFeatured: true,
    },
    {
        id: 11,
        title: "Ngữ pháp nâng cao",
        description:
            "Các cấu trúc ngữ pháp phức tạp giúp bạn viết và nói chính xác trong các tình huống học thuật và chuyên nghiệp.",
        url: "/docs/advanced-grammar.pdf",
        fileType: "pdf",
        category: "Grammar",
        tags: ["grammar", "advanced", "structures"],
        size: "4.8 MB",
        publishedDate: "2024-03-05",
        downloads: 1680,
    },
    {
        id: 12,
        title: "Kỹ năng đọc hiểu tiếng Anh",
        description:
            "Chiến lược đọc hiểu hiệu quả cho văn bản tiếng Anh với các bài tập phân tích và tổng hợp.",
        url: "/docs/reading-skills.pdf",
        fileType: "pdf",
        category: "Reading",
        tags: ["reading", "comprehension", "skills"],
        size: "3.9 MB",
        publishedDate: "2024-03-22",
        author: "Thomas Brown",
        downloads: 2080,
    },
    {
        id: 13,
        title: "Phân tích bài báo tiếng Anh",
        description:
            "Học cách phân tích và hiểu các bài báo tiếng Anh, từ báo chí đến tạp chí học thuật.",
        url: "/docs/article-analysis.docx",
        fileType: "docx",
        category: "Reading",
        tags: ["articles", "analysis", "media"],
        size: "2.6 MB",
        publishedDate: "2024-02-15",
        downloads: 980,
    },
    {
        id: 14,
        title: "Từ vựng chuyên ngành",
        description:
            "Từ vựng chuyên ngành cho các lĩnh vực như y tế, công nghệ, luật, kinh doanh và khoa học.",
        url: "/docs/specialized-vocabulary.xlsx",
        fileType: "xlsx",
        category: "Vocabulary",
        tags: ["specialized", "professional", "technical"],
        size: "3.2 MB",
        publishedDate: "2024-04-08",
        author: "Daniel Martinez",
        downloads: 1560,
        isNew: true,
    },
    {
        id: 15,
        title: "Luyện phát âm chuyên sâu",
        description:
            "Các bài tập luyện phát âm nâng cao cho người học muốn hoàn thiện giọng nói gần với người bản xứ.",
        url: "/docs/advanced-pronunciation.mp3",
        fileType: "audio",
        category: "Pronunciation",
        tags: ["pronunciation", "advanced", "native-like"],
        size: "68.3 MB",
        publishedDate: "2024-03-30",
        downloads: 1240,
    },
    {
        id: 16,
        title: "Khóa học TOEIC cơ bản",
        description:
            "Chuẩn bị cho kỳ thi TOEIC với các bài tập và bài kiểm tra mô phỏng phần Listening và Reading.",
        url: "/docs/toeic-preparation.pdf",
        fileType: "pdf",
        category: "TOEIC",
        tags: ["TOEIC", "exam", "preparation"],
        size: "6.7 MB",
        publishedDate: "2024-04-12",
        author: "Jennifer Adams",
        downloads: 3450,
        isNew: true,
        isFeatured: true,
    },
    {
        id: 17,
        title: "Khóa học TOEIC nâng cao",
        description:
            "Tăng cường kỹ năng để đạt điểm cao trong kỳ thi TOEIC, tập trung vào các chiến lược làm bài hiệu quả.",
        url: "/docs/advanced-toeic.pptx",
        fileType: "pptx",
        category: "TOEIC",
        tags: ["TOEIC", "advanced", "strategies"],
        size: "8.2 MB",
        publishedDate: "2024-03-18",
        downloads: 2790,
    },
    {
        id: 18,
        title: "Học tiếng Anh qua phim ảnh",
        description:
            "Sử dụng phim ảnh để cải thiện kỹ năng nghe và từ vựng, với phân tích các đoạn phim phổ biến.",
        url: "/docs/english-through-movies.mp4",
        fileType: "video",
        category: "Multimedia",
        tags: ["movies", "listening", "culture"],
        size: "125.6 MB",
        publishedDate: "2024-02-25",
        author: "Alexandra Peters",
        downloads: 2180,
    },
    {
        id: 19,
        title: "Học tiếng Anh qua nhạc",
        description:
            "Học qua lời bài hát và giai điệu để làm quen với ngữ điệu tiếng Anh và từ vựng hiện đại.",
        url: "/docs/english-through-music.mp3",
        fileType: "audio",
        category: "Multimedia",
        tags: ["music", "lyrics", "culture"],
        size: "45.3 MB",
        publishedDate: "2024-03-08",
        downloads: 1870,
    },
    {
        id: 20,
        title: "Học tiếng Anh qua truyện ngắn",
        description:
            "Đọc và phân tích truyện ngắn để nâng cao khả năng đọc hiểu và mở rộng vốn từ vựng.",
        url: "/docs/short-stories.pdf",
        fileType: "pdf",
        category: "Reading",
        tags: ["stories", "reading", "literature"],
        size: "4.9 MB",
        publishedDate: "2024-04-04",
        author: "William Johnson",
        downloads: 1290,
    },
];

// Trích xuất tất cả các danh mục và tags
const allCategories = Array.from(new Set(docsData.map((doc) => doc.category)));
const allTags = Array.from(new Set(docsData.flatMap((doc) => doc.tags)));
const allFileTypes = Array.from(new Set(docsData.map((doc) => doc.fileType)));

const Docs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedFileType, setSelectedFileType] = useState<string | null>(
        null
    );
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "downloads" | "name">("date");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 9;

    // Lọc và sắp xếp tài liệu
    const filteredDocs = docsData.filter((doc) => {
        const matchesSearch =
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            !selectedCategory || doc.category === selectedCategory;
        const matchesFileType =
            !selectedFileType || doc.fileType === selectedFileType;
        const matchesTag = !selectedTag || doc.tags.includes(selectedTag);

        return (
            matchesSearch && matchesCategory && matchesFileType && matchesTag
        );
    });

    const sortedDocs = [...filteredDocs].sort((a, b) => {
        if (sortBy === "date") {
            return (
                new Date(b.publishedDate).getTime() -
                new Date(a.publishedDate).getTime()
            );
        } else if (sortBy === "downloads") {
            return b.downloads - a.downloads;
        } else {
            // 'name'
            return a.title.localeCompare(b.title);
        }
    });

    const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);
    const displayedDocs = sortedDocs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Featured documents
    const featuredDocs = docsData.filter((doc) => doc.isFeatured);

    // Format file size function
    const formatFileSize = (size: string) => {
        return size;
    };

    // Format date function
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Get file icon based on file type
    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case "pdf":
                return <FileText className="h-8 w-8 text-red-500" />;
            case "docx":
                return <FileText className="h-8 w-8 text-blue-500" />;
            case "xlsx":
                return <FileText className="h-8 w-8 text-green-500" />;
            case "pptx":
                return <File className="h-8 w-8 text-orange-500" />;
            case "zip":
                return <FileArchive className="h-8 w-8 text-purple-500" />;
            case "image":
                return <FileImage className="h-8 w-8 text-teal-500" />;
            case "audio":
                return <FileAudio className="h-8 w-8 text-indigo-500" />;
            case "video":
                return <FileVideo className="h-8 w-8 text-pink-500" />;
            default:
                return <FileText className="h-8 w-8 text-gray-500" />;
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedFileType(null);
        setSelectedTag(null);
        setSortBy("date");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Resources Library
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Access our comprehensive collection of learning
                            materials, guides, and resources
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for documents, guides, templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Featured documents */}
                {featuredDocs.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <Star className="h-5 w-5 mr-2 text-amber-500" />
                            Featured Resources
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredDocs.slice(0, 3).map((doc) => (
                                <a
                                    key={doc.id}
                                    href={doc.url}
                                    className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-full"
                                >
                                    <div className="p-6 flex items-start">
                                        <div className="mr-4 mt-1">
                                            {getFileIcon(doc.fileType)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {doc.title}
                                                {doc.isNew && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {doc.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    {doc.category}
                                                </span>
                                                {doc.tags
                                                    .slice(0, 2)
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Download className="h-4 w-4 mr-1.5" />
                                            <span>
                                                {doc.downloads.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-blue-600 font-medium text-sm">
                                            <span>Download</span>
                                            <FileUp className="h-4 w-4 ml-1.5" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Controls and filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            All Resources
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value as
                                            | "date"
                                            | "downloads"
                                            | "name"
                                    )
                                }
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date">Newest First</option>
                                <option value="downloads">
                                    Most Downloaded
                                </option>
                                <option value="name">Alphabetical</option>
                            </select>
                            <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${
                                        viewMode === "grid"
                                            ? "bg-blue-50 text-blue-600"
                                            : "bg-white text-gray-500"
                                    }`}
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${
                                        viewMode === "list"
                                            ? "bg-blue-50 text-blue-600"
                                            : "bg-white text-gray-500"
                                    }`}
                                >
                                    <LayoutList className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced filters */}
                    {showFilters && (
                        <div className="mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Categories
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                id="category-all"
                                                type="radio"
                                                checked={
                                                    selectedCategory === null
                                                }
                                                onChange={() =>
                                                    setSelectedCategory(null)
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label
                                                htmlFor="category-all"
                                                className="ml-2 text-gray-700"
                                            >
                                                All Categories
                                            </label>
                                        </div>
                                        {allCategories.map((category) => (
                                            <div
                                                key={category}
                                                className="flex items-center"
                                            >
                                                <input
                                                    id={`category-${category}`}
                                                    type="radio"
                                                    checked={
                                                        selectedCategory ===
                                                        category
                                                    }
                                                    onChange={() =>
                                                        setSelectedCategory(
                                                            category
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`category-${category}`}
                                                    className="ml-2 text-gray-700"
                                                >
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        File Types
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                id="type-all"
                                                type="radio"
                                                checked={
                                                    selectedFileType === null
                                                }
                                                onChange={() =>
                                                    setSelectedFileType(null)
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label
                                                htmlFor="type-all"
                                                className="ml-2 text-gray-700"
                                            >
                                                All Types
                                            </label>
                                        </div>
                                        {allFileTypes.map((type) => (
                                            <div
                                                key={type}
                                                className="flex items-center"
                                            >
                                                <input
                                                    id={`type-${type}`}
                                                    type="radio"
                                                    checked={
                                                        selectedFileType ===
                                                        type
                                                    }
                                                    onChange={() =>
                                                        setSelectedFileType(
                                                            type
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`type-${type}`}
                                                    className="ml-2 text-gray-700 flex items-center"
                                                >
                                                    <span className="mr-2">
                                                        {getFileIcon(type)}
                                                    </span>
                                                    <span className="capitalize">
                                                        {type}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Popular Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.slice(0, 12).map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    setSelectedTag(
                                                        selectedTag === tag
                                                            ? null
                                                            : tag
                                                    )
                                                }
                                                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                                                    selectedTag === tag
                                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results counter */}
                    <div className="text-sm text-gray-500 mb-4">
                        Showing {displayedDocs.length} of {filteredDocs.length}{" "}
                        resources
                    </div>
                </div>

                {/* Documents Grid/List */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {displayedDocs.map((doc) => (
                            <a
                                key={doc.id}
                                href={doc.url}
                                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-full"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex items-start mb-4">
                                        <div className="mr-4">
                                            {getFileIcon(doc.fileType)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {doc.title}
                                                {doc.isNew && (
                                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                <span>
                                                    {formatDate(
                                                        doc.publishedDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {doc.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                            {doc.category}
                                        </span>
                                        {doc.tags
                                            .slice(0, 2)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        {doc.tags.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                +{doc.tags.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Download className="h-4 w-4 mr-1.5" />
                                            <span>
                                                {doc.downloads.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <File className="h-4 w-4 mr-1.5" />
                                            <span>{doc.size}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-blue-600 font-medium text-sm">
                                        <span>Download</span>
                                        <FileUp className="h-4 w-4 ml-1.5" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 mb-10">
                        {displayedDocs.map((doc) => (
                            <a
                                key={doc.id}
                                href={doc.url}
                                className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                            >
                                <div className="p-4 flex items-center justify-center bg-gray-50 border-r border-gray-100">
                                    {getFileIcon(doc.fileType)}
                                </div>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {doc.title}
                                                {doc.isNew && (
                                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                                                {doc.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                            <span>
                                                {formatDate(doc.publishedDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                            {doc.category}
                                        </span>
                                        {doc.tags
                                            .slice(0, 3)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between gap-4 border-l border-gray-100">
                                    <div className="flex flex-col items-end text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Download className="h-4 w-4 mr-1.5" />
                                            <span>
                                                {doc.downloads.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <File className="h-4 w-4 mr-1.5" />
                                            <span>{doc.size}</span>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <FileUp className="h-5 w-5" />
                                    </button>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {/* Empty state */}
                {displayedDocs.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No resources found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            We couldn't find any documents matching your current
                            search criteria.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Docs;
