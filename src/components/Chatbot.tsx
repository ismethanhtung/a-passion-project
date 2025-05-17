"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addConversation } from "@/api/conversation";
import { fetchUserById } from "@/api/user";
import { fetchCourses } from "@/api/courses";
import ReactMarkdown from "react-markdown";
import { updatePath } from "@/api/learningPath";
import { useRef } from "react";
import { Bot } from "lucide-react";

// Dữ liệu tài liệu học tập
const documentData = [
    {
        title: "English for Absolute Beginners",
        description:
            "A step-by-step guide for those starting from scratch, with essential vocabulary, grammar, and pronunciation tips.",
        url: "http://localhost:3000/docs/english-basics.pdf",
        category: "Beginner",
        tags: [
            "starter",
            "vocabulary",
            "grammar",
            "listening",
            "pronunciation",
            "speaking",
        ],
        isNew: true,
    },
    {
        title: "Mastering English Grammar",
        description:
            "Comprehensive rules and usage examples covering all grammar levels from basic to advanced.",
        url: "http://localhost:3000/docs/master-grammar.pdf",
        category: "Grammar",
        tags: ["grammar", "tenses", "sentence structure", "academic"],
    },
    {
        title: "American Pronunciation Course",
        description:
            "A full audio course to train your American English pronunciation with practice scripts and recordings.",
        url: "http://localhost:3000/docs/us-pronunciation.zip",
        category: "Pronunciation",
        tags: ["pronunciation", "accent", "phonetics", "speaking", "listening"],
        isFeatured: true,
    },
    {
        title: "Thematic Vocabulary Builder",
        description:
            "Vocabulary lists organized by themes such as travel, health, business, and everyday conversation.",
        url: "http://localhost:3000/docs/thematic-vocab.xlsx",
        category: "Vocabulary",
        tags: ["vocabulary", "topics", "word bank", "IELTS", "TOEIC"],
    },
    {
        title: "Listening Practice for All Levels",
        description:
            "Effective listening exercises with real-life audio samples and comprehension questions.",
        url: "http://localhost:3000/docs/listening-course.mp3",
        category: "Listening",
        tags: ["listening", "comprehension", "TOEIC", "real-life"],
        isNew: true,
    },
    {
        title: "Everyday Speaking Guide",
        description:
            "Daily speaking scenarios and conversation patterns for fluency and confidence building.",
        url: "http://localhost:3000/docs/speaking-scenarios.docx",
        category: "Speaking",
        tags: [
            "speaking",
            "fluency",
            "conversation",
            "communication",
            "phrases",
        ],
    },
    {
        title: "Academic Writing Templates",
        description:
            "Templates and techniques for writing academic essays, reports, and emails professionally.",
        url: "http://localhost:3000/docs/academic-writing.docx",
        category: "Writing",
        tags: ["writing", "academic", "report", "email", "IELTS"],
    },
    {
        title: "Basic English Conversations",
        description:
            "Practice dialogues and common phrases used in daily English communication.",
        url: "http://localhost:3000/docs/daily-conversation.pdf",
        category: "Communication",
        tags: ["communication", "speaking", "daily", "phrases"],
    },
    {
        title: "Advanced Business English",
        description:
            "Master business meetings, presentations, and email writing in professional contexts.",
        url: "http://localhost:3000/docs/business-english.pdf",
        category: "Business",
        tags: ["business", "professional", "communication", "writing"],
    },
    {
        title: "IELTS Vocabulary by Topic",
        description:
            "Essential vocabulary grouped by IELTS topics with usage examples and synonyms.",
        url: "http://localhost:3000/docs/ielts-topics.xlsx",
        category: "IELTS",
        tags: ["IELTS", "vocabulary", "topics", "exam", "academic"],
        isFeatured: true,
    },
    {
        title: "TOEIC Practice Test Pack",
        description:
            "Full mock tests for TOEIC Listening and Reading sections with answer keys and explanations.",
        url: "http://localhost:3000/docs/toeic-test-pack.pdf",
        category: "TOEIC",
        tags: ["TOEIC", "mock test", "listening", "reading", "practice"],
        isNew: true,
        isFeatured: true,
    },
    {
        title: "Reading Strategies and Analysis",
        description:
            "Techniques to understand articles and passages, identify key ideas, and analyze structure.",
        url: "http://localhost:3000/docs/reading-strategies.pdf",
        category: "Reading",
        tags: ["reading", "comprehension", "articles", "analysis", "skills"],
    },
    {
        title: "Advanced Pronunciation Guide",
        description:
            "Improve your pronunciation with drills, minimal pairs, intonation practice, and feedback tips.",
        url: "http://localhost:3000/docs/pronunciation-drills.mp3",
        category: "Pronunciation",
        tags: [
            "pronunciation",
            "intonation",
            "stress",
            "advanced",
            "native-like",
        ],
    },
    {
        title: "Specialized Vocabulary for Careers",
        description:
            "Industry-specific vocabulary for healthcare, engineering, law, and IT.",
        url: "http://localhost:3000/docs/industry-vocab.xlsx",
        category: "Vocabulary",
        tags: [
            "professional",
            "specialized",
            "careers",
            "health",
            "technology",
            "law",
        ],
        isNew: true,
    },
    {
        title: "Luyện phát âm chuyên sâu",
        description:
            "Các bài tập luyện phát âm nâng cao cho người học muốn hoàn thiện giọng nói gần với người bản xứ.",
        url: "http://localhost:3000/docs/advanced-pronunciation.mp3",
        category: "Pronunciation",
        tags: ["pronunciation", "advanced", "native-like"],
    },
    {
        title: "Khóa học TOEIC cơ bản",
        description:
            "Chuẩn bị cho kỳ thi TOEIC với các bài tập và bài kiểm tra mô phỏng phần Listening và Reading.",
        url: "http://localhost:3000/docs/toeic-preparation.pdf",
        category: "TOEIC",
        tags: ["TOEIC", "exam", "preparation"],
        isNew: true,
        isFeatured: true,
    },
    {
        title: "Advanced TOEIC Strategies",
        description:
            "Master high-level TOEIC strategies for both Listening and Reading sections with practice tests and tips.",
        url: "http://localhost:3000/docs/toeic-advanced.pdf",
        category: "TOEIC",
        tags: ["TOEIC", "advanced", "strategy", "exam", "test-tips"],
    },
    {
        title: "IELTS Writing Task 2 Guide",
        description:
            "Comprehensive guide to mastering IELTS Writing Task 2 with model essays and scoring criteria.",
        url: "http://localhost:3000/docs/ielts-writing-task2.pdf",
        category: "IELTS",
        tags: ["IELTS", "writing", "essay", "task2", "bandscore"],
    },
    {
        title: "Everyday English Conversations",
        description:
            "Real-life dialogues and expressions for daily situations: shopping, traveling, dining, and more.",
        url: "http://localhost:3000/docs/everyday-conversations.mp3",
        category: "Speaking",
        tags: ["speaking", "conversation", "daily", "phrases", "real-life"],
    },
    {
        title: "English for Presentations",
        description:
            "Learn essential vocabulary, structures, and techniques for effective English presentations.",
        url: "http://localhost:3000/docs/presentation-skills.pptx",
        category: "Business",
        tags: ["presentation", "business", "communication", "public-speaking"],
    },
    {
        title: "Academic Vocabulary Builder",
        description:
            "Build academic English vocabulary with categorized word lists and usage in context.",
        url: "http://localhost:3000/docs/academic-vocab.xlsx",
        category: "Vocabulary",
        tags: ["academic", "vocabulary", "reading", "writing", "context"],
    },
    {
        title: "Listening Practice – Natural Speed",
        description:
            "Train your ears with native-level listening exercises using news, podcasts, and interviews.",
        url: "http://localhost:3000/docs/natural-listening.mp3",
        category: "Listening",
        tags: ["listening", "natural-speed", "native", "news", "interview"],
    },
    {
        title: "Business Email Writing",
        description:
            "Templates and language tips for writing effective and professional emails in English.",
        url: "http://localhost:3000/docs/business-email.docx",
        category: "Writing",
        tags: ["writing", "email", "business", "formal", "template"],
    },
    {
        title: "Idioms and Slang Explained",
        description:
            "Understand and use popular English idioms and slang in casual conversation.",
        url: "http://localhost:3000/docs/idioms-guide.pdf",
        category: "Vocabulary",
        tags: ["idioms", "slang", "phrases", "casual", "speaking"],
    },
];

// Định nghĩa interface cho tài liệu
interface Document {
    title: string;
    description: string;
    url: string;
    category: string;
    tags: string[];
    isNew?: boolean;
    isFeatured?: boolean;
}

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId: any = user?.id;
    const toggleChat = () => setShowChat((prev) => !prev);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    function formatCourses(courseList, scores = []) {
        if (!Array.isArray(courseList) || courseList.length === 0) {
            return "Không tìm thấy khóa học phù hợp.";
        }

        return courseList
            .map((rawText, index) => {
                const item = JSON.parse(rawText); // Chuyển từ string JSON thành object
                const originalPrice = item.price
                    ? `${item.price.toLocaleString("vi-VN")}đ`
                    : "Không có thông tin";
                const discountedPrice = item.newPrice
                    ? `${item.newPrice.toLocaleString("vi-VN")}đ`
                    : originalPrice;
                const discount =
                    item.price && item.newPrice
                        ? `(Giảm ${Math.round(
                              (1 - item.newPrice / item.price) * 100
                          )}%)`
                        : "";
                const courseLink =
                    item.linkCourse ||
                    `http://localhost:3000/courses/${item.id}`;

                return `[Course ${index + 1} begin]
Name: ${item.title}
Description: ${item.description}
Objectives: ${item.objectives || "Không có thông tin"}
Original Price: ${originalPrice}
Discounted Price: ${discountedPrice} ${discount}
Learning Outcomes: ${item.learning_outcomes || "Không có thông tin"}
Level: ${item.level || "Không xác định"}
Duration: ${
                    item.duration ||
                    (item.lessons?.length
                        ? `${item.lessons.length} bài học`
                        : "Không có thông tin")
                }
Tags (Category): ${item.tags || item.category || "Không có thông tin"}
Rating: ${item.averageRating || "Chưa có đánh giá"}
Link: ${courseLink}`;
            })
            .join("\n\n");
    }

    // Định dạng tài liệu học tập
    function formatDocuments(docs: Document[]) {
        if (!Array.isArray(docs) || docs.length === 0) {
            return "Không tìm thấy tài liệu phù hợp.";
        }

        return docs
            .map((doc, index) => {
                // Đảm bảo URL không bị lỗi định dạng
                const safeUrl = doc.url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "");
                // Loại bỏ URL trùng lặp nếu có
                const cleanUrl = safeUrl.replace(
                    /(http:\/\/[^)]+)(\)\(http:\/\/)/,
                    "$1"
                );

                return `[Document ${index + 1}]
    Tiêu đề: ${doc.title}
    Mô tả: ${doc.description}
    Phân loại: ${doc.category}
    Tags: ${doc.tags.join(", ")}
    Link tải: ${cleanUrl}
    ${doc.isNew ? "✨ Tài liệu mới" : ""}
    ${doc.isFeatured ? "⭐ Được đề xuất" : ""}`;
            })
            .join("\n\n");
    }

    useEffect(() => {
        const initConversation = async () => {
            try {
                const response1 = await fetchCourses();
                console.log("🍪🍪🍪🍪", document.cookie);

                console.log(response1);
                const response = await addConversation(userId, "Chatbot");
                const data = await response.json();
                setConversationId(data.id);

                // Lấy lịch sử tin nhắn
                const messagesResponse = await fetch(
                    `${API_BASE_URL}/conversation/user/${userId}`
                );
                const messagesData = await messagesResponse.json();
                setMessages(
                    messagesData.map((msg) => ({
                        sender: msg.senderId === userId ? "user" : "bot",
                        text: msg.content,
                    }))
                );
            } catch (error) {
                console.error("❌ Error:", error);
            }
        };
        initConversation();
    }, [userId]);
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);
    const removeVietnameseDiacritics = (str: string): string => {
        return str
            .normalize("NFD") // Tách dấu khỏi ký tự gốc
            .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
            .replace(/đ/g, "d") // Chuyển "đ" thành "d"
            .replace(/Đ/g, "D"); // Chuyển "Đ" thành "D"
    };

    let isRequestPath = false;
    let isDocumentQuery = false;
    let isCourseOnlyQuery = false;

    const identifyQueryType = (
        message: string
    ): { isDoc: boolean; isCourse: boolean; isPath: boolean } => {
        isDocumentQuery = false;
        isCourseOnlyQuery = false;
        isRequestPath = false;

        const normalizedMessage = removeVietnameseDiacritics(
            message.normalize("NFC").toLowerCase()
        );

        // Từ khóa nhận dạng tài liệu
        const docKeywords = [
            "docs",
            "tài liệu",
            "file",
            "document",
            "sách",
            "book",
            "ebook",
            "tài nguyên",
            "material",
            "resource",
            "pdf",
            "mp3",
            "docx",
            "zip",
        ].map((kw) => removeVietnameseDiacritics(kw.toLowerCase()));

        // Từ khóa nhận dạng khóa học
        const courseKeywords = [
            "khoa hoc",
            "course",
            "lớp học",
            "bài giảng",
            "giáo trình",
        ].map((kw) => removeVietnameseDiacritics(kw.toLowerCase()));

        // Từ khóa nhận dạng lộ trình
        const pathKeywords = [
            "lo trinh",
            "learning path",
            "lộ trình",
            "kế hoạch",
            "roadmap",
        ].map((kw) => removeVietnameseDiacritics(kw.toLowerCase()));

        // Kiểm tra loại truy vấn
        let hasDocKeyword = docKeywords.some((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            return regex.test(normalizedMessage);
        });

        let hasCourseKeyword = courseKeywords.some((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            return regex.test(normalizedMessage);
        });

        let hasPathKeyword = pathKeywords.some((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            return regex.test(normalizedMessage);
        });

        // Cập nhật trạng thái
        isDocumentQuery = hasDocKeyword;
        isCourseOnlyQuery = hasCourseKeyword && !hasDocKeyword;
        isRequestPath = hasPathKeyword;

        return {
            isDoc: hasDocKeyword,
            isCourse: hasCourseKeyword,
            isPath: hasPathKeyword,
        };
    };

    const isCourseQuery = (message: any) => {
        const queryTypes = identifyQueryType(message);
        return queryTypes.isDoc || queryTypes.isCourse || queryTypes.isPath;
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            // Lưu tin nhắn người dùng
            await fetch(
                `${API_BASE_URL}/conversation/${conversationId}/message`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ senderId: userId, content: input }),
                }
            );

            // Hiển thị trạng thái đang nhập
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Đang tìm kiếm thông tin...",
                    isTyping: true,
                },
            ]);

            // Lấy thông tin người dùng
            const userProfile = await fetchUserById(userId);
            console.log("🟢 userProfile:", userProfile);

            // Khởi tạo biến vectorDB
            let relevantCourses = {
                results: [],
                scores: [],
                query_analysis: {},
            };

            // Khởi tạo biến chứa tài liệu phù hợp
            let relevantDocuments: Document[] = [];

            // Phân tích loại truy vấn
            const queryTypes = identifyQueryType(input);
            const isQueryAboutCoursesOrDocs =
                queryTypes.isDoc || queryTypes.isCourse || queryTypes.isPath;

            console.log("🟢 Phân tích truy vấn:", {
                isQueryAboutCoursesOrDocs,
                isTàiLiệu: queryTypes.isDoc,
                isKhóaHọc: queryTypes.isCourse,
                isLộTrình: queryTypes.isPath,
            });

            if (isQueryAboutCoursesOrDocs) {
                // Tìm kiếm tài liệu nếu là câu hỏi về tài liệu hoặc lộ trình
                if (queryTypes.isDoc || queryTypes.isPath) {
                    const queryTerms = input
                        .toLowerCase()
                        .split(" ")
                        .filter((term) => term.length > 2);

                    // Tính toán điểm phù hợp cho mỗi tài liệu
                    const scoredDocuments = documentData.map((doc) => {
                        // Tìm trong tiêu đề, mô tả, thẻ và danh mục
                        const searchText = [
                            doc.title.toLowerCase(),
                            doc.description.toLowerCase(),
                            doc.category.toLowerCase(),
                            ...doc.tags.map((tag) => tag.toLowerCase()),
                        ].join(" ");

                        // Tính điểm phù hợp
                        let relevanceScore = 0;
                        let matchedTerms = 0;

                        // Đếm số từ khóa xuất hiện
                        queryTerms.forEach((term) => {
                            if (searchText.includes(term)) {
                                relevanceScore += 1;
                                matchedTerms += 1;
                            }
                        });

                        // Thưởng thêm cho tiêu đề trùng khớp
                        if (
                            doc.title
                                .toLowerCase()
                                .split(" ")
                                .some((word) =>
                                    queryTerms.includes(word.toLowerCase())
                                )
                        ) {
                            relevanceScore += 3;
                        }

                        // Thưởng cho tài liệu mới/nổi bật
                        if (doc.isNew) relevanceScore += 1;
                        if (doc.isFeatured) relevanceScore += 2;

                        // Trọng số cho danh mục và thẻ
                        const normalizedInput = removeVietnameseDiacritics(
                            input.toLowerCase()
                        );
                        if (
                            removeVietnameseDiacritics(
                                doc.category.toLowerCase()
                            ).includes(normalizedInput)
                        ) {
                            relevanceScore += 4;
                        }

                        // Kiểm tra thẻ
                        doc.tags.forEach((tag) => {
                            if (
                                removeVietnameseDiacritics(
                                    tag.toLowerCase()
                                ).includes(normalizedInput)
                            ) {
                                relevanceScore += 3;
                            }
                        });

                        return {
                            document: doc,
                            score: relevanceScore,
                            matchedTerms,
                        };
                    });

                    // Lọc những tài liệu không phù hợp và sắp xếp theo điểm
                    const filteredDocuments = scoredDocuments
                        .filter(
                            (item) => item.matchedTerms > 0 || item.score > 2
                        )
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5); // Giới hạn kết quả

                    // Chỉ lấy thông tin tài liệu
                    relevantDocuments = filteredDocuments.map(
                        (item) => item.document
                    );
                    console.log("🟢 Tài liệu phù hợp:", relevantDocuments);
                }

                try {
                    // Gọi đến vectorDB với các thông số nếu là câu hỏi về khóa học hoặc lộ trình
                    if (queryTypes.isCourse || queryTypes.isPath) {
                        const findCoursesInVectorDB = await fetch(
                            `http://localhost:8000/search`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    query: input,
                                    top_k: 5,
                                    // min_score: 0.3,
                                    // filters: {
                                    //     level:
                                    //         userProfile?.skillLevel?.toLowerCase() ||
                                    //         undefined,
                                    // },
                                }),
                            }
                        );

                        // Xử lý kết quả từ vectorDB
                        relevantCourses = await findCoursesInVectorDB.json();
                        console.log("🟢 Kết quả vectorDB:", relevantCourses);
                    }
                } catch (error) {
                    console.error("❌ Lỗi khi tìm kiếm khóa học:", error);
                }
            }

            // Format các khóa học với điểm số tương ứng
            let formatCoursesVar = "";
            if (relevantCourses.results && relevantCourses.results.length > 0) {
                formatCoursesVar = formatCourses(
                    relevantCourses.results,
                    relevantCourses.scores
                );
            }

            // Format các tài liệu phù hợp
            let formatDocsVar = "";
            if (relevantDocuments.length > 0) {
                formatDocsVar = formatDocuments(relevantDocuments);
            }

            // Tạo prompt cho LLM
            const promptMessages = [
                ...messages.slice(-5).map((m) => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text,
                })),
                { role: "user", content: input },
            ];

            // Thêm thông tin ngữ cảnh vào prompt
            if (
                (relevantCourses.results &&
                    relevantCourses.results.length > 0 &&
                    userProfile) ||
                relevantDocuments.length > 0
            ) {
                let systemContent = `Dưới đây là thông tin học viên`;

                if (userProfile) {
                    systemContent += ` và các thông tin liên quan.
                    User level: ${userProfile.skillLevel || "không rõ"}.
                    Specific goals: ${userProfile.specificGoals || "không rõ"}.
                    Priority skills: ${
                        userProfile.prioritySkills || "không rõ"
                    }.
                    Known vocabulary: ${
                        userProfile.knownVocabulary || "không rõ"
                    }.
                    Assessment test results: ${
                        userProfile.assessmentTest || "không rõ"
                    }.
                    Learning purpose: ${
                        userProfile.learningPurpose || "không rõ"
                    }.
                    User goals: ${userProfile.learningGoals || "không rõ"}.`;
                }

                if (
                    relevantCourses.results &&
                    relevantCourses.results.length > 0 &&
                    queryTypes.isCourse
                ) {
                    systemContent += `
                    Các khóa học được gợi ý: ${formatCoursesVar}.
                    
                    Từ những khoá học được gợi ý này, hãy chọn và giới thiệu những khoá học phù hợp nhất với học viên.
                    
                    Khi giới thiệu mỗi khóa học, PHẢI đảm bảo cung cấp:
                    1. Tên đầy đủ của khóa học
                    2. Mô tả ngắn gọn khóa học
                    3. GIÁ GỐC và GIÁ SAU GIẢM (nếu có giảm giá)
                    4. Số bài học hoặc thời lượng (nếu có)
                    5. Trình độ phù hợp
                    6. Thông tin về mục tiêu của khóa học
                    7. Link đến khóa học (dạng markdown [tên khóa học](http://localhost:3000/courses/ID))
                    4. Không bịa ra tài liệu không có trong danh sách được cung cấp

                    Giải thích ngắn gọn tại sao những khóa học này phù hợp với nhu cầu và trình độ của người học.
                    Cung cấp link đến khóa học để người dùng có thể dễ dàng truy cập.
                    
                    FORMAT mẫu cho mỗi khóa học:
                    ## [Tên khóa học](link)
                    - **Mô tả**: Mô tả chi tiết
                    - **Giá**: XX.XXX.XXXđ ~~XX.XXX.XXXđ~~ (Giảm XX%)
                    - **Trình độ**: Trình độ phù hợp
                    - **Thời lượng**: X bài học
                    - **Mục tiêu**: Mục tiêu của khóa học
                    
                    Lý do nên chọn: [Giải thích]`;
                }

                if (relevantDocuments.length > 0 && queryTypes.isDoc) {
                    systemContent += `
                    Các tài liệu học tập phù hợp: ${formatDocsVar}
                    
                    Từ những tài liệu học tập được gợi ý này, hãy chọn và giới thiệu những tài liệu phù hợp nhất với nhu cầu của người học.
                    
                    Khi giới thiệu mỗi tài liệu, PHẢI đảm bảo cung cấp:
                    1. Tên đầy đủ của tài liệu
                    2. Mô tả chi tiết về nội dung và lợi ích của tài liệu
                    3. Phân loại/thể loại của tài liệu
                    4. Những điểm nổi bật của tài liệu (nếu có)
                    5. Đối tượng phù hợp với tài liệu này
                    6. Link tải tài liệu (dạng markdown [tên tài liệu](URL) với URL đầy đủ bắt đầu bằng http:// hoặc https://)
                    
                    Giải thích ngắn gọn tại sao những tài liệu này phù hợp với người học, và cách họ có thể sử dụng chúng để đạt được mục tiêu học tập.
                    Cung cấp link tải tài liệu để người dùng có thể truy cập dễ dàng.
                    
                    FORMAT mẫu cho mỗi tài liệu:
                    ## [Tên tài liệu](link tải)
                    - **Loại**: Phân loại tài liệu
                    - **Mô tả**: Mô tả chi tiết
                    - **Đối tượng**: Người học phù hợp
                    - **Ứng dụng**: Cách sử dụng tài liệu hiệu quả
                    
                    Lý do nên sử dụng: [Giải thích]
                    
                    QUAN TRỌNG: Đảm bảo sửa chữa các URL bị lỗi, đặc biệt là URL có chứa dấu %5D hoặc %5B hoặc URL trùng lặp.`;
                }

                if (queryTypes.isPath) {
                    systemContent += `
                    Đây là yêu cầu về lộ trình học tập. Hãy tạo một lộ trình học tập cá nhân hóa phù hợp với trình độ và mục tiêu của người học.
                    
                    YÊU CẦU CHI TIẾT ĐỐI VỚI LỘ TRÌNH:
                    1. Xác định rõ thời gian: Đề xuất khoảng thời gian phù hợp (ví dụ: 2 tháng, 4 tháng, 6 tháng - nhớ rõ 1 tháng có 4 tuần) tùy thuộc vào mục tiêu và trình độ hiện tại của học viên.
                    2. Chia theo tuần: Mỗi 2 tuần nên có hoạt động và mục tiêu cụ thể.
                    3. Đề xuất khóa học cụ thể: Nêu rõ tên khóa học và cung cấp link,                         
                    4. Không bịa ra tài liệu không có trong danh sách được cung cấp,
                    5. Đánh giá tiến độ: Mô tả phương pháp để học viên tự đánh giá tiến độ của mình.
                    6. Đưa ra lời khuyên: Cung cấp các mẹo và chiến lược học tập phù hợp.
                    
                    
             
                    
                    
                    ### LỜI KHUYÊN VÀ CHIẾN LƯỢC HỌC TẬP
                    [Cung cấp 3-5 lời khuyên cụ thể]
                    
                    ĐẶC BIỆT LƯU Ý KHI TẠO LỘ TRÌNH:
                    1. Tất cả các URL phải ở định dạng markdown chuẩn [Tên](URL)
                    2. URL không được chứa các ký tự đặc biệt [ ] ( ) 
                    3. Mỗi tài liệu hoặc khóa học phải có một URL riêng
                    4. Không bịa ra khóa học không có trong danh sách được cung cấp`;

                    // Thêm gợi ý tài liệu nếu có tài liệu phù hợp
                    if (relevantDocuments.length > 0) {
                        systemContent += `
                        Hãy tích hợp các tài liệu sau đây vào lộ trình học tập một cách phù hợp: ${formatDocsVar}
                        
                        QUAN TRỌNG VỀ TÀI LIỆU:
                        1. Mỗi tài liệu PHẢI được sử dụng đúng cách trong lộ trình, đặt vào đúng giai đoạn phù hợp với trình độ.
                        2. Khi đề cập đến tài liệu trong lộ trình, PHẢI bao gồm:
                           - Tên đầy đủ của tài liệu
                           - Mô tả ngắn gọn về nội dung và cách sử dụng
                           - Đường link đầy đủ dạng markdown [Tên tài liệu](URL)
                        3. Không bịa ra tài liệu không có trong danh sách được cung cấp`;
                    }

                    // Thêm gợi ý khóa học nếu có khóa học phù hợp
                    if (
                        relevantCourses.results &&
                        relevantCourses.results.length > 0
                    ) {
                        systemContent += `
                        Hãy tích hợp các khóa học sau đây vào lộ trình học tập một cách phù hợp: ${formatCoursesVar}
                        
                        QUAN TRỌNG VỀ KHÓA HỌC:
                        1. Mỗi khóa học PHẢI được sử dụng đúng cách trong lộ trình, đặt vào đúng giai đoạn phù hợp với trình độ.
                        2. Khi đề cập đến khóa học trong lộ trình, PHẢI bao gồm:
                           - Tên đầy đủ của khóa học
                           - Mô tả ngắn gọn về nội dung khóa học
                           - Thông tin về giá (nếu có)
                           - Đường link đầy đủ dạng markdown [Tên khóa học](URL)
                        3. Đề xuất cách học cụ thể, ví dụ: "Hoàn thành 3 bài học đầu tiên trong tuần 1"
                        4. Không bịa ra khóa học không có trong danh sách được cung cấp`;
                    }

                    // Thêm hướng dẫn cho trợ lý định dạng đường dẫn đúng
                    systemContent += `
                    
                    QUAN TRỌNG: 
                    - Đảm bảo rằng tất cả các URL đều có định dạng đúng, bắt đầu bằng http:// hoặc https://
                    - Không sử dụng dấu ngoặc vuông [] hoặc dấu ngoặc đơn () trong URL
                    - Đảm bảo thông tin đầy đủ và cụ thể cho từng giai đoạn
                    - Phải có ít nhất 2 giai đoạn trong lộ trình, mỗi giai đoạn có ít nhất 2-4 tuần
                    - Chỉ sử dụng các khóa học và tài liệu từ danh sách được cung cấp, KHÔNG TỰ NGHĨ RA khóa học hay tài liệu mới
                    - Đảm bảo kết hợp hợp lý các tài liệu và khóa học để tạo lộ trình hiệu quả nhất
                    `;
                }

                systemContent += `
                Trả lời theo định dạng ReactMarkdown.
                
                Hãy phân tích truy vấn của người dùng và chọn những tài nguyên phù hợp nhất. 
                Hãy trả lời bằng tiếng Việt rõ ràng, mạch lạc và định dạng theo ReactMarkdown.
                
                YÊU CẦU CHUNG:
                1. Trả lời đầy đủ, chi tiết và đảm bảo cung cấp đủ thông tin mà người dùng cần
                2. Luôn định dạng URL theo dạng markdown [tên](URL) với URL đầy đủ bắt đầu bằng http:// 
                3. Sửa chữa bất kỳ URL bị lỗi nào, đặc biệt là các URL có chứa %5D hoặc %5B
                4. Định dạng câu trả lời với các đề mục, danh sách, và làm nổi bật các thông tin quan trọng
                5. Luôn đảm bảo bao gồm thông tin giá cả, chi tiết, và đường dẫn khi đề cập đến khóa học
                6. Cung cấp tối thiểu 3-5 gợi ý nếu người dùng yêu cầu tìm kiếm tài liệu hoặc khóa học
                7. Đưa ra lời khuyên - động viên người dùng ở cuối câu trả lời
                
                Sử dụng văn phong chuyên nghiệp, thân thiện và khuyến khích.
        .`;

                promptMessages.push({
                    role: "system",
                    content: systemContent,
                });
            } else if (userProfile) {
                // Nếu không có khóa học/tài liệu phù hợp hoặc không phải câu hỏi về khóa học/tài liệu
                promptMessages.push({
                    role: "system",
                    content: `Bạn là một trợ lý AI chuyên về học tiếng Anh, hãy trả lời câu hỏi của người dùng một cách thân thiện và hữu ích.
                    Hãy trả lời bằng tiếng Việt và định dạng theo ReactMarkdown.
                    Sử dụng văn phong thân thiện và khuyến khích.

                    QUAN TRỌNG: 
                    - Khi đề cập đến bất kỳ khóa học nào, LUÔN LUÔN chèn link đầy đủ đến khóa học đó, ví dụ: [Tên khóa học](http://localhost:3000/courses/course-id)
                    - Khi đề cập đến bất kỳ tài liệu nào, LUÔN LUÔN chèn link đầy đủ đến tài liệu đó, ví dụ: [Tên tài liệu](http://localhost:3000/docs/doc-id)
                    - Khi đề cập đến bất kỳ bài kiểm tra nào, LUÔN LUÔN chèn link đầy đủ đến bài kiểm tra đó, ví dụ: [Tên bài kiểm tra](http://localhost:3000/online-tests/test-id)
                    - Luôn tạo liên kết cho khóa học/tài liệu/bài kiểm tra theo định dạng [Tên](URL) để người dùng có thể nhấp vào
                    - Cung cấp ít nhất 3 khóa học/tài liệu/bài kiểm tra liên quan nếu có thể, mỗi khóa học/tài liệu/bài kiểm tra phải có liên kết đầy đủ
                    `,
                });

                // Thêm các khóa học liên quan nếu có
                if (
                    relevantCourses.results &&
                    relevantCourses.results.length > 0
                ) {
                    let courseInfo = formatCourses(
                        relevantCourses.results,
                        relevantCourses.scores
                    );
                    promptMessages.push({
                        role: "system",
                        content: `Dưới đây là các khóa học liên quan đến câu hỏi của người dùng. 
                        Hãy sử dụng thông tin này để đề xuất cho người dùng. Luôn PHẢI bao gồm link đầy đủ cho mỗi khóa học.
                        
                        ${courseInfo}`,
                    });
                }

                // Thêm các tài liệu liên quan nếu có
                if (queryTypes.isDoc && relevantDocuments.length > 0) {
                    let docInfo = formatDocuments(relevantDocuments);
                    promptMessages.push({
                        role: "system",
                        content: `Dưới đây là các tài liệu liên quan đến câu hỏi của người dùng.
                        Hãy sử dụng thông tin này để đề xuất cho người dùng. Luôn PHẢI bao gồm link đầy đủ cho mỗi tài liệu.
                        
                        ${docInfo}`,
                    });
                }
            } else {
                // Prompt mặc định cho các câu hỏi khác
                promptMessages.push({
                    role: "system",
                    content: `Bạn là một trợ lý AI chuyên về học tiếng Anh, hãy trả lời câu hỏi của người dùng một cách thân thiện và hữu ích.
                    Hãy trả lời bằng tiếng Việt và định dạng theo ReactMarkdown.
                    Sử dụng văn phong thân thiện và khuyến khích.
                    
                    QUAN TRỌNG:
                    - Nếu câu trả lời của bạn đề cập đến bất kỳ khóa học, tài liệu hoặc bài kiểm tra nào, LUÔN LUÔN phải cung cấp link đầy đủ 
                    - Nếu bạn đề xuất các khóa học, hãy sử dụng định dạng [Tên khóa học](http://localhost:3000/courses/course-id)
                    - Nếu bạn đề xuất tài liệu, hãy sử dụng định dạng [Tên tài liệu](http://localhost:3000/docs/doc-id)
                    - Nếu bạn đề xuất bài kiểm tra, hãy sử dụng định dạng [Tên bài kiểm tra](http://localhost:3000/online-tests/test-id)
                    `,
                });
            }

            console.log("🟢 promptMessages:", promptMessages);

            // Gửi prompt đến LLM
            const aiResponse = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer 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`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: promptMessages,
                        temperature: 0.7,
                        max_tokens: 4000,
                    }),
                }
            );

            const data = await aiResponse.json();
            const responseText =
                data.choices?.[0]?.message?.content?.trim() ||
                "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này!";

            console.log("🟢 Phản hồi AI:", responseText);

            // Cập nhật lộ trình học tập nếu đó là yêu cầu về lộ trình
            if (isRequestPath) {
                try {
                    console.log("🟢 Lưu lộ trình học tập");

                    // Làm sạch URL trong phản hồi trước khi lưu
                    const cleanedResponse = responseText
                        .replace(/\]\(http:\/localhost/g, "](http://localhost")
                        .replace(/\%5D\(/g, "/")
                        .replace(/\%5B/g, "")
                        .replace(/\[([^\]]+)\]\[(.*?)\](\(.*?\))/g, "[$1]$3") // Sửa URL bị lặp cặp ngoặc vuông
                        .replace(/\(http([^)]*)\)/g, (match) => {
                            // Xử lý URL có thể chứa dấu ngoặc không hợp lệ
                            return match
                                .replace(/\[|\]/g, "") // Loại bỏ các ký tự ngoặc vuông dư thừa
                                .replace(/,/g, "%2C"); // Mã hóa dấu phẩy trong URL
                        })
                        .replace(/ielts.*?(months|weeks)/gi, (match) => {
                            // Xử lý đặc biệt cho cụm từ liên quan đến IELTS và thời gian
                            return match
                                .replace(/\-/g, " ") // Thay dấu gạch ngang bằng khoảng trắng
                                .replace(/\s+/g, " "); // Xử lý nhiều khoảng trắng liên tiếp
                        });

                    await updatePath(userId, { pathDetails: cleanedResponse });
                    console.log("🟢 Đã cập nhật lộ trình học tập");
                } catch (error) {
                    console.error("❌ Lỗi khi cập nhật lộ trình:", error);
                }
            }

            // Reset biến trạng thái
            isRequestPath = false;
            isDocumentQuery = false;
            isCourseOnlyQuery = false;

            // Lưu tin nhắn phản hồi từ bot
            await fetch(
                `${API_BASE_URL}/conversation/${conversationId}/message`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        senderId: null,
                        content: responseText,
                    }),
                }
            );

            // Cập nhật UI với tin nhắn bot mới và xóa tin nhắn "đang nhập"
            setMessages((prev) =>
                prev
                    .filter((msg) => !msg.isTyping) // Xóa tin nhắn "đang nhập"
                    .concat([{ sender: "bot", text: responseText }])
            );
        } catch (error) {
            console.error("❌ Lỗi trong quá trình xử lý:", error);

            // Xử lý lỗi và cập nhật UI
            setMessages((prev) =>
                prev
                    .filter((msg) => !msg.isTyping)
                    .concat([
                        {
                            sender: "bot",
                            text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                        },
                    ])
            );
        }
    };
    const formatMarkdown = (text: string) => {
        // Xử lý lỗi URL có chứa dấu ngoặc hoặc bị trùng lặp
        let formattedText = text.replace(
            /\[(.*?)\]\[(.*?)\](\(.*?\))/g,
            "[$1]$3"
        );

        // Xử lý lỗi URL chứa %5D và %5B
        formattedText = formattedText
            .replace(/\%5D\(/g, "/")
            .replace(/\%5B/g, "");

        // Xử lý lỗi URL có ielts-topics.xlsx\]\(http:/localhost
        formattedText = formattedText.replace(
            /\]\(http:\/localhost/g,
            "](http://localhost"
        );

        // Xử lý lỗi URL trong nội dung liên quan đến IELTS
        formattedText = formattedText.replace(
            /IELTS[^\(]*?\(([^\)]+)\)/gi,
            (match, url) => {
                // Làm sạch URL trong phần IELTS
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");

                // Tìm phần text trước dấu (
                const textPart = match.split("(")[0].trim();
                return `${textPart} (${cleanUrl})`;
            }
        );

        // Xử lý link khóa học
        formattedText = formattedText.replace(
            /\[([^\]]+)\]\((http[^\)]+courses[^\)]+)\)/g,
            (match, title, url) => {
                // Đảm bảo URL đúng định dạng
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return `[${title}](${cleanUrl})`;
            }
        );

        // Xử lý link tài liệu
        formattedText = formattedText.replace(
            /\[([^\]]+)\]\((http[^\)]+docs[^\)]+)\)/g,
            (match, title, url) => {
                // Đảm bảo URL đúng định dạng
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return `[${title}](${cleanUrl})`;
            }
        );

        // Xử lý link bài test
        formattedText = formattedText.replace(
            /\[([^\]]+)\]\((http[^\)]+online-tests[^\)]+)\)/g,
            (match, title, url) => {
                // Đảm bảo URL đúng định dạng
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return `[${title}](${cleanUrl})`;
            }
        );

        // Xử lý trường hợp bị lỗi định dạng cho khóa học
        formattedText = formattedText.replace(
            /-?\s*(http[^\s]+courses[^\s]+)/g,
            (_, url) => {
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return ` [Xem khóa học](${cleanUrl})`;
            }
        );

        // Xử lý đặc biệt cho các đường dẫn trong nội dung IELTS
        formattedText = formattedText.replace(
            /\b(ielts[^\.]*?)(http[^\s\)]+)/gi,
            (match, prefix, url) => {
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return `${prefix}[Xem tài liệu](${cleanUrl})`;
            }
        );

        // Xử lý URL không hợp lệ trong lộ trình học IELTS
        formattedText = formattedText.replace(
            /\*\*(Tháng|Tuần|Giai đoạn)[^:]*:[^\[]*\[(.*?)\]([^\(])/gi,
            (match, prefix, linkText, suffix) => {
                // Sửa định dạng link bị thiếu dấu ngoặc đơn
                return `**(${prefix}): [${linkText}](http://localhost:3000/resources)${suffix}`;
            }
        );

        // Xử lý trường hợp bị lỗi định dạng cho tài liệu
        formattedText = formattedText.replace(
            /-?\s*(http[^\s]+docs[^\s]+)/g,
            (_, url) => {
                // Trích xuất tên file từ URL
                const fileName = url.split("/").pop();
                // Tạo tên hiển thị thân thiện
                let displayName = "Xem tài liệu";

                // Làm sạch URL
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");

                if (fileName) {
                    // Loại bỏ phần mở rộng file để tạo tên hiển thị thân thiện hơn
                    const nameWithoutExt = fileName.split(".")[0];
                    if (nameWithoutExt) {
                        // Chuyển định dạng từ kebab-case thành tiếng Việt có hoa chữ cái đầu
                        displayName = nameWithoutExt
                            .split("-")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ");
                    }
                }

                return ` [${displayName}](${cleanUrl})`;
            }
        );

        // Xử lý trường hợp bị lỗi định dạng cho bài test
        formattedText = formattedText.replace(
            /-?\s*(http[^\s]+online-tests[^\s]+)/g,
            (_, url) => {
                const testId = url.split("/").pop();
                const cleanUrl = url
                    .replace(/\[|\]/g, "")
                    .replace(/\%5D\(/g, "/")
                    .replace(/\%5B/g, "")
                    .replace(/,/g, "%2C");
                return ` [Làm bài kiểm tra${
                    testId ? ` ${testId}` : ""
                }](${cleanUrl})`;
            }
        );

        return formattedText;
    };
    return (
        <>
            <button
                onClick={toggleChat}
                className="relative p-1.5 rounded-full focus:outline-none hover:bg-purple-100 transition-all duration-300"
            >
                <div className="relative">
                    <Bot className="w-7 h-7" />
                    {!showChat && messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                            !
                        </span>
                    )}
                </div>
            </button>

            {showChat && (
                <div className="fixed top-64 right-10 w-1/3 h-[700px] bg-white rounded-xl shadow-xl p-4 border border-violet-300 flex flex-col animate-slideIn z-50">
                    <div className="flex justify-between items-center border-b border-violet-100 pb-2">
                        <div className="flex items-center">
                            <img
                                className="w-6 h-6 mr-2"
                                src="/icons/chatbot.png"
                                alt="AI Assistant"
                            />
                            <div className="text-lg font-semibold text-violet-700">
                                AI Assistant
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-2xl font-semibold hover:text-violet-500 transition-colors"
                        >
                            ×
                        </button>
                    </div>

                    <div
                        ref={chatBoxRef}
                        className="chat-box text-sm flex-grow overflow-y-auto my-3 pr-2 h-full"
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-700 p-3 py-20">
                                <h2 className="text-lg font-semibold text-violet-500 mb-3">
                                    Chào mừng đến với Trợ Lý Học Ngôn Ngữ!
                                </h2>

                                <p className="text-sm mt-1 text-gray-600">
                                    Tôi có thể giúp bạn với:
                                </p>
                                <ul className="text-sm mt-2 space-y-1.5 list-disc list-inside text-violet-600 max-w-xs mx-auto text-left">
                                    <li>Trả lời câu hỏi về học ngôn ngữ</li>
                                    <li>
                                        Đề xuất lộ trình học tập cá nhân hóa
                                    </li>
                                    <li>Gợi ý khóa học, tài liệu học tập</li>
                                    <li>Hỗ trợ bạn đạt mục tiêu học tập</li>
                                </ul>
                                <p className="text-sm mt-4 text-gray-500">
                                    Hãy nhắn tin cho tôi hoặc chọn một trong các
                                    mẫu dưới đây! 👇
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {msg.sender === "bot" && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                                <img
                                                    src="/icons/chatbot.png"
                                                    alt="AI"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                                                msg.sender === "user"
                                                    ? "bg-violet-500 text-white"
                                                    : msg.isTyping
                                                    ? "bg-gray-200 text-gray-500 flex items-center"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {msg.isTyping ? (
                                                <div className="typing-animation flex space-x-1">
                                                    <span className="dot animate-bounce">
                                                        ●
                                                    </span>
                                                    <span
                                                        className="dot animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.2s",
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    <span
                                                        className="dot animate-bounce"
                                                        style={{
                                                            animationDelay:
                                                                "0.4s",
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                </div>
                                            ) : (
                                                <ReactMarkdown
                                                    components={{
                                                        h1: (props) => (
                                                            <h1
                                                                className="text-xl font-bold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        h2: (props) => (
                                                            <h2
                                                                className="text-lg font-semibold my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                        p: (props) => (
                                                            <p
                                                                className="text-base my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        ol: (props) => (
                                                            <ol
                                                                className="list-decimal ml-5 my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        ul: (props) => (
                                                            <ul
                                                                className="list-disc ml-5 my-1.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        li: (props) => (
                                                            <li
                                                                className="my-0.5"
                                                                {...props}
                                                            />
                                                        ),
                                                        a: (props) => (
                                                            <a
                                                                className="text-blue-500 underline hover:text-blue-700"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                {...props}
                                                            />
                                                        ),
                                                        blockquote: (props) => (
                                                            <blockquote
                                                                className="border-l-4 border-violet-300 pl-3 italic my-2 text-gray-600"
                                                                {...props}
                                                            />
                                                        ),
                                                        code: (props) => (
                                                            <code
                                                                className="bg-gray-200 px-1 rounded text-sm"
                                                                {...props}
                                                            />
                                                        ),
                                                        pre: (props) => (
                                                            <pre
                                                                className="bg-gray-800 text-white p-2 rounded my-2 overflow-x-auto text-sm"
                                                                {...props}
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {formatMarkdown(msg.text)}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                        {msg.sender === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-violet-200 ml-2 flex items-center justify-center flex-shrink-0">
                                                <span className="text-violet-600 font-medium text-sm">
                                                    {user?.name?.[0]?.toUpperCase() ||
                                                        "U"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatBoxRef} />
                            </div>
                        )}
                        {messages.length === 0 && (
                            <div className="p-2 flex flex-wrap gap-2 mt-auto overflow-x-auto justify-center">
                                {[
                                    "Làm sao để bắt đầu học tiếng Anh?",
                                    "Tài liệu cho người mới học tiếng Anh?",
                                    "Tài liệu luyện phát âm tiếng Anh",
                                    "Tạo lộ trình học IELTS",
                                    "Khóa học TOEIC phù hợp với tôi?",
                                    "Sách học từ vựng hiệu quả",
                                ].map((s, i) => (
                                    <button
                                        key={i}
                                        className="bg-violet-100 px-3 py-1.5 rounded-full text-sm hover:bg-violet-200 whitespace-nowrap transition-colors duration-200"
                                        onClick={() => {
                                            setInput(s);
                                            setTimeout(
                                                () => sendMessage(),
                                                100
                                            );
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-300 bg-gray-50">
                        <input
                            className="flex-1 p-2.5 focus:outline-none bg-transparent"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="p-2 text-white bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 transition-colors duration-200"
                        >
                            <img
                                src="/icons/send.png"
                                className="w-5 h-5"
                                alt="Send"
                            />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .dot {
                    font-size: 10px;
                }

                .typing-animation {
                    padding: 0 4px;
                }
            `}</style>
        </>
    );
}
