import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/online-tests/[id]/attempts - Tạo một lần thử bài kiểm tra mới
 */
export async function POST(
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
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        // Tạm thời hardcode userId = 1
        const userId = 1;

        // Tạo một lần thử mới
        const newAttempt = await prisma.testAttempt.create({
            data: {
                testId,
                userId,
                startTime: new Date(),
                completed: false,
            },
        });

        return NextResponse.json(newAttempt, { status: 201 });
    } catch (error) {
        console.error("Error creating test attempt:", error);
        return NextResponse.json(
            { error: "Failed to start test" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/online-tests/[id]/attempts - Lấy danh sách các lần thử của một bài kiểm tra
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

        // Tạm thời hardcode userId = 1
        const userId = 1;

        // Lấy danh sách các lần thử
        const attempts = await prisma.testAttempt.findMany({
            where: {
                testId,
                userId,
            },
            orderBy: {
                startTime: "desc",
            },
        });

        return NextResponse.json(attempts);
    } catch (error) {
        console.error("Error fetching test attempts:", error);
        return NextResponse.json(
            { error: "Failed to fetch attempts" },
            { status: 500 }
        );
    }
}
