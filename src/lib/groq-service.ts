import axios from "axios";

/**
 * Giao diện cho kết quả đánh giá phát âm từ Groq API
 */
interface PronunciationAssessment {
    overallScore: number;
    feedback: string[];
    detailedFeedback: string;
    improvementSuggestions: string[];
    commonErrors: string[];
}

/**
 * Tạo prompt cho Groq API để đánh giá phát âm
 */
const createPrompt = (
    recordedText: string,
    originalText: string,
    language: string
): string => {
    return `
  You are a professional pronunciation coach specializing in ${language}. 
  
  Analyze the pronunciation quality by comparing the original text with the recorded speech transcription:

  Original Text: "${originalText}"
  Recorded Transcription: "${recordedText}"
  Language: ${language}

  Please provide:
  1. An overall score (0-100) based on accuracy
  2. A brief assessment of the pronunciation quality
  3. Specific errors and areas for improvement
  4. Suggestions for better pronouncing difficult words
  5. Common patterns of mistakes in this speech sample
  
  Format your response as a JSON object with the following structure:
  {
    "overallScore": number,
    "feedback": string[],  // 2-3 short statements about the overall quality
    "detailedFeedback": string,  // More detailed analysis
    "improvementSuggestions": string[],  // List of specific suggestions
    "commonErrors": string[]  // Common error patterns identified
  }

  Respond with ONLY the JSON, nothing else.
  `;
};

/**
 * Gửi request đến Groq API để đánh giá phát âm
 */
export async function assessPronunciationWithGroq(
    recordedText: string,
    originalText: string,
    language: string
): Promise<PronunciationAssessment> {
    console.log("Bắt đầu đánh giá phát âm với Groq LLM...");

    // Kiểm tra GROQ_API_KEY
    const groqApiKey =
        process.env.GROQ_API_KEY ||
        "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";

    if (!groqApiKey) {
        console.warn("GROQ_API_KEY không tìm thấy, sử dụng đánh giá mặc định");
        return createMockAssessment(recordedText, originalText);
    }

    try {
        console.log("Tạo prompt cho Groq API...");
        const prompt = createPrompt(recordedText, originalText, language);
        console.log("Độ dài prompt:", prompt.length, "ký tự");

        console.log("Gửi yêu cầu đến Groq API...");
        console.log("Thông tin yêu cầu:", {
            model: "llama3-8b-8192",
            recordedTextLength: recordedText.length,
            originalTextLength: originalText.length,
            language,
        });

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192", // Model miễn phí của Groq
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional pronunciation coach with expertise in linguistic analysis.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 1024,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                },
            }
        );

        console.log("Đã nhận phản hồi từ Groq API:", {
            status: response.status,
            hasChoices: !!response.data.choices,
            choicesLength: response.data.choices?.length,
        });

        // Phân tích phản hồi từ LLM
        const content = response.data.choices[0]?.message?.content;
        if (!content) {
            console.error("Không có nội dung trong phản hồi từ Groq API");
            throw new Error("No content in Groq API response");
        }

        console.log(
            "Nội dung phản hồi từ Groq (một phần):",
            content.substring(0, 100) + "..."
        );

        // Trích xuất JSON từ phản hồi
        try {
            // Làm sạch phản hồi (loại bỏ các ký tự không phải JSON nếu có)
            const jsonString = content.replace(/```json|```/g, "").trim();
            console.log(
                "Chuỗi JSON (một phần):",
                jsonString.substring(0, 100) + "..."
            );

            const assessment = JSON.parse(jsonString);
            console.log("Đã phân tích thành công JSON từ phản hồi Groq");
            console.log("Điểm đánh giá:", assessment.overallScore);
            console.log("Số lượng phản hồi:", assessment.feedback?.length || 0);

            return assessment;
        } catch (parseError) {
            console.error("Lỗi khi phân tích phản hồi từ Groq:", parseError);
            console.log("Nội dung phản hồi gốc:", content);
            throw new Error("Failed to parse Groq response as JSON");
        }
    } catch (error) {
        console.error("Lỗi khi gọi Groq API:", error);
        console.log("Đang chuyển sang đánh giá mặc định...");

        // Trả về đánh giá mặc định nếu có lỗi
        return createMockAssessment(recordedText, originalText);
    }
}

/**
 * Tạo đánh giá mặc định khi không có Groq API key hoặc có lỗi
 */
function createMockAssessment(
    recordedText: string,
    originalText: string
): PronunciationAssessment {
    // Tính toán điểm số đơn giản dựa trên so sánh từ
    const origWords = originalText.toLowerCase().split(/\s+/);
    const recWords = recordedText.toLowerCase().split(/\s+/);

    let matchCount = 0;
    const minLength = Math.min(origWords.length, recWords.length);

    for (let i = 0; i < minLength; i++) {
        if (origWords[i] === recWords[i]) {
            matchCount++;
        }
    }

    const score = Math.round((matchCount / origWords.length) * 100);

    // Tạo đánh giá mặc định
    return {
        overallScore: score,
        feedback: [
            score > 80
                ? "Phát âm tốt! Hầu hết các từ đều chính xác."
                : "Phát âm cần cải thiện.",
            "Tiếp tục luyện tập để phát âm tự nhiên hơn.",
        ],
        detailedFeedback: `Phân tích đã phát hiện ${matchCount} từ chính xác trên tổng số ${origWords.length} từ. Cần lưu ý đến việc phát âm rõ ràng và chính xác từng từ.`,
        improvementSuggestions: [
            "Luyện tập từng từ một cách chậm rãi.",
            "Nghe và bắt chước người bản xứ.",
            "Tập trung vào nhịp điệu và ngữ điệu của câu.",
        ],
        commonErrors: [
            "Phát âm không rõ ràng các phụ âm cuối.",
            "Nhầm lẫn giữa các nguyên âm.",
        ],
    };
}
