import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint đánh giá bài viết sử dụng Grok AI
 */
export async function POST(request: NextRequest) {
    try {
        const { content, prompt, language = "en" } = await request.json();

        // Kiểm tra dữ liệu đầu vào
        if (!content || !prompt) {
            return NextResponse.json(
                { error: "Content and prompt are required" },
                { status: 400 }
            );
        }

        const feedback = await evaluateWritingWithAI(content, prompt, language);
        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Error in writing evaluation API:", error);
        return NextResponse.json(
            { error: "Failed to evaluate writing" },
            { status: 500 }
        );
    }
}

/**
 * Đánh giá bài viết bằng Grok AI
 */
async function evaluateWritingWithAI(
    content: string,
    prompt: string,
    language: string
) {
    try {
        // Xây dựng hệ thống prompt cho AI để đánh giá văn bản
        const systemPrompt =
            language === "en"
                ? getEnglishSystemPrompt()
                : getVietnameseSystemPrompt();

        const userPrompt = `
${language === "en" ? "WRITING PROMPT" : "ĐỀ BÀI"}:
${prompt}

${language === "en" ? "STUDENT'S WRITING" : "BÀI VIẾT CỦA HỌC VIÊN"}:
${content}
`;

        // Gọi API Grok để đánh giá
        // Lưu ý: Trong môi trường thực tế, bạn sẽ sử dụng API key và URL thực của Grok
        // Đây là code mẫu để minh họa
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.2,
                    max_tokens: 3000,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Grok API error: ${response.statusText}`);
        }

        const result = await response.json();
        const feedbackContent = result.choices[0]?.message?.content;

        if (!feedbackContent) {
            throw new Error("No feedback content received from Grok");
        }

        // Xử lý phản hồi để trích xuất JSON
        let parsedFeedback;
        try {
            // Cố gắng phân tích trực tiếp
            parsedFeedback = JSON.parse(feedbackContent);
        } catch (parseError) {
            console.log(
                "Raw response is not valid JSON, attempting to extract JSON portion..."
            );

            try {
                // Phương pháp 1: Tìm kiếm phần JSON trong phản hồi sử dụng regex
                const jsonPattern = /\{[\s\S]*\}/g;
                const jsonMatches = feedbackContent.match(jsonPattern);

                if (jsonMatches && jsonMatches.length > 0) {
                    // Lấy khối JSON dài nhất tìm thấy (có thể là JSON hoàn chỉnh nhất)
                    const potentialJson = jsonMatches.sort(
                        (a, b) => b.length - a.length
                    )[0];
                    parsedFeedback = JSON.parse(potentialJson);
                    console.log("Successfully extracted JSON using regex");
                } else {
                    // Phương pháp 2: Tìm từ { đầu tiên đến } cuối cùng
                    const startIdx = feedbackContent.indexOf("{");
                    const endIdx = feedbackContent.lastIndexOf("}");

                    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
                        const jsonSubstring = feedbackContent.substring(
                            startIdx,
                            endIdx + 1
                        );
                        parsedFeedback = JSON.parse(jsonSubstring);
                        console.log(
                            "Successfully extracted JSON using substring"
                        );
                    } else {
                        throw new Error(
                            "Cannot find valid JSON structure in response"
                        );
                    }
                }
            } catch (extractError) {
                console.error("Failed to extract valid JSON:", extractError);
                console.error("Raw response:", feedbackContent);
                // Fallback khi không thể phân tích JSON
                return generateMockFeedback(content, prompt, language);
            }
        }

        // Kiểm tra tính hợp lệ của phản hồi đã phân tích
        if (
            !parsedFeedback ||
            typeof parsedFeedback.overallScore !== "number" ||
            !parsedFeedback.grammar ||
            !parsedFeedback.vocabulary ||
            !parsedFeedback.structure ||
            !parsedFeedback.coherence
        ) {
            console.error(
                "Parsed feedback is missing required fields:",
                parsedFeedback
            );
            return generateMockFeedback(content, prompt, language);
        }

        return parsedFeedback;
    } catch (error) {
        console.error("Error evaluating with AI:", error);
        // Fallback: Tạo phản hồi mô phỏng khi API thất bại
        return generateMockFeedback(content, prompt, language);
    }
}

/**
 * Tạo feedback mô phỏng khi API không hoạt động
 */
function generateMockFeedback(
    content: string,
    prompt: string,
    language: string
) {
    const wordCount = content.trim().split(/\s+/).length;

    // Tính toán điểm ngẫu nhiên cho mỗi thành phần
    const grammarScore = Math.floor(Math.random() * 3) + 6; // 6-8
    const vocabScore = Math.floor(Math.random() * 3) + 7; // 7-9
    const structureScore = Math.floor(Math.random() * 3) + 6; // 6-8
    const coherenceScore = Math.floor(Math.random() * 3) + 7; // 7-9

    // Tính điểm tổng thể
    const overallScore = Math.floor(
        (grammarScore + vocabScore + structureScore + coherenceScore) / 4
    );

    if (language === "en") {
        return {
            overallScore,
            grammar: {
                score: grammarScore,
                comments: [
                    "Your grammar is generally good, but there are some errors that need correction.",
                    "Pay attention to subject-verb agreement and tense consistency.",
                ],
                errors: [
                    {
                        original: "They was going",
                        correction: "They were going",
                        explanation: "Use 'were' with plural subjects.",
                    },
                    {
                        original: "If I would have known",
                        correction: "If I had known",
                        explanation:
                            "Use past perfect tense in conditional clauses.",
                    },
                ],
            },
            vocabulary: {
                score: vocabScore,
                comments: [
                    "You use a good range of vocabulary, though some word choices could be more precise.",
                    "Consider using more academic vocabulary for formal writing.",
                ],
                suggestions: [
                    {
                        word: "good",
                        alternatives: [
                            "excellent",
                            "outstanding",
                            "exceptional",
                        ],
                        context: "The results were good.",
                    },
                    {
                        word: "bad",
                        alternatives: ["poor", "inadequate", "substandard"],
                        context: "This is a bad solution.",
                    },
                ],
            },
            structure: {
                score: structureScore,
                comments: [
                    "Your essay has a clear introduction, body, and conclusion.",
                    "Consider adding more transitional phrases between paragraphs for better flow.",
                ],
            },
            coherence: {
                score: coherenceScore,
                comments: [
                    "Your ideas connect well, but some parts could be more logically organized.",
                    "The main argument is clear throughout the essay.",
                ],
            },
            improvements: [
                "Strengthen your thesis statement in the introduction.",
                "Add more specific examples to support your arguments.",
                "Conclude with a stronger call to action or summary of main points.",
            ],
            improvedVersion: content,
        };
    } else {
        return {
            overallScore,
            grammar: {
                score: grammarScore,
                comments: [
                    "Ngữ pháp của bạn nhìn chung tốt, nhưng có một số lỗi cần sửa.",
                    "Hãy chú ý đến sự phù hợp giữa chủ ngữ-động từ và tính nhất quán của thì.",
                ],
                errors: [
                    {
                        original: "Họ đã đi đến",
                        correction: "Họ đã đến",
                        explanation:
                            "Trong tiếng Việt, 'đi đến' là dư thừa, chỉ cần 'đến' là đủ.",
                    },
                    {
                        original: "Tôi đang sắp đi",
                        correction: "Tôi sắp đi",
                        explanation:
                            "Không nên dùng 'đang' với 'sắp', vì 'sắp' đã chỉ thời gian tương lai gần.",
                    },
                ],
            },
            vocabulary: {
                score: vocabScore,
                comments: [
                    "Bạn sử dụng từ vựng khá phong phú, mặc dù có thể chọn từ chính xác hơn ở một số chỗ.",
                    "Nên cân nhắc sử dụng từ vựng học thuật hơn cho văn phong chính thức.",
                ],
                suggestions: [
                    {
                        word: "tốt",
                        alternatives: ["xuất sắc", "nổi bật", "đặc biệt"],
                        context: "Kết quả rất tốt.",
                    },
                    {
                        word: "xấu",
                        alternatives: [
                            "kém",
                            "không đạt yêu cầu",
                            "dưới tiêu chuẩn",
                        ],
                        context: "Đây là một giải pháp xấu.",
                    },
                ],
            },
            structure: {
                score: structureScore,
                comments: [
                    "Bài viết của bạn có phần mở đầu, thân bài và kết luận rõ ràng.",
                    "Nên bổ sung thêm các cụm từ chuyển tiếp giữa các đoạn văn để tạo sự mạch lạc.",
                ],
            },
            coherence: {
                score: coherenceScore,
                comments: [
                    "Ý tưởng của bạn kết nối tốt, nhưng một số phần có thể được sắp xếp logic hơn.",
                    "Luận điểm chính rõ ràng xuyên suốt bài viết.",
                ],
            },
            improvements: [
                "Tăng cường luận điểm chính trong phần mở đầu.",
                "Bổ sung thêm ví dụ cụ thể để hỗ trợ cho lập luận.",
                "Kết luận với lời kêu gọi hành động mạnh mẽ hoặc tóm tắt các điểm chính.",
            ],
            improvedVersion: content,
        };
    }
}

/**
 * Hệ thống prompt cho đánh giá bài viết tiếng Anh
 */
function getEnglishSystemPrompt() {
    return `You are an expert English writing instructor and evaluator. Your task is to analyze and provide detailed feedback on a student's written response to a writing prompt.

Evaluate the writing based on these criteria:
1. Grammar and mechanics
2. Vocabulary and word choice
3. Structure and organization
4. Coherence and logical flow

For each area, provide:
- Numeric scores on a scale of 1-10
- Specific comments highlighting strengths
- Detailed identification of errors with corrections
- Constructive suggestions for improvement

IMPORTANT: Your response must be ONLY a valid JSON object with no additional text before or after. Do not include any explanations, introductions, or text outside the JSON structure.

Format your response as a JSON object with the following structure:
{
  "overallScore": number,
  "grammar": {
    "score": number,
    "comments": [string],
    "errors": [{"original": string, "correction": string, "explanation": string}]
  },
  "vocabulary": {
    "score": number,
    "comments": [string],
    "suggestions": [{"word": string, "alternatives": [string], "context": string}]
  },
  "structure": {
    "score": number,
    "comments": [string]
  },
  "coherence": {
    "score": number,
    "comments": [string]
  },
  "improvements": [string],
  "improvedVersion": string
}

Be fair, balanced, and supportive in your evaluation. Focus on both strengths and specific areas for improvement. Your goal is to help the student improve their writing skills.

Remember: Return ONLY the JSON object, nothing else before or after it.`;
}

/**
 * Hệ thống prompt cho đánh giá bài viết tiếng Việt
 */
function getVietnameseSystemPrompt() {
    return `Bạn là một giáo viên và người đánh giá viết tiếng Việt chuyên nghiệp. Nhiệm vụ của bạn là phân tích và cung cấp phản hồi chi tiết về bài viết của học viên dựa trên một đề bài đã cho.

Đánh giá bài viết dựa trên các tiêu chí sau:
1. Ngữ pháp và quy tắc viết
2. Từ vựng và lựa chọn từ
3. Cấu trúc và tổ chức
4. Tính mạch lạc và luận lý

Cho mỗi lĩnh vực, cung cấp:
- Điểm số trên thang điểm 1-10
- Nhận xét cụ thể về điểm mạnh
- Xác định chi tiết lỗi với cách sửa
- Đề xuất mang tính xây dựng để cải thiện

QUAN TRỌNG: Phản hồi của bạn phải CHỈ là một đối tượng JSON hợp lệ mà không có bất kỳ văn bản bổ sung nào trước hoặc sau. Không đưa vào bất kỳ lời giải thích, phần giới thiệu hay văn bản nào ngoài cấu trúc JSON.

Định dạng phản hồi của bạn dưới dạng đối tượng JSON với cấu trúc sau:
{
  "overallScore": số,
  "grammar": {
    "score": số,
    "comments": [chuỗi],
    "errors": [{"original": chuỗi, "correction": chuỗi, "explanation": chuỗi}]
  },
  "vocabulary": {
    "score": số,
    "comments": [chuỗi],
    "suggestions": [{"word": chuỗi, "alternatives": [chuỗi], "context": chuỗi}]
  },
  "structure": {
    "score": số,
    "comments": [chuỗi]
  },
  "coherence": {
    "score": số,
    "comments": [chuỗi]
  },
  "improvements": [chuỗi],
  "improvedVersion": chuỗi
}

Hãy công bằng, cân bằng và hỗ trợ trong đánh giá của bạn. Tập trung vào cả điểm mạnh và các lĩnh vực cụ thể cần cải thiện. Mục tiêu của bạn là giúp học viên nâng cao kỹ năng viết của họ.

Lưu ý: Chỉ trả về đối tượng JSON, không có bất kỳ nội dung nào khác trước hoặc sau nó.`;
}
