import { NextResponse } from "next/server";

interface GenerateFlashcardParams {
    word: string;
    topic?: string;
    level?: string;
}

export async function POST(req: Request) {
    try {
        console.log("API: Nhận yêu cầu tạo flashcard");

        const body = await req.json();
        console.log("API: Dữ liệu nhận được:", body);

        const {
            word,
            topic = "Chung",
            level = "Intermediate",
        } = body as GenerateFlashcardParams;

        if (!word) {
            console.log("API: Lỗi - Từ vựng không được để trống");
            return NextResponse.json(
                { error: "Từ vựng không được để trống" },
                { status: 400 }
            );
        }

        // Gọi API AI để tạo flashcard
        // Trong trường hợp thật, đây sẽ là yêu cầu đến AI model như OpenAI hoặc Anthropic
        // Ở đây chúng ta sẽ mô phỏng kết quả
        console.log(
            `API: Đang tạo flashcard cho từ "${word}" với chủ đề "${topic}" và cấp độ "${level}"`
        );

        const response = await simulateAIResponse(word, topic, level);
        console.log("API: Kết quả tạo flashcard:", response);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error generating flashcard:", error);
        return NextResponse.json(
            { error: "Có lỗi khi tạo flashcard", details: String(error) },
            { status: 500 }
        );
    }
}

async function simulateAIResponse(word: string, topic: string, level: string) {
    // Mô phỏng độ trễ của yêu cầu API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Tạo dữ liệu mẫu dựa trên từ được cung cấp
    const flashcardData = {
        word: word,
        meaning: generateMeaning(word, topic),
        example: generateExample(word, topic, level),
        exampleVi: generateVietnameseExample(word, topic),
        pronunciation: generatePronunciation(word),
        difficulty: determineDifficulty(level),
        tags: generateTags(topic),
    };

    return flashcardData;
}

function generatePronunciation(word: string): string {
    // Tạo phát âm giả định
    const vowels = "aeiou";
    const result =
        "/" +
        word
            .split("")
            .map((char) => {
                if (vowels.includes(char.toLowerCase())) {
                    return Math.random() > 0.5 ? `ə${char}` : `${char}ː`;
                }
                return char;
            })
            .join("") +
        "/";

    return result;
}

function generateMeaning(word: string, topic: string): string {
    // Tạo nghĩa giả định
    const meanings = {
        "Kinh doanh": [
            `Thuật ngữ kinh doanh chỉ việc ${word.toLowerCase()} trong môi trường doanh nghiệp`,
            `${word} là một phương pháp quản lý hiệu quả trong kinh doanh hiện đại`,
            `Khái niệm trong tài chính doanh nghiệp liên quan đến quá trình ${word.toLowerCase()}`,
        ],
        "Du lịch": [
            `Thuật ngữ du lịch mô tả việc ${word.toLowerCase()} khi đi du lịch nước ngoài`,
            `${word} là một khía cạnh quan trọng trong trải nghiệm du lịch văn hóa`,
            `Cách thức ${word.toLowerCase()} một chuyến đi hiệu quả và tiết kiệm`,
        ],
        "Học thuật": [
            `Thuật ngữ học thuật chỉ phương pháp ${word.toLowerCase()} trong nghiên cứu khoa học`,
            `${word} là một khái niệm cơ bản trong lĩnh vực nghiên cứu học thuật`,
            `Nguyên tắc ${word.toLowerCase()} được áp dụng trong phân tích dữ liệu nghiên cứu`,
        ],
        IELTS: [
            `Từ vựng IELTS quan trọng liên quan đến ${word.toLowerCase()}`,
            `${word} là thuật ngữ thường xuất hiện trong các bài thi IELTS`,
            `Cách sử dụng từ ${word} một cách chính xác trong bài thi IELTS`,
        ],
        TOEIC: [
            `Từ vựng TOEIC cần thiết liên quan đến ${word.toLowerCase()}`,
            `${word} thường xuất hiện trong các bài thi TOEIC phần đọc hiểu`,
            `Ứng dụng của ${word} trong ngữ cảnh kinh doanh và giao tiếp công sở`,
        ],
    };

    const defaultMeanings = [
        `${word} là một từ tiếng Anh chỉ việc ${word.toLowerCase()} trong các tình huống thường ngày`,
        `Thuật ngữ ${word} diễn tả quá trình hoặc hành động ${word.toLowerCase()} trong ngữ cảnh cụ thể`,
        `${word} là khái niệm liên quan đến việc ${word.toLowerCase()} trong nhiều lĩnh vực khác nhau`,
    ];

    const topicMeanings = (meanings as any)[topic] || defaultMeanings;
    return topicMeanings[Math.floor(Math.random() * topicMeanings.length)];
}

function generateExample(word: string, topic: string, level: string): string {
    // Tạo ví dụ theo chủ đề và trình độ
    const examples = {
        "Kinh doanh": [
            `The company has implemented a new ${word} strategy to increase market share.`,
            `During the meeting, the CEO discussed the importance of ${word} in modern business.`,
            `Our ${word} approach has led to a 15% increase in quarterly profits.`,
        ],
        "Du lịch": [
            `Travelers should always consider the ${word} options before booking their trip.`,
            `The tour guide explained how ${word} has influenced local culture.`,
            `Many tourists enjoy the ${word} experience offered by this coastal city.`,
        ],
        "Học thuật": [
            `The research paper examines the role of ${word} in cognitive development.`,
            `Students must understand the concept of ${word} before advancing to more complex topics.`,
            `Professor Johnson's lecture on ${word} clarified many misconceptions.`,
        ],
        IELTS: [
            `The IELTS writing task required candidates to discuss ${word} in modern society.`,
            `During the speaking test, I had to explain how ${word} affects everyday life.`,
            `The reading passage was about the history of ${word} in Western civilization.`,
        ],
        TOEIC: [
            `The company's ${word} policy was outlined in the memo.`,
            `The manager asked his team to ${word} the project before the deadline.`,
            `Our business partners suggested we ${word} the current marketing strategy.`,
        ],
    };

    const defaultExamples = [
        `She explained the concept of ${word} in simple terms so everyone could understand.`,
        `The book provides several examples of how ${word} works in real-life situations.`,
        `We need to ${word} the situation carefully before making a decision.`,
    ];

    const topicExamples = (examples as any)[topic] || defaultExamples;
    return topicExamples[Math.floor(Math.random() * topicExamples.length)];
}

function generateVietnameseExample(word: string, topic: string): string {
    // Tạo ví dụ tiếng Việt
    const examples = {
        "Kinh doanh": [
            `Công ty đã áp dụng chiến lược ${word} mới để tăng thị phần.`,
            `Trong cuộc họp, CEO đã thảo luận về tầm quan trọng của ${word} trong kinh doanh hiện đại.`,
            `Cách tiếp cận ${word} của chúng tôi đã dẫn đến lợi nhuận quý tăng 15%.`,
        ],
        "Du lịch": [
            `Du khách nên luôn cân nhắc các lựa chọn ${word} trước khi đặt chuyến đi.`,
            `Hướng dẫn viên đã giải thích cách ${word} ảnh hưởng đến văn hóa địa phương.`,
            `Nhiều du khách thích trải nghiệm ${word} mà thành phố ven biển này mang lại.`,
        ],
        "Học thuật": [
            `Bài nghiên cứu xem xét vai trò của ${word} trong sự phát triển nhận thức.`,
            `Sinh viên phải hiểu khái niệm ${word} trước khi tiến tới các chủ đề phức tạp hơn.`,
            `Bài giảng của Giáo sư Johnson về ${word} đã làm rõ nhiều quan niệm sai lầm.`,
        ],
        IELTS: [
            `Bài viết IELTS yêu cầu thí sinh thảo luận về ${word} trong xã hội hiện đại.`,
            `Trong bài thi nói, tôi phải giải thích cách ${word} ảnh hưởng đến cuộc sống hàng ngày.`,
            `Đoạn đọc hiểu nói về lịch sử của ${word} trong nền văn minh phương Tây.`,
        ],
        TOEIC: [
            `Chính sách ${word} của công ty được nêu trong bản ghi nhớ.`,
            `Người quản lý yêu cầu nhóm của mình ${word} dự án trước thời hạn.`,
            `Các đối tác kinh doanh đề nghị chúng tôi ${word} chiến lược tiếp thị hiện tại.`,
        ],
    };

    const defaultExamples = [
        `Cô ấy đã giải thích khái niệm ${word} bằng những từ ngữ đơn giản để mọi người có thể hiểu.`,
        `Cuốn sách cung cấp một số ví dụ về cách ${word} hoạt động trong các tình huống thực tế.`,
        `Chúng ta cần ${word} tình huống cẩn thận trước khi đưa ra quyết định.`,
    ];

    const topicExamples = (examples as any)[topic] || defaultExamples;
    return topicExamples[Math.floor(Math.random() * topicExamples.length)];
}

function determineDifficulty(level: string): "easy" | "medium" | "hard" {
    switch (level) {
        case "Beginner":
            return "easy";
        case "Advanced":
            return "hard";
        default:
            return "medium";
    }
}

function generateTags(topic: string): string[] {
    const topicTags: Record<string, string[]> = {
        "Kinh doanh": ["business", "management", "finance", "corporate"],
        "Du lịch": ["travel", "tourism", "vacation", "international"],
        "Học thuật": ["academic", "education", "research", "study"],
        IELTS: ["IELTS", "exam", "study abroad", "English test"],
        TOEIC: ["TOEIC", "business English", "professional", "office"],
    };

    const commonTags = ["vocabulary", "English", "important", "useful"];

    // Kết hợp tags chủ đề với tags chung
    const baseTags = topicTags[topic] || [topic.toLowerCase()];

    // Chọn ngẫu nhiên 2-3 tags
    const selectedTags = [...baseTags];
    commonTags.sort(() => Math.random() - 0.5);

    // Thêm 1-2 tags chung
    const additionalTagsCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < additionalTagsCount && i < commonTags.length; i++) {
        selectedTags.push(commonTags[i]);
    }

    // Trả về mảng tags duy nhất
    return [...new Set(selectedTags)];
}
