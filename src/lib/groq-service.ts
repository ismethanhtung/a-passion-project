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
    // Nếu GROQ_API_KEY không tồn tại, trả về đánh giá mặc định
    if (!process.env.GROQ_API_KEY) {
        console.warn("GROQ_API_KEY not found, returning mock assessment");
        return createMockAssessment(recordedText, originalText);
    }

    try {
        const prompt = createPrompt(recordedText, originalText, language);

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
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
            }
        );

        // Phân tích phản hồi từ LLM
        const content = response.data.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content in Groq API response");
        }

        // Trích xuất JSON từ phản hồi
        try {
            // Làm sạch phản hồi (loại bỏ các ký tự không phải JSON nếu có)
            const jsonString = content.replace(/```json|```/g, "").trim();
            const assessment = JSON.parse(jsonString);
            return assessment;
        } catch (parseError) {
            console.error("Error parsing Groq response:", parseError);
            console.log("Raw response:", content);
            throw new Error("Failed to parse Groq response as JSON");
        }
    } catch (error) {
        console.error("Error calling Groq API:", error);
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
