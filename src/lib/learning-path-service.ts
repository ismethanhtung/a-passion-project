import axios from "axios";

/**
 * Interface cho các thông tin đầu vào để tạo lộ trình cá nhân hóa
 */
interface LearningPathInputData {
    goal: string; // Mục tiêu học tập
    currentLevel: string; // Trình độ hiện tại
    targetLevel?: string; // Trình độ mong muốn đạt được
    timeAvailable?: string; // Thời gian có thể dành cho việc học
    interests?: string[]; // Các lĩnh vực quan tâm
    learningPreference?: string; // Hình thức học ưa thích (đọc, nghe, video...)
    specialNeeds?: string; // Yêu cầu đặc biệt
    previousExperience?: string; // Kinh nghiệm học trước đây
}

/**
 * Interface cho một khóa học trong lộ trình
 */
interface PathCourse {
    id?: number; // ID khóa học (nếu có trong hệ thống)
    title: string; // Tên khóa học
    description: string; // Mô tả khóa học
    duration: string; // Thời lượng khóa học
    level: string; // Cấp độ khóa học
    skills: string[]; // Các kỹ năng đạt được
    url?: string; // URL đến khóa học (nếu có)
    type: string; // Loại khóa học (video, bài giảng, đọc...)
    priority: number; // Độ ưu tiên (1: cao nhất)
    estimatedTimeToComplete: string; // Thời gian ước tính để hoàn thành
}

/**
 * Interface cho một giai đoạn trong lộ trình học tập
 */
interface PathStage {
    name: string; // Tên giai đoạn
    description: string; // Mô tả giai đoạn
    duration: string; // Thời lượng giai đoạn
    focusAreas: string[]; // Các lĩnh vực trọng tâm
    targetSkills: string[]; // Các kỹ năng mục tiêu
    courses: PathCourse[]; // Các khóa học trong giai đoạn
    milestones: string[]; // Các cột mốc cần đạt được
    expectedOutcomes: string[]; // Kết quả mong đợi
    skillLevel: string; // Trình độ kỹ năng sau giai đoạn
}

/**
 * Interface cho kết quả lộ trình học tập cá nhân hóa
 */
export interface PersonalizedLearningPath {
    summary: {
        title: string; // Tiêu đề lộ trình
        description: string; // Mô tả lộ trình
        totalDuration: string; // Tổng thời lượng
        startingLevel: string; // Trình độ bắt đầu
        targetLevel: string; // Trình độ mục tiêu
        mainFocus: string[]; // Các lĩnh vực trọng tâm
    };
    stages: PathStage[]; // Các giai đoạn của lộ trình
    overallRecommendations: string[]; // Các đề xuất tổng thể
    studyTips: string[]; // Các mẹo học tập
    resourceRecommendations: {
        // Đề xuất tài nguyên học tập
        books: string[];
        websites: string[];
        apps: string[];
        communities: string[];
    };
    progressTracking: {
        // Gợi ý theo dõi tiến độ
        assessmentFrequency: string;
        assessmentMethods: string[];
        successIndicators: string[];
    };
}

/**
 * Service để tạo lộ trình học tập cá nhân hóa sử dụng Groq API
 */
export class LearningPathService {
    private static instance: LearningPathService;

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): LearningPathService {
        if (!LearningPathService.instance) {
            LearningPathService.instance = new LearningPathService();
        }
        return LearningPathService.instance;
    }

    /**
     * Tạo lộ trình học tập cá nhân hóa dựa trên thông tin người dùng
     */
    public async createPersonalizedLearningPath(
        userData: LearningPathInputData
    ): Promise<PersonalizedLearningPath> {
        try {
            // Lấy API key từ biến môi trường
            const groqApiKey = process.env.GROQ_API_KEY;

            if (!groqApiKey) {
                console.error(
                    "GROQ_API_KEY không tìm thấy trong biến môi trường"
                );
                throw new Error("API key không tìm thấy");
            }

            // Tạo prompt cho Groq API
            const prompt = this.buildLearningPathPrompt(userData);

            // Gửi yêu cầu đến Groq API
            console.log(
                "Đang gửi yêu cầu tạo lộ trình học tập đến Groq API..."
            );

            let response;
            try {
                response = await axios.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        model: "llama3-70b-8192", // Model cao cấp của Groq
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are an expert language education consultant with deep knowledge of curriculum design, language acquisition, teaching methodologies, and educational resource development. Your specialty is creating detailed, personalized learning paths for language learners.",
                            },
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                        temperature: 0.2, // Giảm temperature để kết quả nhất quán hơn
                        max_tokens: 4096, // Tăng max_tokens để có kết quả chi tiết hơn
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer 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`,
                        },
                    }
                );
            } catch (apiError: any) {
                console.error("Lỗi khi gọi Groq API:", {
                    status: apiError.response?.status,
                    statusText: apiError.response?.statusText,
                    data: apiError.response?.data,
                    message: apiError.message,
                });

                if (apiError.response?.status === 401) {
                    throw new Error(
                        "Lỗi xác thực với Groq API. Vui lòng kiểm tra API key trong file .env"
                    );
                }
                throw apiError;
            }

            // Phân tích phản hồi từ Groq API
            const content = response.data.choices[0]?.message?.content;
            if (!content) {
                console.error("Không có nội dung phản hồi từ Groq API");
                throw new Error("Không có phản hồi từ API");
            }

            // Trích xuất JSON từ phản hồi
            try {
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                    content.match(/```([\s\S]*?)```/) || [null, content];

                const jsonString = jsonMatch[1].trim();
                console.log("Đã nhận được phản hồi từ Groq API");

                const learningPath = JSON.parse(
                    jsonString
                ) as PersonalizedLearningPath;

                // Thêm URLs cho các khóa học có trong hệ thống
                return this.enhanceLearningPath(learningPath);
            } catch (parseError) {
                console.error(
                    "Lỗi khi phân tích phản hồi từ Groq:",
                    parseError
                );
                throw new Error("Không thể phân tích kết quả từ API");
            }
        } catch (error: any) {
            console.error("Lỗi khi tạo lộ trình học tập:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
            });
            throw error;
        }
    }

    /**
     * Tạo nội dung prompt để hướng dẫn Groq API tạo lộ trình học tập
     */
    private buildLearningPathPrompt(userData: LearningPathInputData): string {
        return `
Tạo một lộ trình học tập ngôn ngữ chi tiết và cá nhân hóa cho học viên với các thông tin sau:

- Mục tiêu học tập: ${userData.goal}
- Trình độ hiện tại: ${userData.currentLevel}
${userData.targetLevel ? `- Trình độ mong muốn: ${userData.targetLevel}` : ""}
${
    userData.timeAvailable
        ? `- Thời gian có thể dành cho việc học: ${userData.timeAvailable}`
        : ""
}
${
    userData.interests && userData.interests.length > 0
        ? `- Lĩnh vực quan tâm: ${userData.interests.join(", ")}`
        : ""
}
${
    userData.learningPreference
        ? `- Hình thức học ưa thích: ${userData.learningPreference}`
        : ""
}
${userData.specialNeeds ? `- Yêu cầu đặc biệt: ${userData.specialNeeds}` : ""}
${
    userData.previousExperience
        ? `- Kinh nghiệm học trước đây: ${userData.previousExperience}`
        : ""
}

Tạo một lộ trình học tập THỰC SỰ chi tiết, đầy đủ và thiết thực. Lộ trình cần chia thành nhiều giai đoạn rõ ràng, mỗi giai đoạn có các khóa học cụ thể, kỹ năng đạt được và cột mốc đánh giá.

Trả về kết quả theo định dạng JSON với cấu trúc như sau:
\`\`\`json
{
  "summary": {
    "title": "Tiêu đề lộ trình",
    "description": "Mô tả chi tiết về lộ trình và cách nó sẽ giúp người học đạt được mục tiêu",
    "totalDuration": "Tổng thời gian ước tính để hoàn thành lộ trình",
    "startingLevel": "Trình độ bắt đầu",
    "targetLevel": "Trình độ mục tiêu",
    "mainFocus": ["Lĩnh vực trọng tâm 1", "Lĩnh vực trọng tâm 2", "..."]
  },
  "stages": [
    {
      "name": "Tên giai đoạn 1",
      "description": "Mô tả chi tiết về mục đích và nội dung của giai đoạn này",
      "duration": "Thời lượng ước tính của giai đoạn",
      "focusAreas": ["Lĩnh vực 1", "Lĩnh vực 2", "..."],
      "targetSkills": ["Kỹ năng 1", "Kỹ năng 2", "..."],
      "courses": [
        {
          "title": "Khóa học 1",
          "description": "Mô tả chi tiết về khóa học này và lợi ích của nó",
          "duration": "Thời lượng khóa học",
          "level": "Cấp độ khóa học (Beginner/Intermediate/Advanced)",
          "skills": ["Kỹ năng 1", "Kỹ năng 2", "..."],
          "type": "Loại khóa học (video, interactive, reading, practice)",
          "priority": 1,
          "estimatedTimeToComplete": "Thời gian ước tính để hoàn thành"
        },
        {
          "title": "Khóa học 2",
          "description": "Mô tả chi tiết",
          "duration": "Thời lượng",
          "level": "Cấp độ",
          "skills": ["Kỹ năng 1", "Kỹ năng 2"],
          "type": "Loại khóa học",
          "priority": 2,
          "estimatedTimeToComplete": "Thời gian ước tính"
        }
      ],
      "milestones": ["Cột mốc 1", "Cột mốc 2", "..."],
      "expectedOutcomes": ["Kết quả 1", "Kết quả 2", "..."],
      "skillLevel": "Trình độ kỹ năng sau khi hoàn thành giai đoạn"
    },
    {
      // Tương tự cho các giai đoạn khác, mỗi giai đoạn rất chi tiết và đầy đủ
    }
  ],
  "overallRecommendations": ["Đề xuất 1", "Đề xuất 2", "..."],
  "studyTips": ["Mẹo học tập 1", "Mẹo học tập 2", "..."],
  "resourceRecommendations": {
    "books": ["Sách 1", "Sách 2", "..."],
    "websites": ["Website 1", "Website 2", "..."],
    "apps": ["Ứng dụng 1", "Ứng dụng 2", "..."],
    "communities": ["Cộng đồng 1", "Cộng đồng 2", "..."]
  },
  "progressTracking": {
    "assessmentFrequency": "Tần suất đánh giá tiến độ",
    "assessmentMethods": ["Phương pháp 1", "Phương pháp 2", "..."],
    "successIndicators": ["Chỉ số 1", "Chỉ số 2", "..."]
  }
}
\`\`\`

HÃY CHÚ Ý:
1. Tạo ít nhất 3-5 giai đoạn chi tiết.
2. Mỗi giai đoạn nên có 3-5 khóa học cụ thể.
3. Đảm bảo các khóa học theo trình tự từ cơ bản đến nâng cao.
4. Lộ trình phải có thể thực hiện được và phù hợp với mục tiêu/trình độ đã nêu.
5. Cung cấp mô tả CHI TIẾT cho mọi thành phần.
6. Thực sự đi sâu vào các kỹ năng cần đạt được trong từng giai đoạn.
7. Lộ trình phải có tính thực tế và có thể áp dụng được.
8. Phản hồi PHẢI ở định dạng JSON như trên, KHÔNG có văn bản bên ngoài.
`;
    }

    /**
     * Nâng cao lộ trình học tập bằng cách thêm URLs và thông tin khác
     */
    private enhanceLearningPath(
        learningPath: PersonalizedLearningPath
    ): PersonalizedLearningPath {
        // Đây là nơi bạn có thể thêm logic để map các khóa học với khóa học thực tế trong hệ thống
        // Hoặc thêm các thông tin bổ sung vào lộ trình

        // Ví dụ đơn giản: Thêm URLs cho một số khóa học phổ biến
        const commonCourses: Record<string, string> = {
            "Introduction to English": "/courses/31",
            "Basic Pronunciation": "/courses/1",
            "Everyday Vocabulary": "/courses/15",
            "Simple Grammar Structures": "/courses/8",
            "Real-Life Conversations": "/courses/17",
            "Advanced Grammar": "/courses/18",
            "Business English": "/courses/22",
            "Listening & Speaking Skills": "/courses/5",
            "TOEIC Exam Preparation": "/courses/19",
            "Professional Writing": "/courses/20",
            "Advanced Pronunciation": "/courses/7",
            "Academic Writing": "/courses/21",
            "Business Communication": "/courses/25",
            "Professional Presentations": "/courses/26",
            "Negotiation & Meeting Skills": "/courses/27",
            "Business Email Writing": "/courses/28",
        };

        // Thêm URLs cho các khóa học
        learningPath.stages.forEach((stage) => {
            stage.courses.forEach((course) => {
                if (commonCourses[course.title]) {
                    course.url = commonCourses[course.title];
                }
            });
        });

        return learningPath;
    }
}

export default LearningPathService;
