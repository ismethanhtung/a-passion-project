import { NextResponse } from "next/server";

interface GenerateParams {
    word: string;
    topic?: string;
    level?: string;
}

export async function POST(req: Request) {
    try {
        const {
            word,
            topic = "Chung",
            level = "Intermediate",
        } = (await req.json()) as GenerateParams;

        if (!word) {
            return NextResponse.json(
                { error: "Từ vựng không được để trống" },
                { status: 400 }
            );
        }

        // Gọi API AI để tạo nội dung từ vựng
        // Trong trường hợp thật, đây sẽ là yêu cầu đến AI model như OpenAI hoặc Anthropic
        // Ở đây chúng ta sẽ mô phỏng kết quả

        const response = await simulateAIResponse(word, topic, level);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error generating vocabulary:", error);
        return NextResponse.json(
            { error: "Có lỗi khi tạo từ vựng" },
            { status: 500 }
        );
    }
}

async function simulateAIResponse(word: string, topic: string, level: string) {
    // Mô phỏng độ trễ của yêu cầu API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Tạo dữ liệu mẫu dựa trên từ được cung cấp
    const wordData = {
        word: word,
        pronunciation: generatePronunciation(word),
        meaning: generateMeaning(word, topic),
        exampleSentences: generateExamples(word, topic, level),
        relatedWords: generateRelatedWords(word),
        level: level,
        topic: topic,
    };

    return wordData;
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
            "Một thuật ngữ kinh doanh liên quan đến quản lý và tối ưu hóa nguồn lực",
            "Khái niệm trong tài chính doanh nghiệp chỉ sự phát triển bền vững",
            "Chiến lược kinh doanh tập trung vào tăng trưởng và mở rộng thị trường",
        ],
        "Du lịch": [
            "Thuật ngữ du lịch mô tả trải nghiệm văn hóa và khám phá địa phương",
            "Khái niệm liên quan đến lập kế hoạch và tổ chức chuyến đi",
            "Phương pháp khám phá điểm đến du lịch một cách trọn vẹn và hiệu quả",
        ],
        "Công nghệ": [
            "Thuật ngữ công nghệ chỉ quá trình đổi mới và phát triển sản phẩm",
            "Khái niệm trong IT liên quan đến tối ưu hóa hệ thống và quy trình",
            "Phương pháp tiếp cận giải quyết vấn đề kỹ thuật phức tạp",
        ],
        "Học thuật": [
            "Thuật ngữ học thuật dùng trong nghiên cứu và phân tích dữ liệu",
            "Khái niệm quan trọng trong phương pháp nghiên cứu khoa học",
            "Lý thuyết và nguyên tắc được sử dụng trong các công trình nghiên cứu",
        ],
        "Thể thao": [
            "Thuật ngữ thể thao chỉ kỹ thuật hoặc chiến thuật trong thi đấu",
            "Phương pháp rèn luyện và nâng cao thành tích trong thể thao",
            "Khái niệm liên quan đến hiệu suất và phát triển thể chất",
        ],
        "Ẩm thực": [
            "Thuật ngữ ẩm thực mô tả phương pháp chế biến hoặc hương vị đặc trưng",
            "Kỹ thuật nấu ăn và chế biến nguyên liệu trong nghệ thuật ẩm thực",
            "Khái niệm dinh dưỡng và hương vị trong văn hóa ẩm thực",
        ],
        "Y tế": [
            "Thuật ngữ y khoa chỉ quy trình chẩn đoán hoặc điều trị bệnh",
            "Phương pháp y tế tiên tiến trong chăm sóc sức khỏe",
            "Khái niệm liên quan đến phòng ngừa và điều trị trong y học",
        ],
        "Văn hóa": [
            "Thuật ngữ văn hóa mô tả truyền thống hoặc giá trị xã hội",
            "Khái niệm nghệ thuật và biểu đạt trong văn hóa đương đại",
            "Hiện tượng văn hóa đại chúng phản ánh xu hướng xã hội",
        ],
    };

    const defaultMeanings = [
        `Từ tiếng Anh "${word}" có ý nghĩa liên quan đến ${topic.toLowerCase()}`,
        `Khái niệm trong lĩnh vực ${topic.toLowerCase()} mô tả quá trình hoặc trạng thái`,
        `Thuật ngữ chuyên môn trong ${topic.toLowerCase()} chỉ một hiện tượng hoặc quy trình cụ thể`,
    ];

    const topicMeanings = (meanings as any)[topic] || defaultMeanings;
    return topicMeanings[Math.floor(Math.random() * topicMeanings.length)];
}

function generateExamples(
    word: string,
    topic: string,
    level: string
): string[] {
    // Tạo ví dụ theo trình độ và chủ đề
    const examples: Record<string, string[]> = {
        Beginner: [
            `The ${word} is important for students to understand basic concepts.`,
            `We use ${word} in our daily activities without realizing it.`,
            `She learned about ${word} during her first year of studies.`,
        ],
        Intermediate: [
            `The company's ${word} strategy has improved their market position significantly.`,
            `Understanding how ${word} works can give you an advantage in your career.`,
            `The professor explained the concept of ${word} using real-world examples.`,
        ],
        Advanced: [
            `The intricate relationship between ${word} and economic growth has been the subject of numerous academic studies.`,
            `Experts in the field have debated whether ${word} should be considered a fundamental principle or merely a theoretical construct.`,
            `The implementation of ${word} requires a nuanced understanding of both theoretical foundations and practical applications.`,
        ],
    };

    // Ví dụ theo chủ đề
    const topicExamples: Record<string, string[]> = {
        "Kinh doanh": [
            `Our business implemented a new ${word} approach that increased profits by 15%.`,
            `The CEO emphasized the importance of ${word} in the company's five-year strategy.`,
            `Successful entrepreneurs understand how to leverage ${word} to gain competitive advantage.`,
        ],
        "Du lịch": [
            `The travel guide recommended ${word} as an essential practice for international travelers.`,
            `Experienced tourists always consider ${word} when planning their itineraries.`,
            `The resort offers special ${word} packages for honeymoon couples.`,
        ],
        "Công nghệ": [
            `The latest software update includes improved ${word} features.`,
            `Tech companies are investing heavily in ${word} technology.`,
            `Engineers developed a new algorithm based on ${word} principles.`,
        ],
        "Học thuật": [
            `The research paper discusses ${word} as a fundamental concept in modern science.`,
            `Students are required to understand ${word} before advancing to more complex topics.`,
            `The professor's lecture on ${word} clarified many misconceptions about the subject.`,
        ],
        "Thể thao": [
            `Athletes must master the ${word} technique to compete at the professional level.`,
            `The coach emphasized ${word} as a key element of their training regimen.`,
            `Olympic competitors often demonstrate perfect ${word} execution during performances.`,
        ],
        "Ẩm thực": [
            `Chefs around the world incorporate ${word} into their signature recipes.`,
            `The cookbook explains how ${word} enhances the flavor profile of traditional dishes.`,
            `Culinary schools teach ${word} as an essential technique for aspiring chefs.`,
        ],
        "Y tế": [
            `Doctors recommend ${word} as part of a comprehensive treatment plan.`,
            `Medical researchers are studying how ${word} affects patient recovery times.`,
            `The hospital has implemented a new ${word} protocol to improve patient care.`,
        ],
        "Văn hóa": [
            `The exhibition explores how ${word} has shaped modern cultural expressions.`,
            `Cultural historians trace the evolution of ${word} through different societies.`,
            `Artists often incorporate ${word} into their work to reflect contemporary values.`,
        ],
    };

    // Kết hợp ví dụ theo trình độ và chủ đề
    const levelExamples = examples[level] || examples["Intermediate"];
    const specificTopicExamples = (topicExamples as any)[topic];

    // Tạo mảng kết quả
    const result: string[] = [];

    // Thêm ít nhất một ví dụ theo trình độ
    result.push(
        levelExamples[Math.floor(Math.random() * levelExamples.length)]
    );

    // Thêm ví dụ theo chủ đề nếu có
    if (specificTopicExamples) {
        result.push(
            specificTopicExamples[
                Math.floor(Math.random() * specificTopicExamples.length)
            ]
        );
    } else {
        // Thêm một ví dụ khác theo trình độ nếu không có ví dụ theo chủ đề
        const anotherExample = levelExamples.find((ex) => ex !== result[0]);
        if (anotherExample) {
            result.push(anotherExample);
        }
    }

    // Thêm ví dụ tổng quát
    result.push(
        `The concept of ${word} can be applied in various contexts, especially in ${topic.toLowerCase()}.`
    );

    return result;
}

function generateRelatedWords(word: string): string[] {
    // Tạo các từ liên quan
    const suffixes = [
        "tion",
        "ment",
        "ity",
        "ness",
        "ism",
        "al",
        "ive",
        "able",
        "ful",
    ];
    const prefixes = ["re", "un", "in", "dis", "pre", "post", "sub", "over"];

    const related: string[] = [];

    // Tạo 1-2 từ với tiền tố
    if (word.length > 3) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        related.push(prefix + word.toLowerCase());
    }

    // Tạo 1-2 từ với hậu tố
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    related.push(word.toLowerCase() + suffix);

    // Thêm vài từ đồng nghĩa giả định
    const additionalWords = [word + "ify", word + "ology", word + "ish"];
    related.push(...additionalWords);

    // Lọc và trả về 3-5 từ ngẫu nhiên
    return [...new Set(related)]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 3);
}
