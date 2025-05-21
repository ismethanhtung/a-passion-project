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

        return NextResponse.json({
            id: test.id,
            title: test.title,
            isPublished: test.isPublished,
            isAIGenerated: test.isAIGenerated,
            questionCount: test._count.testQuestions,
            sections,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt,
            isReady: test.isPublished && test._count.testQuestions > 0,
        });
    } catch (error) {
        console.error("Error fetching test status:", error);
        return NextResponse.json(
            { error: "Failed to fetch test status" },
            { status: 500 }
        );
    }
}
