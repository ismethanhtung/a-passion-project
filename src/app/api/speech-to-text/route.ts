import { NextRequest, NextResponse } from "next/server";
import { assessPronunciationWithGroq } from "@/lib/groq-service";

// Sử dụng Web Speech Recognition API thông qua edge runtime
export const runtime = "edge";

// Định nghĩa kiểu cho phản hồi phân tích phát âm
type PronunciationFeedback = {
    overallScore: number;
    feedback: string[];
    wordAnalysis: Array<{
        word: string;
        isCorrect: boolean;
        feedback?: string;
        confidence: number;
    }>;
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

export async function POST(request: NextRequest) {
    try {
        // Xử lý FormData (file âm thanh)
        const formData = await request.formData();
        const audioFile = formData.get("audio") as File | null;
        const originalText = formData.get("text") as string;
        const language = formData.get("language") as string;

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

        // Sử dụng dịch vụ Speech to Text - Thực hiện chuyển đổi âm thanh thành văn bản
        let transcription = "";

        try {
            // Trong môi trường thực tế, sử dụng một dịch vụ STT như:
            // 1. Google Cloud Speech-to-Text
            // 2. Azure Speech Services
            // 3. Amazon Transcribe

            // Ví dụ: nếu bạn muốn sử dụng Google Cloud Speech-to-Text:
            // transcription = await convertSpeechToTextWithGoogleCloud(audioFile, language);

            // Ví dụ: nếu bạn muốn sử dụng Azure Speech Services:
            // transcription = await convertSpeechToTextWithAzure(audioFile, language);

            // Hiện tại, WebSpeech API chỉ hoạt động ở client-side, không thể gọi trực tiếp từ server
            // Nên chúng ta sẽ tiếp tục mô phỏng ở server, và sẽ dùng WebSpeech API thực tế ở client-side

            // Phiên bản nâng cấp tạm thời - tự nhiên hơn, nhưng vẫn là mô phỏng
            transcription = await enhancedSimulateSpeechToText(
                audioFile,
                originalText,
                language
            );
        } catch (error) {
            return handleApiError(error, "Error processing speech to text");
        }

        // Phân tích phát âm sử dụng Groq AI
        try {
            // Sử dụng Groq API để phân tích phát âm sâu hơn
            const analysis = await assessPronunciationWithGroq(
                transcription,
                originalText,
                language
            );

            return NextResponse.json({
                transcription,
                analysis,
                originalText,
            });
        } catch (error) {
            // Nếu Groq gặp lỗi, sử dụng phương pháp phân tích cơ bản
            console.error(
                "Error using Groq, falling back to basic analysis:",
                error
            );

            const basicAnalysis = analyzePronunciation(
                transcription,
                originalText,
                language
            );

            return NextResponse.json({
                transcription,
                analysis: basicAnalysis,
                originalText,
            });
        }
    } catch (error) {
        return handleApiError(error, "Internal server error");
    }
}

// Phương pháp mô phỏng cải tiến - thông minh hơn để giống thực tế
async function enhancedSimulateSpeechToText(
    audioFile: File,
    originalText: string,
    language: string
): Promise<string> {
    // Mô phỏng kết quả với độ chính xác thay đổi dựa trên độ dài và phức tạp của văn bản
    return new Promise((resolve) => {
        setTimeout(() => {
            const words = originalText.split(/\s+/);
            const complexity = Math.min(words.length * 0.1, 1); // Độ phức tạp tăng theo độ dài

            const simulatedWords = words.map((word) => {
                // Xác suất giữ nguyên từ giảm dần theo độ phức tạp và độ dài từ
                const keepWordProbability =
                    0.8 - complexity * 0.2 - (word.length > 7 ? 0.1 : 0);
                if (Math.random() < keepWordProbability) {
                    return word;
                }

                // Mô phỏng các lỗi phát âm phổ biến, ngày càng thực tế hơn
                if (word.length <= 2) return word; // Từ ngắn ít sai

                // Lỗi phụ thuộc vào ngôn ngữ
                let errors: string[] = [];
                if (language.startsWith("en")) {
                    // Lỗi tiếng Anh phổ biến
                    errors = [
                        word.replace(/th/i, "t"), // "this" -> "tis"
                        word.replace(/v/i, "b"), // "very" -> "bery"
                        word.replace(/r/i, "l"), // "right" -> "light"
                        word.replace(/[aeiou]/i, getRandomVowel()), // Thay thế nguyên âm ngẫu nhiên
                        word.replace(/ing$/, "in"), // "running" -> "runnin"
                        word.replace(/ed$/, "t"), // "walked" -> "walkt"
                        word, // Giữ nguyên từ
                    ];
                } else if (language.startsWith("fr")) {
                    // Lỗi tiếng Pháp phổ biến
                    errors = [
                        word.replace(/r/g, "h"), // Phát âm "r" kiểu Pháp
                        word.replace(/u/g, "ou"), // Khó phát âm "u" tiếng Pháp
                        word.replace(/eu/g, "e"), // "deux" -> "dex"
                        word, // Giữ nguyên từ
                    ];
                } else {
                    // Lỗi chung cho các ngôn ngữ khác
                    errors = [
                        word.replace(/[aeiou]/i, getRandomVowel()),
                        word.replace(/[bcdfghjklmnpqrstvwxyz]$/i, ""),
                        word + "s",
                        word,
                    ];
                }

                return errors[Math.floor(Math.random() * errors.length)];
            });

            // Thêm khả năng bỏ từ, thêm từ, hoặc đảo vị trí
            let finalResult = [...simulatedWords]; // Tạo bản sao để tránh thay đổi mảng gốc

            // 20% khả năng bỏ một từ ngẫu nhiên
            if (words.length > 3 && Math.random() < 0.2) {
                const indexToRemove = Math.floor(
                    Math.random() * finalResult.length
                );
                finalResult.splice(indexToRemove, 1);
            }

            // 10% khả năng lặp lại một từ
            if (Math.random() < 0.1 && finalResult.length > 0) {
                const indexToRepeat = Math.floor(
                    Math.random() * finalResult.length
                );
                finalResult.splice(
                    indexToRepeat,
                    0,
                    finalResult[indexToRepeat]
                );
            }

            resolve(finalResult.join(" "));
        }, 1000); // Mô phỏng độ trễ xử lý
    });
}

// Hàm trợ giúp tạo nguyên âm ngẫu nhiên
function getRandomVowel(): string {
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels[Math.floor(Math.random() * vowels.length)];
}

// Phân tích phát âm cơ bản (fallback khi Groq không hoạt động)
function analyzePronunciation(
    recordedText: string,
    originalText: string,
    language: string
): PronunciationFeedback {
    const words = originalText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(/\s+/);
    const recordedWords = recordedText
        .toLowerCase()
        .replace(/[.,?!]/g, "")
        .split(/\s+/);

    // Tạo dữ liệu phân tích cho từng từ
    const wordAnalysis = words.map((word, index) => {
        const recorded = recordedWords[index] || "";
        const similarity = calculateSimilarity(word, recorded);
        const isCorrect = similarity > 0.7;

        return {
            word,
            isCorrect,
            confidence: similarity,
            feedback: isCorrect ? undefined : getSuggestion(word, language),
        };
    });

    const overallScore = Math.floor(
        (wordAnalysis.reduce((sum, w) => sum + (w.isCorrect ? 1 : 0), 0) /
            wordAnalysis.length) *
            100
    );

    // Tạo phản hồi tổng quan dựa trên điểm số
    const generalFeedback = getGeneralFeedback(overallScore, language);

    return {
        overallScore,
        feedback: generalFeedback,
        wordAnalysis,
        detailedFeedback: generateDetailedFeedback(
            recordedText,
            originalText,
            overallScore,
            language
        ),
        improvementSuggestions: generateImprovementSuggestions(
            wordAnalysis,
            language
        ),
        commonErrors: identifyCommonErrors(wordAnalysis, language),
    };
}

// Tính độ tương đồng giữa hai chuỗi
function calculateSimilarity(original: string, recorded: string): number {
    if (!recorded) return 0;

    // Tính Levenshtein distance
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

    // Phiên bản thực tế hơn
    return Math.min(1, Math.max(0, similarity));
}

// Tạo gợi ý cụ thể cho từng từ
function getSuggestion(word: string, language: string): string {
    // Các gợi ý dựa theo ngôn ngữ
    const suggestions: { [key: string]: string[] } = {
        "en-US": [
            `Tập trung vào âm nguyên âm trong "${word}"`,
            `Thử phát âm "${word}" chậm rãi, từng âm tiết một`,
            `Trọng âm nên đặt ở âm tiết ${
                Math.random() > 0.5 ? "đầu tiên" : "thứ hai"
            } của "${word}"`,
            `Nghe người bản xứ nói "${word}" và bắt chước âm thanh`,
            `Vị trí lưỡi của bạn cần điều chỉnh khi phát âm "${word}"`,
            `Cố gắng phát âm rõ các phụ âm cuối của "${word}"`,
        ],
        "en-GB": [
            `Chú ý đến phát âm kiểu Anh của "${word}"`,
            `Âm "r" trong "${word}" ít rõ hơn trong tiếng Anh-Anh`,
            `Thử phát âm "${word}" với khẩu hình tròn hơn`,
            `Nguyên âm trong "${word}" nên kéo dài hơn trong tiếng Anh-Anh`,
        ],
        default: [
            `Tập trung vào trọng âm chính xác trong "${word}"`,
            `Thử phát âm "${word}" chậm hơn`,
            `Lắng nghe cẩn thận cách người bản xứ phát âm "${word}"`,
        ],
    };

    // Sử dụng gợi ý theo ngôn ngữ hoặc mặc định nếu không có
    const languageSuggestions = suggestions[language] || suggestions["default"];
    return languageSuggestions[
        Math.floor(Math.random() * languageSuggestions.length)
    ];
}

// Phản hồi tổng quan dựa trên điểm số
function getGeneralFeedback(score: number, language: string): string[] {
    const feedbackByScore: { [key: string]: { [key: number]: string[] } } = {
        "en-US": {
            90: [
                "Phát âm tuyệt vời! Bạn nghe rất tự nhiên.",
                "Nhịp điệu và ngữ điệu của bạn rất chuẩn xác!",
                "Người bản xứ sẽ hiểu bạn hoàn toàn.",
            ],
            80: [
                "Phát âm rất tốt nhìn chung.",
                "Nhịp điệu của bạn tự nhiên và rõ ràng.",
                "Hãy luyện tập thêm một vài âm tinh tế để hoàn hảo.",
            ],
            70: [
                "Phát âm tốt với một số điểm cần cải thiện.",
                "Lời nói của bạn dễ hiểu nhưng có một số yếu tố không giống người bản xứ.",
                "Tập trung vào các từ được đánh dấu để cải thiện.",
            ],
            60: [
                "Phát âm tạm ổn, nhưng giọng nước ngoài khá rõ.",
                "Một số từ cần luyện tập thêm.",
                "Hãy thử nói chậm hơn và phát âm rõ ràng hơn.",
            ],
            0: [
                "Phát âm của bạn cần luyện tập nhiều hơn.",
                "Tập trung vào các âm cơ bản của tiếng Anh.",
                "Hãy lặp lại theo người bản xứ từng từ một.",
                "Luyện tập cẩn thận các từ được đánh dấu.",
            ],
        },
        default: {
            90: ["Phát âm xuất sắc!", "Bạn nghe rất tự nhiên."],
            80: ["Phát âm rất tốt.", "Hãy tiếp tục phát huy!"],
            70: ["Phát âm tốt nhưng vẫn có thể cải thiện thêm."],
            60: ["Tiếp tục luyện tập để cải thiện phát âm."],
            0: ["Tập trung vào âm cơ bản và nhịp điệu của ngôn ngữ."],
        },
    };

    // Xác định ngưỡng điểm thích hợp
    const thresholds = [90, 80, 70, 60, 0];
    const threshold = thresholds.find((t) => score >= t) || 0;

    // Lấy phản hồi theo ngôn ngữ và điểm số
    const languageFeedback =
        feedbackByScore[language] || feedbackByScore["default"];
    return languageFeedback[threshold] || languageFeedback[0];
}

// Tạo phản hồi chi tiết
function generateDetailedFeedback(
    recordedText: string,
    originalText: string,
    score: number,
    language: string
): string {
    // So sánh độ dài và số từ
    const origWords = originalText.split(/\s+/);
    const recWords = recordedText.split(/\s+/);

    const lengthDiff = Math.abs(origWords.length - recWords.length);
    const hasLengthIssue = lengthDiff > 0;

    let feedback = "";

    if (score >= 90) {
        feedback = `Phát âm của bạn rất xuất sắc! Bạn đã phát âm chính xác hầu hết các từ, với nhịp điệu và ngữ điệu tự nhiên. ${
            hasLengthIssue
                ? `Tuy nhiên, bạn ${
                      origWords.length > recWords.length ? "bỏ qua" : "thêm"
                  } ${lengthDiff} từ.`
                : ""
        }`;
    } else if (score >= 80) {
        feedback = `Phát âm của bạn rất tốt. Hầu hết các từ đều rõ ràng và chính xác. ${
            hasLengthIssue
                ? `Có ${lengthDiff} từ ${
                      origWords.length > recWords.length
                          ? "bị bỏ qua"
                          : "được thêm vào"
                  }.`
                : ""
        } Bạn có thể cải thiện thêm về nhịp điệu và trọng âm trong một số từ.`;
    } else if (score >= 70) {
        feedback = `Phát âm của bạn khá tốt và dễ hiểu. ${
            hasLengthIssue
                ? `Có ${lengthDiff} từ ${
                      origWords.length > recWords.length
                          ? "bị bỏ qua"
                          : "được thêm vào"
                  }.`
                : ""
        } Một số từ cần luyện tập thêm, đặc biệt là những từ có phụ âm cuối hoặc các nguyên âm đặc biệt.`;
    } else if (score >= 60) {
        feedback = `Phát âm của bạn ở mức trung bình. Người nghe có thể hiểu nhưng phải cố gắng. ${
            hasLengthIssue
                ? `Bạn đã ${
                      origWords.length > recWords.length ? "bỏ qua" : "thêm"
                  } ${lengthDiff} từ.`
                : ""
        } Cần chú ý đến trọng âm, nhịp điệu và phát âm rõ ràng hơn.`;
    } else {
        feedback = `Phát âm của bạn cần được cải thiện nhiều. ${
            hasLengthIssue
                ? `Có ${lengthDiff} từ ${
                      origWords.length > recWords.length
                          ? "bị bỏ qua"
                          : "được thêm vào"
                  }.`
                : ""
        } Hãy tập trung vào việc phát âm từng từ một cách rõ ràng, và luyện tập nhịp điệu cơ bản.`;
    }

    return feedback;
}

// Tạo các gợi ý cải thiện
function generateImprovementSuggestions(
    wordAnalysis: any[],
    language: string
): string[] {
    const incorrectWords = wordAnalysis.filter((w) => !w.isCorrect);

    if (incorrectWords.length === 0)
        return ["Tiếp tục duy trì phát âm tốt của bạn!"];

    // Gợi ý chung
    const commonSuggestions = [
        "Luyện tập từng từ một cách chậm rãi, tập trung vào từng âm tiết.",
        "Hãy ghi âm và nghe lại giọng nói của bạn để phát hiện lỗi.",
        "Sử dụng ứng dụng này thường xuyên để theo dõi tiến độ của bạn.",
    ];

    // Gợi ý dựa trên từ sai cụ thể
    const specificSuggestions: string[] = [];

    if (incorrectWords.length <= 3) {
        // Nếu có ít từ sai, đưa ra gợi ý cụ thể cho từng từ
        incorrectWords.forEach((word) => {
            specificSuggestions.push(
                `Tập trung vào từ "${word.word}" - ${
                    word.feedback?.replace(
                        /^Try focusing on this word: /,
                        ""
                    ) || "cần luyện tập nhiều hơn"
                }`
            );
        });
    } else {
        // Nếu nhiều từ sai, đưa ra gợi ý tổng quát hơn
        specificSuggestions.push(
            `Tập trung vào ${incorrectWords.length} từ được đánh dấu đỏ phía trên.`
        );

        // Phân tích xem có vấn đề về nguyên âm, phụ âm, hay ngữ điệu
        const hasVowelIssues = incorrectWords.some((w) =>
            /[aeiou]/i.test(w.word)
        );
        const hasConsonantIssues = incorrectWords.some((w) =>
            /[bcdfghjklmnpqrstvwxyz]{2,}/i.test(w.word)
        );

        if (hasVowelIssues) {
            specificSuggestions.push(
                "Tập trung vào phát âm nguyên âm chính xác hơn, đặc biệt là các nguyên âm dài và ngắn."
            );
        }

        if (hasConsonantIssues) {
            specificSuggestions.push(
                "Chú ý đến các tổ hợp phụ âm, đặc biệt là ở cuối từ."
            );
        }
    }

    // Kết hợp các gợi ý chung và cụ thể
    return [...specificSuggestions, ...commonSuggestions.slice(0, 2)];
}

// Xác định lỗi phổ biến
function identifyCommonErrors(wordAnalysis: any[], language: string): string[] {
    const incorrectWords = wordAnalysis.filter((w) => !w.isCorrect);

    if (incorrectWords.length === 0) return [];

    const errors: string[] = [];

    // Phân tích các từ sai để tìm mẫu lỗi chung
    const wordsSorted = incorrectWords
        .map((w) => w.word)
        .sort()
        .join(" ");

    // Kiểm tra lỗi về phụ âm cuối
    if (/[bdgptkszʃʒfvθð]$/.test(wordsSorted)) {
        errors.push(
            "Bạn thường bỏ qua hoặc phát âm không rõ các phụ âm cuối từ."
        );
    }

    // Kiểm tra lỗi về nguyên âm
    if (/[aeiou]{2}/.test(wordsSorted)) {
        errors.push("Bạn gặp khó khăn với các nguyên âm đôi hoặc âm đôi.");
    }

    // Kiểm tra lỗi về từ dài
    if (incorrectWords.some((w) => w.word.length > 6)) {
        errors.push("Các từ dài hơn thường khó phát âm hơn với bạn.");
    }

    // Kiểm tra lỗi về âm đặc biệt theo ngôn ngữ
    if (language.startsWith("en") && /th|r|l|w/.test(wordsSorted)) {
        errors.push(
            "Âm đặc biệt của tiếng Anh như 'th', 'r', 'l', 'w' gây khó khăn cho bạn."
        );
    }

    // Thêm một lỗi chung nếu ít lỗi được xác định
    if (errors.length < 2) {
        errors.push("Nhịp điệu và ngữ điệu của bạn đôi khi không tự nhiên.");
    }

    return errors;
}
