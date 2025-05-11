import { v4 as uuidv4 } from "uuid";

// Định nghĩa kiểu dữ liệu cho chủ đề viết
export type WritingTopic = {
    id: string;
    title: string;
    description: string;
    level: "beginner" | "intermediate" | "advanced";
    category: string;
    prompt: string;
    wordCount?: {
        min: number;
        max: number;
    };
    timeLimit?: number; // thời gian giới hạn tính bằng phút
    language: string; // Ngôn ngữ yêu cầu viết (ví dụ: "en", "fr", "de", "es", "jp")
};

// Định nghĩa kiểu dữ liệu cho bài viết
export type WritingResponse = {
    id: string;
    content: string;
    originalPrompt: string;
    timestamp: string;
    topicId: string;
    language: string;
    title?: string;
    wordCount?: number;
};

// Định nghĩa kiểu dữ liệu cho feedback từ Grok
export type WritingFeedback = {
    writingId: string;
    overallScore: number;
    grammar: {
        score: number;
        comments: string[];
        errors: Array<{
            original: string;
            correction: string;
            explanation: string;
        }>;
    };
    vocabulary: {
        score: number;
        comments: string[];
        suggestions: Array<{
            word: string;
            alternatives: string[];
            context: string;
        }>;
    };
    structure: {
        score: number;
        comments: string[];
    };
    coherence: {
        score: number;
        comments: string[];
    };
    improvements: string[];
    improvedVersion: string;
    timestamp: string;
};

// Singleton service để quản lý các hoạt động liên quan đến writing practice
export class WritingService {
    private static instance: WritingService;
    private readonly STORAGE_KEY = "writing_responses";
    private readonly FEEDBACK_KEY = "writing_feedbacks";

    private constructor() {
        // Private constructor cho singleton pattern
    }

    public static getInstance(): WritingService {
        if (!WritingService.instance) {
            WritingService.instance = new WritingService();
        }
        return WritingService.instance;
    }

    /**
     * Lấy danh sách chủ đề viết dựa trên các tiêu chí lọc
     */
    public getTopics(
        level?: "beginner" | "intermediate" | "advanced",
        category?: string,
        language?: string,
        limit: number = 6
    ): WritingTopic[] {
        let filteredTopics = this.getDefaultTopics();

        if (level) {
            filteredTopics = filteredTopics.filter(
                (topic) => topic.level === level
            );
        }

        if (category) {
            filteredTopics = filteredTopics.filter(
                (topic) => topic.category === category
            );
        }

        if (language) {
            filteredTopics = filteredTopics.filter(
                (topic) => topic.language === language
            );
        }

        // Shuffle array để lấy ngẫu nhiên
        const shuffled = [...filteredTopics].sort(() => 0.5 - Math.random());

        // Trả về số lượng chủ đề theo limit
        return shuffled.slice(0, limit);
    }

    /**
     * Lấy một chủ đề viết ngẫu nhiên
     */
    public getRandomTopic(
        level?: "beginner" | "intermediate" | "advanced",
        category?: string,
        language: string = "en"
    ): WritingTopic {
        const topics = this.getTopics(level, category, language, 10);

        if (topics.length === 0) {
            // Fallback nếu không có chủ đề nào
            return this.getFallbackTopic(language);
        }

        const randomIndex = Math.floor(Math.random() * topics.length);
        return topics[randomIndex];
    }

    /**
     * Lấy chủ đề dự phòng khi không tìm thấy chủ đề phù hợp
     */
    private getFallbackTopic(language: string = "en"): WritingTopic {
        const defaultTopic: WritingTopic = {
            id: "default",
            title: language === "en" ? "General Writing" : "Viết Tổng Quát",
            description:
                language === "en"
                    ? "Practice your general writing skills"
                    : "Luyện tập kỹ năng viết tổng quát",
            level: "intermediate",
            category: language === "en" ? "General" : "Tổng quát",
            prompt:
                language === "en"
                    ? "Write an essay discussing the importance of education in modern society."
                    : "Viết một bài luận thảo luận về tầm quan trọng của giáo dục trong xã hội hiện đại.",
            wordCount: {
                min: 200,
                max: 350,
            },
            timeLimit: 30,
            language: language,
        };

        return defaultTopic;
    }

    /**
     * Tạo chủ đề viết tùy chỉnh từ mô tả
     */
    public async createCustomTopic(
        description: string,
        level: "beginner" | "intermediate" | "advanced" = "intermediate",
        language: string = "en"
    ): Promise<WritingTopic> {
        try {
            // Gọi API để tạo prompt từ mô tả
            const response = await fetch("/api/writing/generate-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description,
                    level,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate writing prompt");
            }

            const data = await response.json();

            // Tính toán word count và time limit dựa trên level
            const wordCountMin =
                level === "beginner"
                    ? 100
                    : level === "intermediate"
                    ? 200
                    : 300;

            const wordCountMax =
                level === "beginner"
                    ? 200
                    : level === "intermediate"
                    ? 350
                    : 500;

            const timeLimit =
                level === "beginner" ? 15 : level === "intermediate" ? 30 : 45;

            return {
                id: uuidv4(),
                title:
                    language === "en"
                        ? `Custom Topic: ${description.slice(0, 30)}${
                              description.length > 30 ? "..." : ""
                          }`
                        : `Chủ đề tùy chỉnh: ${description.slice(0, 30)}${
                              description.length > 30 ? "..." : ""
                          }`,
                description: description,
                level: level,
                category: language === "en" ? "Custom" : "Tùy chỉnh",
                prompt: data.prompt,
                wordCount: {
                    min: wordCountMin,
                    max: wordCountMax,
                },
                timeLimit: timeLimit,
                language: language,
            };
        } catch (error) {
            console.error("Error creating custom topic:", error);

            // Fallback khi API không hoạt động
            return {
                id: uuidv4(),
                title:
                    language === "en"
                        ? `Custom Topic: ${description.slice(0, 30)}${
                              description.length > 30 ? "..." : ""
                          }`
                        : `Chủ đề tùy chỉnh: ${description.slice(0, 30)}${
                              description.length > 30 ? "..." : ""
                          }`,
                description: description,
                level: level,
                category: language === "en" ? "Custom" : "Tùy chỉnh",
                prompt:
                    language === "en"
                        ? `Write an essay about: ${description}. Present your ideas clearly and coherently.`
                        : `Hãy viết một bài văn về chủ đề: ${description}. Trình bày ý kiến của bạn một cách mạch lạc và rõ ràng.`,
                wordCount: {
                    min:
                        level === "beginner"
                            ? 100
                            : level === "intermediate"
                            ? 200
                            : 300,
                    max:
                        level === "beginner"
                            ? 200
                            : level === "intermediate"
                            ? 350
                            : 500,
                },
                timeLimit:
                    level === "beginner"
                        ? 15
                        : level === "intermediate"
                        ? 30
                        : 45,
                language: language,
            };
        }
    }

    /**
     * Lưu bài viết người dùng vào localStorage
     */
    public saveWritingResponse(
        content: string,
        topicId: string,
        originalPrompt: string,
        language: string = "en"
    ): WritingResponse {
        const writingResponse: WritingResponse = {
            id: uuidv4(),
            content,
            originalPrompt,
            timestamp: new Date().toISOString(),
            topicId,
            language,
            wordCount: content.trim().split(/\s+/).length,
        };

        const savedResponses = this.getSavedWritingResponses();
        savedResponses.push(writingResponse);

        // Lưu vào localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(savedResponses)
            );
        }

        return writingResponse;
    }

    /**
     * Lấy tất cả bài viết đã lưu
     */
    public getSavedWritingResponses(): WritingResponse[] {
        if (typeof window === "undefined") return [];

        const savedData = localStorage.getItem(this.STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    }

    /**
     * Lấy bài viết dựa trên ID
     */
    public getWritingResponseById(id: string): WritingResponse | null {
        const savedResponses = this.getSavedWritingResponses();
        return savedResponses.find((response) => response.id === id) || null;
    }

    /**
     * Lấy feedback của bài viết đã lưu
     */
    public getSavedFeedback(writingId: string): WritingFeedback | null {
        if (typeof window === "undefined") return null;

        const savedFeedbacks = localStorage.getItem(this.FEEDBACK_KEY);
        const feedbacks: WritingFeedback[] = savedFeedbacks
            ? JSON.parse(savedFeedbacks)
            : [];

        return (
            feedbacks.find((feedback) => feedback.writingId === writingId) ||
            null
        );
    }

    /**
     * Đánh giá bài viết sử dụng Grok API
     */
    public async evaluateWriting(
        content: string,
        originalPrompt: string,
        writingId: string,
        language: string = "en"
    ): Promise<WritingFeedback> {
        try {
            // Gọi API đánh giá bài viết
            const response = await fetch("/api/writing/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    prompt: originalPrompt,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to evaluate writing");
            }

            const feedbackData = await response.json();

            // Chuyển đổi dữ liệu từ API thành đối tượng WritingFeedback
            const feedback: WritingFeedback = {
                writingId,
                overallScore: feedbackData.overallScore || 0,
                grammar: feedbackData.grammar || {
                    score: 0,
                    comments: [],
                    errors: [],
                },
                vocabulary: feedbackData.vocabulary || {
                    score: 0,
                    comments: [],
                    suggestions: [],
                },
                structure: feedbackData.structure || {
                    score: 0,
                    comments: [],
                },
                coherence: feedbackData.coherence || {
                    score: 0,
                    comments: [],
                },
                improvements: feedbackData.improvements || [],
                improvedVersion: feedbackData.improvedVersion || "",
                timestamp: new Date().toISOString(),
            };

            // Lưu feedback vào localStorage
            this.saveFeedback(feedback);

            return feedback;
        } catch (error) {
            console.error("Error evaluating writing:", error);

            // Fallback khi API không hoạt động: tạo feedback giả
            return this.generateMockFeedback(
                content,
                originalPrompt,
                writingId
            );
        }
    }

    /**
     * Lưu feedback vào localStorage
     */
    private saveFeedback(feedback: WritingFeedback): void {
        if (typeof window === "undefined") return;

        const savedFeedbacks = localStorage.getItem(this.FEEDBACK_KEY);
        const feedbacks: WritingFeedback[] = savedFeedbacks
            ? JSON.parse(savedFeedbacks)
            : [];

        // Thêm feedback mới hoặc cập nhật nếu đã tồn tại
        const existingIndex = feedbacks.findIndex(
            (f) => f.writingId === feedback.writingId
        );

        if (existingIndex >= 0) {
            feedbacks[existingIndex] = feedback;
        } else {
            feedbacks.push(feedback);
        }

        localStorage.setItem(this.FEEDBACK_KEY, JSON.stringify(feedbacks));
    }

    /**
     * Tạo feedback demo khi API không hoạt động
     */
    private generateMockFeedback(
        content: string,
        originalPrompt: string,
        writingId: string
    ): WritingFeedback {
        const wordCount = content.trim().split(/\s+/).length;
        const sentences = content
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 0);

        // Tính toán điểm ngẫu nhiên cho mỗi thành phần
        const grammarScore = Math.floor(Math.random() * 3) + 6; // 6-8
        const vocabScore = Math.floor(Math.random() * 3) + 7; // 7-9
        const structureScore = Math.floor(Math.random() * 3) + 6; // 6-8
        const coherenceScore = Math.floor(Math.random() * 3) + 7; // 7-9

        // Tính điểm tổng thể
        const overallScore = Math.floor(
            (grammarScore + vocabScore + structureScore + coherenceScore) / 4
        );

        return {
            writingId,
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
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Lấy các chủ đề mặc định
     */
    private getDefaultTopics(): WritingTopic[] {
        return [
            {
                id: "environment-en-1",
                title: "Environmental Protection",
                description: "Discuss environmental challenges and solutions",
                level: "intermediate",
                category: "Environment",
                prompt: "Write an essay discussing the most pressing environmental challenges facing our planet today and propose some potential solutions. Include examples of successful environmental initiatives from around the world.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "tech-en-1",
                title: "Technology Impact",
                description: "Analyze how technology has changed society",
                level: "intermediate",
                category: "Technology",
                prompt: "Analyze how technology has transformed daily life in the past decade. Discuss both positive and negative impacts, and consider what these changes might mean for future generations.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "education-en-1",
                title: "Modern Education",
                description: "Discuss the changing landscape of education",
                level: "intermediate",
                category: "Education",
                prompt: "How should education systems evolve to better prepare students for the challenges of the 21st century? Discuss key changes that would improve learning outcomes and better equip young people for the future.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "society-en-1",
                title: "Social Media Effects",
                description: "Examine the impacts of social media",
                level: "intermediate",
                category: "Society",
                prompt: "Examine how social media has affected interpersonal relationships and communication. What are the benefits and drawbacks of these platforms? Has social media ultimately brought people closer together or driven them further apart?",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "culture-en-1",
                title: "Cultural Identity",
                description: "Explore aspects of cultural identity",
                level: "advanced",
                category: "Culture",
                prompt: "In an increasingly globalized world, how important is it to maintain distinct cultural identities? Discuss the tensions between cultural preservation and global integration, using specific examples.",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
                language: "en",
            },
            {
                id: "health-en-1",
                title: "Mental Health Awareness",
                description: "Discuss the importance of mental health",
                level: "intermediate",
                category: "Health",
                prompt: "Discuss the growing awareness of mental health issues in society. What factors have contributed to this increased awareness, and what more can be done to support mental wellbeing?",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "business-en-1",
                title: "Business Ethics",
                description: "Explore ethical considerations in business",
                level: "advanced",
                category: "Business",
                prompt: "To what extent should businesses prioritize ethical considerations over profit? Discuss using specific examples of companies that have succeeded or failed in balancing ethics and profitability.",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
                language: "en",
            },
            {
                id: "travel-en-1",
                title: "Sustainable Tourism",
                description: "Examine sustainable tourism practices",
                level: "intermediate",
                category: "Travel",
                prompt: "Discuss the concept of sustainable tourism and its importance in today's world. How can travelers and tourism industries balance the desire for exploration with environmental and cultural preservation?",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "en",
            },
            {
                id: "science-en-1",
                title: "Scientific Discovery",
                description:
                    "Reflect on the impact of scientific breakthroughs",
                level: "advanced",
                category: "Science",
                prompt: "Choose a major scientific discovery or technological innovation from the past century and analyze its impact on society. How has it changed our understanding of the world or daily life?",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
                language: "en",
            },
            {
                id: "personal-en-1",
                title: "Personal Growth",
                description: "Reflect on personal development",
                level: "beginner",
                category: "Personal",
                prompt: "Describe a challenging experience that contributed significantly to your personal growth. What did you learn from this experience, and how has it changed your perspective?",
                wordCount: {
                    min: 150,
                    max: 250,
                },
                timeLimit: 20,
                language: "en",
            },
            // Danh sách bài viết Tiếng Việt
            {
                id: "environment-vi-1",
                title: "Bảo vệ môi trường",
                description: "Thảo luận về thách thức và giải pháp môi trường",
                level: "intermediate",
                category: "Môi trường",
                prompt: "Viết một bài luận thảo luận về những thách thức môi trường cấp bách nhất mà hành tinh chúng ta đang phải đối mặt và đề xuất một số giải pháp tiềm năng. Đưa ra ví dụ về các sáng kiến môi trường thành công từ khắp nơi trên thế giới.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "vi",
            },
            {
                id: "tech-vi-1",
                title: "Tác động của công nghệ",
                description: "Phân tích ảnh hưởng của công nghệ đối với xã hội",
                level: "intermediate",
                category: "Công nghệ",
                prompt: "Phân tích cách công nghệ đã biến đổi cuộc sống hàng ngày trong thập kỷ qua. Thảo luận về cả tác động tích cực và tiêu cực, và xem xét những thay đổi này có thể có ý nghĩa gì đối với các thế hệ tương lai.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "vi",
            },
            {
                id: "education-vi-1",
                title: "Giáo dục hiện đại",
                description: "Thảo luận về bối cảnh giáo dục đang thay đổi",
                level: "intermediate",
                category: "Giáo dục",
                prompt: "Hệ thống giáo dục nên phát triển như thế nào để chuẩn bị tốt hơn cho học sinh đối mặt với những thách thức của thế kỷ 21? Thảo luận về những thay đổi quan trọng sẽ cải thiện kết quả học tập và trang bị tốt hơn cho người trẻ trong tương lai.",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "vi",
            },
            {
                id: "society-vi-1",
                title: "Ảnh hưởng của mạng xã hội",
                description: "Xem xét tác động của mạng xã hội",
                level: "intermediate",
                category: "Xã hội",
                prompt: "Xem xét mạng xã hội đã ảnh hưởng như thế nào đến các mối quan hệ và giao tiếp giữa mọi người. Lợi ích và hạn chế của các nền tảng này là gì? Mạng xã hội cuối cùng đã kéo mọi người lại gần nhau hơn hay đẩy họ xa nhau?",
                wordCount: {
                    min: 250,
                    max: 400,
                },
                timeLimit: 30,
                language: "vi",
            },
            {
                id: "culture-vi-1",
                title: "Bản sắc văn hóa",
                description: "Khám phá các khía cạnh của bản sắc văn hóa",
                level: "advanced",
                category: "Văn hóa",
                prompt: "Trong một thế giới ngày càng toàn cầu hóa, việc duy trì bản sắc văn hóa riêng biệt quan trọng như thế nào? Thảo luận về những căng thẳng giữa bảo tồn văn hóa và hội nhập toàn cầu, sử dụng các ví dụ cụ thể.",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
                language: "vi",
            },
        ];
    }
}
