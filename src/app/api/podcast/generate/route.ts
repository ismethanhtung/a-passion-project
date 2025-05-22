import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, level, format, duration } = await req.json();

        if (!topic) {
            return NextResponse.json(
                { error: "Thiếu chủ đề podcast" },
                { status: 400 }
            );
        }

        // Tạo system message để hướng dẫn AI tạo nội dung podcast phù hợp
        const systemMessage = `Bạn là một chuyên gia tạo nội dung podcast học tiếng Anh.
    Dựa trên yêu cầu của người dùng, hãy tạo một kịch bản podcast tiếng Anh phù hợp với mục đích học tập.
    
    Nội dung podcast cần:
    - Phù hợp với trình độ người học (${level || "intermediate"})
    - Kịch bản có cấu trúc rõ ràng với phần mở đầu, nội dung chính và kết luận
    - Có tính giáo dục và giúp người học cải thiện kỹ năng tiếng Anh
    - Sử dụng văn phong tự nhiên, dễ hiểu
    - Độ dài phù hợp với thời lượng ${duration || "5-10"} phút
    - Đối với định dạng ${
        format || "dialogue"
    }, đảm bảo có phân vai người nói rõ ràng
    
    Kết quả trả về cần có định dạng JSON như sau:
    {
      "title": "Tiêu đề podcast",
      "description": "Mô tả ngắn gọn về nội dung podcast",
      "transcript": "Nội dung kịch bản đầy đủ",
      "summary": "Tóm tắt nội dung chính của podcast",
      "vocabulary": [
        {"word": "từ vựng 1", "definition": "định nghĩa", "example": "ví dụ sử dụng"},
        {"word": "từ vựng 2", "definition": "định nghĩa", "example": "ví dụ sử dụng"}
      ],
      "quiz": [
        {"question": "Câu hỏi 1", "options": ["A. Lựa chọn 1", "B. Lựa chọn 2", "C. Lựa chọn 3", "D. Lựa chọn 4"], "answer": 0, "explanation": "Giải thích đáp án"},
        {"question": "Câu hỏi 2", "options": ["A. Lựa chọn 1", "B. Lựa chọn 2", "C. Lựa chọn 3", "D. Lựa chọn 4"], "answer": 0, "explanation": "Giải thích đáp án"}
      ],
      "audioText": "Phiên bản ngắn gọn của transcript, chỉ bao gồm nội dung cần đọc, không quá 4000 ký tự. Nếu là đối thoại, hãy bảo tồn tên của người nói."
    }
    
    Tạo ít nhất 5 từ vựng quan trọng và 5 câu hỏi quiz liên quan đến nội dung podcast.
    Quan trọng: Bắt buộc phải tạo trường "audioText" để sử dụng cho text-to-speech.`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${
                        process.env.GROQ_API_KEY ||
                        "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"
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        { role: "system", content: systemMessage },
                        {
                            role: "user",
                            content: `Tạo podcast về chủ đề: ${topic}. Trình độ: ${
                                level || "intermediate"
                            }. Định dạng: ${
                                format || "dialogue"
                            }. Thời lượng: ${duration || "5-10"} phút.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                    response_format: { type: "json_object" },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API error:", errorData);
            return NextResponse.json(
                { error: "Lỗi khi gọi API tạo podcast" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const podcastContent = data.choices[0]?.message?.content;

        // Parse JSON kết quả
        let parsedResult;
        try {
            parsedResult = JSON.parse(podcastContent);

            // Đảm bảo có trường audioText
            if (!parsedResult.audioText && parsedResult.transcript) {
                // Tạo audioText từ transcript nếu không có
                parsedResult.audioText = parsedResult.transcript.slice(0, 4000);
            }
        } catch (e) {
            console.error("Error parsing podcast content:", e);
            return NextResponse.json(
                { error: "Lỗi khi xử lý nội dung podcast" },
                { status: 500 }
            );
        }

        return NextResponse.json(parsedResult);
    } catch (error) {
        console.error("Podcast generation error:", error);
        return NextResponse.json(
            { error: "Lỗi server khi xử lý yêu cầu tạo podcast" },
            { status: 500 }
        );
    }
}
