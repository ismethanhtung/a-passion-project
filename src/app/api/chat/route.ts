import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// API xử lý chat với Groq API
export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Tin nhắn không hợp lệ" },
                { status: 400 }
            );
        }

        // Lấy API key từ biến môi trường
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            console.error("GROQ_API_KEY không tìm thấy trong biến môi trường");
            return NextResponse.json(
                { error: "Cấu hình API không hợp lệ" },
                { status: 500 }
            );
        }

        // Tối ưu: Chỉ giữ tối đa 10 tin nhắn gần nhất để tránh quá nhiều tokens
        const recentMessages = messages.slice(-10);

        // Gửi yêu cầu đến Groq API
        console.log("Đang gửi tin nhắn đến Groq API...");
        let response;

        try {
            response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "llama3-8b-8192", // Sử dụng model nhỏ hơn để giảm độ trễ
                    messages: recentMessages,
                    temperature: 0.7,
                    max_tokens: 4000, // Giảm max_tokens để phản hồi nhanh hơn
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer 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`,
                    },
                }
            );
        } catch (apiError: any) {
            console.error("Lỗi khi gọi Groq API:", {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
                message: apiError.message,
            });

            if (apiError.response?.status === 401) {
                return NextResponse.json(
                    { error: "Lỗi xác thực với Groq API" },
                    { status: 401 }
                );
            }

            throw apiError;
        }

        // Trích xuất nội dung từ phản hồi
        const content = response.data.choices[0]?.message?.content || "";

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error("Lỗi xử lý chat:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
        });

        return NextResponse.json(
            { error: "Lỗi server: " + error.message },
            { status: 500 }
        );
    }
}
