"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Award,
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    GraduationCap,
    Target,
    Users,
} from "lucide-react";
import { motion } from "framer-motion";

// Các chương trình học giả lập
const learningPrograms = [
    {
        id: 1,
        title: "Chương trình IELTS 6.5+",
        description:
            "Chương trình luyện thi IELTS toàn diện giúp bạn đạt được mục tiêu 6.5+ chỉ trong 3 tháng.",
        level: "Trung cấp - Cao cấp",
        duration: "3 tháng",
        lessons: 36,
        students: 1245,
        rating: 4.8,
        image: "/images/programs/ielts.jpg",
        price: 4500000,
        features: [
            "Luyện tập 4 kỹ năng: Nghe, Nói, Đọc, Viết",
            "Phương pháp làm bài thi hiệu quả",
            "Giáo trình độc quyền cập nhật mới nhất",
            "Giáo viên có chứng chỉ IELTS 8.0+",
            "Bài tập và mô phỏng thi thực tế",
            "Đảm bảo đầu ra hoặc học lại miễn phí",
        ],
        popular: true,
        tag: "Phổ biến nhất",
    },
    {
        id: 2,
        title: "Tiếng Anh Giao Tiếp Chuyên Sâu",
        description:
            "Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong mọi tình huống từ cơ bản đến nâng cao.",
        level: "Sơ cấp - Trung cấp",
        duration: "4 tháng",
        lessons: 48,
        students: 2160,
        rating: 4.9,
        image: "/images/programs/speaking.jpg",
        price: 3800000,
        features: [
            "Phát âm chuẩn với người bản xứ",
            "Từ vựng phong phú theo chủ đề",
            "Ngữ pháp giao tiếp thực tế",
            "Luyện tập hội thoại hàng ngày",
            "Thực hành với giáo viên bản ngữ",
            "Chứng chỉ hoàn thành có giá trị",
        ],
        popular: true,
        tag: "Bán chạy",
    },
    {
        id: 3,
        title: "Tiếng Nhật Cho Người Đi Làm",
        description:
            "Chương trình học tiếng Nhật thiết kế riêng cho người đi làm, giúp bạn nhanh chóng giao tiếp cơ bản.",
        level: "Sơ cấp",
        duration: "6 tháng",
        lessons: 72,
        students: 935,
        rating: 4.7,
        image: "/images/programs/japanese.jpg",
        price: 5200000,
        features: [
            "Học mọi lúc mọi nơi với video bài giảng",
            "Lộ trình từ N5 đến N3",
            "Giáo trình cập nhật theo JLPT mới nhất",
            "Hỗ trợ 1-1 với giáo viên",
            "Luyện tập hội thoại thực tế",
            "Giáo viên người Nhật có kinh nghiệm",
        ],
        popular: false,
    },
    {
        id: 4,
        title: "TOEIC 750+ Đảm Bảo Đầu Ra",
        description:
            "Chương trình luyện thi TOEIC cam kết đầu ra 750+ điểm hoặc hoàn tiền 100%.",
        level: "Trung cấp",
        duration: "2 tháng",
        lessons: 24,
        students: 1843,
        rating: 4.9,
        image: "/images/programs/toeic.jpg",
        price: 3200000,
        features: [
            "Phương pháp làm bài thi hiệu quả",
            "Luyện đề TOEIC theo format mới nhất",
            "Kỹ thuật làm bài nhanh và chính xác",
            "Cam kết đầu ra hoặc hoàn tiền",
            "Mô phỏng kỳ thi thực tế",
            "Giáo viên có chứng chỉ TOEIC 990",
        ],
        popular: true,
        tag: "Đảm bảo đầu ra",
    },
    {
        id: 5,
        title: "Tiếng Hàn Cho Người Mới Bắt Đầu",
        description:
            "Khóa học tiếng Hàn từ con số 0, giúp bạn nắm vững ngữ pháp và giao tiếp cơ bản.",
        level: "Sơ cấp",
        duration: "5 tháng",
        lessons: 60,
        students: 756,
        rating: 4.6,
        image: "/images/programs/korean.jpg",
        price: 4100000,
        features: [
            "Học bảng chữ cái Hangul dễ dàng",
            "Ngữ pháp cơ bản đến trung cấp",
            "Từ vựng theo chủ đề thông dụng",
            "Luyện nghe, nói chuẩn giọng Seoul",
            "Tìm hiểu văn hóa Hàn Quốc",
            "Giáo viên tốt nghiệp đại học Hàn Quốc",
        ],
        popular: false,
    },
    {
        id: 6,
        title: "Tiếng Anh Thương Mại & Kinh Doanh",
        description:
            "Chương trình chuyên sâu về tiếng Anh thương mại giúp bạn tự tin làm việc trong môi trường quốc tế.",
        level: "Trung cấp - Cao cấp",
        duration: "3 tháng",
        lessons: 36,
        students: 1120,
        rating: 4.8,
        image: "/images/programs/business.jpg",
        price: 4800000,
        features: [
            "Từ vựng chuyên ngành kinh doanh",
            "Kỹ năng thuyết trình bằng tiếng Anh",
            "Viết email và báo cáo chuyên nghiệp",
            "Đàm phán và giao tiếp quốc tế",
            "Tình huống kinh doanh thực tế",
            "Chứng chỉ được công nhận bởi doanh nghiệp",
        ],
        popular: false,
    },
];

const LearningProgramsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);

    const filteredPrograms =
        activeTab === "all"
            ? learningPrograms
            : learningPrograms.filter((program) => {
                  if (activeTab === "popular") return program.popular;
                  if (activeTab === "english")
                      return (
                          program.title.includes("Tiếng Anh") ||
                          program.title.includes("IELTS") ||
                          program.title.includes("TOEIC")
                      );
                  if (activeTab === "other")
                      return (
                          program.title.includes("Tiếng Nhật") ||
                          program.title.includes("Tiếng Hàn")
                      );
                  return true;
              });

    const tabItems = [
        { id: "all", label: "Tất cả" },
        { id: "popular", label: "Phổ biến nhất" },
        { id: "english", label: "Tiếng Anh" },
        { id: "other", label: "Ngôn ngữ khác" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Chương Trình Học Chuyên Biệt
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            Các chương trình học được thiết kế bởi chuyên gia
                            với lộ trình cụ thể giúp bạn đạt mục tiêu nhanh
                            chóng
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <a
                                href="#programs"
                                className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                Khám phá chương trình
                            </a>
                            <Link href="/learning-paths">
                                <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                                    Lộ trình học
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lợi ích */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Tại Sao Chọn Chương Trình Học Của Chúng Tôi?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Cam kết đầu ra
                            </h3>
                            <p className="text-gray-600">
                                Đảm bảo kết quả học tập hoặc được học lại miễn
                                phí cho đến khi đạt mục tiêu
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Giáo viên chất lượng cao
                            </h3>
                            <p className="text-gray-600">
                                Đội ngũ giảng viên giàu kinh nghiệm và có chứng
                                chỉ quốc tế cao nhất
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 rounded-lg bg-pink-600 flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Giáo trình độc quyền
                            </h3>
                            <p className="text-gray-600">
                                Tài liệu học tập được biên soạn riêng, cập nhật
                                theo xu hướng mới nhất
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm">
                            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Học viên thành công
                            </h3>
                            <p className="text-gray-600">
                                Hơn 10,000 học viên đã đạt được mục tiêu và
                                thành công trong sự nghiệp
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách chương trình học */}
            <div id="programs" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Khám Phá Chương Trình Học
                    </h2>
                    <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                        Lựa chọn chương trình học phù hợp với mục tiêu và trình
                        độ của bạn
                    </p>

                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-1 rounded-lg bg-gray-200">
                            {tabItems.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? "bg-white text-purple-700 shadow"
                                            : "text-gray-700 hover:text-purple-700"
                                    } px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Programs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPrograms.map((program) => (
                            <motion.div
                                key={program.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                                whileHover={{ y: -5 }}
                                onMouseEnter={() =>
                                    setHoveredProgram(program.id)
                                }
                                onMouseLeave={() => setHoveredProgram(null)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={
                                            program.image ||
                                            "/images/programs/default.jpg"
                                        }
                                        alt={program.title}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                        style={{
                                            transform:
                                                hoveredProgram === program.id
                                                    ? "scale(1.05)"
                                                    : "scale(1)",
                                        }}
                                    />
                                    {program.popular && (
                                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {program.tag || "Phổ biến"}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {program.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {program.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-purple-600 mr-2" />
                                            <span className="text-sm text-gray-700">
                                                {program.duration}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                                            <span className="text-sm text-gray-700">
                                                {program.lessons} buổi học
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 text-purple-600 mr-2" />
                                            <span className="text-sm text-gray-700">
                                                {program.students} học viên
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Award className="h-4 w-4 text-purple-600 mr-2" />
                                            <span className="text-sm text-gray-700">
                                                {program.rating}/5 đánh giá
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="text-xl font-bold text-purple-700">
                                            {program.price.toLocaleString()}đ
                                        </div>
                                        <Link
                                            href={`/learning/programs/${program.id}`}
                                        >
                                            <button className="flex items-center text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors">
                                                Xem chi tiết{" "}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Bắt đầu hành trình học tập của bạn ngay hôm nay
                        </h2>
                        <p className="text-lg opacity-90 mb-8">
                            Đăng ký tư vấn miễn phí để tìm chương trình học phù
                            hợp nhất với mục tiêu của bạn
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                Đăng ký tư vấn
                            </button>
                            <Link href="/courses">
                                <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                                    Khám phá khóa học
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningProgramsPage;
