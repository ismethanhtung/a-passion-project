import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/online-tests/[id]/status - Lấy trạng thái của bài kiểm tra
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const testId = parseInt(params.id);

        if (isNaN(testId)) {
            return NextResponse.json(
                { error: "Invalid test ID" },
                { status: 400 }
            );
        }

        // Kiểm tra xem bài kiểm tra có tồn tại không
        const test = await prisma.onlineTest.findUnique({
            where: { id: testId },
            select: {
                id: true,
                title: true,
                description: true,
                isPublished: true,
                isAIGenerated: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        testQuestions: true,
                    },
                },
            },
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        // Lấy thông tin về các phần của bài kiểm tra
        const questionSections = await prisma.testQuestion.groupBy({
            by: ["sectionType"],
            where: {
                testId,
            },
            _count: {
                id: true,
            },
        });

        // Tạo cấu trúc thông tin về các phần
        const sections = {};
        questionSections.forEach((section) => {
            sections[section.sectionType] = section._count.id;
        });

        // Xác định trạng thái của bài kiểm tra
        let status = "READY";
        let errorMessage: string | null = null;

        if (test.description.includes("[Đang tạo...]")) {
            status = "GENERATING";
        } else if (test.description.includes("[Lỗi:")) {
            status = "ERROR";
            const match = test.description.match(/\[Lỗi: (.*?)\]/);
            errorMessage = match ? match[1] : null;
        } else if (!test.isPublished) {
            status = "PENDING";
        } else if (test._count.testQuestions === 0) {
            status = "EMPTY";
        }

        // Làm sạch description trước khi trả về
        const cleanDescription = test.description
            .replace(" [Đang tạo...]", "")
            .replace(/\[Lỗi: .*?\]/, "");

        return NextResponse.json({
            id: test.id,
            title: test.title,
            description: cleanDescription,
            isPublished: test.isPublished,
            isAIGenerated: test.isAIGenerated,
            questionCount: test._count.testQuestions,
            sections,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt,
            isReady: status === "READY",
            status,
            errorMessage,
        });
    } catch (error) {
        console.error("Error fetching test status:", error);
        return NextResponse.json(
            { error: "Failed to fetch test status" },
            { status: 500 }
        );
    }
}
