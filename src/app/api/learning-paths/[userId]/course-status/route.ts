import { NextRequest, NextResponse } from "next/server";
import LearningPathReminderService from "@/lib/learning-path-reminder";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = parseInt(params.userId);
        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }

        // Lấy pathId từ query param nếu có
        const pathId = req.nextUrl.searchParams.get("pathId");
        const pathIdNumber = pathId ? parseInt(pathId) : undefined;

        // Kiểm tra cookie để xác thực người dùng (kiểm tra đơn giản)
        const token = req.cookies.get("next-auth.session-token");
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Lấy thông tin trạng thái khóa học
        const reminderService = LearningPathReminderService.getInstance();
        const courseStatus = await reminderService.getPathCoursesStatus(
            userId,
            pathIdNumber
        );

        return NextResponse.json(courseStatus);
    } catch (error) {
        console.error("Lỗi khi lấy trạng thái khóa học:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
