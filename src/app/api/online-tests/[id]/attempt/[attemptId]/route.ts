import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/online-tests/[id]/attempt/[attemptId] - Lấy thông tin một lần thử bài kiểm tra
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; attemptId: string } }
) {
    try {
        const testId = parseInt(params.id);
        const attemptId = parseInt(params.attemptId);

        if (isNaN(testId) || isNaN(attemptId)) {
            return NextResponse.json(
                { error: "Invalid ID format" },
                { status: 400 }
            );
        }

        // Tìm thông tin về bài kiểm tra
        const test = await prisma.onlineTest.findUnique({
            where: { id: testId },
            select: {
                id: true,
                title: true,
                description: true,
                instructions: true,
                testType: true,
                difficulty: true,
                duration: true,
                sections: true,
                isPublished: true,
            },
        });

        if (!test) {
            return NextResponse.json(
                { error: "Test not found" },
                { status: 404 }
            );
        }

        if (!test.isPublished) {
            return NextResponse.json(
                { error: "Test is not published yet" },
                { status: 403 }
            );
        }

        // Tìm thông tin về lần thử
        const attempt = await prisma.testAttempt.findUnique({
            where: {
                id: attemptId,
                testId: testId,
            },
            include: {
                answers: true,
            },
        });

        if (!attempt) {
            return NextResponse.json(
                { error: "Test attempt not found" },
                { status: 404 }
            );
        }

        // Lấy danh sách câu hỏi cho bài kiểm tra này
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
            test,
            attempt,
            questions: {
                grouped: groupedQuestions,
                list: questions,
                count: questions.length,
            },
        });
    } catch (error) {
        console.error("Error fetching test attempt:", error);
        return NextResponse.json(
            { error: "Failed to fetch test attempt" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/online-tests/[id]/attempt/[attemptId] - Cập nhật thông tin lần thử (thêm câu trả lời, kết thúc bài)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string; attemptId: string } }
) {
    try {
        const testId = parseInt(params.id);
        const attemptId = parseInt(params.attemptId);

        if (isNaN(testId) || isNaN(attemptId)) {
            return NextResponse.json(
                { error: "Invalid ID format" },
                { status: 400 }
            );
        }

        // Lấy dữ liệu cập nhật
        const updateData = await request.json();

        // Tìm thông tin về lần thử
        const attempt = await prisma.testAttempt.findUnique({
            where: {
                id: attemptId,
                testId: testId,
            },
        });

        if (!attempt) {
            return NextResponse.json(
                { error: "Test attempt not found" },
                { status: 404 }
            );
        }

        // Cập nhật thông tin
        if (updateData.completed) {
            // Nếu kết thúc bài kiểm tra, cập nhật thời gian kết thúc và trạng thái
            const updatedAttempt = await prisma.testAttempt.update({
                where: { id: attemptId },
                data: {
                    endTime: new Date(),
                    completed: true,
                    score: updateData.score || 0,
                    sectionScores: updateData.sectionScores || {},
                    feedback: updateData.feedback || "",
                },
            });

            return NextResponse.json(updatedAttempt);
        } else if (updateData.answers && Array.isArray(updateData.answers)) {
            // Thêm hoặc cập nhật câu trả lời
            for (const answer of updateData.answers) {
                if (!answer.questionId) continue;

                // Tìm xem câu trả lời này đã tồn tại chưa
                const existingAnswer = await prisma.testAnswer.findFirst({
                    where: {
                        attemptId,
                        questionId: answer.questionId,
                    },
                });

                if (existingAnswer) {
                    // Cập nhật câu trả lời
                    await prisma.testAnswer.update({
                        where: { id: existingAnswer.id },
                        data: {
                            answer: answer.answer,
                            isCorrect: answer.isCorrect,
                        },
                    });
                } else {
                    // Tạo câu trả lời mới
                    await prisma.testAnswer.create({
                        data: {
                            attemptId,
                            questionId: answer.questionId,
                            answer: answer.answer,
                            isCorrect: answer.isCorrect || false,
                        },
                    });
                }
            }

            // Trả về danh sách câu trả lời đã cập nhật
            const updatedAnswers = await prisma.testAnswer.findMany({
                where: { attemptId },
            });

            return NextResponse.json({
                success: true,
                answersCount: updatedAnswers.length,
            });
        }

        return NextResponse.json(
            { error: "Invalid update data" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error updating test attempt:", error);
        return NextResponse.json(
            { error: "Failed to update test attempt" },
            { status: 500 }
        );
    }
}
