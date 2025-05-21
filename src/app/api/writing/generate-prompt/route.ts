import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint tạo đề bài viết từ mô tả
 */
export async function POST(request: NextRequest) {
    try {
        const {
            description,
            level = "intermediate",
            language = "en",
        } = await request.json();

        // Kiểm tra dữ liệu đầu vào
        if (!description) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            );
        }

        const prompt = await generateWritingPrompt(
            description,
            level,
            language
        );

        return NextResponse.json({
            prompt,
            success: true,
        });
    } catch (error) {
        console.error("Error in generating writing prompt:", error);
        return NextResponse.json(
            { error: "Failed to generate writing prompt" },
            { status: 500 }
        );
    }
}

/**
 * Tạo đề bài viết từ mô tả sử dụng AI
 */
async function generateWritingPrompt(
    description: string,
    level: "beginner" | "intermediate" | "advanced",
    language: string
): Promise<string> {
    try {
        // Chuẩn bị prompt cho AI
        const systemPrompt =
            language === "en"
                ? getEnglishSystemPrompt(level)
                : getVietnameseSystemPrompt(level);

        const userPrompt =
            language === "en"
                ? `Create a writing prompt about: ${description}`
                : `Tạo đề bài viết về: ${description}`;

        // Gọi API AI để tạo prompt
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.3,
                    max_tokens: 800,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Grok API error: ${response.statusText}`);
        }

        const result = await response.json();
        const promptContent = result.choices[0]?.message?.content;

        if (!promptContent) {
            throw new Error("No prompt content received from Grok");
        }

        // Làm sạch phản hồi để đảm bảo không có tiêu đề hoặc nội dung dư thừa
        let cleanedPrompt = promptContent.trim();

        // Loại bỏ các tiêu đề thường gặp
        const commonHeaders = [
            "Writing Prompt:",
            "Prompt:",
            "Writing Task:",
            "Đề bài:",
            "Đề viết:",
            "Task:",
        ];

        for (const header of commonHeaders) {
            if (cleanedPrompt.startsWith(header)) {
                cleanedPrompt = cleanedPrompt.substring(header.length).trim();
            }
        }

        // Nếu phản hồi quá ngắn, có thể không hợp lệ
        if (cleanedPrompt.length < 20) {
            console.warn("Response too short, using fallback:", cleanedPrompt);
            return generateFallbackPrompt(description, level, language);
        }

        return cleanedPrompt;
    } catch (error) {
        console.error("Error generating prompt with AI:", error);
        // Fallback: Tạo prompt đơn giản khi API không hoạt động
        return generateFallbackPrompt(description, level, language);
    }
}

/**
 * Tạo prompt dự phòng khi API không hoạt động
 */
function generateFallbackPrompt(
    description: string,
    level: "beginner" | "intermediate" | "advanced",
    language: string
): string {
    if (language === "en") {
        let instructions = "";

        switch (level) {
            case "beginner":
                instructions =
                    "Write a short essay or paragraph discussing your thoughts on this topic. Use simple language and clear examples.";
                break;
            case "intermediate":
                instructions =
                    "Write an essay exploring this topic from multiple perspectives. Include examples and a clear structure with introduction, body paragraphs, and conclusion.";
                break;
            case "advanced":
                instructions =
                    "Write a comprehensive essay analyzing this topic in depth. Present a nuanced argument, consider multiple viewpoints, use sophisticated vocabulary, and provide detailed evidence to support your claims.";
                break;
        }

        return `${description}\n\n${instructions}`;
    } else {
        let instructions = "";

        switch (level) {
            case "beginner":
                instructions =
                    "Viết một bài luận ngắn hoặc đoạn văn thảo luận về suy nghĩ của bạn về chủ đề này. Sử dụng ngôn ngữ đơn giản và ví dụ rõ ràng.";
                break;
            case "intermediate":
                instructions =
                    "Viết một bài luận khám phá chủ đề này từ nhiều góc độ. Đưa ra ví dụ và cấu trúc rõ ràng với phần mở đầu, các đoạn thân bài và kết luận.";
                break;
            case "advanced":
                instructions =
                    "Viết một bài luận toàn diện phân tích sâu về chủ đề này. Đưa ra một lập luận tinh tế, xem xét nhiều quan điểm, sử dụng từ vựng cao cấp và cung cấp bằng chứng chi tiết để hỗ trợ cho các nhận định của bạn.";
                break;
        }

        return `${description}\n\n${instructions}`;
    }
}

/**
 * Hệ thống prompt cho sinh đề bài viết tiếng Anh
 */
function getEnglishSystemPrompt(level: string): string {
    const levelSpecifics = {
        beginner:
            "The prompt should be straightforward, focusing on personal experiences or simple opinions. Use simple language and clear instructions. Word count: 150-250 words. Time limit suggestion: 20 minutes.",
        intermediate:
            "The prompt should require analysis of different perspectives. Use moderately complex language and specific requirements. Word count: 250-400 words. Time limit suggestion: 30 minutes.",
        advanced:
            "The prompt should demand critical thinking and in-depth analysis. Use sophisticated language and challenging requirements. Include specific criteria for evaluation. Word count: 400-600 words. Time limit suggestion: 45 minutes.",
    };

    return `You are a professional English writing instructor creating prompts for ${level} level students.

${levelSpecifics[level]}

Create a clear, engaging, and specific writing prompt based on the user's request. The prompt should:
1. Have a clear main topic or question
2. Include specific instructions about what the student should address
3. Specify any particular requirements for the response (structure, examples, etc.)
4. Be appropriate for the ${level} level
5. Be challenging but achievable

IMPORTANT FORMATTING INSTRUCTIONS:
- Format your response as a single prompt paragraph
- Do NOT include any introductory text or explanations
- Do NOT include "Writing Prompt:" or similar headers 
- Do NOT include meta-information about the prompt
- ONLY provide the actual prompt itself
- Your response should begin with the actual instruction to the student`;
}

/**
 * Hệ thống prompt cho sinh đề bài viết tiếng Việt
 */
function getVietnameseSystemPrompt(level: string): string {
    const levelSpecifics = {
        beginner:
            "Đề bài nên đơn giản, tập trung vào trải nghiệm cá nhân hoặc ý kiến đơn giản. Sử dụng ngôn ngữ đơn giản và hướng dẫn rõ ràng. Số từ: 150-250 từ. Thời gian đề xuất: 20 phút.",
        intermediate:
            "Đề bài nên yêu cầu phân tích nhiều góc độ khác nhau. Sử dụng ngôn ngữ phức tạp vừa phải và yêu cầu cụ thể. Số từ: 250-400 từ. Thời gian đề xuất: 30 phút.",
        advanced:
            "Đề bài nên đòi hỏi tư duy phản biện và phân tích sâu sắc. Sử dụng ngôn ngữ phức tạp và yêu cầu thách thức. Bao gồm tiêu chí đánh giá cụ thể. Số từ: 400-600 từ. Thời gian đề xuất: 45 phút.",
    };

    return `Bạn là một giáo viên viết chuyên nghiệp đang tạo đề bài cho học viên cấp độ ${
        level === "beginner"
            ? "cơ bản"
            : level === "intermediate"
            ? "trung cấp"
            : "nâng cao"
    }.

${levelSpecifics[level]}

Tạo một đề bài viết rõ ràng, hấp dẫn và cụ thể dựa trên yêu cầu của người dùng. Đề bài nên:
1. Có chủ đề hoặc câu hỏi chính rõ ràng
2. Bao gồm hướng dẫn cụ thể về những gì học viên nên đề cập
3. Nêu rõ các yêu cầu cụ thể cho bài viết (cấu trúc, ví dụ, v.v.)
4. Phù hợp với cấp độ ${
        level === "beginner"
            ? "cơ bản"
            : level === "intermediate"
            ? "trung cấp"
            : "nâng cao"
    }
5. Thách thức nhưng khả thi

HƯỚNG DẪN ĐỊNH DẠNG QUAN TRỌNG:
- Định dạng câu trả lời của bạn dưới dạng một đoạn đề bài duy nhất
- KHÔNG bao gồm bất kỳ văn bản giới thiệu hoặc giải thích nào
- KHÔNG bao gồm "Đề bài:" hoặc các tiêu đề tương tự
- KHÔNG bao gồm thông tin mô tả về đề bài
- CHỈ cung cấp chính đề bài
- Câu trả lời của bạn phải bắt đầu bằng hướng dẫn thực tế cho học viên`;
}
