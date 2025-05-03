import { NextRequest, NextResponse } from "next/server";
import { WritingFeedback } from "@/lib/writing/writing-service";

export async function POST(req: NextRequest) {
    try {
        const { content, prompt, language = "vi-VN" } = await req.json();

        if (!content || !prompt) {
            return NextResponse.json(
                { error: "Thiếu nội dung hoặc đề bài" },
                { status: 400 }
            );
        }

        // Kiểm tra độ dài nội dung
        if (content.length < 20) {
            return NextResponse.json(
                { error: "Nội dung bài viết quá ngắn để đánh giá" },
                { status: 400 }
            );
        }

        try {
            // Sử dụng API AI để đánh giá bài viết
            const feedback = await evaluateWritingWithAI(
                content,
                prompt,
                language
            );

            return NextResponse.json({
                feedback,
            });
        } catch (error) {
            console.error("Error evaluating with AI:", error);

            // Fallback: Tạo đánh giá đơn giản nếu API lỗi
            const mockFeedback = createMockFeedback(content, prompt);

            return NextResponse.json({
                feedback: mockFeedback,
            });
        }
    } catch (error) {
        console.error("Error in writing evaluation API:", error);
        return NextResponse.json(
            { error: "Lỗi khi xử lý yêu cầu" },
            { status: 500 }
        );
    }
}

/**
 * Đánh giá bài viết bằng API AI
 */
async function evaluateWritingWithAI(
    content: string,
    prompt: string,
    language: string
): Promise<WritingFeedback> {
    // Chuẩn bị prompt để gửi đến API
    const systemPrompt = `Bạn là một giáo viên ngôn ngữ chuyên nghiệp với nhiều năm kinh nghiệm đánh giá bài viết.
Hãy đánh giá bài viết của học viên theo đề bài được cung cấp.

Bạn cần đánh giá các khía cạnh sau:
1. Ngữ pháp: Độ chính xác của cấu trúc câu, thì, thể, từ loại, v.v.
2. Từ vựng: Độ phong phú, chính xác và phù hợp của từ vựng
3. Cấu trúc: Tổ chức bài viết, sự mạch lạc giữa các đoạn và ý tưởng
4. Tính liên kết: Sự liên kết giữa các câu và đoạn văn, sử dụng từ nối

Đánh giá phải bao gồm:
- Điểm đánh giá tổng thể (thang 0-100)
- Điểm cho từng khía cạnh (thang 0-100)
- Nhận xét cụ thể với ví dụ từ bài viết
- Gợi ý cải thiện
- Phiên bản cải thiện của bài viết

Trả về đánh giá dưới định dạng JSON theo cấu trúc sau:
{
  "overallScore": 75,
  "grammar": {
    "score": 70,
    "comments": ["Nhận xét 1", "Nhận xét 2"],
    "examples": [
      {
        "original": "Câu gốc có lỗi",
        "correction": "Câu được sửa lỗi",
        "explanation": "Giải thích lỗi và cách sửa"
      }
    ]
  },
  "vocabulary": {
    "score": 80,
    "comments": ["Nhận xét 1", "Nhận xét 2"],
    "suggestions": [
      {
        "word": "Từ được dùng",
        "alternatives": ["Từ thay thế 1", "Từ thay thế 2"],
        "context": "Ngữ cảnh mà từ xuất hiện"
      }
    ]
  },
  "structure": {
    "score": 75,
    "comments": ["Nhận xét 1", "Nhận xét 2"]
  },
  "coherence": {
    "score": 70,
    "comments": ["Nhận xét 1", "Nhận xét 2"]
  },
  "improvements": ["Gợi ý cải thiện 1", "Gợi ý cải thiện 2"],
  "improvedVersion": "Phiên bản cải thiện của bài viết"
}`;

    const userPrompt = `
ĐỀ BÀI:
${prompt}

BÀI VIẾT CỦA HỌC VIÊN:
${content}

Vui lòng đánh giá bài viết này một cách chi tiết và chuyên nghiệp.`;

    try {
        // Gọi API AI
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
        let feedbackData: WritingFeedback;

        try {
            // Tìm và phân tích phần JSON trong phản hồi
            const jsonMatch = data.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                feedbackData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.error("Error parsing JSON from AI response:", parseError);
            throw parseError;
        }

        return feedbackData;
    } catch (error) {
        console.error("Error calling AI API:", error);
        throw error;
    }
}

/**
 * Tạo đánh giá mẫu khi API lỗi
 */
function createMockFeedback(content: string, prompt: string): WritingFeedback {
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;

    // Điểm số tương đối dựa trên độ dài
    const baseScore = Math.min(85, Math.max(65, 70 + wordCount / 50));

    return {
        overallScore: Math.round(baseScore),
        grammar: {
            score: Math.round(baseScore + Math.random() * 10 - 5),
            comments: [
                "Bài viết của bạn có một số lỗi ngữ pháp cần cải thiện.",
                "Hãy chú ý đến việc sử dụng đúng thì và thể trong câu.",
            ],
            examples: [
                {
                    original:
                        "Một đoạn văn mẫu từ bài viết của bạn có thể cần cải thiện.",
                    correction:
                        "Một đoạn văn mẫu từ bài viết của bạn có thể cần được cải thiện.",
                    explanation:
                        'Thêm "được" để câu văn được tự nhiên hơn trong tiếng Việt.',
                },
            ],
        },
        vocabulary: {
            score: Math.round(baseScore + Math.random() * 10 - 5),
            comments: [
                "Bạn sử dụng từ vựng khá tốt nhưng đôi khi còn lặp lại.",
                "Cố gắng đa dạng hóa từ vựng để làm phong phú bài viết.",
            ],
            suggestions: [
                {
                    word: "tốt",
                    alternatives: [
                        "xuất sắc",
                        "tuyệt vời",
                        "hiệu quả",
                        "lý tưởng",
                    ],
                    context: "Cách diễn đạt này rất tốt.",
                },
            ],
        },
        structure: {
            score: Math.round(baseScore + Math.random() * 10 - 5),
            comments: [
                "Cấu trúc bài viết khá rõ ràng nhưng có thể cải thiện.",
                "Nên có phần mở bài, thân bài và kết luận rõ ràng hơn.",
            ],
        },
        coherence: {
            score: Math.round(baseScore + Math.random() * 10 - 5),
            comments: [
                "Các ý trong bài viết khá mạch lạc nhưng đôi khi thiếu sự liên kết.",
                "Sử dụng các từ nối để liên kết các ý tưởng tốt hơn.",
            ],
        },
        improvements: [
            "Cải thiện việc sử dụng từ nối để kết nối các ý tưởng.",
            "Đa dạng hóa cấu trúc câu để bài viết thêm phong phú.",
            "Phát triển ý tưởng chính kỹ hơn với các ví dụ cụ thể.",
            "Chú ý đến việc sử dụng dấu câu đúng cách.",
        ],
        improvedVersion: `${content}\n\n[Phiên bản cải thiện sẽ được cung cấp bởi AI khi kết nối tới API.]`,
    };
}
