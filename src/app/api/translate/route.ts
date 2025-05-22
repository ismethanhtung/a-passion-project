import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, sourceLang, targetLang } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Thiếu nội dung cần dịch" },
                { status: 400 }
            );
        }

        // Hệ thống thông báo dựa trên ngôn ngữ
        const systemMessage = `Bạn là một dịch giả chuyên nghiệp. Hãy dịch văn bản từ ${
            sourceLang === "en"
                ? "tiếng Anh sang tiếng Việt"
                : "tiếng Việt sang tiếng Anh"
        }.
       Văn bản dịch phải chính xác, tự nhiên và phù hợp về ngữ cảnh.
       Chỉ trả về văn bản đã dịch, không kèm theo giải thích hay bất kỳ thông tin nào khác.`;

        const prompt = `Dịch văn bản sau: "${text}"`;

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
                        { role: "user", content: prompt },
                    ],
                    temperature: 0.3,
                    max_tokens: 1000,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API error:", errorData);
            return NextResponse.json(
                { error: "Lỗi khi gọi API dịch văn bản" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const translation = data.choices[0]?.message?.content?.trim();

        return NextResponse.json({ translation });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { error: "Lỗi server khi xử lý yêu cầu dịch" },
            { status: 500 }
        );
    }
}
