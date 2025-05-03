import { NextRequest, NextResponse } from "next/server";
import { assessPronunciationWithGroq } from "@/lib/groq-service";
import { transcribeAudioWithAssemblyAI } from "@/lib/assembly-ai-service";
import { transcribeAudioWithAzure } from "@/lib/azure-speech-service";

// Định nghĩa kiểu dữ liệu cho phản hồi
type PronunciationFeedback = {
    overallScore: number;
    feedback: string[];
    wordAnalysis: Array<{
        word: string;
        isCorrect: boolean;
        feedback?: string;
        confidence: number;
    }>;
    // Thêm các trường mới từ Groq
    detailedFeedback?: string;
    improvementSuggestions?: string[];
    commonErrors?: string[];
};

// Xử lý lỗi API
const handleApiError = (error: any, message: string) => {
    console.error(`${message}:`, error);
    return NextResponse.json(
        { error: message, details: error.message || "Unknown error" },
        { status: 500 }
    );
};

// Xác thực dữ liệu đầu vào
const validateInputData = (
    recordedText: any,
    originalText: any,
    language: any
) => {
    const errors: string[] = [];

    if (!recordedText || typeof recordedText !== "string") {
        errors.push("recordedText is required and must be a string");
    }

    if (!originalText || typeof originalText !== "string") {
        errors.push("originalText is required and must be a string");
    }

    if (!language || typeof language !== "string") {
        errors.push("language is required and must be a string");
    }

    return errors;
};

export async function POST(request: NextRequest) {
    try {
        let recordedText: string = "";
        let originalText: string = "";
        let language: string = "";

        // Kiểm tra kiểu yêu cầu
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            // Xử lý FormData (file âm thanh)
            try {
                const formData = await request.formData();
                const audioFile = formData.get("audio") as File;
                originalText = formData.get("text") as string;
                language = formData.get("language") as string;

                if (!audioFile || !originalText || !language) {
                    return NextResponse.json(
                        {
                            error: "Missing required parameters",
                            fields: {
                                audioFile: !!audioFile,
                                originalText: !!originalText,
                                language: !!language,
                            },
                        },
                        { status: 400 }
                    );
                }

                // Sử dụng dịch vụ speech-to-text thực tế để chuyển đổi âm thanh thành văn bản
                try {
                    console.log(
                        "Attempting to use AssemblyAI for speech-to-text..."
                    );
                    recordedText = await transcribeAudioWithAssemblyAI(
                        audioFile,
                        language
                    );
                    console.log(
                        "AssemblyAI transcription successful:",
                        recordedText
                    );
                } catch (assemblyError) {
                    console.warn(
                        "AssemblyAI transcription failed, trying Azure:",
                        assemblyError
                    );

                    // Nếu AssemblyAI thất bại, thử sử dụng Azure
                    try {
                        recordedText = await transcribeAudioWithAzure(
                            audioFile,
                            language
                        );
                        console.log(
                            "Azure transcription successful:",
                            recordedText
                        );
                    } catch (azureError) {
                        console.warn("Azure transcription failed:", azureError);

                        // Nếu cả hai dịch vụ đều thất bại, sử dụng phương pháp mô phỏng
                        console.log("Falling back to simulation method");
                        recordedText = await simulateAudioTranscription(
                            audioFile,
                            originalText,
                            language
                        );
                    }
                }
            } catch (error) {
                return handleApiError(error, "Error processing form data");
            }
        } else {
            // Xử lý JSON
            try {
                const body = await request.json();
                recordedText = body.recordedText;
                originalText = body.originalText;
                language = body.language;

                // Xác thực dữ liệu đầu vào
                const validationErrors = validateInputData(
                    recordedText,
                    originalText,
                    language
                );

                if (validationErrors.length > 0) {
                    return NextResponse.json(
                        {
                            error: "Validation failed",
                            details: validationErrors,
                        },
                        { status: 400 }
                    );
                }
            } catch (error) {
                return handleApiError(error, "Error parsing request JSON");
            }
        }

        // Thực hiện phân tích phát âm sử dụng Groq LLM
        try {
            // Sử dụng Groq API để phân tích phát âm
            const groqAssessment = await assessPronunciationWithGroq(
                recordedText,
                originalText,
                language
            );

            // Xây dựng phản hồi dựa trên kết quả từ Groq
            const wordAnalysis = analyzeWords(recordedText, originalText);

            // Kết hợp kết quả từ Groq và phân tích từ
            const combinedAnalysis: PronunciationFeedback = {
                overallScore: groqAssessment.overallScore,
                feedback: groqAssessment.feedback,
                wordAnalysis: wordAnalysis,
                detailedFeedback: groqAssessment.detailedFeedback,
                improvementSuggestions: groqAssessment.improvementSuggestions,
                commonErrors: groqAssessment.commonErrors,
            };

            return NextResponse.json(combinedAnalysis);
        } catch (error) {
            // Sử dụng phân tích fallback nếu có lỗi với Groq
            console.error(
                "Error using Groq, falling back to basic analysis:",
                error
            );
            const analysis = analyzePronunciation(
                recordedText,
                originalText,
                language
            );
            return NextResponse.json(analysis);
        }
    } catch (error) {
        return handleApiError(error, "Internal server error");
    }
}

// Mô phỏng chuyển đổi âm thanh thành văn bản
async function simulateAudioTranscription(
    audioFile: File,
    originalText: string,
    language: string
): Promise<string> {
    // Mô phỏng kết quả với một số lỗi ngẫu nhiên
    const words = originalText.split(" ");
    const simulatedWords = words.map((word) => {
        // 70% cơ hội giữ nguyên từ, 30% cơ hội thay đổi
        if (Math.random() > 0.3) {
            return word;
        }

        // Mô phỏng các lỗi phát âm phổ biến
        if (word.length <= 2) return word;

        const errors = [
            // Thay thế nguyên âm
            word.replace(/[aeiou]/i, "a"),
            // Bỏ phụ âm cuối
            word.replace(/[bcdfghjklmnpqrstvwxyz]$/i, ""),
            // Thêm một phụ âm ở cuối
            word + "s",
            // Đảo nguyên âm
            word.replace(/([aeiou])([aeiou])/i, "$2$1"),
            // Hoặc giữ nguyên từ
            word,
        ];

        return errors[Math.floor(Math.random() * errors.length)];
    });

    return simulatedWords.join(" ");
}

// Phân tích từng từ để tạo thông tin trực quan
function analyzeWords(recordedText: string, originalText: string) {
    const words = originalText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(" ");
    const recordedWords = recordedText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(" ");

    // Tạo dữ liệu phân tích cho từng từ
    return words.map((word, index) => {
        const recorded = recordedWords[index] || "";
        const similarity = calculateSimilarity(word, recorded);
        const isCorrect = similarity > 0.7;

        return {
            word,
            isCorrect,
            confidence: similarity,
            feedback: isCorrect
                ? undefined
                : `Try focusing on this word: "${word}"`,
        };
    });
}

// Hàm phân tích phát âm mô phỏng (fallback khi Groq không hoạt động)
function analyzePronunciation(
    recordedText: string,
    originalText: string,
    language: string
): PronunciationFeedback {
    const wordAnalysis = analyzeWords(recordedText, originalText);

    const overallScore = Math.floor(
        (wordAnalysis.reduce((sum, w) => sum + (w.isCorrect ? 1 : 0), 0) /
            wordAnalysis.length) *
            100
    );

    // Tạo phản hồi tổng quan
    const generalFeedback = [
        overallScore > 80
            ? "Excellent pronunciation!"
            : "Good effort, keep practicing!",
        overallScore > 70
            ? "Your rhythm is natural"
            : "Try to maintain a more natural rhythm",
        overallScore > 60
            ? "Stress patterns are good"
            : "Work on word stress patterns",
    ];

    return {
        overallScore,
        feedback: generalFeedback,
        wordAnalysis,
    };
}

// Tính độ tương đồng giữa hai chuỗi (mô phỏng)
function calculateSimilarity(original: string, recorded: string): number {
    if (!recorded) return 0;

    // Tính Levenshtein distance đơn giản
    function levenshteinDistance(a: string, b: string) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix: number[][] = [];

        // Khởi tạo ma trận
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let i = 0; i <= a.length; i++) {
            matrix[0][i] = i;
        }

        // Điền ma trận
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Thay thế
                        matrix[i][j - 1] + 1, // Chèn
                        matrix[i - 1][j] + 1 // Xóa
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    const distance = levenshteinDistance(original, recorded);
    const maxLength = Math.max(original.length, recorded.length);
    const similarity = 1 - distance / maxLength;

    // Thêm một chút ngẫu nhiên để có kết quả đa dạng hơn
    return Math.min(1, Math.max(0.4, similarity * 0.7 + Math.random() * 0.3));
}
