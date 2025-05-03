import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { description, level } = await req.json();

        if (!description) {
            return NextResponse.json(
                { error: "Thiếu thông tin mô tả chủ đề" },
                { status: 400 }
            );
        }

        // Sử dụng API AI để tạo prompt
        try {
            const promptData = await generateWritingPrompt(description, level);

            return NextResponse.json({
                prompt: promptData.prompt,
            });
        } catch (error) {
            console.error("Error generating prompt with AI:", error);

            // Fallback: Tạo prompt đơn giản nếu không thể sử dụng AI
            const fallbackPrompt = createFallbackPrompt(description, level);

            return NextResponse.json({
                prompt: fallbackPrompt,
            });
        }
    } catch (error) {
        console.error("Error in generate-prompt API:", error);
        return NextResponse.json(
            { error: "Lỗi khi xử lý yêu cầu" },
            { status: 500 }
        );
    }
}

/**
 * Tạo prompt viết bằng API AI
 */
async function generateWritingPrompt(
    description: string,
    level: string = "intermediate"
): Promise<{ prompt: string }> {
    // Chuẩn bị prompt để gửi đến API
    const systemPrompt = `Bạn là một giáo viên ngôn ngữ có nhiều kinh nghiệm trong việc tạo ra các bài tập viết. 
Hãy tạo một đề bài viết chi tiết dựa trên chủ đề được cung cấp.
Đề bài phải phù hợp với trình độ ${
        level === "beginner"
            ? "cơ bản"
            : level === "intermediate"
            ? "trung cấp"
            : "nâng cao"
    }.
Đề bài nên bao gồm:
1. Mô tả rõ ràng về nhiệm vụ viết
2. Các gợi ý và hướng dẫn cụ thể
3. 2-3 câu hỏi gợi ý để người học suy nghĩ
4. Phù hợp với độ dài khoảng ${
        level === "beginner"
            ? "100-200"
            : level === "intermediate"
            ? "200-350"
            : "300-500"
    } từ
Viết bằng tiếng Việt, hãy tạo một đề bài thử thách nhưng có thể tiếp cận được.`;

    const userPrompt = `Chủ đề: ${description}
Cấp độ: ${level}`;

    try {
        // Gọi API AI (chẳng hạn thông qua API server của bạn)
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return { prompt: data.content };
    } catch (error) {
        console.error("Error calling AI API:", error);
        throw error;
    }
}

/**
 * Tạo prompt mặc định khi không thể gọi API
 */
function createFallbackPrompt(
    description: string,
    level: string = "intermediate"
): string {
    let difficultyText = "";
    let wordCountText = "";

    if (level === "beginner") {
        difficultyText = "sử dụng từ vựng và cấu trúc câu đơn giản";
        wordCountText = "100-200";
    } else if (level === "intermediate") {
        difficultyText = "sử dụng từ vựng phong phú và cấu trúc câu đa dạng";
        wordCountText = "200-350";
    } else {
        difficultyText =
            "phân tích sâu, sử dụng lập luận phức tạp và từ vựng học thuật";
        wordCountText = "300-500";
    }

    return `Hãy viết một bài luận về chủ đề: "${description}".

Trong bài viết của bạn, hãy ${difficultyText}. Bạn nên bao gồm ý kiến cá nhân, các lập luận hỗ trợ, và ví dụ cụ thể nếu có thể.

Câu hỏi gợi ý:
1. Chủ đề này ảnh hưởng đến cuộc sống cá nhân và xã hội như thế nào?
2. Có những quan điểm khác nhau về vấn đề này không? 
3. Giải pháp hoặc đề xuất của bạn là gì?

Bài viết nên có độ dài khoảng ${wordCountText} từ. Hãy lưu ý về cấu trúc bài viết với phần mở đầu, thân bài và kết luận rõ ràng.`;
}
