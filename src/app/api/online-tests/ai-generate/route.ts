import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// PrismaClient singleton implementation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface TestConfig {
    title: string;
    description: string;
    instructions: string;
    duration: number;
    sections: Record<string, any>;
    tags: string[];
}

/**
 * POST /api/online-tests/ai-generate - Tạo bài kiểm tra sử dụng AI
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication - tạm thời comment lại
        // const session = await getServerSession(authOptions);
        // if (!session?.user) {
        //   return NextResponse.json(
        //     { error: "Unauthorized" },
        //     { status: 401 }
        //   );
        // }

        // Get user ID from session
        // const userId = session.user.id;
        const userId = 1; // Tạm thời hardcode userId

        // Parse request body
        const body = await request.json();
        const {
            testType, // TOEIC, IELTS
            difficulty, // Beginner, Intermediate, Advanced, Expert
            isFullTest, // true for full test, false for mini test
            specificSections, // array of sections to include (optional)
            specificTopics, // specific topics to focus on (optional)
        } = body;

        // Validate required fields
        if (!testType || !difficulty) {
            return NextResponse.json(
                {
                    error: "Missing required fields: testType and difficulty are required",
                },
                { status: 400 }
            );
        }

        // Validate test type
        if (!["TOEIC", "IELTS"].includes(testType)) {
            return NextResponse.json(
                { error: "Invalid test type. Must be TOEIC or IELTS" },
                { status: 400 }
            );
        }

        // Validate difficulty
        if (
            !["Beginner", "Intermediate", "Advanced", "Expert"].includes(
                difficulty
            )
        ) {
            return NextResponse.json(
                {
                    error: "Invalid difficulty. Must be Beginner, Intermediate, Advanced, or Expert",
                },
                { status: 400 }
            );
        }

        // Configurations based on test type and full/mini test
        let testConfig: TestConfig = {
            title: "",
            description: "",
            instructions: "",
            duration: 0,
            sections: {},
            tags: [],
        };

        // Configure based on test type
        if (testType === "TOEIC") {
            if (isFullTest) {
                testConfig = {
                    title: `TOEIC Full Test (${difficulty})`,
                    description: `Bài thi TOEIC đầy đủ với cấu trúc và độ khó ${difficulty.toLowerCase()}.`,
                    instructions:
                        "Bài thi gồm hai phần: Listening (100 câu hỏi) và Reading (100 câu hỏi). Thời gian làm bài: 120 phút.",
                    duration: 120,
                    sections: {
                        listening: { parts: 4, questions: 100 },
                        reading: { parts: 3, questions: 100 },
                    },
                    tags: ["TOEIC", "Full Test", difficulty],
                };
            } else {
                // Mini test configuration
                const includedSections = specificSections || ["listening"];
                testConfig = {
                    title: `TOEIC Mini Test - ${includedSections
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(" & ")} (${difficulty})`,
                    description: `Bài thi TOEIC tập trung vào phần ${includedSections.join(
                        " và "
                    )} với độ khó ${difficulty.toLowerCase()}.`,
                    instructions: `Bài thi tập trung vào ${includedSections.length} phần với thời gian tương ứng.`,
                    duration:
                        includedSections.includes("listening") &&
                        includedSections.includes("reading")
                            ? 90
                            : 45,
                    sections: {},
                    tags: [
                        "TOEIC",
                        "Mini Test",
                        difficulty,
                        ...includedSections,
                    ],
                };

                // Add sections
                if (includedSections.includes("listening")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        listening: { parts: 4, questions: 50 },
                    };
                }
                if (includedSections.includes("reading")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        reading: { parts: 3, questions: 50 },
                    };
                }
            }
        } else if (testType === "IELTS") {
            if (isFullTest) {
                testConfig = {
                    title: `IELTS Full Test (${difficulty})`,
                    description: `Bài thi IELTS đầy đủ với cấu trúc và độ khó ${difficulty.toLowerCase()}.`,
                    instructions:
                        "Bài thi gồm bốn phần: Listening, Reading, Writing, và Speaking. Thời gian làm bài: 165 phút (không bao gồm phần Speaking).",
                    duration: 165,
                    sections: {
                        listening: { parts: 4, questions: 40 },
                        reading: { parts: 3, questions: 40 },
                        writing: { parts: 2, questions: 2 },
                        speaking: { parts: 3, questions: 3 },
                    },
                    tags: ["IELTS", "Full Test", difficulty],
                };
            } else {
                // Mini test configuration
                const includedSections = specificSections || ["reading"];
                testConfig = {
                    title: `IELTS Mini Test - ${includedSections
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(" & ")} (${difficulty})`,
                    description: `Bài thi IELTS tập trung vào phần ${includedSections.join(
                        " và "
                    )} với độ khó ${difficulty.toLowerCase()}.`,
                    instructions: `Bài thi tập trung vào ${includedSections.length} phần với thời gian tương ứng.`,
                    duration: calculateIELTSMiniTestDuration(includedSections),
                    sections: {},
                    tags: [
                        "IELTS",
                        "Mini Test",
                        difficulty,
                        ...includedSections,
                    ],
                };

                // Add sections
                if (includedSections.includes("listening")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        listening: { parts: 4, questions: 20 },
                    };
                }
                if (includedSections.includes("reading")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        reading: { parts: 3, questions: 20 },
                    };
                }
                if (includedSections.includes("writing")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        writing: { parts: 1, questions: 1 },
                    };
                }
                if (includedSections.includes("speaking")) {
                    testConfig.sections = {
                        ...testConfig.sections,
                        speaking: { parts: 2, questions: 2 },
                    };
                }
            }
        }

        // Add any specific topics to the title and description if provided
        if (specificTopics && specificTopics.length > 0) {
            const topicsStr = specificTopics.join(", ");
            testConfig.title += ` - ${topicsStr}`;
            testConfig.description += ` Chủ đề: ${topicsStr}.`;
            testConfig.tags = [...testConfig.tags, ...specificTopics];
        }

        try {
            // Generate test content with AI
            console.log("Generating test content with AI...");
            const testContent = await generateTestWithAI(
                testType,
                difficulty,
                testConfig.sections,
                specificTopics
            );

            // Create test in database
            console.log("Creating test in database...");
            const newTest = await prisma.onlineTest.create({
                data: {
                    title: testConfig.title,
                    description: testConfig.description,
                    instructions: testConfig.instructions,
                    testType,
                    difficulty,
                    duration: testConfig.duration,
                    tags: testConfig.tags.join(", "),
                    sections: testConfig.sections,
                    isAIGenerated: true,
                    isPublished: true, // Xuất bản ngay lập tức vì đã có đủ câu hỏi
                    creatorId: userId,
                    popularity: 0,
                    completionRate: 0,
                },
            });

            // Create questions for the test
            console.log("Creating questions for test...");
            await createQuestionsFromAIResponse(newTest.id, testContent);

            return NextResponse.json(
                {
                    id: newTest.id,
                    title: newTest.title,
                    message: "Test generated successfully",
                },
                { status: 201 }
            );
        } catch (aiError: any) {
            console.error("Error creating AI-generated test:", aiError);

            // Xử lý trường hợp lỗi - tạo một bài kiểm tra mẫu nếu AI thất bại
            return NextResponse.json(
                {
                    error: "Failed to generate test with AI. Please try again later.",
                    message: aiError.message || "Unknown error",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * Helper function to calculate IELTS mini test duration
 */
function calculateIELTSMiniTestDuration(sections: string[]): number {
    let duration = 0;
    if (sections.includes("listening")) duration += 30;
    if (sections.includes("reading")) duration += 60;
    if (sections.includes("writing")) duration += 45;
    if (sections.includes("speaking")) duration += 15;
    return duration;
}

/**
 * Generate test content using Groq API
 */
async function generateTestWithAI(
    testType: string,
    difficulty: string,
    sections: any,
    topics?: string[]
): Promise<any> {
    try {
        // Xây dựng prompt cho Groq API
        const systemPrompt = createSystemPrompt(testType);
        const userPrompt = createUserPrompt(
            testType,
            difficulty,
            sections,
            topics
        );

        // Lấy API key
        const groqApiKey =
            process.env.GROQ_API_KEY ||
            "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";

        console.log("Calling Groq API with prompt...");

        // Gọi Groq API
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192", // Sử dụng model với ngữ cảnh dài hơn
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.3,
                    max_tokens: 8000, // Tăng max_tokens để có thể tạo nhiều nội dung hơn
                    response_format: { type: "json_object" }, // Yêu cầu trả về JSON
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API error response:", errorText);
            throw new Error(`Groq API error: ${response.statusText}`);
        }

        const result = await response.json();
        const content = result.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from Groq");
        }

        console.log("Received response from Groq API");

        // Parse JSON response
        try {
            // Kiểm tra nếu content đã là một đối tượng
            if (typeof content === "object") {
                return content;
            }

            // Loại bỏ các ký tự ```json và ``` nếu có
            let jsonString = content.trim();
            if (jsonString.startsWith("```json")) {
                jsonString = jsonString.substring(7);
            } else if (jsonString.startsWith("```")) {
                jsonString = jsonString.substring(3);
            }

            if (jsonString.endsWith("```")) {
                jsonString = jsonString
                    .substring(0, jsonString.length - 3)
                    .trim();
            }

            // Cố gắng phân tích chuỗi JSON
            console.log("Parsing JSON response...");
            const parsedResponse = JSON.parse(jsonString);

            // Xác thực định dạng bài kiểm tra
            validateTestFormat(parsedResponse, testType);

            // Nếu quá ít câu hỏi, trả về lỗi
            const questionCount = countQuestionsInResponse(parsedResponse);
            if (questionCount < 5) {
                console.error(
                    `Generated test has too few questions: ${questionCount}`
                );
                throw new Error(
                    "Not enough questions generated. Please try again."
                );
            }

            console.log(
                `Successfully parsed response with ${questionCount} questions`
            );
            return parsedResponse;
        } catch (parseError) {
            console.error("Failed to parse Groq response as JSON:", parseError);
            console.log(
                "Raw response first 500 chars:",
                content.substring(0, 500) + "..."
            );

            // Thử trích xuất JSON từ phản hồi nếu có nhiều nội dung hơn
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const extractedJson = jsonMatch[0];
                    console.log(
                        "Extracted JSON pattern, attempting to parse..."
                    );
                    const parsedJson = JSON.parse(extractedJson);

                    // Xác thực định dạng bài kiểm tra
                    validateTestFormat(parsedJson, testType);

                    // Nếu quá ít câu hỏi, trả về lỗi
                    const questionCount = countQuestionsInResponse(parsedJson);
                    if (questionCount < 5) {
                        console.error(
                            `Generated test has too few questions: ${questionCount}`
                        );
                        throw new Error(
                            "Not enough questions generated. Please try again."
                        );
                    }

                    console.log(
                        `Successfully parsed extracted JSON with ${questionCount} questions`
                    );
                    return parsedJson;
                } catch (extractError) {
                    console.error("Failed to extract JSON:", extractError);
                }
            }

            // Tạo bài kiểm tra mẫu nếu không thể parse
            console.log("Falling back to sample test template...");
            return createSampleTest(testType, difficulty, sections, topics);
        }
    } catch (error) {
        console.error("Error generating test with AI:", error);
        throw error;
    }
}

/**
 * Đếm số câu hỏi trong phản hồi AI
 */
function countQuestionsInResponse(response: any): number {
    if (!response || !response.sections) {
        return 0;
    }

    let totalQuestions = 0;

    // Đếm tất cả câu hỏi trong tất cả các phần
    Object.values(response.sections).forEach((section: any) => {
        if (section.parts && Array.isArray(section.parts)) {
            section.parts.forEach((part: any) => {
                if (part.questions && Array.isArray(part.questions)) {
                    totalQuestions += part.questions.length;
                }
            });
        }
    });

    return totalQuestions;
}

/**
 * Tạo bài kiểm tra mẫu trong trường hợp AI không thể tạo
 */
function createSampleTest(
    testType: string,
    difficulty: string,
    sections: any,
    topics?: string[]
): any {
    console.log("Creating sample test for", testType, difficulty);

    const result: any = {
        sections: {},
    };

    // Tạo mẫu dựa trên loại bài kiểm tra
    if (testType === "TOEIC") {
        // Tạo phần Listening nếu được yêu cầu
        if (sections.listening) {
            result.sections.listening = {
                parts: [
                    {
                        part: 1,
                        instructions:
                            "Look at the picture and select the statement that best describes what you see.",
                        questions: [],
                    },
                    {
                        part: 2,
                        instructions:
                            "Listen to the question and select the best response.",
                        questions: [],
                    },
                ],
            };

            // Thêm câu hỏi mẫu cho Listening Part 1
            for (let i = 1; i <= 5; i++) {
                result.sections.listening.parts[0].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample Photograph Question ${i}`,
                    options: [
                        "A. Option A",
                        "B. Option B",
                        "C. Option C",
                        "D. Option D",
                    ],
                    correctAnswer: "A",
                    audioScript:
                        "This is sample audio transcript for the question.",
                    explanation: "Sample explanation for the correct answer.",
                });
            }

            // Thêm câu hỏi mẫu cho Listening Part 2
            for (let i = 6; i <= 10; i++) {
                result.sections.listening.parts[1].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample Question-Response ${i}`,
                    options: ["A. Option A", "B. Option B", "C. Option C"],
                    correctAnswer: "B",
                    audioScript:
                        "This is sample audio transcript for the question.",
                    explanation: "Sample explanation for the correct answer.",
                });
            }
        }

        // Tạo phần Reading nếu được yêu cầu
        if (sections.reading) {
            result.sections.reading = {
                parts: [
                    {
                        part: 5,
                        instructions:
                            "Select the word that best completes the sentence.",
                        questions: [],
                    },
                    {
                        part: 6,
                        instructions:
                            "Select the word or phrase that best completes the passage.",
                        questions: [],
                    },
                ],
            };

            // Thêm câu hỏi mẫu cho Reading Part 5
            for (let i = 101; i <= 110; i++) {
                result.sections.reading.parts[0].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample Incomplete Sentence ${i}: The company's profits _____ by 15% last quarter.`,
                    options: [
                        "A. increase",
                        "B. increased",
                        "C. increasing",
                        "D. increases",
                    ],
                    correctAnswer: "B",
                    explanation: "Sample explanation for the correct answer.",
                });
            }

            // Thêm câu hỏi mẫu cho Reading Part 6
            for (let i = 131; i <= 135; i++) {
                result.sections.reading.parts[1].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample Text Completion ${i}`,
                    options: [
                        "A. Option A",
                        "B. Option B",
                        "C. Option C",
                        "D. Option D",
                    ],
                    correctAnswer: "C",
                    explanation: "Sample explanation for the correct answer.",
                });
            }
        }
    } else if (testType === "IELTS") {
        // Tạo phần Listening nếu được yêu cầu
        if (sections.listening) {
            result.sections.listening = {
                parts: [
                    {
                        part: 1,
                        instructions:
                            "Listen to a conversation between two people in an everyday social context.",
                        questions: [],
                    },
                    {
                        part: 2,
                        instructions:
                            "Listen to a monologue in an everyday social context.",
                        questions: [],
                    },
                ],
            };

            // Thêm câu hỏi mẫu cho Listening Part 1
            for (let i = 1; i <= 5; i++) {
                result.sections.listening.parts[0].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample IELTS Listening Question ${i}`,
                    options: ["A. Option A", "B. Option B", "C. Option C"],
                    correctAnswer: "A",
                    audioScript:
                        "This is sample audio transcript for an IELTS listening question.",
                    explanation: "Sample explanation for the correct answer.",
                });
            }

            // Thêm câu hỏi mẫu cho Listening Part 2
            for (let i = 11; i <= 15; i++) {
                result.sections.listening.parts[1].questions.push({
                    id: i,
                    type: "fill",
                    text: `Complete the notes: The speaker mentions that the museum opens at _____.`,
                    correctAnswer: "9:30 AM",
                    audioScript:
                        "This is sample audio transcript for an IELTS listening question.",
                    explanation: "Sample explanation for the correct answer.",
                });
            }
        }

        // Tạo phần Reading nếu được yêu cầu
        if (sections.reading) {
            result.sections.reading = {
                parts: [
                    {
                        part: 1,
                        instructions:
                            "Read the passage and answer the questions.",
                        questions: [],
                    },
                ],
            };

            // Thêm passage
            result.sections.reading.parts[0].passage =
                "This is a sample academic reading passage for IELTS. It would typically be several paragraphs long and discuss an academic topic.";

            // Thêm câu hỏi mẫu cho Reading
            for (let i = 1; i <= 10; i++) {
                result.sections.reading.parts[0].questions.push({
                    id: i,
                    type: "single",
                    text: `Sample IELTS Reading Question ${i}`,
                    options: [
                        "A. Option A",
                        "B. Option B",
                        "C. Option C",
                        "D. Option D",
                    ],
                    correctAnswer: "B",
                    explanation: "Sample explanation for the correct answer.",
                });
            }
        }

        // Tạo phần Writing nếu được yêu cầu
        if (sections.writing) {
            result.sections.writing = {
                parts: [
                    {
                        part: 1,
                        instructions:
                            "Task 1: The graph below shows information about...",
                        questions: [
                            {
                                id: 1,
                                type: "essay",
                                text: "Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
                                correctAnswer: null,
                                explanation:
                                    "You should write at least 150 words and spend about 20 minutes on this task.",
                            },
                        ],
                    },
                    {
                        part: 2,
                        instructions:
                            "Task 2: Write an essay on the following topic.",
                        questions: [
                            {
                                id: 2,
                                type: "essay",
                                text: "Some people believe that technology has made our lives too complicated. To what extent do you agree or disagree?",
                                correctAnswer: null,
                                explanation:
                                    "You should write at least 250 words and spend about 40 minutes on this task.",
                            },
                        ],
                    },
                ],
            };
        }

        // Tạo phần Speaking nếu được yêu cầu
        if (sections.speaking) {
            result.sections.speaking = {
                parts: [
                    {
                        part: 1,
                        instructions:
                            "The examiner will ask you general questions about yourself.",
                        questions: [
                            {
                                id: 1,
                                type: "speaking",
                                text: "Tell me about where you live.",
                                options: [
                                    "Talk about your home",
                                    "Describe your neighborhood",
                                    "Mention what you like/dislike about it",
                                ],
                                correctAnswer: null,
                                explanation:
                                    "You should speak for 1-2 minutes about this topic.",
                            },
                        ],
                    },
                ],
            };
        }
    }

    return result;
}

/**
 * Xác thực định dạng bài kiểm tra trả về từ AI
 */
function validateTestFormat(testData: any, testType: string): void {
    if (!testData.sections) {
        throw new Error("Invalid test format: missing sections object");
    }

    // Kiểm tra các phần cần thiết cho từng loại bài thi
    if (testType === "TOEIC") {
        // Kiểm tra định dạng TOEIC
        if (
            testData.sections.listening &&
            !Array.isArray(testData.sections.listening.parts)
        ) {
            throw new Error(
                "Invalid TOEIC test format: missing listening parts array"
            );
        }

        if (
            testData.sections.reading &&
            !Array.isArray(testData.sections.reading.parts)
        ) {
            throw new Error(
                "Invalid TOEIC test format: missing reading parts array"
            );
        }
    } else if (testType === "IELTS") {
        // Kiểm tra định dạng IELTS
        const sections = ["listening", "reading", "writing", "speaking"];

        for (const section of sections) {
            if (
                testData.sections[section] &&
                !Array.isArray(testData.sections[section].parts)
            ) {
                throw new Error(
                    `Invalid IELTS test format: missing ${section} parts array`
                );
            }
        }
    }
}

/**
 * Create system prompt for AI
 */
function createSystemPrompt(testType: string): string {
    if (testType === "TOEIC") {
        return `You are an expert in creating TOEIC test content. 
    Your task is to generate authentic TOEIC test questions following the official ETS TOEIC test format.
    Your output must be a valid JSON object with the sections and parts as described below.
    
    TOEIC test structure:
    - Listening: 
      - Part 1: Photographs (questions 1-6) - Look at a photograph and select the statement that best describes it
      - Part 2: Question-Response (questions 7-31) - Listen to a question and select the best response
      - Part 3: Conversations (questions 32-70) - Listen to a conversation and answer questions
      - Part 4: Talks (questions 71-100) - Listen to a talk and answer questions
    - Reading:
      - Part 5: Incomplete Sentences (questions 101-130) - Select the word that best completes the sentence
      - Part 6: Text Completion (questions 131-146) - Select the word that best completes the passage
      - Part 7: Reading Comprehension (questions 147-200) - Read a passage and answer questions
    
    Make sure all content is appropriate for professional testing and follows real TOEIC patterns.
    
    IMPORTANT: For each section, each part MUST be structured properly with questions having: id, type, text, options (array), correctAnswer, and explanation.
    For listening sections, also include 'audioScript' that represents what would be heard.
    
    IMPORTANT: Try to create as many questions as possible, at least 10-15 questions per part. The more complete the test, the better.
    Make sure your response remains a valid JSON object throughout, and every question should have a unique ID and meaningful content.`;
    } else {
        return `You are an expert in creating IELTS test content.
    Your task is to generate authentic IELTS test questions following the official format for IELTS Academic tests.
    Your output must be a valid JSON object with the sections and parts as described below.
    
    IELTS test structure:
    - Listening: 4 sections, 40 questions total
      - Section 1: A conversation between two people in an everyday social context
      - Section 2: A monologue in an everyday social context
      - Section 3: A conversation between up to four people in an educational or training context
      - Section 4: A monologue on an academic subject
    - Reading: 3 passages, 40 questions total
      - Academic texts from books, journals, magazines, and newspapers
      - Question types: multiple choice, identifying information, matching, sentence completion, etc.
    - Writing: 2 tasks
      - Task 1: Describe visual information (graph, table, chart, diagram)
      - Task 2: Write an essay in response to a point of view, argument or problem
    - Speaking: 3 parts
      - Part 1: Introduction and interview
      - Part 2: Long turn (speak for 1-2 minutes on a given topic)
      - Part 3: Discussion related to Part 2
    
    Make sure all content is appropriate for academic testing and follows real IELTS patterns.
    
    IMPORTANT: For each section, each part MUST be structured properly with questions having: id, type, text, options (array for multiple choice), correctAnswer, and explanation.
    For listening sections, also include 'audioScript' that represents what would be heard.
    For writing sections, include a detailed task description and assessment criteria.
    For speaking sections, include specific questions and prompts.
    
    IMPORTANT: Try to create as many questions as possible for each section, at least 10-15 questions per part. The more complete the test, the better.
    Make sure your response remains a valid JSON object throughout, and every question should have a unique ID and meaningful content.`;
    }
}

/**
 * Create user prompt for AI based on test requirements
 */
function createUserPrompt(
    testType: string,
    difficulty: string,
    sections: any,
    topics?: string[]
): string {
    let prompt = `Generate a ${difficulty.toLowerCase()} level ${testType} `;

    if (Object.keys(sections).length === 0) {
        prompt += "practice test";
    } else {
        prompt += `test with the following sections: ${Object.keys(
            sections
        ).join(", ")}`;
    }

    if (topics && topics.length > 0) {
        prompt += ` focusing on the topics: ${topics.join(", ")}`;
    }

    if (testType === "TOEIC") {
        prompt += `\n\nFor each section, generate realistic questions following the TOEIC format:`;

        if (sections.listening) {
            prompt += `
      \n- Listening (${sections.listening.questions} questions):
        - Part 1: Photographs with descriptions (6 questions)
        - Part 2: Question-Response pairs (25 questions)
        - Part 3: Conversations with questions (39 questions)
        - Part 4: Talks with questions (30 questions)`;
        }

        if (sections.reading) {
            prompt += `
      \n- Reading (${sections.reading.questions} questions):
        - Part 5: Incomplete Sentences (30 questions)
        - Part 6: Text Completion (16 questions)
        - Part 7: Reading Comprehension passages with questions (54 questions)`;
        }
    } else {
        prompt += `\n\nFor each section, generate realistic questions following the IELTS format:`;

        if (sections.listening) {
            prompt += `
      \n- Listening (${sections.listening.questions} questions total):
        - Part 1: Conversation in everyday social context (10 questions)
        - Part 2: Monologue in everyday social context (10 questions)
        - Part 3: Conversation in educational context (10 questions)
        - Part 4: Academic monologue (10 questions)
        - Provide transcript text that would be the audio content`;
        }

        if (sections.reading) {
            prompt += `
      \n- Reading (${sections.reading.questions} questions total):
        - 3 academic passages with various question types
        - Include detailed passages and appropriate questions`;
        }

        if (sections.writing) {
            prompt += `
      \n- Writing (${sections.writing.questions} tasks):
        - Task 1: Visual information description (provide description of a chart/graph)
        - Task 2: Essay topic on an academic subject`;
        }

        if (sections.speaking) {
            prompt += `
      \n- Speaking (${sections.speaking.questions} parts):
        - Part 1: Introduction questions about familiar topics
        - Part 2: Long turn topics with preparation time
        - Part 3: Discussion questions related to Part 2 topic`;
        }
    }

    prompt += `\n\nReturn ONLY a valid JSON object with the following structure:
{
  "sections": {
    "listening": {
      "parts": [
        {
          "part": 1,
          "instructions": "string",
          "questions": [
            {
              "id": 1,
              "type": "single", // single, multiple, fill, etc.
              "text": "question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "audioScript": "text that would be in the audio file",
              "explanation": "explanation of the answer"
            }
          ]
        }
      ]
    },
    "reading": {
      "parts": [
        {
          "part": 5,
          "instructions": "string",
          "questions": [
            {
              "id": 101,
              "type": "single",
              "text": "question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "explanation": "explanation of the answer"
            }
          ]
        }
      ]
    }`;

    if (testType === "IELTS") {
        prompt += `,
    "writing": {
      "parts": [
        {
          "part": 1,
          "instructions": "string",
          "questions": [
            {
              "id": 1,
              "type": "essay",
              "text": "task description",
              "correctAnswer": null,
              "explanation": "assessment criteria"
            }
          ]
        }
      ]
    },
    "speaking": {
      "parts": [
        {
          "part": 1,
          "instructions": "string",
          "questions": [
            {
              "id": 1,
              "type": "oral",
              "text": "interview question",
              "options": ["example answers"],
              "correctAnswer": null,
              "explanation": "assessment criteria"
            }
          ]
        }
      ]
    }`;
    }

    prompt += `
  }
}
  
Make sure:
1. The difficulty level (${difficulty}) is appropriate throughout all questions and content
2. All JSON is properly formatted with no syntax errors
3. All questions have appropriate structure based on their type
4. The generated content follows the official ${testType} test structure exactly`;

    return prompt;
}

/**
 * Create test questions in database from AI response
 */
async function createQuestionsFromAIResponse(
    testId: number,
    aiResponse: any
): Promise<void> {
    try {
        const { sections } = aiResponse;
        const questionsToCreate: Array<{
            testId: number;
            content: string;
            type: string;
            options: any[];
            correctAnswer: any;
            part: number;
            sectionType: string;
            explanation: string;
            audioUrl: string | null;
            order: number;
            groupId: number;
        }> = [];

        // Kiểm tra các section và chuẩn hóa dữ liệu
        for (const [sectionType, sectionDataRaw] of Object.entries(sections)) {
            const sectionData = sectionDataRaw as any;
            // Kiểm tra sectionData có parts hay không
            if (!sectionData || !Array.isArray(sectionData.parts)) {
                console.warn(`Section ${sectionType} has no valid parts array`);
                continue;
            }

            console.log(
                `Processing ${sectionType} section with ${sectionData.parts.length} parts`
            );

            // Process each part in the section
            for (const part of sectionData.parts) {
                // Kiểm tra xem part có questions array không
                if (!part || !Array.isArray(part.questions)) {
                    console.warn(
                        `Part ${
                            part?.part || "unknown"
                        } in ${sectionType} has no valid questions array`
                    );
                    continue;
                }

                const partNumber = part.part || 0;
                const partInstructions = part.instructions || "";
                const groupId = part.groupId || partNumber;

                console.log(
                    `Processing ${sectionType} part ${partNumber} with ${part.questions.length} questions`
                );

                // Chuẩn hóa câu hỏi theo loại bài thi
                for (const question of part.questions) {
                    // Kiểm tra các trường bắt buộc
                    if (!question.text) {
                        console.warn(
                            `Question missing text in ${sectionType} part ${partNumber}`
                        );
                        continue;
                    }

                    try {
                        // Chuẩn hóa dữ liệu theo loại câu hỏi và section
                        const questionType = standardizeQuestionType(
                            question.type,
                            sectionType
                        );
                        let options = Array.isArray(question.options)
                            ? question.options
                            : [];
                        let correctAnswer = question.correctAnswer || "";

                        // Đảm bảo options có đủ cho câu hỏi lựa chọn
                        if (questionType === "single" && options.length < 2) {
                            // Tạo options mặc định nếu thiếu
                            options = ["A", "B", "C", "D"].slice(
                                0,
                                Math.max(options.length, 4)
                            );
                        }

                        // Đảm bảo correctAnswer hợp lệ đối với câu hỏi lựa chọn
                        if (
                            (questionType === "single" ||
                                questionType === "multiple") &&
                            (!correctAnswer ||
                                (Array.isArray(options) &&
                                    !options.includes(correctAnswer)))
                        ) {
                            // Nếu đáp án không hợp lệ, lấy phần tử đầu tiên làm đáp án
                            correctAnswer =
                                Array.isArray(options) && options.length > 0
                                    ? options[0]
                                    : "A";
                        }

                        // Tạo câu hỏi chuẩn hóa
                        questionsToCreate.push({
                            testId,
                            content: question.text,
                            type: questionType,
                            options: options,
                            correctAnswer: correctAnswer,
                            part: partNumber,
                            sectionType,
                            explanation: question.explanation || "",
                            audioUrl: question.audioScript ? null : null, // Would generate audio from script
                            order: question.id || questionsToCreate.length + 1,
                            groupId: groupId,
                        });
                    } catch (qError) {
                        console.error("Error processing question:", qError);
                        // Tiếp tục với câu hỏi tiếp theo nếu có lỗi
                    }
                }
            }
        }

        // Nếu không có câu hỏi nào, ném lỗi
        if (questionsToCreate.length === 0) {
            console.log("Không có câu hỏi nào được tạo, tạo câu hỏi mẫu...");
            // Thay vì ném lỗi, tạo câu hỏi mẫu
            const testTypeForSample = aiResponse.testType || "TOEIC";
            const difficultyForSample = aiResponse.difficulty || "Intermediate";
            const sampleQuestions = createSampleQuestions(
                testId,
                testTypeForSample,
                difficultyForSample
            );
            if (sampleQuestions.length > 0) {
                questionsToCreate.push(...sampleQuestions);
            } else {
                throw new Error("No valid questions found in AI response");
            }
        }

        // Đảm bảo có ít nhất 5 câu hỏi
        if (questionsToCreate.length < 5) {
            console.log(
                `Chỉ có ${questionsToCreate.length} câu hỏi, bổ sung thêm câu hỏi mẫu...`
            );
            const testTypeForSample = aiResponse.testType || "TOEIC";
            const difficultyForSample = aiResponse.difficulty || "Intermediate";
            const additionalQuestions = createSampleQuestions(
                testId,
                testTypeForSample,
                difficultyForSample,
                5 - questionsToCreate.length
            );
            questionsToCreate.push(...additionalQuestions);
        }

        // Create all questions in batch
        if (questionsToCreate.length > 0) {
            // Log để debug
            console.log(
                `Creating ${questionsToCreate.length} questions for test ${testId}`
            );

            // Tạo các câu hỏi theo lô nhỏ để tránh lỗi kích thước quá lớn
            const BATCH_SIZE = 50;
            for (let i = 0; i < questionsToCreate.length; i += BATCH_SIZE) {
                const batch = questionsToCreate.slice(i, i + BATCH_SIZE);
                console.log(
                    `Creating batch ${i / BATCH_SIZE + 1} with ${
                        batch.length
                    } questions`
                );

                await prisma.testQuestion.createMany({
                    data: batch,
                });
            }

            // Cập nhật test để đánh dấu là đã xuất bản
            await prisma.onlineTest.update({
                where: { id: testId },
                data: {
                    isPublished: true,
                    updatedAt: new Date(),
                },
            });

            console.log(
                `Successfully created all ${questionsToCreate.length} questions for test ${testId}`
            );
        }
    } catch (error) {
        console.error("Error creating questions from AI response:", error);
        throw error;
    }
}

/**
 * Chuẩn hóa loại câu hỏi dựa trên phần thi
 */
function standardizeQuestionType(type: string, sectionType: string): string {
    if (!type) {
        // Mặc định dựa trên section
        if (sectionType === "listening" || sectionType === "reading") {
            return "single";
        } else if (sectionType === "writing") {
            return "essay";
        } else if (sectionType === "speaking") {
            return "speaking";
        }
        return "single";
    }

    // Chuẩn hóa các loại phổ biến
    const typeLower = type.toLowerCase();
    if (typeLower.includes("single") || typeLower.includes("multiple choice")) {
        return "single";
    } else if (typeLower.includes("multiple") || typeLower.includes("multi")) {
        return "multiple";
    } else if (typeLower.includes("fill") || typeLower.includes("completion")) {
        return "fill";
    } else if (typeLower.includes("essay") || typeLower.includes("writing")) {
        return "essay";
    } else if (typeLower.includes("speak") || typeLower.includes("oral")) {
        return "speaking";
    }

    // Giữ nguyên nếu không thuộc các loại phổ biến
    return type;
}

/**
 * Tạo câu hỏi mẫu khi AI không tạo đủ câu hỏi hoặc gặp lỗi
 */
function createSampleQuestions(
    testId: number,
    testType: string,
    difficulty: string,
    count: number = 20
): Array<any> {
    console.log(
        `Creating ${count} sample questions for ${testType} test with ${difficulty} difficulty`
    );

    const questions: Array<any> = [];

    if (testType === "TOEIC") {
        // Tạo câu hỏi Listening
        for (let i = 1; i <= Math.min(10, count / 2); i++) {
            questions.push({
                testId,
                content: `Sample TOEIC Listening Question ${i}`,
                type: "single",
                options: [
                    "A. Option A",
                    "B. Option B",
                    "C. Option C",
                    "D. Option D",
                ],
                correctAnswer: "A",
                part: Math.min(4, Math.ceil(i / 3)),
                sectionType: "listening",
                explanation: `Explanation for sample question ${i}`,
                audioUrl: null,
                order: i,
                groupId: Math.min(4, Math.ceil(i / 3)),
            });
        }

        // Tạo câu hỏi Reading
        for (let i = 1; i <= Math.min(10, count / 2); i++) {
            questions.push({
                testId,
                content: `Sample TOEIC Reading Question ${i}`,
                type: "single",
                options: [
                    "A. Option A",
                    "B. Option B",
                    "C. Option C",
                    "D. Option D",
                ],
                correctAnswer: "B",
                part: 5 + Math.min(2, Math.ceil(i / 5)),
                sectionType: "reading",
                explanation: `Explanation for sample question ${i}`,
                audioUrl: null,
                order: i + 100,
                groupId: 5 + Math.min(2, Math.ceil(i / 5)),
            });
        }
    } else if (testType === "IELTS") {
        // Tạo câu hỏi Listening
        for (let i = 1; i <= Math.min(5, count / 4); i++) {
            questions.push({
                testId,
                content: `Sample IELTS Listening Question ${i}`,
                type: "single",
                options: ["A. Option A", "B. Option B", "C. Option C"],
                correctAnswer: "A",
                part: Math.min(4, i),
                sectionType: "listening",
                explanation: `Explanation for sample question ${i}`,
                audioUrl: null,
                order: i,
                groupId: Math.min(4, i),
            });
        }

        // Tạo câu hỏi Reading
        for (let i = 1; i <= Math.min(5, count / 4); i++) {
            questions.push({
                testId,
                content: `Sample IELTS Reading Question ${i}`,
                type: "single",
                options: [
                    "A. Option A",
                    "B. Option B",
                    "C. Option C",
                    "D. Option D",
                ],
                correctAnswer: "B",
                part: Math.min(3, i),
                sectionType: "reading",
                explanation: `Explanation for sample question ${i}`,
                audioUrl: null,
                order: i + 40,
                groupId: Math.min(3, i),
            });
        }

        // Tạo câu hỏi Writing
        for (let i = 1; i <= Math.min(5, count / 4); i++) {
            questions.push({
                testId,
                content: `Sample IELTS Writing Task ${i}: Write an essay about ${
                    i % 2 === 0 ? "technology" : "education"
                }.`,
                type: "essay",
                options: [],
                correctAnswer: "",
                part: Math.min(2, i),
                sectionType: "writing",
                explanation: "Write at least 250 words.",
                audioUrl: null,
                order: i + 80,
                groupId: Math.min(2, i),
            });
        }

        // Tạo câu hỏi Speaking
        for (let i = 1; i <= Math.min(5, count / 4); i++) {
            questions.push({
                testId,
                content: `Sample IELTS Speaking Question ${i}: Talk about your ${
                    i % 3 === 0
                        ? "hometown"
                        : i % 3 === 1
                        ? "favorite hobby"
                        : "future plans"
                }.`,
                type: "speaking",
                options: [],
                correctAnswer: "",
                part: Math.min(3, i),
                sectionType: "speaking",
                explanation: "Speak for 1-2 minutes.",
                audioUrl: null,
                order: i + 120,
                groupId: Math.min(3, i),
            });
        }
    }

    console.log(`Created ${questions.length} sample questions`);
    return questions;
}
