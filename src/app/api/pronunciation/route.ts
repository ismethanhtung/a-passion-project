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

// Sử dụng Node.js runtime để hỗ trợ các thư viện xử lý âm thanh
export const runtime = "nodejs";

/**
 * Xử lý yêu cầu đánh giá phát âm
 */
export async function POST(req: NextRequest) {
    try {
        console.log("Nhận yêu cầu đánh giá phát âm");

        // Kiểm tra nếu là FormData (từ ghi âm trực tiếp)
        if (req.headers.get("content-type")?.includes("multipart/form-data")) {
            console.log("Xử lý yêu cầu dạng FormData");
            const formData = await req.formData();

            // Lấy các tham số từ FormData
            const audioFile = formData.get("audio") as File;
            const originalText = formData.get("text") as string;
            const language = formData.get("language") as string;
            let recordedText = formData.get("recordedText") as string;

            console.log("Thông tin yêu cầu:", {
                hasAudio: !!audioFile,
                audioSize: audioFile ? audioFile.size : 0,
                originalText,
                language,
                hasRecordedText: !!recordedText,
            });

            // Nếu có file âm thanh nhưng không có văn bản đã ghi, gửi đến API speech-to-text
            if (audioFile && !recordedText) {
                console.log("Gửi âm thanh đến API speech-to-text để nhận dạng");

                try {
                    // Tạo FormData mới để gửi đến API speech-to-text
                    const speechFormData = new FormData();
                    speechFormData.append("audio", audioFile);
                    speechFormData.append("language", language);

                    // Gọi API speech-to-text nội bộ
                    const speechResponse = await fetch(
                        new URL("/api/speech-to-text", req.url).toString(),
                        {
                            method: "POST",
                            body: speechFormData,
                        }
                    );

                    if (!speechResponse.ok) {
                        throw new Error(
                            `Lỗi API speech-to-text: ${speechResponse.status} ${speechResponse.statusText}`
                        );
                    }

                    const speechData = await speechResponse.json();
                    recordedText = speechData.transcription || "";
                    console.log("Văn bản đã nhận dạng:", recordedText);
                } catch (error) {
                    console.error("Lỗi khi gọi API speech-to-text:", error);
                    return NextResponse.json(
                        {
                            error: "Không thể nhận dạng giọng nói",
                            details:
                                error instanceof Error
                                    ? error.message
                                    : String(error),
                        },
                        { status: 500 }
                    );
                }
            }

            // Nếu có văn bản gốc và văn bản đã ghi, đánh giá phát âm
            if (originalText && recordedText) {
                console.log("Đánh giá phát âm với Groq API");
                const pronunciationFeedback = await assessPronunciationWithGroq(
                    recordedText,
                    originalText,
                    language
                );

                return NextResponse.json({
                    ...pronunciationFeedback,
                    recordedText,
                });
            } else if (recordedText) {
                // Nếu chỉ có văn bản đã ghi, trả về kết quả nhận dạng
                return NextResponse.json({
                    recordedText,
                });
            } else {
                // Nếu không có cả văn bản gốc và văn bản đã ghi
                return NextResponse.json(
                    { error: "Không đủ thông tin để đánh giá phát âm" },
                    { status: 400 }
                );
            }
        } else {
            // Xử lý yêu cầu JSON
            console.log("Xử lý yêu cầu dạng JSON");
            const { recordedText, originalText, language } = await req.json();

            if (!recordedText || !originalText) {
                return NextResponse.json(
                    { error: "Thiếu văn bản để đánh giá" },
                    { status: 400 }
                );
            }

            console.log("Đánh giá phát âm với Groq API");
            const pronunciationFeedback = await assessPronunciationWithGroq(
                recordedText,
                originalText,
                language || "en-US"
            );

            return NextResponse.json(pronunciationFeedback);
        }
    } catch (error) {
        console.error("Lỗi khi xử lý yêu cầu đánh giá phát âm:", error);
        return NextResponse.json(
            {
                error: "Lỗi khi xử lý yêu cầu",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
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
