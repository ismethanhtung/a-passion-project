import React from "react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl w-full border border-blue-100">
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/images/logo.png"
                        alt="Code Alone Logo"
                        className="w-20 h-20 mb-4 rounded-full shadow-lg"
                    />
                    <h1 className="text-4xl font-bold text-blue-800 mb-2 text-center">
                        Về Code Alone
                    </h1>
                    <p className="text-gray-600 text-lg text-center max-w-2xl">
                        Code Alone là nền tảng học tập và kiểm tra trực tuyến
                        giúp bạn phát triển kỹ năng lập trình, ngoại ngữ và tư
                        duy hiện đại. Chúng tôi tin rằng ai cũng có thể học và
                        thành công với sự hỗ trợ phù hợp.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                            Sứ mệnh
                        </h2>
                        <p className="text-gray-700 mb-2">
                            Mang đến trải nghiệm học tập cá nhân hóa, hiệu quả
                            và truyền cảm hứng cho mọi người Việt Nam trên hành
                            trình chinh phục tri thức số.
                        </p>
                        <h2 className="text-2xl font-semibold text-blue-700 mb-3 mt-6">
                            Giá trị cốt lõi
                        </h2>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            <li>Chất lượng & Đổi mới</li>
                            <li>Lấy người học làm trung tâm</li>
                            <li>Hỗ trợ cộng đồng & phát triển bền vững</li>
                            <li>Minh bạch & Uy tín</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                            Đội ngũ sáng lập
                        </h2>
                        <div className="flex items-center space-x-4 mb-3">
                            <img
                                src="/images/avatar/ceo.png"
                                alt="CEO"
                                className="w-14 h-14 rounded-full border-2 border-blue-200"
                            />
                            <div>
                                <div className="font-bold text-blue-800">
                                    Nguyễn Văn A
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Founder & CEO
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                            <img
                                src="/images/avatar/cto.png"
                                alt="CTO"
                                className="w-14 h-14 rounded-full border-2 border-blue-200"
                            />
                            <div>
                                <div className="font-bold text-blue-800">
                                    Trần Thị B
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Co-founder & CTO
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <img
                                src="/images/avatar/lead.png"
                                alt="Lead"
                                className="w-14 h-14 rounded-full border-2 border-blue-200"
                            />
                            <div>
                                <div className="font-bold text-blue-800">
                                    Lê Văn C
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Lead Product Designer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                        Bạn nhận được gì từ Code Alone?
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>
                            Khoá học & bài kiểm tra đa dạng, cập nhật liên tục
                        </li>
                        <li>
                            Giao diện thân thiện, dễ sử dụng trên mọi thiết bị
                        </li>
                        <li>
                            Phản hồi, hỗ trợ nhanh chóng từ đội ngũ chuyên môn
                        </li>
                        <li>
                            Cộng đồng học tập năng động, chia sẻ kinh nghiệm
                        </li>
                    </ul>
                </div>
                <div className="text-center text-gray-500 text-sm mt-8">
                    <div>
                        Liên hệ:{" "}
                        <a
                            href="mailto:support@codealone.com"
                            className="text-blue-600 hover:underline"
                        >
                            support@codealone.com
                        </a>
                    </div>
                    <div className="mt-1">
                        Hotline:{" "}
                        <a
                            href="tel:0123456789"
                            className="text-blue-600 hover:underline"
                        >
                            0123 456 789
                        </a>
                    </div>
                    <div className="mt-1">
                        Theo dõi chúng tôi:{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Facebook
                        </a>{" "}
                        |{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
