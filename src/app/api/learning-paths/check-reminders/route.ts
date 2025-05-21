import { NextRequest, NextResponse } from "next/server";
import LearningPathReminderService from "@/lib/learning-path-reminder";

export async function GET(req: NextRequest) {
    try {
        // Lấy API key từ query param hoặc header
        const apiKey =
            req.nextUrl.searchParams.get("api_key") ||
            req.headers.get("x-api-key");

        // Kiểm tra API key (nên lưu API key trong biến môi trường)
        const validApiKey =
            process.env.REMINDER_API_KEY || "learning_path_reminder_secret";
        if (apiKey !== validApiKey) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Khởi tạo service
        const reminderService = LearningPathReminderService.getInstance();

        // Trước tiên, cập nhật trạng thái đăng ký
        const updatedEnrollments =
            await reminderService.updateEnrollmentStatus();

        // Sau đó, kiểm tra và gửi thông báo
        const sentNotifications =
            await reminderService.checkAllPathsAndNotify();

        return NextResponse.json({
            success: true,
            updated_enrollments: updatedEnrollments,
            sent_notifications: sentNotifications,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Lỗi khi kiểm tra nhắc nhở lộ trình:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    // Cho phép gọi API bằng POST nếu cần
    return GET(req);
}
