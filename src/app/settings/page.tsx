"use client";

import React, { useState, useEffect } from "react";
import SettingsForm from "@/components/Settings/SettingsForm";
import UserSettingsForm from "@/components/Settings/UserSettingsForm";
import LearningGoals from "@/components/Settings/LearningGoals";
import PasswordChangeForm from "@/components/Settings/PasswordChangeForm";
import CurrentLevel from "@/components/Settings/CurrentLevel";
import StudyScheduleForm from "@/components/Settings/StudyScheduleForm";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Lock,
    Book,
    Award,
    Clock,
    Bell,
    ChevronRight,
    CheckCircle,
    ShieldCheck,
    CalendarRange,
    Megaphone,
    Settings,
} from "lucide-react";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoaded, setIsLoaded] = useState(false);
    const [saveStatus, setSaveStatus] = useState<null | "saving" | "saved">(
        null
    );

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Simulate saving status demo
    const simulateSave = () => {
        setSaveStatus("saving");
        setTimeout(() => {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus(null), 2000);
        }, 1500);
    };

    const tabs = [
        {
            id: "profile",
            label: "Hồ sơ",
            icon: <User className="w-5 h-5" />,
            description: "Thông tin cá nhân và hồ sơ học tập của bạn",
        },
        {
            id: "security",
            label: "Bảo mật",
            icon: <ShieldCheck className="w-5 h-5" />,
            description: "Thiết lập bảo mật và quyền riêng tư",
        },
        {
            id: "learning",
            label: "Học tập",
            icon: <Book className="w-5 h-5" />,
            description: "Mục tiêu và cài đặt học tập của bạn",
        },
        {
            id: "schedule",
            label: "Lịch trình",
            icon: <CalendarRange className="w-5 h-5" />,
            description: "Quản lý thời gian học tập hàng ngày",
        },
        {
            id: "notification",
            label: "Thông báo",
            icon: <Megaphone className="w-5 h-5" />,
            description: "Cài đặt thông báo và nhắc nhở",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-32 px-4 sm:px-6 lg:px-8 ">
                {/* Header with status indicator */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Settings className="w-7 h-7 mr-3 text-indigo-600" />
                            Cài đặt tài khoản
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Quản lý thông tin cá nhân và tùy chọn của bạn
                        </p>
                    </div>
                    <div className="flex items-center">
                        {saveStatus === "saving" && (
                            <div className="flex items-center text-indigo-600">
                                <div className="animate-spin h-5 w-5 mr-2 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                <span>Đang lưu...</span>
                            </div>
                        )}
                        {saveStatus === "saved" && (
                            <div className="flex items-center text-green-600">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span>Đã lưu thay đổi</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            x: isLoaded ? 0 : -20,
                        }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
                                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md border-4 border-indigo-100">
                                    <span className="text-3xl font-bold text-indigo-600">
                                        TN
                                    </span>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="font-bold text-lg text-white">
                                        Thanh Tùng
                                    </h3>
                                    <p className="text-indigo-100 text-sm">
                                        thanhtung@example.com
                                    </p>
                                </div>
                            </div>

                            <nav className="p-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left p-3 mb-1 flex items-center justify-between rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`p-2 rounded-md mr-3 ${
                                                    activeTab === tab.id
                                                        ? "bg-indigo-100 text-indigo-600"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {tab.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {tab.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                                                    {tab.description}
                                                </div>
                                            </div>
                                        </div>
                                        {activeTab === tab.id && (
                                            <ChevronRight className="h-5 w-5 text-indigo-600" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            y: isLoaded ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6"
                                >
                                    {/* Tab Content */}
                                    {activeTab === "profile" && (
                                        <div>
                                            <header className="border-b border-gray-100 pb-4 mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Thông tin cá nhân
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Cập nhật thông tin cá nhân
                                                    và hồ sơ học tập của bạn
                                                </p>
                                            </header>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                <SettingsForm
                                                    onSave={simulateSave}
                                                />
                                                <UserSettingsForm
                                                    onSave={simulateSave}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "security" && (
                                        <div>
                                            <header className="border-b border-gray-100 pb-4 mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Bảo mật tài khoản
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Cập nhật mật khẩu và thiết
                                                    lập bảo mật cho tài khoản
                                                    của bạn
                                                </p>
                                            </header>
                                            <div className="max-w-xl mx-auto">
                                                <PasswordChangeForm
                                                    onSave={simulateSave}
                                                />

                                                <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                                    <h3 className="text-blue-800 font-semibold text-lg mb-2 flex items-center">
                                                        <ShieldCheck className="w-5 h-5 mr-2" />
                                                        Bảo mật hai lớp
                                                    </h3>
                                                    <p className="text-blue-700 text-sm mb-4">
                                                        Bảo vệ tài khoản của bạn
                                                        bằng cách thêm một lớp
                                                        bảo mật khác ngoài mật
                                                        khẩu.
                                                    </p>
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                        Thiết lập xác thực hai
                                                        yếu tố
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "learning" && (
                                        <div>
                                            <header className="border-b border-gray-100 pb-4 mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Cài đặt học tập
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Quản lý mục tiêu và thiết
                                                    lập học tập của bạn
                                                </p>
                                            </header>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                <LearningGoals
                                                    onSave={simulateSave}
                                                />
                                                <CurrentLevel
                                                    onSave={simulateSave}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "schedule" && (
                                        <div>
                                            <header className="border-b border-gray-100 pb-4 mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Lịch trình học tập
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Quản lý thời gian và lịch
                                                    trình học tập hàng ngày
                                                </p>
                                            </header>
                                            <div className="max-w-xl mx-auto">
                                                <StudyScheduleForm
                                                    onSave={simulateSave}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "notification" && (
                                        <div>
                                            <header className="border-b border-gray-100 pb-4 mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Cài đặt thông báo
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Tùy chỉnh cách bạn nhận
                                                    thông báo từ ứng dụng
                                                </p>
                                            </header>
                                            <div className="max-w-xl mx-auto">
                                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                                                    {[
                                                        {
                                                            title: "Nhắc nhở học tập hàng ngày",
                                                            desc: "Nhận thông báo khi đến giờ học",
                                                            defaultChecked:
                                                                true,
                                                        },
                                                        {
                                                            title: "Thông báo thành tích",
                                                            desc: "Nhận thông báo khi đạt được mục tiêu",
                                                            defaultChecked:
                                                                true,
                                                        },
                                                        {
                                                            title: "Cập nhật nội dung",
                                                            desc: "Nhận thông báo về nội dung mới",
                                                            defaultChecked:
                                                                false,
                                                        },
                                                        {
                                                            title: "Email thông báo",
                                                            desc: "Nhận email tổng kết tuần",
                                                            defaultChecked:
                                                                true,
                                                        },
                                                        {
                                                            title: "Thông báo về khóa học",
                                                            desc: "Thông báo khi có khóa học mới phù hợp",
                                                            defaultChecked:
                                                                false,
                                                        },
                                                    ].map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div>
                                                                <p className="font-medium text-gray-800">
                                                                    {item.title}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {item.desc}
                                                                </p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    defaultChecked={
                                                                        item.defaultChecked
                                                                    }
                                                                    onChange={
                                                                        simulateSave
                                                                    }
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 border border-indigo-100">
                                                    <h3 className="text-indigo-800 font-semibold mb-2">
                                                        Cài đặt email
                                                    </h3>
                                                    <p className="text-indigo-700 text-sm mb-4">
                                                        Chọn loại email bạn muốn
                                                        nhận từ chúng tôi
                                                    </p>

                                                    <div className="space-y-3">
                                                        {[
                                                            {
                                                                title: "Email học tập hàng tuần",
                                                                checked: true,
                                                            },
                                                            {
                                                                title: "Thông báo khuyến mãi",
                                                                checked: false,
                                                            },
                                                            {
                                                                title: "Cập nhật sản phẩm",
                                                                checked: true,
                                                            },
                                                        ].map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center"
                                                            >
                                                                <input
                                                                    id={`email-opt-${idx}`}
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                        item.checked
                                                                    }
                                                                    onChange={
                                                                        simulateSave
                                                                    }
                                                                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`email-opt-${idx}`}
                                                                    className="ml-2 text-sm text-indigo-800"
                                                                >
                                                                    {item.title}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
