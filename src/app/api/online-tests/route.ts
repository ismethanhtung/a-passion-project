import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/online-tests - Lấy danh sách bài kiểm tra
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const testType = searchParams.get("testType");
        const difficulty = searchParams.get("difficulty");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "popular";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        // Build filter
        const where: any = {
            isPublished: true,
        };

        if (testType && testType !== "All") {
            where.testType = testType;
        }

        if (difficulty) {
            where.difficulty = difficulty;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } },
            ];
        }

        // Build sorting
        let orderBy: any = {};
        switch (sort) {
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "popularity":
                orderBy = { popularity: "desc" };
                break;
            case "completion":
                orderBy = { completionRate: "desc" };
                break;
            default:
                orderBy = { popularity: "desc" };
        }

        // Query tests
        const tests = await prisma.onlineTest.findMany({
            where,
            orderBy,
            skip,
            take: limit,
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

        // Get total count for pagination
        const totalCount = await prisma.onlineTest.count({ where });

        return NextResponse.json({
            tests,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching tests:", error);
        return NextResponse.json(
            { error: "Failed to fetch tests" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/online-tests - Tạo bài kiểm tra mới
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        // const session = await getServerSession(authOptions);
        // if (!session?.user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // Get user ID from session
        // const userId = session.user.id;

        // Parse request body
        const body = await request.json();
        const {
            title,
            description,
            instructions,
            testType,
            difficulty,
            duration,
            tags,
            sections,
            thumbnail,
            isAIGenerated,
        } = body;

        // Validate required fields
        if (!title || !description || !testType || !difficulty || !duration) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new test
        const newTest = await prisma.onlineTest.create({
            data: {
                title,
                description,
                instructions: instructions || "",
                testType,
                difficulty,
                duration,
                tags: tags || "",
                sections: sections || {},
                thumbnail,
                isAIGenerated: isAIGenerated || false,
                isPublished: false,
                creatorId: 1,
            },
        });

        return NextResponse.json(newTest, { status: 201 });
    } catch (error) {
        console.error("Error creating test:", error);
        return NextResponse.json(
            { error: "Failed to create test" },
            { status: 500 }
        );
    }
}
