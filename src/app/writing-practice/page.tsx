"use client";

import { useState } from "react";
import { WritingService } from "@/lib/writing/writing-service";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function WritingPracticePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">
                Luyện Kỹ Năng Viết
            </h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
                <p className="text-gray-700 mb-4">
                    Luyện tập kỹ năng viết là một phần quan trọng trong quá
                    trình học ngoại ngữ. Tại đây, bạn có thể luyện viết theo các
                    đề bài có sẵn hoặc tạo đề bài tùy chỉnh, nhận phản hồi chi
                    tiết và cải thiện kỹ năng viết của mình.
                </p>
                <div className="flex justify-center mt-6">
                    <Link href="/writing-practice/practice">
                        <Button variant="primary" className="mr-4">
                            Bắt đầu luyện tập
                        </Button>
                    </Link>
                    <Link href="/writing-practice/my-writings">
                        <Button variant="outline">Bài viết của tôi</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                    title="Đa dạng chủ đề"
                    description="Nhiều chủ đề đa dạng từ môi trường, công nghệ đến giáo dục và du lịch."
                    icon="📚"
                />
                <FeatureCard
                    title="Tạo đề bài tùy chỉnh"
                    description="Tự tạo đề bài theo nhu cầu học tập và sở thích cá nhân của bạn."
                    icon="✏️"
                />
                <FeatureCard
                    title="Phản hồi chi tiết"
                    description="Nhận đánh giá chi tiết về ngữ pháp, từ vựng, cấu trúc và tính liên kết của bài viết."
                    icon="📝"
                />
                <FeatureCard
                    title="Theo dõi tiến độ"
                    description="Lưu trữ và xem lại các bài viết trước đây để theo dõi sự tiến bộ."
                    icon="📊"
                />
                <FeatureCard
                    title="Gợi ý cải thiện"
                    description="Nhận các gợi ý cụ thể để cải thiện kỹ năng viết của bạn."
                    icon="💡"
                />
                <FeatureCard
                    title="Đa cấp độ"
                    description="Luyện tập với các cấp độ khác nhau từ cơ bản đến nâng cao."
                    icon="🏆"
                />
            </div>
        </div>
    );
}

function FeatureCard({ title, description, icon }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
