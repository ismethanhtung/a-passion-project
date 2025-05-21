import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/online-tests/[id]/questions - Lấy danh sách câu hỏi của một bài kiểm tra
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
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        // Lấy danh sách câu hỏi
        const questions = await prisma.testQuestion.findMany({
            where: {
                testId,
            },
            orderBy: [
                { sectionType: "asc" },
                { part: "asc" },
                { order: "asc" },
            ],
        });

        if (questions.length === 0) {
            return NextResponse.json(
                { error: "No questions found for this test" },
                { status: 404 }
            );
        }

        // Tổ chức câu hỏi theo section và part
        const groupedQuestions: Record<string, Record<number, any[]>> = {};

        // Nhóm câu hỏi theo section và part
        questions.forEach((question) => {
            if (!groupedQuestions[question.sectionType]) {
                groupedQuestions[question.sectionType] = {};
            }

            if (!groupedQuestions[question.sectionType][question.part]) {
                groupedQuestions[question.sectionType][question.part] = [];
            }

            // Thêm câu hỏi vào nhóm tương ứng
            groupedQuestions[question.sectionType][question.part].push(
                question
            );
        });

        return NextResponse.json({
            testId,
            groupedQuestions,
            questions,
            count: questions.length,
        });
    } catch (error) {
        console.error("Error fetching test questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/online-tests/[id]/questions - Thêm câu hỏi vào bài kiểm tra
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

        // Lấy dữ liệu câu hỏi
        const questionData = await request.json();

        // Kiểm tra dữ liệu
        if (
            !questionData.content ||
            !questionData.type ||
            !questionData.sectionType
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Thêm câu hỏi mới
        const newQuestion = await prisma.testQuestion.create({
            data: {
                testId,
                content: questionData.content,
                type: questionData.type,
                options: questionData.options || [],
                correctAnswer: questionData.correctAnswer || "",
                part: questionData.part || 1,
                sectionType: questionData.sectionType,
                explanation: questionData.explanation || "",
                audioUrl: questionData.audioUrl || null,
                imageUrl: questionData.imageUrl || null,
                order: questionData.order || 0,
                groupId: questionData.groupId || questionData.part || 1,
            },
        });

        return NextResponse.json(newQuestion, { status: 201 });
    } catch (error) {
        console.error("Error adding test question:", error);
        return NextResponse.json(
            { error: "Failed to add question" },
            { status: 500 }
        );
    }
}
