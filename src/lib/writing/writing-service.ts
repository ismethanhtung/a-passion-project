import { v4 as uuidv4 } from "uuid";

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
};

export type WritingResponse = {
    content: string;
    originalPrompt: string;
    timestamp: string;
    id: string;
};

export type WritingFeedback = {
    overallScore: number;
    grammar: {
        score: number;
        comments: string[];
        examples: Array<{
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
};

export class WritingService {
    private static instance: WritingService;

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): WritingService {
        if (!WritingService.instance) {
            WritingService.instance = new WritingService();
        }
        return WritingService.instance;
    }

    /**
     * Lấy chủ đề viết ngẫu nhiên dựa trên cấp độ và danh mục
     */
    public getRandomTopic(
        level?: "beginner" | "intermediate" | "advanced",
        category?: string
    ): WritingTopic {
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

        if (filteredTopics.length === 0) {
            // Nếu không có chủ đề phù hợp, trả về một chủ đề mặc định
            return this.getDefaultTopics()[0];
        }

        const randomIndex = Math.floor(Math.random() * filteredTopics.length);
        return filteredTopics[randomIndex];
    }

    /**
     * Tạo chủ đề viết tùy chỉnh dựa trên mô tả
     */
    public async createCustomTopic(
        description: string,
        level: "beginner" | "intermediate" | "advanced" = "intermediate"
    ): Promise<WritingTopic> {
        try {
            // Gọi API để tạo prompt viết từ mô tả
            const response = await fetch("/api/writing/generate-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description,
                    level,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate writing prompt");
            }

            const data = await response.json();

            return {
                id: uuidv4(),
                title: `Chủ đề tùy chỉnh: ${description.slice(0, 30)}${
                    description.length > 30 ? "..." : ""
                }`,
                description: description,
                level: level,
                category: "Tùy chỉnh",
                prompt: data.prompt,
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
                        ? 25
                        : 40,
            };
        } catch (error) {
            console.error("Error creating custom topic:", error);

            // Fallback: Tạo chủ đề cơ bản nếu API không hoạt động
            return {
                id: uuidv4(),
                title: `Chủ đề tùy chỉnh: ${description.slice(0, 30)}${
                    description.length > 30 ? "..." : ""
                }`,
                description: description,
                level: level,
                category: "Tùy chỉnh",
                prompt: `Hãy viết một bài văn về chủ đề: ${description}. Bạn nên trình bày ý kiến của mình một cách rõ ràng và mạch lạc.`,
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
                        ? 25
                        : 40,
            };
        }
    }

    /**
     * Lưu bài viết của người dùng
     */
    public saveWritingResponse(
        content: string,
        originalPrompt: string
    ): WritingResponse {
        const writingResponse: WritingResponse = {
            id: uuidv4(),
            content,
            originalPrompt,
            timestamp: new Date().toISOString(),
        };

        // Lưu vào localStorage
        try {
            const savedResponses = this.getSavedWritingResponses();
            savedResponses.push(writingResponse);
            localStorage.setItem(
                "writingResponses",
                JSON.stringify(savedResponses)
            );
        } catch (error) {
            console.error("Error saving writing response:", error);
        }

        return writingResponse;
    }

    /**
     * Lấy các bài viết đã lưu
     */
    public getSavedWritingResponses(): WritingResponse[] {
        try {
            const savedResponses = localStorage.getItem("writingResponses");
            return savedResponses ? JSON.parse(savedResponses) : [];
        } catch (error) {
            console.error("Error getting saved writing responses:", error);
            return [];
        }
    }

    /**
     * Đánh giá bài viết
     */
    public async evaluateWriting(
        content: string,
        originalPrompt: string,
        language: string = "vi-VN"
    ): Promise<WritingFeedback> {
        try {
            // Gọi API để đánh giá bài viết
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

            const data = await response.json();
            return data.feedback;
        } catch (error) {
            console.error("Error evaluating writing:", error);

            // Trả về đánh giá mẫu nếu API không hoạt động
            return this.generateMockFeedback(content, originalPrompt);
        }
    }

    /**
     * Tạo đánh giá mẫu (sử dụng khi API không hoạt động)
     */
    private generateMockFeedback(
        content: string,
        originalPrompt: string
    ): WritingFeedback {
        const wordCount = content.split(/\s+/).length;
        const sentenceCount = content.split(/[.!?]+/).length;

        // Điểm số tương đối dựa trên độ dài
        const baseScore = Math.min(80, Math.max(60, 65 + wordCount / 50));

        return {
            overallScore: Math.round(baseScore),
            grammar: {
                score: Math.round(baseScore + Math.random() * 10 - 5),
                comments: [
                    "Bài viết của bạn có một số lỗi ngữ pháp cần cải thiện.",
                    "Hãy chú ý đến việc sử dụng đúng thì và thể trong câu.",
                ],
                examples: [
                    {
                        original:
                            "Một đoạn văn mẫu từ bài viết của bạn có thể cần cải thiện.",
                        correction:
                            "Một đoạn văn mẫu từ bài viết của bạn có thể cần được cải thiện.",
                        explanation:
                            'Thêm "được" để câu văn được tự nhiên hơn trong tiếng Việt.',
                    },
                ],
            },
            vocabulary: {
                score: Math.round(baseScore + Math.random() * 10 - 5),
                comments: [
                    "Bạn sử dụng từ vựng khá tốt nhưng đôi khi còn lặp lại.",
                    "Cố gắng đa dạng hóa từ vựng để làm phong phú bài viết.",
                ],
                suggestions: [
                    {
                        word: "tốt",
                        alternatives: [
                            "xuất sắc",
                            "tuyệt vời",
                            "hiệu quả",
                            "lý tưởng",
                        ],
                        context: "Cách diễn đạt này rất tốt.",
                    },
                ],
            },
            structure: {
                score: Math.round(baseScore + Math.random() * 10 - 5),
                comments: [
                    "Cấu trúc bài viết khá rõ ràng nhưng có thể cải thiện.",
                    "Nên có phần mở bài, thân bài và kết luận rõ ràng hơn.",
                ],
            },
            coherence: {
                score: Math.round(baseScore + Math.random() * 10 - 5),
                comments: [
                    "Các ý trong bài viết khá mạch lạc nhưng đôi khi thiếu sự liên kết.",
                    "Sử dụng các từ nối để liên kết các ý tưởng tốt hơn.",
                ],
            },
            improvements: [
                "Cải thiện việc sử dụng từ nối để kết nối các ý tưởng.",
                "Đa dạng hóa cấu trúc câu để bài viết thêm phong phú.",
                "Phát triển ý tưởng chính kỹ hơn với các ví dụ cụ thể.",
                "Chú ý đến việc sử dụng dấu câu đúng cách.",
            ],
            improvedVersion: `${content}\n\n[Phiên bản cải thiện sẽ được cung cấp bởi AI khi kết nối tới API.]`,
        };
    }

    /**
     * Danh sách chủ đề mẫu
     */
    private getDefaultTopics(): WritingTopic[] {
        return [
            {
                id: "w1",
                title: "Môi trường và biến đổi khí hậu",
                description:
                    "Viết về tác động của biến đổi khí hậu và các biện pháp bảo vệ môi trường.",
                level: "intermediate",
                category: "Xã hội",
                prompt: "Biến đổi khí hậu đang là một trong những thách thức lớn nhất của nhân loại. Hãy trình bày về tác động của biến đổi khí hậu đối với đời sống con người và đề xuất các giải pháp để giảm thiểu vấn đề này. Bạn có thể đưa ra các ví dụ cụ thể và ý kiến cá nhân.",
                wordCount: {
                    min: 200,
                    max: 350,
                },
                timeLimit: 25,
            },
            {
                id: "w2",
                title: "Công nghệ và cuộc sống",
                description:
                    "Bàn luận về ảnh hưởng của công nghệ đối với cuộc sống hiện đại.",
                level: "intermediate",
                category: "Công nghệ",
                prompt: "Công nghệ đang ngày càng đóng vai trò quan trọng trong cuộc sống hiện đại. Hãy thảo luận về những ảnh hưởng tích cực và tiêu cực của công nghệ đối với con người, xã hội và môi trường. Bạn có đồng ý rằng lợi ích của công nghệ lớn hơn tác hại? Giải thích quan điểm của bạn với các lập luận và ví dụ cụ thể.",
                wordCount: {
                    min: 200,
                    max: 350,
                },
                timeLimit: 25,
            },
            {
                id: "w3",
                title: "Giá trị của việc học ngoại ngữ",
                description:
                    "Viết về tầm quan trọng và lợi ích của việc học ngoại ngữ.",
                level: "beginner",
                category: "Giáo dục",
                prompt: "Học ngoại ngữ là một kỹ năng quan trọng trong thế giới hiện đại. Hãy viết một bài luận ngắn về lợi ích của việc học ngoại ngữ đối với cuộc sống cá nhân và sự nghiệp. Bạn đã từng học ngoại ngữ nào? Việc học đó đã giúp ích cho bạn như thế nào?",
                wordCount: {
                    min: 100,
                    max: 200,
                },
                timeLimit: 15,
            },
            {
                id: "w4",
                title: "Du lịch và trải nghiệm văn hóa",
                description:
                    "Chia sẻ về trải nghiệm du lịch và tìm hiểu văn hóa mới.",
                level: "beginner",
                category: "Du lịch",
                prompt: "Du lịch không chỉ là việc tham quan các địa điểm mới mà còn là cơ hội để trải nghiệm các nền văn hóa khác nhau. Hãy viết về một chuyến du lịch đáng nhớ của bạn hoặc một nơi bạn muốn đến thăm. Bạn đã học được gì từ việc khám phá văn hóa mới? Nếu bạn chưa có cơ hội du lịch, hãy viết về một địa điểm bạn mơ ước được đến và lý do tại sao.",
                wordCount: {
                    min: 150,
                    max: 250,
                },
                timeLimit: 20,
            },
            {
                id: "w5",
                title: "Sức khỏe và lối sống",
                description: "Viết về tầm quan trọng của lối sống lành mạnh.",
                level: "beginner",
                category: "Sức khỏe",
                prompt: "Sức khỏe là tài sản quý giá nhất của con người. Hãy viết về tầm quan trọng của lối sống lành mạnh và các hoạt động bạn thực hiện để duy trì sức khỏe tốt. Bạn có thể đề cập đến chế độ ăn uống, tập thể dục, giấc ngủ và sức khỏe tinh thần.",
                wordCount: {
                    min: 100,
                    max: 200,
                },
                timeLimit: 15,
            },
            {
                id: "w6",
                title: "Giáo dục trong thế kỷ 21",
                description:
                    "Phân tích xu hướng và thách thức của giáo dục hiện đại.",
                level: "advanced",
                category: "Giáo dục",
                prompt: "Giáo dục đang trải qua những thay đổi lớn trong thế kỷ 21 với sự phát triển của công nghệ và thay đổi trong nhu cầu xã hội. Hãy phân tích các xu hướng chính trong giáo dục hiện đại, thách thức mà hệ thống giáo dục đang đối mặt, và đề xuất các giải pháp để cải thiện chất lượng giáo dục. Bạn có thể so sánh hệ thống giáo dục truyền thống với các phương pháp giáo dục mới, và thảo luận về vai trò của công nghệ trong việc học tập.",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
            },
            {
                id: "w7",
                title: "Nghệ thuật và văn hóa đại chúng",
                description:
                    "Thảo luận về mối quan hệ giữa nghệ thuật và xã hội.",
                level: "intermediate",
                category: "Nghệ thuật",
                prompt: "Nghệ thuật và văn hóa đại chúng có ảnh hưởng lớn đến xã hội và ngược lại. Hãy thảo luận về vai trò của nghệ thuật trong xã hội hiện đại, cách nó phản ánh và định hình giá trị xã hội. Bạn có thể đề cập đến bất kỳ hình thức nghệ thuật nào (âm nhạc, điện ảnh, văn học, hội họa...) và phân tích tác động của nó đối với cá nhân và cộng đồng.",
                wordCount: {
                    min: 200,
                    max: 350,
                },
                timeLimit: 30,
            },
            {
                id: "w8",
                title: "Vai trò của thanh niên trong phát triển cộng đồng",
                description:
                    "Viết về đóng góp và trách nhiệm của giới trẻ đối với xã hội.",
                level: "intermediate",
                category: "Xã hội",
                prompt: "Thanh niên đóng vai trò quan trọng trong việc phát triển cộng đồng và xã hội. Hãy thảo luận về trách nhiệm và cơ hội của thanh niên trong việc giải quyết các vấn đề xã hội, và đóng góp vào sự phát triển bền vững. Bạn có thể chia sẻ về các hoạt động tình nguyện, các dự án cộng đồng mà bạn hoặc bạn bè đã tham gia, và tác động của những hoạt động này.",
                wordCount: {
                    min: 200,
                    max: 350,
                },
                timeLimit: 25,
            },
            {
                id: "w9",
                title: "Thách thức của quá trình toàn cầu hóa",
                description:
                    "Phân tích ảnh hưởng của toàn cầu hóa đối với kinh tế và văn hóa.",
                level: "advanced",
                category: "Kinh tế",
                prompt: "Toàn cầu hóa đã tạo ra nhiều cơ hội và thách thức cho các quốc gia trên thế giới. Hãy phân tích tác động của toàn cầu hóa đối với kinh tế, văn hóa và chính trị toàn cầu. Thảo luận về những lợi ích và bất lợi của quá trình này, đặc biệt là đối với các nước đang phát triển. Bạn có thể đưa ra các ví dụ cụ thể và đề xuất cách để tối ưu hóa lợi ích của toàn cầu hóa trong khi giảm thiểu tác động tiêu cực.",
                wordCount: {
                    min: 300,
                    max: 500,
                },
                timeLimit: 40,
            },
            {
                id: "w10",
                title: "Mạng xã hội và mối quan hệ cá nhân",
                description:
                    "Thảo luận về tác động của mạng xã hội đối với giao tiếp và mối quan hệ.",
                level: "beginner",
                category: "Công nghệ",
                prompt: "Mạng xã hội đã thay đổi cách con người giao tiếp và xây dựng mối quan hệ. Hãy viết về những ảnh hưởng tích cực và tiêu cực của mạng xã hội đối với các mối quan hệ cá nhân và xã hội. Bạn sử dụng mạng xã hội như thế nào? Nó đã ảnh hưởng đến cuộc sống của bạn ra sao?",
                wordCount: {
                    min: 150,
                    max: 250,
                },
                timeLimit: 20,
            },
        ];
    }
}
