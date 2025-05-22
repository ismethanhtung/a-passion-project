import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { word } = await req.json();

        if (!word) {
            return NextResponse.json(
                { error: "Thiếu từ cần tra cứu" },
                { status: 400 }
            );
        }

        // Tạo system message để hướng dẫn AI trả về kết quả theo định dạng mong muốn
        const systemMessage = `Bạn là một từ điển tiếng Anh - Việt chuyên nghiệp.
    Khi người dùng gửi một từ hoặc cụm từ tiếng Anh, hãy phân tích và trả về thông tin chi tiết theo JSON format như sau:
    {
      "word": "từ cần tra",
      "phonetic": "phiên âm quốc tế",
      "audio": "URL phát âm nếu có",
      "meanings": [
        {
          "partOfSpeech": "loại từ (danh từ/động từ/tính từ...)",
          "definition": "định nghĩa tiếng Việt",
          "example": "ví dụ tiếng Anh",
          "exampleTranslation": "dịch ví dụ sang tiếng Việt",
          "synonyms": ["từ đồng nghĩa"],
          "antonyms": ["từ trái nghĩa"]
        },
        // có thể có nhiều nghĩa
      ],
      "etymology": "nguồn gốc từ (nếu có)",
      "relatedWords": ["các từ liên quan, collocations"],
      "level": "trình độ (beginner/intermediate/advanced)"
    }

    Hãy trả về cấu trúc JSON hoàn chỉnh, với thông tin chính xác dựa trên kiến thức ngôn ngữ của bạn.
    Nếu là từ tiếng Việt, hãy phân tích và cung cấp thông tin tương tự nhưng bằng tiếng Anh.`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer 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`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: `Tra từ điển: "${word}"` },
                    ],
                    temperature: 0.2,
                    max_tokens: 1500,
                    response_format: { type: "json_object" },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API error:", errorData);
            return NextResponse.json(
                { error: "Lỗi khi gọi API từ điển" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const dictionaryResult = data.choices[0]?.message?.content;

        // Parse JSON kết quả
        let parsedResult;
        try {
            parsedResult = JSON.parse(dictionaryResult);
        } catch (e) {
            console.error("Error parsing dictionary result:", e);
            return NextResponse.json(
                { error: "Lỗi khi xử lý kết quả từ điển" },
                { status: 500 }
            );
        }

        return NextResponse.json(parsedResult);
    } catch (error) {
        console.error("Dictionary lookup error:", error);
        return NextResponse.json(
            { error: "Lỗi server khi xử lý yêu cầu tra từ điển" },
            { status: 500 }
        );
    }
}
