import { NextRequest, NextResponse } from "next/server";
import { assessPronunciationWithGroq } from "@/lib/groq-service";

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
    // Thêm các trường mới
    detailedFeedback?: string;
    improvementSuggestions?: string[];
    commonErrors?: string[];
    recordedText?: string; // Thêm trường này để trả về văn bản đã nhận dạng
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

    if (!recordedText && recordedText !== "") {
        errors.push("recordedText is required (can be empty string)");
    } else if (typeof recordedText !== "string") {
        errors.push("recordedText must be a string");
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
        console.log("API pronunciation: Nhận yêu cầu mới");
        let recordedText: string = "";
        let originalText: string = "";
        let language: string = "";

        // Kiểm tra kiểu yêu cầu
        const contentType = request.headers.get("content-type") || "";
        console.log("Content-Type:", contentType);

        if (contentType.includes("multipart/form-data")) {
            // Xử lý FormData (file âm thanh)
            try {
                console.log(
                    "Đang xử lý yêu cầu multipart/form-data với file âm thanh"
                );
                const formData = await request.formData();

                // Log tất cả các keys trong formData
                console.log("FormData keys:", Array.from(formData.keys()));

                // Lấy dữ liệu từ FormData
                const audioFile = formData.get("audio") as File;
                originalText = formData.get("text") as string;
                language = formData.get("language") as string;
                // recordedText có thể được gửi trực tiếp từ client để tránh phải xử lý âm thanh trên server
                recordedText = (formData.get("recordedText") as string) || "";

                console.log("Thông tin từ form:", {
                    hasAudioFile: !!audioFile,
                    audioFileSize: audioFile ? audioFile.size : 0,
                    audioFileType: audioFile ? audioFile.type : "unknown",
                    originalText: originalText,
                    language: language,
                    recordedText: recordedText || "không có",
                });

                // Chi tiết hơn về recordedText
                if (recordedText) {
                    console.log(
                        `recordedText được nhận từ client: "${recordedText}"`
                    );
                    console.log("Độ dài recordedText:", recordedText.length);
                } else {
                    console.log("Không nhận được recordedText từ client");
                }

                // Xác thực dữ liệu đầu vào
                const validationErrors = validateInputData(
                    recordedText,
                    originalText,
                    language
                );

                if (validationErrors.length > 0) {
                    console.error(
                        "Lỗi xác thực dữ liệu đầu vào:",
                        validationErrors
                    );
                    return NextResponse.json(
                        {
                            error: "Validation failed",
                            details: validationErrors,
                        },
                        { status: 400 }
                    );
                }

                // Nếu không có văn bản được ghi nhận, trả về kết quả với điểm thấp
                if (!recordedText || recordedText.trim() === "") {
                    console.log(
                        "Không có văn bản được ghi nhận, trả về kết quả mặc định với điểm thấp"
                    );
                    const defaultResult: PronunciationFeedback = {
                        overallScore: 10,
                        feedback: [
                            "Không thể nhận dạng được giọng nói của bạn",
                            "Vui lòng thử nói to và rõ ràng hơn",
                        ],
                        wordAnalysis: originalText.split(/\s+/).map((word) => ({
                            word,
                            isCorrect: false,
                            feedback: "Không thể nhận dạng",
                            confidence: 0,
                        })),
                        detailedFeedback:
                            "Hệ thống không thể nhận dạng được giọng nói của bạn. Vui lòng đảm bảo bạn đang nói vào microphone, tăng âm lượng và nói rõ ràng hơn.",
                        improvementSuggestions: [
                            "Nói chậm và rõ ràng hơn",
                            "Đảm bảo microphone hoạt động tốt",
                            "Giảm tiếng ồn xung quanh",
                        ],
                        commonErrors: ["Không phát hiện được lời nói"],
                        recordedText: "",
                    };
                    return NextResponse.json(defaultResult);
                }
            } catch (error) {
                console.error("Lỗi khi xử lý FormData:", error);
                return handleApiError(error, "Error processing form data");
            }
        } else {
            // Xử lý JSON
            try {
                console.log("Đang xử lý yêu cầu JSON");
                const body = await request.json();
                recordedText = body.recordedText;
                originalText = body.originalText;
                language = body.language;

                console.log("Dữ liệu từ request JSON:", {
                    recordedText: recordedText,
                    originalText: originalText,
                    language: language,
                });

                // Xác thực dữ liệu đầu vào
                const validationErrors = validateInputData(
                    recordedText,
                    originalText,
                    language
                );

                if (validationErrors.length > 0) {
                    console.error(
                        "Lỗi xác thực dữ liệu đầu vào:",
                        validationErrors
                    );
                    return NextResponse.json(
                        {
                            error: "Validation failed",
                            details: validationErrors,
                        },
                        { status: 400 }
                    );
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                return handleApiError(error, "Error parsing request JSON");
            }
        }

        // Thực hiện phân tích phát âm sử dụng Groq LLM
        try {
            console.log("Đang phân tích phát âm với Groq LLM...");
            console.log(`Text gốc: "${originalText}"`);
            console.log(`Text đã ghi: "${recordedText}"`);

            // Sử dụng Groq API để phân tích phát âm
            console.log("Đang gọi Groq API để phân tích phát âm...");
            const groqAssessment = await assessPronunciationWithGroq(
                recordedText,
                originalText,
                language
            );
            console.log("Kết quả từ Groq API:", groqAssessment);

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
                recordedText: recordedText, // Trả về văn bản đã nhận dạng
            };

            console.log("Phân tích phát âm hoàn tất, trả về kết quả");
            return NextResponse.json(combinedAnalysis);
        } catch (error) {
            // Sử dụng phân tích fallback nếu có lỗi với Groq
            console.error(
                "Lỗi khi sử dụng Groq, đang sử dụng phân tích cơ bản:",
                error
            );
            const analysis = analyzePronunciation(
                recordedText,
                originalText,
                language
            );

            // Thêm văn bản đã ghi vào kết quả
            analysis.recordedText = recordedText;
            console.log("Đã hoàn thành phân tích cơ bản, trả về kết quả");

            return NextResponse.json(analysis);
        }
    } catch (error) {
        console.error("Lỗi nội bộ của server:", error);
        return handleApiError(error, "Internal server error");
    }
}

// Mô phỏng chuyển đổi âm thanh thành văn bản thông minh
function simulateTranscription(originalText: string): string {
    console.log("Tạo mô phỏng nhận dạng giọng nói từ:", originalText);

    const words = originalText.split(/\s+/);
    let simulatedText = "";

    // Mô phỏng việc nhận dạng với một số lỗi ngẫu nhiên
    for (const word of words) {
        // Tạo xác suất nhận dạng đúng (70-100%)
        const accuracy = Math.random() * 0.3 + 0.7;

        if (accuracy > 0.9) {
            // Nhận dạng chính xác
            simulatedText += word + " ";
        } else if (accuracy > 0.8) {
            // Nhận dạng với lỗi nhỏ
            if (word.length > 3) {
                // Thay đổi một ký tự
                const pos = Math.floor(Math.random() * word.length);
                const chars = word.split("");
                chars[pos] = String.fromCharCode(chars[pos].charCodeAt(0) + 1);
                simulatedText += chars.join("") + " ";
            } else {
                simulatedText += word + " ";
            }
        } else if (accuracy > 0.75) {
            // Bỏ qua từ (mô phỏng người dùng không nói từ này)
            continue;
        } else {
            // Nhận dạng với lỗi nghiêm trọng hơn
            simulatedText +=
                word.substring(0, Math.ceil(word.length * 0.7)) + " ";
        }
    }

    return simulatedText.trim();
}

// Phân tích từng từ để tạo thông tin trực quan
function analyzeWords(recordedText: string, originalText: string) {
    const words = originalText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(/\s+/);
    const recordedWords = recordedText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(/\s+/);

    // Tạo dữ liệu phân tích cho từng từ
    return words.map((word, index) => {
        const recorded = recordedWords[index] || "";
        const similarity = calculateSimilarity(word, recorded);
        const isCorrect = similarity > 0.7;

        let feedback = "";
        if (similarity > 0.9) {
            feedback = "Phát âm tốt";
        } else if (similarity > 0.7) {
            feedback = "Phát âm khá tốt";
        } else if (similarity > 0.5) {
            feedback = "Phát âm cần cải thiện";
        } else if (similarity > 0.3) {
            feedback = "Phát âm có nhiều lỗi";
        } else {
            feedback = "Không phát hiện hoặc phát âm sai";
        }

        return {
            word,
            isCorrect,
            feedback,
            confidence: Math.round(similarity * 100),
        };
    });
}

function analyzePronunciation(
    recordedText: string,
    originalText: string,
    language: string
): PronunciationFeedback {
    // Tách thành các từ riêng biệt
    const originalWords = originalText.toLowerCase().split(/\s+/);
    const recordedWords = recordedText.toLowerCase().split(/\s+/);

    // Tính số từ đúng và phân tích từng từ
    let correctWordsCount = 0;
    const wordAnalysis = originalWords.map((originalWord, index) => {
        const recordedWord =
            index < recordedWords.length ? recordedWords[index] : "";

        // Tính độ tương đồng
        const similarity = calculateSimilarity(originalWord, recordedWord);
        const isCorrect = similarity > 0.7;

        if (isCorrect) {
            correctWordsCount++;
        }

        // Phản hồi cụ thể cho từng từ
        let feedback = "";
        if (similarity > 0.9) {
            feedback = "Phát âm tốt";
        } else if (similarity > 0.7) {
            feedback = "Phát âm khá tốt";
        } else if (similarity > 0.5) {
            feedback = "Phát âm cần cải thiện";
        } else if (similarity > 0.3) {
            feedback = "Phát âm có nhiều lỗi";
        } else {
            feedback = "Không phát hiện hoặc phát âm sai";
        }

        return {
            word: originalWord,
            isCorrect,
            feedback,
            confidence: Math.round(similarity * 100),
        };
    });

    // Tính điểm tổng thể
    const overallScore =
        originalWords.length > 0
            ? Math.round((correctWordsCount / originalWords.length) * 100)
            : 0;

    // Tạo phản hồi dựa trên điểm số
    const feedback: string[] = [];
    if (overallScore >= 90) {
        feedback.push("Phát âm xuất sắc!");
        feedback.push("Bạn đã phát âm hầu hết các từ chính xác.");
    } else if (overallScore >= 70) {
        feedback.push("Phát âm tốt!");
        feedback.push(
            "Bạn đã phát âm đúng nhiều từ, nhưng vẫn còn một số lỗi nhỏ."
        );
    } else if (overallScore >= 50) {
        feedback.push("Phát âm cần cải thiện.");
        feedback.push(
            "Bạn đã phát âm đúng một nửa số từ. Hãy tiếp tục luyện tập."
        );
    } else {
        feedback.push("Phát âm cần nhiều luyện tập.");
        feedback.push(
            "Bạn đang gặp khó khăn với phát âm. Hãy tập trung vào từng từ một."
        );
    }

    // Phân tích chi tiết
    const detailedFeedback = `Bạn đã phát âm đúng ${correctWordsCount}/${
        originalWords.length
    } từ (${overallScore}%). ${
        overallScore >= 70
            ? "Phát âm của bạn khá tự nhiên và rõ ràng."
            : "Hãy tập trung vào việc phát âm từng từ một cách chậm rãi và rõ ràng hơn."
    }`;

    // Gợi ý cải thiện
    const incorrectWords = wordAnalysis.filter((w) => !w.isCorrect);
    const improvementSuggestions: string[] = [
        "Luyện tập phát âm từng từ một cách chậm rãi.",
        "Nghe và bắt chước người bản xứ phát âm.",
        incorrectWords.length > 0
            ? `Tập trung vào các từ: ${incorrectWords
                  .slice(0, 3)
                  .map((w) => w.word)
                  .join(", ")}${incorrectWords.length > 3 ? "..." : ""}`
            : "Tiếp tục luyện tập để phát âm tự nhiên hơn.",
    ];

    // Xác định lỗi phổ biến
    const commonErrors: string[] = [];

    // Nhiều từ bị bỏ qua
    if (recordedWords.length < originalWords.length * 0.8) {
        commonErrors.push("Bạn bỏ qua một số từ khi phát âm.");
    }

    // Nhiều từ phát âm sai
    if (incorrectWords.length > originalWords.length * 0.3) {
        commonErrors.push("Bạn phát âm không chính xác nhiều từ.");
    }

    // Phát âm quá nhanh hoặc không rõ ràng
    if (overallScore < 60) {
        commonErrors.push("Phát âm quá nhanh hoặc không rõ ràng.");
    }

    return {
        overallScore,
        feedback,
        wordAnalysis,
        detailedFeedback,
        improvementSuggestions,
        commonErrors,
    };
}

// Tính toán độ tương đồng giữa hai chuỗi
function calculateSimilarity(original: string, recorded: string): number {
    if (!recorded) return 0;

    const distance = levenshteinDistance(original, recorded);
    const maxLength = Math.max(original.length, recorded.length);

    // Tính toán điểm tương đồng theo phần trăm
    return maxLength > 0 ? Math.max(0, 1 - distance / maxLength) : 1;
}

// Thuật toán Levenshtein Distance để tính khoảng cách giữa hai chuỗi
function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    // Khởi tạo ma trận
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Tính toán khoảng cách
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
