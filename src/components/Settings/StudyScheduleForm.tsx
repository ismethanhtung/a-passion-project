import React, { useState } from "react";
import { Clock, Calendar, CheckCircle, X } from "lucide-react";

const StudyScheduleForm = () => {
    const [studyTime, setStudyTime] = useState(30);
    const [selectedDays, setSelectedDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
    });
    const [reminderTime, setReminderTime] = useState("19:00");
    const [isSaved, setIsSaved] = useState(false);

    const daysOfWeek = [
        { id: "monday", label: "T2" },
        { id: "tuesday", label: "T3" },
        { id: "wednesday", label: "T4" },
        { id: "thursday", label: "T5" },
        { id: "friday", label: "T6" },
        { id: "saturday", label: "T7" },
        { id: "sunday", label: "CN" },
    ];

    const handleDayToggle = (day: string) => {
        setSelectedDays((prev) => ({
            ...prev,
            [day]: !prev[day as keyof typeof prev],
        }));
    };

    const handleSave = () => {
        // Lưu cài đặt (sẽ gọi API trong ứng dụng thực tế)
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                Lịch trình học tập
            </h2>

            {/* Thời gian học tập hàng ngày */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian học mỗi ngày (phút)
                </label>
                <div className="flex items-center">
                    <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={studyTime}
                        onChange={(e) => setStudyTime(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 w-12 text-center font-medium text-gray-700">
                        {studyTime}
                    </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10p</span>
                    <span>60p</span>
                    <span>120p</span>
                </div>
            </div>

            {/* Chọn ngày trong tuần */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày học trong tuần
                </label>
                <div className="flex space-x-2">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day.id}
                            onClick={() => handleDayToggle(day.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                                selectedDays[
                                    day.id as keyof typeof selectedDays
                                ]
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Giờ nhắc nhở */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ nhắc nhở học tập
                </label>
                <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Lưu cài đặt */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    {isSaved && (
                        <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Đã lưu thay đổi</span>
                        </div>
                    )}
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyScheduleForm;
