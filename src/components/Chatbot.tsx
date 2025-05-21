"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addConversation } from "@/api/conversation";
import { fetchUserById } from "@/api/user";
import { fetchCourses } from "@/api/courses";
import ReactMarkdown from "react-markdown";
import { updatePath, addRecommendedCourse } from "@/api/learningPath";
import { useRef } from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { fetchConversationMessages } from "@/api/conversation";
import { fetchConversationMessages as fetchConversationMsgs } from "@/api/message";

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

// Thêm interface định nghĩa cho tin nhắn
interface Message {
    sender: "user" | "bot";
    text: string;
    isTyping?: boolean;
    isLearningPath?: boolean;
    pathData?: string;
}

export default function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const user = useSelector((state: RootState) => state.user.user);
    const userId: any = user?.id;
    const toggleChat = () => setShowChat((prev) => !prev);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    function formatCourses(courseList: string[], scores: number[] = []) {
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
                try {
                    // Trước tiên lấy tin nhắn theo userId
                    const userMessagesData = await fetchConversationMessages(
                        userId
                    );
                    if (
                        Array.isArray(userMessagesData) &&
                        userMessagesData.length > 0
                    ) {
                        setMessages(
                            userMessagesData.map((msg) => ({
                                sender:
                                    msg.senderId === userId ? "user" : "bot",
                                text: msg.content,
                            }))
                        );
                        console.log(
                            "✅ Đã tải lịch sử tin nhắn theo userId thành công:",
                            userMessagesData.length,
                            "tin nhắn"
                        );
                    } else {
                        // Nếu không có tin nhắn theo userId, thử lấy theo conversationId
                        const convId = data.id;
                        if (convId) {
                            try {
                                const conversationMessagesData =
                                    await fetchConversationMsgs(convId);
                                if (
                                    Array.isArray(conversationMessagesData) &&
                                    conversationMessagesData.length > 0
                                ) {
                                    setMessages(
                                        conversationMessagesData.map((msg) => ({
                                            sender:
                                                msg.senderId === userId
                                                    ? "user"
                                                    : "bot",
                                            text: msg.content,
                                        }))
                                    );
                                    console.log(
                                        "✅ Đã tải lịch sử tin nhắn theo conversationId thành công:",
                                        conversationMessagesData.length,
                                        "tin nhắn"
                                    );
                                } else {
                                    console.log(
                                        "ℹ️ Không có lịch sử tin nhắn cho cuộc hội thoại"
                                    );
                                }
                            } catch (conversationError) {
                                console.error(
                                    "❌ Lỗi khi tải tin nhắn theo conversationId:",
                                    conversationError
                                );
                            }
                        } else {
                            console.log("ℹ️ Không có lịch sử tin nhắn");
                        }
                    }
                } catch (error) {
                    console.error("❌ Lỗi khi tải lịch sử tin nhắn:", error);
                }
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

        const newMessage = { sender: "user" as const, text: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            // Lưu tin nhắn người dùng
            try {
                const userMessageResponse = await fetch(
                    `${API_BASE_URL}/conversation/${conversationId}/message`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            senderId: userId,
                            content: input,
                        }),
                        credentials: "include", // Thêm credentials để đảm bảo cookie được gửi đi
                    }
                );

                if (!userMessageResponse.ok) {
                    console.error(
                        "❌ Lỗi khi lưu tin nhắn người dùng:",
                        await userMessageResponse.text()
                    );
                } else {
                    console.log("✅ Đã lưu tin nhắn người dùng thành công");
                }
            } catch (saveError) {
                console.error(
                    "❌ Exception khi lưu tin nhắn người dùng:",
                    saveError
                );
            }

            // Hiển thị trạng thái đang nhập
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot" as const,
                    text: "Đang tìm kiếm thông tin...",
                    isTyping: true,
                },
            ]);

            // Lấy thông tin người dùng
            const userProfile = await fetchUserById(userId);
            console.log("🟢 userProfile:", userProfile);

            // Khởi tạo biến vectorDB
            let relevantCourses: {
                results: string[];
                scores: number[];
                query_analysis: any;
            } = {
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

            // Ghi log nếu là yêu cầu lộ trình
            if (queryTypes.isPath) {
                console.log(
                    "🟢 Đây là yêu cầu tạo lộ trình - không sử dụng lịch sử tin nhắn"
                );
            }

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
                        .filter((item) => item.matchedTerms > 0)
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
                        // Xử lý prompt trước khi truy vấn vector DB
                        let enhancedQuery = input;

                        // Tạo prompt nâng cao dựa trên thông tin người dùng và yêu cầu hiện tại
                        if (userProfile) {
                            const userInfo: string[] = [];

                            // Thêm thông tin về trình độ
                            if (userProfile.skillLevel) {
                                userInfo.push(
                                    `trình độ ${userProfile.skillLevel}`
                                );
                            }

                            // Thêm thông tin về mục tiêu cụ thể
                            if (userProfile.specificGoals) {
                                userInfo.push(
                                    `mục tiêu ${userProfile.specificGoals}`
                                );
                            }

                            // Thêm thông tin về kỹ năng ưu tiên
                            if (userProfile.prioritySkills) {
                                userInfo.push(
                                    `cần kỹ năng ${userProfile.prioritySkills}`
                                );
                            }

                            // Thêm thông tin về mục đích học tập
                            if (userProfile.learningPurpose) {
                                userInfo.push(
                                    `mục đích ${userProfile.learningPurpose}`
                                );
                            }

                            // Thêm thông tin về mục tiêu học tập
                            if (userProfile.learningGoals) {
                                userInfo.push(
                                    `mục tiêu học tập ${userProfile.learningGoals}`
                                );
                            }

                            // Tạo câu truy vấn nâng cao
                            if (userInfo.length > 0) {
                                enhancedQuery = `${input} cho người học ${userInfo.join(
                                    ", "
                                )}`;
                                console.log(
                                    "🟢 Câu truy vấn nâng cao:",
                                    enhancedQuery
                                );
                            }
                        }

                        // Chuẩn bị các bộ lọc dựa trên thông tin người dùng
                        const filters: any = {};

                        // Thêm bộ lọc trình độ nếu có
                        if (userProfile?.skillLevel) {
                            // Chuyển đổi trình độ người dùng thành mức độ khóa học
                            const levelMapping: { [key: string]: string } = {
                                beginner: "beginner",
                                elementary: "beginner",
                                "pre-intermediate": "intermediate",
                                intermediate: "intermediate",
                                "upper-intermediate": "advanced",
                                advanced: "advanced",
                            };

                            const userLevel =
                                userProfile.skillLevel.toLowerCase();
                            if (levelMapping[userLevel]) {
                                filters.level = levelMapping[userLevel];
                            }
                        }

                        // Gọi đến vectorDB với câu truy vấn nâng cao
                        const findCoursesInVectorDB = await fetch(
                            `http://localhost:8000/search`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    query: enhancedQuery,
                                    top_k: 5,
                                    min_score: 0.3,
                                    filters:
                                        Object.keys(filters).length > 0
                                            ? filters
                                            : undefined,
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
            const isPathRequest = queryTypes.isPath;

            // Nếu là yêu cầu tạo lộ trình, chỉ gửi tin nhắn hiện tại
            // Nếu không phải, gửi cả tin nhắn trước đó để giữ ngữ cảnh
            const promptMessages = isPathRequest
                ? [
                      {
                          role: "system",
                          content: `Bạn là một chuyên gia giáo dục ngôn ngữ với kiến thức sâu rộng về thiết kế chương trình học, phương pháp học ngôn ngữ và phát triển tài liệu giáo dục. Bạn chuyên tạo lộ trình học tập cá nhân hóa chi tiết cho người học ngôn ngữ.
                          
                          QUAN TRỌNG: Hãy trả về kết quả theo định dạng JSON với cấu trúc như sau:
                          {
                            "learning_plan": {
                              "basic_information": {
                                "goal": {
                                  "description": "Mô tả mục tiêu học tập",
                                  "target_score": "Điểm mục tiêu (nếu có)",
                                  "focus_skills": ["Kỹ năng 1", "Kỹ năng 2"]
                                },
                                "current_level": {
                                  "description": "Mô tả trình độ hiện tại",
                                  "test_results": {
                                    "test_name": "Tên bài kiểm tra",
                                    "score": "Điểm số"
                                  },
                                  "vocabulary_size": "Số lượng từ vựng ước tính"
                                },
                                "duration": {
                                  "total_months": "Tổng số tháng",
                                  "start_date": "Ngày bắt đầu",
                                  "end_date": "Ngày kết thúc"
                                },
                                "expected_outcomes": [
                                  {"description": "Kết quả mong đợi 1"},
                                  {"description": "Kết quả mong đợi 2"}
                                ]
                              },
                              "phases": [
                                {
                                  "phase_number": 1,
                                  "title": "Tên giai đoạn",
                                  "timeframe": {
                                    "start_date": "Ngày bắt đầu",
                                    "end_date": "Ngày kết thúc"
                                  },
                                  "goals": [
                                    {"description": "Mục tiêu 1"},
                                    {"description": "Mục tiêu 2"}
                                  ],
                                  "focus_skills": ["Kỹ năng 1", "Kỹ năng 2"],
                                  "resources": [
                                    {
                                      "name": "Tên tài liệu",
                                      "type": "Loại tài liệu",
                                      "description": "Mô tả",
                                      "link": "Đường dẫn"
                                    }
                                  ],
                                  "courses": [
                                    {
                                      "name": "Tên khóa học",
                                      "description": "Mô tả",
                                      "link": "Đường dẫn"
                                    }
                                  ],
                                  "weekly_schedule": [
                                    {
                                      "weeks": "Tuần 1-2",
                                      "activities": ["Hoạt động 1", "Hoạt động 2"]
                                    }
                                  ],
                                  "practice_tasks": [
                                    {"description": "Bài tập thực hành 1"}
                                  ],
                                  "progress_evaluation": [
                                    {
                                      "description": "Phương pháp đánh giá",
                                      "frequency": "Tần suất"
                                    }
                                  ]
                                }
                              ],
                              "learning_strategy": {
                                "methods": ["Phương pháp 1", "Phương pháp 2"],
                                "daily_plan": [
                                  {
                                    "activity": "Hoạt động",
                                    "duration": "Thời lượng"
                                  }
                                ],
                                "tools": [
                                  {
                                    "name": "Tên công cụ",
                                    "description": "Mô tả"
                                  }
                                ],
                                "overcoming_challenges": ["Cách vượt qua thách thức 1"]
                              },
                              "evaluation_and_adjustment": {
                                "milestones": ["Cột mốc 1", "Cột mốc 2"],
                                "criteria": ["Tiêu chí 1", "Tiêu chí 2"],
                                "adjustment_strategy": ["Chiến lược điều chỉnh 1"]
                              },
                              "additional_resources": {
                                "reference_materials": [
                                  {
                                    "name": "Tên tài liệu",
                                    "description": "Mô tả",
                                    "link": "Đường dẫn"
                                  }
                                ],
                                "communities": [
                                  {
                                    "name": "Tên cộng đồng",
                                    "description": "Mô tả"
                                  }
                                ],
                                "free_resources": [
                                  {
                                    "name": "Tên tài nguyên",
                                    "description": "Mô tả",
                                    "link": "Đường dẫn"
                                  }
                                ]
                              },
                              "advice": ["Lời khuyên 1", "Lời khuyên 2"],
                              "recommended_materials_and_courses": {
                                "documents": [
                                  {
                                    "name": "Tên tài liệu",
                                    "description": "Mô tả",
                                    "link": "Đường dẫn"
                                  }
                                ],
                                "courses": [
                                  {
                                    "name": "Tên khóa học",
                                    "description": "Mô tả",
                                    "link": "Đường dẫn"
                                  }
                                ]
                              }
                            }
                          }
                          
                          CHÚ Ý:
                          1. Phải trả về JSON hợp lệ, không có markdown hoặc text khác
                          2. Phải tuân theo đúng cấu trúc JSON đã cung cấp
                          3. Điền đầy đủ thông tin vào tất cả các trường
                          4. Tạo ít nhất 3 giai đoạn học tập
                          5. Đảm bảo mỗi giai đoạn có đầy đủ thông tin chi tiết
                          6. Không được thêm bất kỳ text nào ngoài JSON
                          7. Không được thêm các trường không có trong cấu trúc mẫu
                          `,
                      },
                      { role: "user", content: input },
                  ]
                : [
                      ...messages.slice(-5).map((m) => ({
                          role: m.sender === "user" ? "user" : "assistant",
                          content: m.text,
                      })),
                      { role: "user", content: input },
                  ];

            // Log để kiểm tra
            console.log("🟢 promptMessages:", promptMessages);
            console.log("🟢 Số lượng promptMessages:", promptMessages.length);
            if (isPathRequest) {
                console.log(
                    "🟢 Xác nhận: Chỉ gửi tin nhắn hiện tại cho yêu cầu lộ trình"
                );
            }

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
                    5. Trình độ phù hợp
                    6. Thông tin về mục tiêu của khóa học
                    7. Cung cấp Link đến khóa học (dạng markdown [tên khóa học](http://localhost:3000/courses/ID))
                    4. Không bịa ra tài liệu/ khóa học không có trong danh sách được cung cấp, không lấy khóa học ngoài hệ thống

                    Giải thích ngắn gọn tại sao những khóa học này phù hợp với nhu cầu và trình độ của người học.
                    
                    FORMAT mẫu cho mỗi khóa học:
                    [Tên khóa học](link)
                    - Mô tả: Mô tả chi tiết
                    - Giá: XX.XXX.XXXđ ~~XX.XXX.XXXđ~~ (Giảm XX%)
                    - Trình độ: Trình độ phù hợp
                    - Thời lượng: X bài học
                    - Mục tiêu: Mục tiêu của khóa học
                    
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
                    [Tên tài liệu](link tải)
                    - Loại: Phân loại tài liệu
                    - Mô tả: Mô tả chi tiết
                    - Đối tượng: Người học phù hợp
                    - Ứng dụng: Cách sử dụng tài liệu hiệu quả
                    
                    Lý do nên sử dụng: [Giải thích]
                    
                    QUAN TRỌNG: Đảm bảo sửa chữa các URL bị lỗi, đặc biệt là URL có chứa dấu %5D hoặc %5B hoặc URL trùng lặp.`;
                }

                if (queryTypes.isPath) {
                    systemContent += `
                    Đây là yêu cầu về lộ trình học tập. Hãy tạo một lộ trình học tập cá nhân hóa RẤT CHI TIẾT phù hợp với trình độ và mục tiêu của người học.
                    
                    YÊU CẦU CHI TIẾT ĐỐI VỚI LỘ TRÌNH (PHẢI đảm bảo TẤT CẢ các điểm dưới đây):
                    
                    ## 1. THÔNG TIN CƠ BẢN
                    1.1. MỤC TIÊU RÕ RÀNG: Nêu cụ thể mục tiêu của lộ trình (VD: TOEIC 700, IELTS 8.0, lưu loát giao tiếp, v.v.)
                    1.2. TRÌNH ĐỘ HIỆN TẠI: Đánh giá chi tiết trình độ hiện tại của học viên dựa trên thông tin có sẵn
                    1.3. THỜI GIAN TOÀN BỘ LỘ TRÌNH: 
                       - PHẢI sử dụng thời gian thực với ngày tháng cụ thể (không chỉ ghi "tháng 1, tháng 2")
                       - Bắt đầu từ NGÀY HIỆN TẠI (${new Date().toLocaleDateString(
                           "vi-VN"
                       )}) và kéo dài 3-6 tháng
                       - Xác định rõ ngày bắt đầu và kết thúc cho mỗi giai đoạn (ví dụ: từ 15/08/2023 đến 15/09/2023)
                       - Mỗi tháng phải có đầy đủ nội dung - mỗi tháng là một giai đoạn, không được bỏ trống hoặc thiếu thông tin
                    1.4. KẾT QUẢ MONG ĐỢI SAU KHI HOÀN THÀNH: Liệt kê ít nhất kỹ năng/năng lực cụ thể sẽ đạt được
                    
                    ## 2. CẤU TRÚC LỘ TRÌNH THEO GIAI ĐOẠN (chia theo tháng, tối thiểu 3-6 tháng)
                    
                    Với MỖI GIAI ĐOẠN (tháng) PHẢI có đầy đủ:
                    2.1. THỜI GIAN CỤ THỂ: Xác định chính xác ngày bắt đầu và kết thúc của giai đoạn (VD: 15/08/2023 - 14/09/2023)
                    2.2. MỤC TIÊU GIAI ĐOẠN: Liệt kê 3-5 mục tiêu cụ thể của giai đoạn với lời khuyên chi tiết cho từng mục tiêu
                    2.3. KỸ NĂNG TRỌNG TÂM: Xác định rõ 2-3 kỹ năng trọng tâm (nghe, nói, đọc, viết, từ vựng, ngữ pháp...) kèm lý do ưu tiên
                    2.4. TÀI LIỆU SỬ DỤNG: Liệt kê cụ thể 2-4 tài liệu kèm đường dẫn và hướng dẫn sử dụng chi tiết từng phần
                    2.5. KHÓA HỌC THAM GIA: Chỉ định 1-2 khóa học kèm đường dẫn và kế hoạch học chi tiết (bài/tuần, giờ/ngày)
                    2.6. LỊCH TRÌNH HÀNG TUẦN: Chi tiết hoạt động từng tuần với ngày cụ thể (tối thiểu 3-4 hoạt động/tuần)
                    2.7. BÀI TẬP THỰC HÀNH: Gợi ý 5-10 bài tập cụ thể cho giai đoạn với hướng dẫn chi tiết
                    2.8. ĐÁNH GIÁ TIẾN ĐỘ: Tiêu chí và phương pháp đánh giá cuối giai đoạn với mục tiêu cụ thể
                    2.9. LỜI KHUYÊN RIÊNG: 2-4 lời khuyên đặc biệt cho giai đoạn này
                    
                    ## 3. CHIẾN LƯỢC VÀ PHƯƠNG PHÁP HỌC TẬP
                    3.1. PHƯƠNG PHÁP HỌC: Đề xuất 3-5 phương pháp học hiệu quả phù hợp với người học
                    3.2. KẾ HOẠCH HÀNG NGÀY: Gợi ý lịch học chi tiết (phân bổ thời gian, tối thiểu 5-7 ngày/tuần)
                    3.3. CÔNG CỤ HỖ TRỢ: Giới thiệu 3-5 ứng dụng/công cụ hỗ trợ việc học
                    3.4. VƯỢT QUA KHÓ KHĂN: Đưa ra giải pháp cho 3-5 khó khăn phổ biến
                    
                    ## 4. ĐÁNH GIÁ VÀ ĐIỀU CHỈNH
                    4.1. CỘT MỐC ĐÁNH GIÁ: Thiết lập 3-5 cột mốc đánh giá trong suốt lộ trình
                    4.2. TIÊU CHÍ ĐÁNH GIÁ: Liệt kê 5-7 tiêu chí cụ thể để tự đánh giá
                    4.3. CHIẾN LƯỢC ĐIỀU CHỈNH: Hướng dẫn cách điều chỉnh lộ trình nếu cần
                    
                    ## 5. TÀI NGUYÊN BỔ SUNG (chỉ dùng các tài nguyên trong hệ thống)
                    5.1. TÀI LIỆU THAM KHẢO: Liệt kê 5-10 tài liệu bổ sung kèm đường dẫn
                    5.2. CỘNG ĐỒNG HỌC TẬP: Giới thiệu 2-3 cộng đồng/nhóm hỗ trợ
                    5.3. NGUỒN TÀI NGUYÊN MIỄN PHÍ: Chia sẻ 3-5 nguồn tài nguyên miễn phí
                    
                    ### LƯU Ý QUAN TRỌNG
                    - Mỗi mục phải ĐƯỢC VIẾT CHI TIẾT, DÀI ĐẦY ĐỦ với nhiều đề mục phụ
                    - Sử dụng formatting đẹp mắt (headings, subheadings, bullet points, bold, italic)
                    - Đặt tiêu đề rõ ràng cho từng phần và mục
                    - Tạo ra một văn bản DÀI, TOÀN DIỆN, CHI TIẾT với hướng dẫn cụ thể
                    - KHÔNG được viết ngắn gọn, phải đảm bảo nội dung phong phú, chi tiết
                    
                    ## ĐỊNH DẠNG VÀ TRÌNH BÀY
                    6.1. Tất cả các URL PHẢI ở định dạng markdown chuẩn [Tên](URL)
                    6.2. URL không được chứa các ký tự đặc biệt [ ] ( ) 
                    6.3. Mỗi tài liệu hoặc khóa học phải có một URL riêng
                    6.4. KHÔNG được bịa ra khóa học, tài liệu không có trong danh sách được cung cấp
                    6.5. Sử dụng nhiều heading (## và ###) và formatting (bold, italic, lists) 
                    6.6. Đảm bảo văn bản trả về DÀI, CHI TIẾT, ĐẦY ĐỦ (tối thiểu 2000 từ)
                    
                    ## 6. KẾT LUẬN
                    6.1. Tóm tắt lại toàn bộ lộ trình một cách súc tích
                    6.2. Nhấn mạnh lợi ích và kết quả mong đợi
                    6.3. Đưa ra lời khuyên, động viên người học
                    6.4. Đề xuất các bước tiếp theo sau khi hoàn thành lộ trình
                    
                    📌 QUAN TRỌNG: Lộ trình cần PHẢI CHI TIẾT, CỤ THỂ, TOÀN DIỆN và DÀI. Đảm bảo mọi thông tin đều rõ ràng và có thể thực hiện được.`;

                    // Thêm gợi ý tài liệu nếu có tài liệu phù hợp
                    if (relevantDocuments.length > 0) {
                        systemContent += `
                        ## 8. CHI TIẾT TÀI LIỆU CẦN TÍCH HỢP VÀO LỘ TRÌNH
                        
                        Hãy tích hợp TẤT CẢ các tài liệu sau đây vào lộ trình học tập một cách phù hợp và PHÂN BỔ đều vào các giai đoạn: 
                        
                        ${formatDocsVar}
                        
                        ### HƯỚNG DẪN TÍCH HỢP TÀI LIỆU:
                        
                        8.1. PHÂN BỔ HỢP LÝ:
                        - Mỗi tài liệu PHẢI được phân bổ vào đúng giai đoạn phù hợp với trình độ và mục tiêu
                        - Tất cả tài liệu PHẢI được sử dụng trong lộ trình, phân bổ đều giữa các giai đoạn
                        - Với mỗi tài liệu, chỉ định rõ THỜI ĐIỂM sử dụng (tuần nào, tháng nào)
                        
                        8.2. MÔ TẢ CHI TIẾT:
                        - Tên đầy đủ của tài liệu (in đậm)
                        - Mô tả CHI TIẾT về nội dung (tối thiểu 2-3 câu)
                        - Hướng dẫn CỤ THỂ cách sử dụng (tối thiểu 3-5 bước)
                        - Lợi ích của tài liệu đối với giai đoạn học tập
                           - Đường link đầy đủ dạng markdown [Tên tài liệu](URL)
                        
                        8.3. KẾ HOẠCH SỬ DỤNG:
                        - Chi tiết nên học PHẦN NÀO của tài liệu trong TUẦN NÀO
                        - Số giờ/ngày nên dành cho tài liệu này
                        - Cách kết hợp với các tài liệu khác
                        - Bài tập/hoạt động thực hành kèm theo
                        
                        8.4. TUYỆT ĐỐI KHÔNG:
                        - KHÔNG bịa ra tài liệu không có trong danh sách được cung cấp
                        - KHÔNG sử dụng URL sai định dạng
                        - KHÔNG lặp lại nội dung giữa các tài liệu`;
                    }

                    // Thêm gợi ý khóa học nếu có khóa học phù hợp
                    if (
                        relevantCourses.results &&
                        relevantCourses.results.length > 0
                    ) {
                        systemContent += `
                        ## 9. CHI TIẾT KHÓA HỌC CẦN TÍCH HỢP VÀO LỘ TRÌNH
                        
                        Hãy tích hợp TẤT CẢ các khóa học sau đây vào lộ trình học tập, phân bổ hợp lý theo các giai đoạn:
                        
                        ${formatCoursesVar}
                        
                        ### HƯỚNG DẪN TÍCH HỢP KHÓA HỌC:
                        
                        9.1. PHÂN BỔ KHÓA HỌC:
                        - Mỗi khóa học PHẢI được đặt vào đúng giai đoạn phù hợp với mục tiêu của giai đoạn đó
                        - Tất cả khóa học PHẢI được sử dụng trong lộ trình, phân bổ hợp lý
                        - Với mỗi khóa học, chỉ định rõ THỜI ĐIỂM bắt đầu và kết thúc (tháng/tuần nào)
                        
                        9.2. MÔ TẢ KHÓA HỌC CHI TIẾT:
                        - Tên đầy đủ của khóa học (in đậm)
                        - Mô tả CHI TIẾT nội dung khóa học (tối thiểu 3-4 câu)
                        - LỢI ÍCH CHÍNH của khóa học đối với giai đoạn hiện tại
                        - Thông tin đầy đủ về giá gốc, giá khuyến mãi (nếu có)
                        - Ước tính thời gian cần hoàn thành toàn bộ khóa học
                           - Đường link đầy đủ dạng markdown [Tên khóa học](URL)
                        
                        9.3. KẾ HOẠCH HỌC TẬP CHI TIẾT:
                        - Chia nhỏ khóa học thành TỪNG TUẦN học cụ thể
                        - Chỉ định cụ thể các bài học nào cần hoàn thành mỗi tuần
                        - Số giờ/ngày nên dành cho khóa học này
                        - Cách kết hợp với các tài liệu và khóa học khác
                        - Hoạt động thực hành và bài tập đi kèm
                        
                        9.4. ĐÁNH GIÁ TIẾN ĐỘ:
                        - Tiêu chí đánh giá sự tiến bộ trong khóa học
                        - Cách theo dõi và kiểm tra kết quả học tập
                        - Điểm cần lưu ý hoặc khó khăn có thể gặp phải
                        
                        9.5. TUYỆT ĐỐI KHÔNG:
                        - KHÔNG bịa ra khóa học không có trong danh sách được cung cấp
                        - KHÔNG sử dụng URL sai định dạng
                        - KHÔNG sắp xếp quá nhiều khóa học vào cùng một giai đoạn
                        - KHÔNG thiếu thông tin giá cả và chi tiết khóa học`;
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
                        model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
            console.log("🟢 data:", data);

            console.log("🟢 Phản hồi AI:", responseText);

            // Xử lý yêu cầu lộ trình đặc biệt
            if (isRequestPath) {
                try {
                    console.log("🟢 Xử lý lộ trình học tập");

                    // Kiểm tra xem phản hồi có phải là JSON không
                    let jsonData: { learning_plan?: any } | null = null;
                    let isJsonResponse = false;
                    let formattedResponse = responseText;

                    try {
                        // Tìm phần JSON trong phản hồi
                        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const jsonString = jsonMatch[0];
                            jsonData = JSON.parse(jsonString) as {
                                learning_plan?: any;
                            };
                            isJsonResponse = true;
                            console.log(
                                "🟢 Phát hiện JSON trong phản hồi:",
                                jsonData
                            );

                            // Chuyển đổi JSON thành Markdown
                            if (jsonData && jsonData.learning_plan) {
                                formattedResponse =
                                    formatLearningPathToMarkdown(jsonData);
                            }
                        }
                    } catch (jsonError) {
                        console.error("❌ Lỗi khi phân tích JSON:", jsonError);
                    }

                    // Làm sạch URL trong phản hồi trước khi lưu
                    const cleanedResponse = formattedResponse
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

                    // Thêm nút xác nhận và tạo lại lộ trình thay vì lưu ngay
                    setMessages((prev) => [
                        ...prev.filter((msg) => !msg.isTyping),
                        {
                            sender: "bot" as const,
                            text: cleanedResponse,
                            isLearningPath: true, // Đánh dấu là tin nhắn lộ trình
                            pathData:
                                isJsonResponse && jsonData
                                    ? JSON.stringify(jsonData)
                                    : cleanedResponse, // Lưu JSON gốc nếu có
                        },
                    ]);

                    console.log("🟢 Đã tạo lộ trình học tập, chờ xác nhận");
                } catch (error) {
                    console.error("❌ Lỗi khi xử lý lộ trình:", error);
                    setMessages((prev) =>
                        prev
                            .filter((msg) => !msg.isTyping)
                            .concat([
                                {
                                    sender: "bot",
                                    text: "Xin lỗi, đã xảy ra lỗi khi xử lý lộ trình học tập. Vui lòng thử lại sau.",
                                },
                            ])
                    );
                }
                return; // Kết thúc xử lý sớm nếu đây là lộ trình
            }

            // Reset biến trạng thái
            isRequestPath = false;
            isDocumentQuery = false;
            isCourseOnlyQuery = false;

            // Lưu tin nhắn phản hồi từ bot
            try {
                const saveResponse = await fetch(
                    `${API_BASE_URL}/conversation/${conversationId}/message`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            senderId: null, // senderId là null cho tin nhắn từ bot
                            content: responseText,
                        }),
                        credentials: "include", // Thêm credentials để đảm bảo cookie được gửi đi
                    }
                );

                if (!saveResponse.ok) {
                    console.error(
                        "❌ Lỗi khi lưu tin nhắn bot:",
                        await saveResponse.text()
                    );
                } else {
                    console.log("✅ Đã lưu tin nhắn bot thành công");
                    // Lấy lại tin nhắn mới nhất sau khi lưu thành công
                    try {
                        const latestMessages = await fetchConversationMsgs(
                            conversationId
                        );
                        if (
                            Array.isArray(latestMessages) &&
                            latestMessages.length > 0
                        ) {
                            console.log(
                                "🔄 Cập nhật lại tin nhắn từ server sau khi lưu tin nhắn bot"
                            );
                        }
                    } catch (refreshError) {
                        console.error(
                            "❌ Lỗi khi làm mới tin nhắn:",
                            refreshError
                        );
                    }
                }
            } catch (saveError) {
                console.error("❌ Exception khi lưu tin nhắn bot:", saveError);
            }

            // Cập nhật UI với tin nhắn bot mới và xóa tin nhắn "đang nhập"
            setMessages((prev) =>
                prev
                    .filter((msg) => !msg.isTyping) // Xóa tin nhắn "đang nhập"
                    .concat([{ sender: "bot" as const, text: responseText }])
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
        // Kiểm tra xem text có phải là JSON không
        if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
            try {
                // Thử phân tích JSON
                const jsonData = JSON.parse(text);

                // Nếu là JSON lộ trình học tập, chuyển đổi thành định dạng Markdown đẹp
                if (jsonData.learning_plan) {
                    return formatLearningPathToMarkdown(jsonData);
                }
            } catch (error) {
                // Nếu không phải JSON hợp lệ, tiếp tục xử lý như văn bản thông thường
                console.error("Không phải JSON hợp lệ:", error);
            }
        }

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

    // Hàm chuyển đổi JSON lộ trình thành Markdown đẹp
    const formatLearningPathToMarkdown = (jsonData: any) => {
        try {
            const plan = jsonData.learning_plan;
            if (!plan) return JSON.stringify(jsonData, null, 2);

            const {
                basic_information,
                phases,
                learning_strategy,
                evaluation_and_adjustment,
                additional_resources,
                advice,
            } = plan;

            let markdown = `# 📚 Lộ Trình Học Tập Cá Nhân Hóa\n\n`;

            // Thông tin cơ bản
            markdown += `## 📋 Thông Tin Cơ Bản\n\n`;

            if (basic_information?.goal) {
                markdown += `### 🎯 Mục Tiêu\n`;
                markdown += `- **Mô tả:** ${
                    basic_information.goal.description || "Không có thông tin"
                }\n`;
                if (basic_information.goal.target_score) {
                    markdown += `- **Điểm mục tiêu:** ${basic_information.goal.target_score}\n`;
                }
                if (
                    basic_information.goal.focus_skills &&
                    basic_information.goal.focus_skills.length > 0
                ) {
                    markdown += `- **Kỹ năng trọng tâm:** ${basic_information.goal.focus_skills.join(
                        ", "
                    )}\n`;
                }
                markdown += `\n`;
            }

            if (basic_information?.current_level) {
                markdown += `### 📊 Trình Độ Hiện Tại\n`;
                markdown += `- **Mô tả:** ${
                    basic_information.current_level.description ||
                    "Không có thông tin"
                }\n`;
                if (basic_information.current_level.test_results) {
                    markdown += `- **Kết quả kiểm tra:** ${
                        basic_information.current_level.test_results
                            .test_name || ""
                    } - ${
                        basic_information.current_level.test_results.score || ""
                    }\n`;
                }
                if (basic_information.current_level.vocabulary_size) {
                    markdown += `- **Lượng từ vựng:** ${basic_information.current_level.vocabulary_size}\n`;
                }
                markdown += `\n`;
            }

            if (basic_information?.duration) {
                markdown += `### ⏱️ Thời Gian Học Tập\n`;
                markdown += `- **Tổng thời gian:** ${
                    basic_information.duration.total_months || "?"
                } tháng\n`;
                markdown += `- **Ngày bắt đầu:** ${
                    basic_information.duration.start_date || "Không xác định"
                }\n`;
                markdown += `- **Ngày kết thúc:** ${
                    basic_information.duration.end_date || "Không xác định"
                }\n\n`;
            }

            if (
                basic_information?.expected_outcomes &&
                basic_information.expected_outcomes.length > 0
            ) {
                markdown += `### 🏆 Kết Quả Mong Đợi\n`;
                basic_information.expected_outcomes.forEach(
                    (outcome: any, index: number) => {
                        markdown += `- ${outcome.description}\n`;
                    }
                );
                markdown += `\n`;
            }

            // Các giai đoạn học tập
            if (phases && phases.length > 0) {
                markdown += `## 🗓️ Các Giai Đoạn Học Tập\n\n`;

                phases.forEach((phase: any, index: number) => {
                    markdown += `### 📅 ${
                        phase.title || `Giai đoạn ${phase.phase_number}`
                    } (${phase.timeframe?.start_date || ""} - ${
                        phase.timeframe?.end_date || ""
                    })\n\n`;

                    if (phase.goals && phase.goals.length > 0) {
                        markdown += `#### Mục Tiêu:\n`;
                        phase.goals.forEach((goal: any) => {
                            markdown += `- ${goal.description}\n`;
                        });
                        markdown += `\n`;
                    }

                    if (phase.focus_skills && phase.focus_skills.length > 0) {
                        markdown += `#### Kỹ Năng Trọng Tâm:\n`;
                        markdown += `${phase.focus_skills
                            .map((skill: string) => `\`${skill}\``)
                            .join(" | ")}\n\n`;
                    }

                    if (phase.resources && phase.resources.length > 0) {
                        markdown += `#### 📚 Tài Liệu Học Tập:\n`;
                        phase.resources.forEach((resource: any) => {
                            markdown += `- **[${resource.name}](${resource.link})** - ${resource.type}\n`;
                            markdown += `  ${resource.description}\n`;
                        });
                        markdown += `\n`;
                    }

                    if (phase.courses && phase.courses.length > 0) {
                        markdown += `#### 🎓 Khóa Học:\n`;
                        phase.courses.forEach((course: any) => {
                            markdown += `- **[${course.name}](${course.link})**\n`;
                            markdown += `  ${course.description}\n`;
                        });
                        markdown += `\n`;
                    }

                    if (
                        phase.weekly_schedule &&
                        phase.weekly_schedule.length > 0
                    ) {
                        markdown += `#### 📆 Lịch Trình Hàng Tuần:\n`;
                        phase.weekly_schedule.forEach((week: any) => {
                            markdown += `- **${week.weeks}**\n`;
                            week.activities.forEach((activity: string) => {
                                markdown += `  - ${activity}\n`;
                            });
                        });
                        markdown += `\n`;
                    }

                    if (
                        phase.practice_tasks &&
                        phase.practice_tasks.length > 0
                    ) {
                        markdown += `#### ✍️ Bài Tập Thực Hành:\n`;
                        phase.practice_tasks.forEach((task: any) => {
                            markdown += `- ${task.description}\n`;
                        });
                        markdown += `\n`;
                    }

                    if (
                        phase.progress_evaluation &&
                        phase.progress_evaluation.length > 0
                    ) {
                        markdown += `#### 📊 Đánh Giá Tiến Độ:\n`;
                        phase.progress_evaluation.forEach((evaluation: any) => {
                            markdown += `- **${evaluation.description}** (${evaluation.frequency})\n`;
                        });
                        markdown += `\n`;
                    }

                    markdown += `---\n\n`;
                });
            }

            // Chiến lược học tập
            if (learning_strategy) {
                markdown += `## 🧠 Chiến Lược Học Tập\n\n`;

                if (
                    learning_strategy.methods &&
                    learning_strategy.methods.length > 0
                ) {
                    markdown += `### 📝 Phương Pháp Học:\n`;
                    learning_strategy.methods.forEach((method: string) => {
                        markdown += `- ${method}\n`;
                    });
                    markdown += `\n`;
                }

                if (
                    learning_strategy.daily_plan &&
                    learning_strategy.daily_plan.length > 0
                ) {
                    markdown += `### ⏰ Kế Hoạch Hàng Ngày:\n`;
                    learning_strategy.daily_plan.forEach((plan: any) => {
                        markdown += `- **${plan.activity}:** ${plan.duration}\n`;
                    });
                    markdown += `\n`;
                }

                if (
                    learning_strategy.tools &&
                    learning_strategy.tools.length > 0
                ) {
                    markdown += `### 🛠️ Công Cụ Hỗ Trợ:\n`;
                    learning_strategy.tools.forEach((tool: any) => {
                        markdown += `- **${tool.name}:** ${tool.description}\n`;
                    });
                    markdown += `\n`;
                }

                if (
                    learning_strategy.overcoming_challenges &&
                    learning_strategy.overcoming_challenges.length > 0
                ) {
                    markdown += `### 💪 Vượt Qua Khó Khăn:\n`;
                    learning_strategy.overcoming_challenges.forEach(
                        (challenge: string) => {
                            markdown += `- ${challenge}\n`;
                        }
                    );
                    markdown += `\n`;
                }
            }

            // Đánh giá và điều chỉnh
            if (evaluation_and_adjustment) {
                markdown += `## 📈 Đánh Giá và Điều Chỉnh\n\n`;

                if (
                    evaluation_and_adjustment.milestones &&
                    evaluation_and_adjustment.milestones.length > 0
                ) {
                    markdown += `### 🏁 Cột Mốc Đánh Giá:\n`;
                    evaluation_and_adjustment.milestones.forEach(
                        (milestone: string) => {
                            markdown += `- ${milestone}\n`;
                        }
                    );
                    markdown += `\n`;
                }

                if (
                    evaluation_and_adjustment.criteria &&
                    evaluation_and_adjustment.criteria.length > 0
                ) {
                    markdown += `### ✅ Tiêu Chí Đánh Giá:\n`;
                    evaluation_and_adjustment.criteria.forEach(
                        (criterion: string) => {
                            markdown += `- ${criterion}\n`;
                        }
                    );
                    markdown += `\n`;
                }

                if (
                    evaluation_and_adjustment.adjustment_strategy &&
                    evaluation_and_adjustment.adjustment_strategy.length > 0
                ) {
                    markdown += `### 🔄 Chiến Lược Điều Chỉnh:\n`;
                    evaluation_and_adjustment.adjustment_strategy.forEach(
                        (strategy: string) => {
                            markdown += `- ${strategy}\n`;
                        }
                    );
                    markdown += `\n`;
                }
            }

            // Tài nguyên bổ sung
            if (additional_resources) {
                markdown += `## 📚 Tài Nguyên Bổ Sung\n\n`;

                if (
                    additional_resources.reference_materials &&
                    additional_resources.reference_materials.length > 0
                ) {
                    markdown += `### 📖 Tài Liệu Tham Khảo:\n`;
                    additional_resources.reference_materials.forEach(
                        (material: any) => {
                            markdown += `- **[${material.name}](${material.link}):** ${material.description}\n`;
                        }
                    );
                    markdown += `\n`;
                }

                if (
                    additional_resources.communities &&
                    additional_resources.communities.length > 0
                ) {
                    markdown += `### 👥 Cộng Đồng Học Tập:\n`;
                    additional_resources.communities.forEach(
                        (community: any) => {
                            markdown += `- **${community.name}:** ${community.description}\n`;
                        }
                    );
                    markdown += `\n`;
                }

                if (
                    additional_resources.free_resources &&
                    additional_resources.free_resources.length > 0
                ) {
                    markdown += `### 🆓 Nguồn Tài Nguyên Miễn Phí:\n`;
                    additional_resources.free_resources.forEach(
                        (resource: any) => {
                            markdown += `- **[${resource.name}](${resource.link}):** ${resource.description}\n`;
                        }
                    );
                    markdown += `\n`;
                }
            }

            // Lời khuyên
            if (advice && advice.length > 0) {
                markdown += `## 💡 Lời Khuyên\n\n`;
                advice.forEach((tip: string) => {
                    markdown += `- ${tip}\n`;
                });
                markdown += `\n`;
            }

            return markdown;
        } catch (error) {
            console.error("Lỗi khi chuyển đổi JSON thành Markdown:", error);
            return JSON.stringify(jsonData, null, 2);
        }
    };

    // Thêm hàm xử lý việc lưu lộ trình
    const handleSavePath = async (pathData: string) => {
        if (!pathData) return;

        try {
            console.log("🟢 Lưu lộ trình học tập");

            // Kiểm tra xem pathData có phải là JSON không
            let dataToSave = pathData;
            let pathId: number | null = null;
            let extractedCourses: {
                id: string;
                title: string;
                priority: number;
            }[] = [];

            try {
                // Nếu là chuỗi JSON, phân tích và lấy dữ liệu
                const jsonData = JSON.parse(pathData);
                if (jsonData && typeof jsonData === "object") {
                    console.log("🟢 Phát hiện dữ liệu JSON hợp lệ");
                    dataToSave = pathData; // Lưu chuỗi JSON nguyên bản

                    // Trích xuất thông tin khóa học từ lộ trình
                    if (jsonData.learning_plan) {
                        // Tìm các khóa học từ giai đoạn
                        if (
                            jsonData.learning_plan.phases &&
                            Array.isArray(jsonData.learning_plan.phases)
                        ) {
                            jsonData.learning_plan.phases.forEach(
                                (phase: any, phaseIndex: number) => {
                                    // Ưu tiên cao hơn cho các khóa học ở giai đoạn đầu
                                    const priority = phaseIndex + 1;

                                    if (
                                        phase.courses &&
                                        Array.isArray(phase.courses)
                                    ) {
                                        phase.courses.forEach((course: any) => {
                                            if (course.link && course.name) {
                                                // Trích xuất ID khóa học từ đường dẫn
                                                const courseIdMatch =
                                                    course.link.match(
                                                        /\/courses\/(\d+)/
                                                    );
                                                if (
                                                    courseIdMatch &&
                                                    courseIdMatch[1]
                                                ) {
                                                    extractedCourses.push({
                                                        id: courseIdMatch[1],
                                                        title: course.name,
                                                        priority: priority,
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            );
                        }

                        // Tìm các khóa học từ recommended_materials_and_courses
                        if (
                            jsonData.learning_plan
                                .recommended_materials_and_courses &&
                            jsonData.learning_plan
                                .recommended_materials_and_courses.courses
                        ) {
                            const recCourses =
                                jsonData.learning_plan
                                    .recommended_materials_and_courses.courses;
                            if (Array.isArray(recCourses)) {
                                recCourses.forEach((course: any) => {
                                    if (course.link && course.name) {
                                        const courseIdMatch =
                                            course.link.match(
                                                /\/courses\/(\d+)/
                                            );
                                        if (courseIdMatch && courseIdMatch[1]) {
                                            // Kiểm tra xem khóa học đã được thêm chưa
                                            const existingIndex =
                                                extractedCourses.findIndex(
                                                    (c) =>
                                                        c.id ===
                                                        courseIdMatch[1]
                                                );
                                            if (existingIndex === -1) {
                                                extractedCourses.push({
                                                    id: courseIdMatch[1],
                                                    title: course.name,
                                                    priority: 999, // Ưu tiên thấp hơn
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            } catch (jsonError) {
                // Không phải JSON, tiếp tục với dữ liệu văn bản
                console.log("🟢 Dữ liệu không phải JSON, lưu dưới dạng text");

                // Tìm kiếm các link khóa học trong văn bản
                const courseMatches = pathData.match(
                    /\[.*?\]\(http:\/\/localhost:3000\/courses\/\d+\)/g
                );
                if (courseMatches) {
                    courseMatches.forEach((match, index) => {
                        const titleMatch = match.match(/\[(.*?)\]/);
                        const idMatch = match.match(/\/courses\/(\d+)/);

                        if (
                            titleMatch &&
                            titleMatch[1] &&
                            idMatch &&
                            idMatch[1]
                        ) {
                            extractedCourses.push({
                                id: idMatch[1],
                                title: titleMatch[1],
                                priority: index + 1,
                            });
                        }
                    });
                }
            }

            // Cập nhật lộ trình
            const pathResponse = await updatePath(userId, {
                pathDetails: dataToSave,
            });
            const pathResponseData = await pathResponse.json();
            pathId = pathResponseData.id;

            // Thêm các khóa học được đề xuất vào lộ trình
            if (pathId && extractedCourses.length > 0) {
                console.log(
                    "🟢 Đã tìm thấy",
                    extractedCourses.length,
                    "khóa học trong lộ trình"
                );

                for (const course of extractedCourses) {
                    try {
                        await addRecommendedCourse(pathId, parseInt(course.id));
                        console.log(
                            `✅ Đã thêm khóa học [${course.title}] (ID: ${course.id}) vào lộ trình`
                        );
                    } catch (courseError) {
                        console.error(
                            `❌ Lỗi khi thêm khóa học ID: ${course.id}:`,
                            courseError
                        );
                    }
                }
            }

            // Cập nhật tin nhắn đã được lưu
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.isLearningPath
                        ? {
                              ...msg,
                              text:
                                  msg.text +
                                  "\n\n✅ **Lộ trình đã được lưu thành công!**" +
                                  (extractedCourses.length > 0
                                      ? `\n\n🎯 **Chúng tôi đã nhận diện ${extractedCourses.length} khóa học trong lộ trình của bạn và sẽ nhắc nhở bạn đăng ký khi cần thiết.**`
                                      : ""),
                          }
                        : msg
                )
            );

            console.log("🟢 Đã cập nhật lộ trình học tập");
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật lộ trình:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.isLearningPath
                        ? {
                              ...msg,
                              text:
                                  msg.text +
                                  "\n\n❌ **Lỗi khi lưu lộ trình. Vui lòng thử lại.**",
                          }
                        : msg
                )
            );
        }
    };

    // Thêm hàm tạo lại lộ trình
    const handleRecreatePath = () => {
        const lastUserMessage = messages
            .filter((msg) => msg.sender === "user")
            .pop();
        if (lastUserMessage) {
            setInput(lastUserMessage.text + " (tạo mới)");
            setTimeout(() => sendMessage(), 100);
        }
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
                                        className={`flex flex-col ${
                                            msg.sender === "user"
                                                ? "items-end"
                                                : "items-start"
                                        }`}
                                    >
                                        <div
                                            className={`flex ${
                                                msg.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            } w-full`}
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
                                                            blockquote: (
                                                                props
                                                            ) => (
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
                                                        {formatMarkdown(
                                                            msg.text
                                                        )}
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

                                        {/* Thêm nút xác nhận lộ trình nếu là tin nhắn lộ trình */}
                                        {msg.isLearningPath && msg.pathData && (
                                            <div className="flex justify-center mt-3 mb-4 space-x-4 w-full">
                                                <button
                                                    onClick={() =>
                                                        msg.pathData &&
                                                        handleSavePath(
                                                            msg.pathData
                                                        )
                                                    }
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                                >
                                                    Đồng ý và lưu lộ trình
                                                </button>
                                                <button
                                                    onClick={handleRecreatePath}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                                >
                                                    Tạo lại lộ trình
                                                </button>
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
