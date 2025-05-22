import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Kiểm tra định dạng ID có hợp lệ không
 */
function isValidTestId(id: string): boolean {
    // ID phải là số nguyên dương
    return /^\d+$/.test(id) && parseInt(id) > 0;
}

/**
 * GET /api/online-tests/[id] - Lấy thông tin chi tiết một bài kiểm tra
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!isValidTestId(params.id)) {
            return NextResponse.json(
                { error: "Invalid test ID" },
                { status: 400 }
            );
        }

        const id = parseInt(params.id);

        // Tìm bài kiểm tra theo ID
        const test = await prisma.onlineTest.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        participants: true,
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

        return NextResponse.json(test);
    } catch (error) {
        console.error("Error fetching test:", error);
        return NextResponse.json(
            { error: "Failed to fetch test details" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/online-tests/[id] - Xóa một bài kiểm tra
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!isValidTestId(params.id)) {
            return NextResponse.json(
                { error: "Invalid test ID" },
                { status: 400 }
            );
        }

        const id = parseInt(params.id);

        // Kiểm tra xem bài kiểm tra có tồn tại không
        const test = await prisma.onlineTest.findUnique({
            where: { id },
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        // Xóa các câu hỏi của bài kiểm tra trước
        await prisma.testQuestion.deleteMany({
            where: { testId: id },
        });

        // Xóa các lần làm bài và câu trả lời
        await prisma.testAnswer.deleteMany({
            where: { attempt: { testId: id } },
        });

        await prisma.testAttempt.deleteMany({
            where: { testId: id },
        });

        // Xóa bài kiểm tra
        await prisma.onlineTest.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Test deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting test:", error);
        return NextResponse.json(
            { error: "Failed to delete test" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/online-tests/[id] - Cập nhật thông tin bài kiểm tra
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!isValidTestId(params.id)) {
            return NextResponse.json(
                { error: "Invalid test ID" },
                { status: 400 }
            );
        }

        const id = parseInt(params.id);

        // Lấy dữ liệu cập nhật từ request
        const updateData = await request.json();

        // Kiểm tra xem bài kiểm tra có tồn tại không
        const test = await prisma.onlineTest.findUnique({
            where: { id },
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        // Cập nhật bài kiểm tra
        const updatedTest = await prisma.onlineTest.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedTest);
    } catch (error) {
        console.error("Error updating test:", error);
        return NextResponse.json(
            { error: "Failed to update test" },
            { status: 500 }
        );
    }
}
