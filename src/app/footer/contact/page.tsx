import React from "react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
                    Liên hệ với chúng tôi
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Bạn có câu hỏi, góp ý hoặc cần hỗ trợ? Hãy gửi thông tin cho
                    chúng tôi, đội ngũ sẽ phản hồi sớm nhất!
                </p>
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Nội dung
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            rows={5}
                            placeholder="Nhập nội dung liên hệ..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                    >
                        Gửi liên hệ
                    </button>
                </form>
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <div>
                        Hoặc liên hệ trực tiếp qua email:{" "}
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
                </div>
            </div>
        </div>
    );
}
