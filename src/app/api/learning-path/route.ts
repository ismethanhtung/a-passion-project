import { NextRequest, NextResponse } from "next/server";
import LearningPathService, {
    PersonalizedLearningPath,
} from "@/lib/learning-path-service";

export async function POST(req: NextRequest) {
    try {
        // Kiểm tra phương thức yêu cầu
        if (req.method !== "POST") {
            return NextResponse.json(
                { error: "Method not allowed" },
                { status: 405 }
            );
        }

        // Parse request body
        const userData = await req.json();

        // Kiểm tra dữ liệu đầu vào
        if (!userData.goal || !userData.currentLevel) {
            return NextResponse.json(
                {
                    error: "Thiếu thông tin cần thiết",
                    message:
                        "Vui lòng cung cấp mục tiêu học tập và trình độ hiện tại",
                },
                { status: 400 }
            );
        }

        // Log thông tin yêu cầu
        console.log("Nhận yêu cầu tạo lộ trình học tập cá nhân hóa:", {
            goal: userData.goal,
            currentLevel: userData.currentLevel,
            // Log các thông tin khác nếu có
        });

        // Khởi tạo service để tạo lộ trình học tập
        const learningPathService = LearningPathService.getInstance();

        // Gọi service để tạo lộ trình học tập
        const learningPath: PersonalizedLearningPath =
            await learningPathService.createPersonalizedLearningPath(userData);

        // Lưu lộ trình học tập vào cơ sở dữ liệu (nếu cần)
        // Ở đây bạn có thể thêm code để lưu lộ trình vào DB

        // Trả về lộ trình học tập
        return NextResponse.json(learningPath, { status: 200 });
    } catch (error: any) {
        console.error("Lỗi khi tạo lộ trình học tập:", error);

        return NextResponse.json(
            {
                error: "Lỗi khi tạo lộ trình học tập",
                message: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu",
            },
            { status: 500 }
        );
    }
}
