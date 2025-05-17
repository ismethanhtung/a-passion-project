import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type ConversationRequest = {
    input: string;
    language: string;
    topic?: string;
    history: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
};

export async function POST(request: NextRequest) {
    try {
        console.log("API conversation: Nhận yêu cầu mới");

        // Phân tích dữ liệu từ request
        const body = await request.json();
        const { input, language, topic, history } = body as ConversationRequest;

        console.log("Dữ liệu từ request:", {
            input: input?.substring(0, 50) + (input?.length > 50 ? "..." : ""),
            language,
            topic,
            historyLength: history?.length || 0,
        });

        // Xác thực dữ liệu đầu vào
        if (!input || typeof input !== "string") {
            return NextResponse.json(
                { error: "Input text is required" },
                { status: 400 }
            );
        }

        if (!language || typeof language !== "string") {
            return NextResponse.json(
                { error: "Language is required" },
                { status: 400 }
            );
        }

        if (history && !Array.isArray(history)) {
            return NextResponse.json(
                { error: "History must be an array" },
                { status: 400 }
            );
        }

        // Tạo prompt cho AI dựa trên ngôn ngữ và chủ đề
        const languageName = getLanguageName(language);
        const topicDetail = topic ? ` The conversation is about ${topic}.` : "";

        // Tìm API key
        const groqApiKey =
            process.env.GROQ_API_KEY ||
            "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";

        if (!groqApiKey) {
            console.warn(
                "GROQ_API_KEY không tìm thấy, sử dụng phản hồi mặc định"
            );
            return NextResponse.json({
                response: createMockResponse(input, language),
            });
        }

        // Tạo prompt
        console.log("Tạo prompt cho AI Assistant...");

        // Chuẩn bị tin nhắn cho AI
        const messages = [
            {
                role: "system",
                content: `You are a friendly language learning assistant helping users practice ${languageName}.${topicDetail} 
                
                Rules for conversation:
                1. Always respond in ${languageName} appropriate for the user's skill level.
                2. Be conversational, friendly, and encouraging.
                3. For beginners, use simple vocabulary and short sentences.
                4. Fix critical grammar or vocabulary mistakes gently.
                5. When possible, introduce new vocabulary or phrases.
                6. If you notice the user struggling, simplify your language.
                7. Keep responses concise but natural (2-4 sentences is ideal).
                8. Ask follow-up questions to keep the conversation going.`,
            },
            ...history.slice(-5), // Giữ lịch sử hội thoại ngắn gọn
            {
                role: "user",
                content: input,
            },
        ];

        // Gọi API Groq
        try {
            console.log("Gửi yêu cầu đến Groq API...");

            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "llama3-8b-8192", // Model miễn phí của Groq
                    messages,
                    temperature: 0.7,
                    max_tokens: 1024,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${groqApiKey}`,
                    },
                }
            );

            console.log("Đã nhận phản hồi từ Groq API");

            // Phân tích phản hồi từ LLM
            const content = response.data.choices[0]?.message?.content;
            if (!content) {
                console.error("Không có nội dung trong phản hồi từ Groq API");
                throw new Error("No content in Groq API response");
            }

            return NextResponse.json({ response: content });
        } catch (error) {
            console.error("Lỗi khi gọi Groq API:", error);
            console.log("Đang chuyển sang phản hồi dự phòng...");

            // Trả về phản hồi đơn giản nếu có lỗi
            return NextResponse.json({
                response: createMockResponse(input, language),
            });
        }
    } catch (error) {
        console.error("Lỗi server:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// Hàm tạo phản hồi mặc định khi không có API key hoặc có lỗi
function createMockResponse(input: string, language: string): string {
    const langCode = language.split("-")[0];

    if (langCode === "vi") {
        return "Xin lỗi, tôi đang gặp vấn đề kết nối. Bạn có thể thử lại sau? Tôi rất muốn tiếp tục cuộc trò chuyện với bạn.";
    }

    if (langCode === "ja") {
        return "申し訳ありません、接続に問題があります。後でもう一度お試しいただけますか？あなたとの会話を続けたいです。";
    }

    if (langCode === "fr") {
        return "Désolé, je rencontre des problèmes de connexion. Pourriez-vous réessayer plus tard ? J'aimerais continuer notre conversation.";
    }

    if (langCode === "de") {
        return "Es tut mir leid, ich habe Verbindungsprobleme. Könnten Sie es später noch einmal versuchen? Ich würde gerne unser Gespräch fortsetzen.";
    }

    if (langCode === "es") {
        return "Lo siento, estoy teniendo problemas de conexión. ¿Podrías intentarlo más tarde? Me gustaría continuar nuestra conversación.";
    }

    if (langCode === "zh") {
        return "抱歉，我遇到了连接问题。您能稍后再试吗？我很想继续我们的对话。";
    }

    // Default to English
    return "I'm sorry, I'm having connection issues. Could you try again later? I'd love to continue our conversation.";
}

// Chuyển đổi mã ngôn ngữ thành tên đầy đủ
function getLanguageName(languageCode: string): string {
    const langMap: Record<string, string> = {
        "en-US": "American English",
        "en-GB": "British English",
        "en-AU": "Australian English",
        "fr-FR": "French",
        "es-ES": "Spanish",
        "de-DE": "German",
        "ja-JP": "Japanese",
        "zh-CN": "Mandarin Chinese",
        "vi-VN": "Vietnamese",
        "ko-KR": "Korean",
        "ru-RU": "Russian",
        "it-IT": "Italian",
    };

    return langMap[languageCode] || "English";
}
