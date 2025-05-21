"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { X, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { checkPathEnrollments } from "@/api/learningPath";

interface LearningPathReminderProps {
    pathId?: number; // ID lộ trình cụ thể (nếu không cung cấp, sẽ hiển thị nhắc nhở cho tất cả lộ trình)
}

interface CourseEnrollmentStatus {
    courseId: number;
    courseName: string;
    isEnrolled: boolean;
    pathId: number;
    priority: number;
}

const LearningPathReminder: React.FC<LearningPathReminderProps> = ({
    pathId,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [courseStatus, setCourseStatus] = useState<CourseEnrollmentStatus[]>(
        []
    );
    const [dismissedUntil, setDismissedUntil] = useState<Date | null>(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.id;

    useEffect(() => {
        // Kiểm tra xem người dùng đã tắt thông báo tạm thời chưa
        const dismissedStorage = localStorage.getItem(
            "path_reminder_dismissed"
        );
        if (dismissedStorage) {
            const dismissedTime = new Date(dismissedStorage);

            // Nếu thời gian tắt thông báo chưa hết, không hiển thị thông báo
            if (dismissedTime > new Date()) {
                setDismissedUntil(dismissedTime);
                return;
            } else {
                // Xóa thông tin tắt thông báo đã hết hạn
                localStorage.removeItem("path_reminder_dismissed");
            }
        }

        if (!userId) return;

        const fetchEnrollmentStatus = async () => {
            try {
                setLoading(true);

                // Lấy thông tin về trạng thái đăng ký khóa học trong lộ trình
                const response = await fetch(
                    `/api/learning-paths/${userId}/course-status${
                        pathId ? `?pathId=${pathId}` : ""
                    }`
                );

                if (response.ok) {
                    const data = await response.json();

                    // Nếu có khóa học chưa đăng ký, hiển thị thông báo
                    const unenrolledCourses = data.filter(
                        (course: any) => !course.isEnrolled
                    );

                    if (unenrolledCourses.length > 0) {
                        setCourseStatus(unenrolledCourses);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đăng ký khóa học:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollmentStatus();
    }, [userId, pathId]);

    // Nếu không có khóa học nào chưa đăng ký hoặc người dùng đã tắt thông báo
    if (!isVisible || loading || !courseStatus.length) {
        return null;
    }

    // Sắp xếp khóa học theo độ ưu tiên
    const sortedCourses = [...courseStatus].sort(
        (a, b) => a.priority - b.priority
    );

    // Chỉ hiển thị tối đa 3 khóa học được đề xuất
    const displayCourses = sortedCourses.slice(0, 3);

    const dismissForDay = () => {
        // Tạo thời gian tắt thông báo trong 24 giờ
        const dismissTime = new Date();
        dismissTime.setHours(dismissTime.getHours() + 24);

        localStorage.setItem(
            "path_reminder_dismissed",
            dismissTime.toISOString()
        );
        setDismissedUntil(dismissTime);
        setIsVisible(false);
    };

    const createNewPath = () => {
        // Đóng thông báo và chuyển hướng tới trang tạo lộ trình mới
        setIsVisible(false);
        // Chuyển hướng sẽ được xử lý bởi Link component
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full md:max-w-lg bg-white rounded-lg shadow-xl border border-purple-200 animate-slideUp">
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Nhắc nhở lộ trình học tập
                        </h3>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-gray-700 mb-4">
                        Bạn có lộ trình học tập nhưng chưa đăng ký các khóa học
                        được đề xuất sau:
                    </p>

                    <div className="space-y-3">
                        {displayCourses.map((course) => (
                            <div
                                key={course.courseId}
                                className="flex items-start p-3 bg-purple-50 rounded-md"
                            >
                                <BookOpen className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">
                                        {course.courseName}
                                    </h4>
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            {course.isEnrolled ? (
                                                <span className="flex items-center text-green-600">
                                                    <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                                    Đã đăng ký
                                                </span>
                                            ) : (
                                                <span>Chưa đăng ký</span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/courses/${course.courseId}`}
                                            className="text-sm px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                        >
                                            Xem khóa học
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedCourses.length > 3 && (
                        <p className="mt-2 text-sm text-gray-500">
                            Và {sortedCourses.length - 3} khóa học khác...
                        </p>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={dismissForDay}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                        >
                            Nhắc lại sau
                        </button>

                        <div className="flex space-x-3">
                            <Link
                                href={`/learning-paths`}
                                className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 focus:outline-none"
                            >
                                Xem lộ trình
                            </Link>
                            <Link
                                href="/create-learning-path"
                                onClick={createNewPath}
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none"
                            >
                                Tạo lộ trình mới
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .animate-slideUp {
                    animation: slideUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LearningPathReminder;
