import VoskService from "./vosk-service";

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

type ConversationResponse = {
    message: string;
    isCompleted: boolean;
};

export class ConversationService {
    private static instance: ConversationService;
    private messages: Message[] = [];
    private language: string = "en-US";
    private currentTurn: number = 0;
    private maxTurns: number = 5;
    private difficulty: string = "intermediate";
    private scenarioContext: string = "";

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService();
        }
        return ConversationService.instance;
    }

    /**
     * Bắt đầu cuộc hội thoại mới với ngữ cảnh
     */
    public async startConversation(
        scenario: string,
        language: string = "en-US",
        difficulty: string = "intermediate",
        maxTurns: number = 5
    ): Promise<ConversationResponse> {
        // Reset các biến trạng thái
        this.messages = [];
        this.currentTurn = 0;
        this.maxTurns = maxTurns;
        this.language = language;
        this.difficulty = difficulty;
        this.scenarioContext = scenario;

        // Thêm message hệ thống để thiết lập ngữ cảnh
        const systemMessage: Message = {
            role: "system",
            content: this.buildSystemPrompt(),
        };
        this.messages.push(systemMessage);

        // Lấy phản hồi đầu tiên từ AI
        try {
            const initialResponse = await this.getAIResponse();
            return {
                message: initialResponse,
                isCompleted: false,
            };
        } catch (error) {
            console.error("Error starting conversation:", error);
            return {
                message: "Xin lỗi, đã xảy ra lỗi khi bắt đầu cuộc hội thoại.",
                isCompleted: false,
            };
        }
    }

    /**
     * Tạo system prompt để thiết lập ngữ cảnh
     */
    private buildSystemPrompt(): string {
        const languageMapping: Record<string, string> = {
            "en-US": "English (American)",
            "en-GB": "English (British)",
            "vi-VN": "Vietnamese",
            "fr-FR": "French",
            "ja-JP": "Japanese",
        };

        const difficultySetting: Record<string, string> = {
            beginner:
                "Use simple vocabulary and grammar. Speak slowly and clearly with many common phrases.",
            intermediate:
                "Use moderate vocabulary and grammar. Maintain a natural conversational pace.",
            advanced:
                "Use rich vocabulary, idioms and complex grammar. Speak naturally with occasional challenging words.",
        };

        return `You are a conversation practice partner for language learning. 
Your role is to help the user practice their conversational skills in ${
            languageMapping[this.language] || this.language
        }.

SCENARIO CONTEXT: ${this.scenarioContext}

DIFFICULTY LEVEL: ${this.difficulty.toUpperCase()}
${difficultySetting[this.difficulty] || ""}

INSTRUCTIONS:
1. Respond completely in ${languageMapping[this.language] || this.language} only
2. Keep responses conversational and natural
3. Stay in character for the scenario
4. Do not break character to provide grammar corrections during the conversation
5. After ${this.maxTurns} user exchanges, end the conversation naturally

Start the conversation by introducing the scenario to the user and prompting them to respond.`;
    }

    /**
     * Gửi tin nhắn người dùng và nhận phản hồi từ AI
     */
    public async sendMessage(
        userMessage: string
    ): Promise<ConversationResponse> {
        // Thêm tin nhắn người dùng
        this.messages.push({
            role: "user",
            content: userMessage,
        });

        // Tăng số lượt đã hội thoại
        this.currentTurn++;

        // Kiểm tra xem có phải lượt cuối không
        const isLastTurn = this.currentTurn >= this.maxTurns;

        // Nếu là lượt cuối, thêm thông báo trong prompt
        let aiResponse: string;

        try {
            if (isLastTurn) {
                // Nhắc AI kết thúc cuộc trò chuyện một cách tự nhiên
                const endOfConversationPrompt: Message = {
                    role: "system",
                    content:
                        "This is the last turn in the conversation. End the conversation naturally and in a friendly way.",
                };
                this.messages.push(endOfConversationPrompt);
            }

            // Lấy phản hồi từ AI
            aiResponse = await this.getAIResponse();

            // Thêm tin nhắn của AI
            this.messages.push({
                role: "assistant",
                content: aiResponse,
            });

            return {
                message: aiResponse,
                isCompleted: isLastTurn,
            };
        } catch (error) {
            console.error("Error sending message:", error);
            return {
                message: "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.",
                isCompleted: isLastTurn,
            };
        }
    }

    /**
     * Chuyển đổi âm thanh thành văn bản
     */
    public async transcribeAudio(
        audioBlob: Blob,
        language: string
    ): Promise<string> {
        try {
            // Thử sử dụng Vosk cho offline speech recognition
            if (VoskService) {
                try {
                    const transcript = await VoskService.recognizeSpeech(
                        audioBlob
                    );
                    if (transcript && transcript.trim().length > 0) {
                        return transcript;
                    }
                } catch (error) {
                    console.warn("Error using Vosk for transcription:", error);
                }
            }

            // Nếu Vosk không hoạt động, sử dụng server API
            const formData = new FormData();
            formData.append("audio", audioBlob);
            formData.append("language", language);

            const response = await fetch("/api/speech-to-text", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to transcribe audio");
            }

            const data = await response.json();
            return data.transcription || "";
        } catch (error) {
            console.error("Error transcribing audio:", error);
            // Giả lập văn bản nếu không nhận dạng được
            return "I'm sorry, I couldn't hear you clearly.";
        }
    }

    /**
     * Lấy đánh giá sau khi kết thúc cuộc trò chuyện
     */
    public async getFeedback(): Promise<any> {
        try {
            // Tạo prompt cho việc đánh giá
            const feedbackPrompt: Message = {
                role: "system",
                content: `You are a language evaluation AI. Review the conversation and provide detailed feedback on the user's language skills.
                
Focus on:
1. Grammar and vocabulary usage
2. Fluency and natural expressions
3. Appropriateness of responses
4. Overall communication effectiveness

Format your response as a JSON object with the following structure:
{
  "overallScore": 85, // A score from 0-100
  "strengths": ["Clear pronunciation", "Good vocabulary usage"],
  "areasToImprove": ["Grammar mistakes with past tense", "Limited use of connecting phrases"],
  "detailedFeedback": "Detailed paragraph analyzing the conversation",
  "specificExamples": {
    "goodExamples": [
      {"text": "specific text from user", "comment": "Why this was good"}
    ],
    "improvementExamples": [
      {"text": "specific text from user", "comment": "Suggestion for improvement"}
    ]
  },
  "nextSteps": ["Practice past tense verbs", "Learn more connecting phrases"]
}`,
            };

            // Lấy tất cả tin nhắn của người dùng
            const userMessages = this.messages
                .filter((m) => m.role === "user")
                .map((m) => m.content);

            // Thêm prompt đánh giá
            const tempMessages = [...this.messages, feedbackPrompt];

            // Gửi request để lấy đánh giá
            const response = await this.callAPI(tempMessages);

            // Cố gắng parse JSON từ phản hồi
            try {
                // Tìm đoạn JSON trong phản hồi
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonStr = jsonMatch[0];
                    return JSON.parse(jsonStr);
                }
            } catch (parseError) {
                console.error("Error parsing feedback JSON:", parseError);
                // Nếu không parse được, trả về dạng object đơn giản
                return {
                    overallScore: 75,
                    strengths: ["Hoàn thành cuộc trò chuyện"],
                    areasToImprove: ["Cần cải thiện ngữ pháp và từ vựng"],
                    detailedFeedback: response,
                    nextSteps: ["Tiếp tục luyện tập giao tiếp hàng ngày"],
                };
            }

            return {
                overallScore: 75,
                strengths: ["Hoàn thành cuộc trò chuyện"],
                areasToImprove: ["Cần cải thiện ngữ pháp và từ vựng"],
                detailedFeedback: response,
                nextSteps: ["Tiếp tục luyện tập giao tiếp hàng ngày"],
            };
        } catch (error) {
            console.error("Error getting feedback:", error);
            return {
                overallScore: 70,
                strengths: ["Tham gia tích cực vào cuộc trò chuyện"],
                areasToImprove: ["Cần thêm thời gian luyện tập"],
                detailedFeedback:
                    "Không thể lấy đánh giá chi tiết do lỗi hệ thống.",
                nextSteps: ["Tiếp tục luyện tập"],
            };
        }
    }

    /**
     * Lấy phản hồi từ AI
     */
    private async getAIResponse(): Promise<string> {
        return await this.callAPI(this.messages);
    }

    /**
     * Gọi API để lấy phản hồi
     */
    private async callAPI(messages: Message[]): Promise<string> {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            return data.content || "";
        } catch (error) {
            console.error("Error calling API:", error);
            return "Xin lỗi, tôi đang gặp vấn đề kết nối. Vui lòng thử lại sau.";
        }
    }
}
