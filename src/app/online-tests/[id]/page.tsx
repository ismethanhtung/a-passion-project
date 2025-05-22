"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Users,
    Star,
    BarChart3,
    CheckCircle2,
    Play,
    Edit,
    Download,
    Share2,
    BookOpen,
    Sparkles,
    AlertCircle,
    MessageCircle,
} from "lucide-react";
import {
    OnlineTest,
    SectionType,
    TestType,
    TestDifficulty,
} from "@/interfaces/online-test";

interface TestDetail extends OnlineTest {
    _count: {
        participants: number;
        testQuestions: number;
    };
}

// Mock data for các loại bài thi
const mockToeicTest = {
    listening: {
        part1: {
            name: "Photographs",
            description: "Nhìn vào hình ảnh và chọn câu mô tả phù hợp nhất",
            questionCount: 6,
            questions: [...Array(6)].map((_, i) => ({
                id: `mock-p1-q${i + 1}`,
                type: "single",
                content: `What is the woman doing?`,
                options: JSON.stringify([
                    "A. She is reading a book",
                    "B. She is writing a letter",
                    "C. She is cooking",
                    "D. She is cleaning the house",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 1,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSifjsSKvcJ8UOy_0TrsS_rB-NdjOFFt73_pT0xAx-go41TeLundAOz6XKDb7nvkxHWuoo&usqp=CAU",
                order: i + 1,
            })),
        },
        part2: {
            name: "Question-Response",
            description: "Nghe câu hỏi và chọn câu trả lời phù hợp nhất",
            questionCount: 25,
            questions: [...Array(25)].map((_, i) => ({
                id: `mock-p2-q${i + 1}`,
                type: "single",
                content: `What is the man doing?`,
                options: JSON.stringify([
                    "A. He is reading a book",
                    "B. He is writing a letter",
                    "C. He is cooking",
                    "D. He is cleaning the house",
                ]),
                correctAnswer: JSON.stringify(i % 3),
                part: 2,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/toeic/part2-sample.mp3",
                order: i + 1,
            })),
        },
        part3: {
            name: "Conversations",
            description: "Nghe đoạn hội thoại và trả lời câu hỏi",
            questionCount: 39,
            questions: [...Array(39)].map((_, i) => ({
                id: `mock-p3-q${i + 1}`,
                type: "single",
                content: `How much did you pay for the car?`,
                options: JSON.stringify([
                    "A. $10,000",
                    "B. $15,000",
                    "C. $20,000",
                    "D. $25,000",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 3,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/toeic/part3-sample.mp3",
                groupId: Math.floor(i / 3) + 1,
                order: i + 1,
            })),
        },
        part4: {
            name: "Talks",
            description: "Nghe bài nói và trả lời câu hỏi",
            questionCount: 30,
            questions: [...Array(30)].map((_, i) => ({
                id: `mock-p4-q${i + 1}`,
                type: "single",
                content: `How much did you pay for the car?`,
                options: JSON.stringify([
                    "A. $10,000",
                    "B. $15,000",
                    "C. $20,000",
                    "D. $25,000",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 4,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/toeic/part4-sample.mp3",
                groupId: Math.floor(i / 3) + 1,
                order: i + 1,
            })),
        },
    },
    reading: {
        part5: {
            name: "Incomplete Sentences",
            description: "Chọn từ thích hợp để hoàn thành câu",
            questionCount: 30,
            questions: [...Array(30)].map((_, i) => ({
                id: `mock-p5-q${i + 1}`,
                type: "single",
                content: `The quarterly report ______ a substantial increase in revenue.`,
                options: JSON.stringify([
                    "A. indicates",
                    "B. indicating",
                    "C. is indicated",
                    "D. to indicate",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 5,
                sectionType: "reading",
                explanation: "Giải thích ngữ pháp",
                order: i + 1,
            })),
        },
        part6: {
            name: "Text Completion",
            description: "Hoàn thành đoạn văn với từ/cụm từ thích hợp",
            questionCount: 16,
            questions: [...Array(16)].map((_, i) => ({
                id: `mock-p6-q${i + 1}`,
                type: "single",
                content: `Đọc đoạn văn sau và điền vào chỗ trống ${i + 1}:
                
                The CEO announced that the company would be expanding its operations to Asia next year. This decision was made ______ careful market analysis and consultation with experts.`,
                options: JSON.stringify([
                    "A. despite",
                    "B. after",
                    "C. without",
                    "D. although",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 6,
                sectionType: "reading",
                explanation: "Giải thích ngữ pháp",
                groupId: Math.floor(i / 4) + 1,
                order: i + 1,
            })),
        },
        part7: {
            name: "Reading Comprehension",
            description: "Đọc hiểu và trả lời câu hỏi",
            questionCount: 54,
            questions: [...Array(54)].map((_, i) => ({
                id: `mock-p7-q${i + 1}`,
                type: "single",
                content: `Đọc đoạn văn và trả lời câu hỏi ${i + 1}: 
                
                According to the passage, what is the main reason for the company's success?`,
                options: JSON.stringify([
                    "A. Innovative marketing strategies",
                    "B. Strong leadership team",
                    "C. Quality products and services",
                    "D. International expansion",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 7,
                sectionType: "reading",
                explanation: "Giải thích đáp án",
                groupId: Math.floor(i / 3) + 1,
                order: i + 1,
            })),
        },
    },
};

const mockIeltsTest = {
    listening: {
        section1: {
            name: "Section 1",
            description: "Hội thoại giữa hai người về tình huống hàng ngày",
            questionCount: 10,
            questions: [...Array(10)].map((_, i) => ({
                id: `mock-l1-q${i + 1}`,
                type: "single",
                content: `What is the man doing?`,
                options: JSON.stringify([
                    "A. He is reading a book",
                    "B. He is writing a letter",
                    "C. He is cooking",
                    "D. He is cleaning the house",
                ]),
                correctAnswer: JSON.stringify(i % 4),
                part: 1,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/ielts/section1-sample.mp3",
                order: i + 1,
            })),
        },
        section2: {
            name: "Section 2",
            description: "Bài nói độc thoại về tình huống hàng ngày",
            questionCount: 10,
            questions: [...Array(10)].map((_, i) => ({
                id: `mock-l2-q${i + 1}`,
                type: "single",
                content: `What is the man doing?`,
                options: JSON.stringify([
                    "A. He is reading a book",
                    "B. He is writing a letter",
                    "C. He is cooking",
                    "D. He is cleaning the house",
                ]),
                correctAnswer: JSON.stringify(i % 3),
                part: 2,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/ielts/section2-sample.mp3",
                order: i + 1,
            })),
        },
        section3: {
            name: "Section 3",
            description:
                "Hội thoại giữa tối đa 4 người trong môi trường học thuật",
            questionCount: 10,
            questions: [...Array(10)].map((_, i) => ({
                id: `mock-l3-q${i + 1}`,
                type: i % 5 === 0 ? "fill" : "single",
                content: `What is the man doing?`,
                ...(i % 5 === 0
                    ? {
                          correctAnswer: JSON.stringify("answer"),
                      }
                    : {
                          options: JSON.stringify([
                              "A. He is reading a book",
                              "B. He is writing a letter",
                              "C. He is cooking",
                              "D. He is cleaning the house",
                          ]),
                          correctAnswer: JSON.stringify(i % 4),
                      }),
                part: 3,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/ielts/section3-sample.mp3",
                order: i + 1,
            })),
        },
        section4: {
            name: "Section 4",
            description: "Bài nói độc thoại về chủ đề học thuật",
            questionCount: 10,
            questions: [...Array(10)].map((_, i) => ({
                id: `mock-l4-q${i + 1}`,
                type: i % 5 === 0 ? "fill" : "single",
                content: `What is the man doing?`,
                ...(i % 5 === 0
                    ? {
                          correctAnswer: JSON.stringify("answer"),
                      }
                    : {
                          options: JSON.stringify([
                              "A. He is reading a book",
                              "B. He is writing a letter",
                              "C. He is cooking",
                              "D. He is cleaning the house",
                          ]),
                          correctAnswer: JSON.stringify(i % 4),
                      }),
                part: 4,
                sectionType: "listening",
                explanation: "Giải thích đáp án",
                audioUrl: "/audio/ielts/section4-sample.mp3",
                order: i + 1,
            })),
        },
    },
    reading: {
        passages: {
            name: "Academic Reading",
            description: "3 bài đọc dài từ sách, tạp chí học thuật",
            questionCount: 40,
            questions: [...Array(40)].map((_, i) => ({
                id: `mock-r-q${i + 1}`,
                type: i % 8 === 0 ? "fill" : "single",
                content: `What is the man doing?`,
                ...(i % 8 === 0
                    ? {
                          correctAnswer: JSON.stringify("answer"),
                      }
                    : {
                          options: JSON.stringify([
                              "A. He is reading a book",
                              "B. He is writing a letter",
                              "C. He is cooking",
                              "D. He is cleaning the house",
                          ]),
                          correctAnswer: JSON.stringify(i % 4),
                      }),
                part: Math.floor(i / 13) + 1,
                sectionType: "reading",
                explanation: "Giải thích đáp án",
                order: i + 1,
            })),
        },
    },
    writing: {
        tasks: {
            name: "Academic Writing",
            description: "2 bài viết với các mục đích khác nhau",
            questionCount: 2,
            questions: [
                {
                    id: `mock-w-q1`,
                    type: "essay",
                    content:
                        "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
                    correctAnswer: null,
                    part: 1,
                    sectionType: "writing",
                    explanation: "Hướng dẫn cách viết Task 1",
                    imageUrl: "/images/ielts/writing-task1-sample.jpg",
                    order: 1,
                },
                {
                    id: `mock-w-q2`,
                    type: "essay",
                    content:
                        "Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.",
                    correctAnswer: null,
                    part: 2,
                    sectionType: "writing",
                    explanation: "Hướng dẫn cách viết Task 2",
                    order: 2,
                },
            ],
        },
    },
};

const TestDetail = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [test, setTest] = useState<TestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [errorType, setErrorType] = useState<"notFound" | "other" | "">("");
    const [isStartingTest, setIsStartingTest] = useState(false);
    const [showNoContentModal, setShowNoContentModal] = useState(false);
    const [showCreateMockTestModal, setShowCreateMockTestModal] =
        useState(false);
    const [mockDataGenerated, setMockDataGenerated] = useState(false);
    const [selectedMockTestType, setSelectedMockTestType] =
        useState<TestType>("TOEIC");
    const [selectedMockTestDifficulty, setSelectedMockTestDifficulty] =
        useState<TestDifficulty>("Intermediate");
    const [mockTestTitle, setMockTestTitle] = useState("");

    // Đảm bảo id được trích xuất đúng cách từ params theo khuyến nghị của Next.js
    const testId = params?.id || "";

    // Fetch test details
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                setError("");
                setErrorType("");

                // Kiểm tra định dạng ID hợp lệ trước khi gửi yêu cầu API
                if (!testId) {
                    // Nếu không có ID, đặt lỗi ngay lập tức
                    setErrorType("other");
                    throw new Error("ID bài kiểm tra không hợp lệ");
                }

                // Nếu ID không phải là số nguyên dương, thử tải từ localStorage trước
                if (!/^\d+$/.test(testId)) {
                    console.error(`Non-numeric test ID format: ${testId}`);
                    const mockTestInfo = localStorage.getItem(
                        `mockTestInfo_${testId}`
                    );

                    if (mockTestInfo) {
                        const mockTest = JSON.parse(mockTestInfo);
                        console.log(
                            `Loaded mock test from localStorage: ${mockTest.title}`
                        );
                        setTest(mockTest);
                        setLoading(false);
                        return;
                    }

                    // Nếu không có trong localStorage, đánh dấu là không tìm thấy
                    setErrorType("notFound");
                    throw new Error("ID bài kiểm tra không hợp lệ");
                }

                console.log(`Fetching test details for ID: ${testId}`);
                const response = await fetch(`/api/online-tests/${testId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        console.error(`Test with ID ${testId} not found`);
                        setErrorType("notFound");
                        throw new Error("Bài kiểm tra không tồn tại");
                    }
                    const errorData = await response.json();
                    setErrorType("other");
                    throw new Error(
                        errorData.error ||
                            "Không thể tải thông tin bài kiểm tra"
                    );
                }

                const data = await response.json();
                console.log(`Successfully fetched test data: ${data.title}`);
                setTest(data);
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi khi tải bài kiểm tra");
                console.error("Error fetching test:", err);
            } finally {
                setLoading(false);
            }
        };

        if (testId) {
            fetchTest();
        } else {
            setError("ID bài kiểm tra không hợp lệ");
            setErrorType("other");
            setLoading(false);
        }
    }, [testId]);

    // Tạo mock data cho bài test chưa có nội dung
    const generateMockData = () => {
        if (!test) return;

        try {
            console.log(`Generating mock data for test ID: ${test.id}`);

            const mockTestQuestions =
                test.testType === "TOEIC"
                    ? [
                          ...mockToeicTest.listening.part1.questions,
                          ...mockToeicTest.listening.part2.questions,
                          ...mockToeicTest.listening.part3.questions,
                          ...mockToeicTest.listening.part4.questions,
                          ...mockToeicTest.reading.part5.questions,
                          ...mockToeicTest.reading.part6.questions,
                          ...mockToeicTest.reading.part7.questions,
                      ]
                    : [
                          ...mockIeltsTest.listening.section1.questions,
                          ...mockIeltsTest.listening.section2.questions,
                          ...mockIeltsTest.listening.section3.questions,
                          ...mockIeltsTest.listening.section4.questions,
                          ...mockIeltsTest.reading.passages.questions,
                          ...mockIeltsTest.writing.tasks.questions,
                      ];

            // Đảm bảo test.id là chuỗi khi lưu vào localStorage
            const safeTestId = test.id.toString();

            // Lưu dữ liệu mock vào localStorage
            const mockTestData = {
                id: safeTestId,
                testId: safeTestId,
                questions: mockTestQuestions,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            localStorage.setItem(
                `mockTest_${safeTestId}`,
                JSON.stringify(mockTestData)
            );

            console.log(
                `Successfully saved mock data with ${mockTestQuestions.length} questions`
            );
            setMockDataGenerated(true);
            return true; // Trả về true nếu thành công
        } catch (error) {
            console.error("Lỗi khi tạo mock data:", error);
            return false; // Trả về false nếu thất bại
        }
    };

    // Tạo mock data cho ID không tồn tại
    const createMockTestForInvalidId = () => {
        if (!mockTestTitle.trim()) {
            alert("Vui lòng nhập tiêu đề bài kiểm tra");
            return;
        }

        setLoading(true);

        try {
            // Tạo id an toàn: sử dụng testId nếu là số, nếu không thì tạo mới
            const numericId = /^\d+$/.test(testId)
                ? parseInt(testId)
                : Math.floor(Math.random() * 10000);
            const safeTestId = testId.toString(); // Giữ nguyên ID ban đầu để sử dụng làm khóa trong localStorage

            console.log(
                `Creating mock test with ID: ${safeTestId} (numeric: ${numericId})`
            );

            // Tạo test data mẫu
            const mockTest: TestDetail = {
                id: numericId,
                title: mockTestTitle,
                description: `Bài kiểm tra ${selectedMockTestType} mock được tạo tự động cho mục đích luyện tập.`,
                testType: selectedMockTestType,
                difficulty: selectedMockTestDifficulty,
                duration: selectedMockTestType === "TOEIC" ? 120 : 165,
                tags: `${selectedMockTestType}, Practice, Mock Test, ${selectedMockTestDifficulty}`,
                isPublished: true,
                isAIGenerated: false,
                popularity: 50,
                completionRate: 0,
                instructions:
                    "Làm bài kiểm tra theo đúng chỉ dẫn cho từng phần. Bạn có thể chuyển qua lại giữa các phần trong thời gian làm bài.",
                sections:
                    selectedMockTestType === "TOEIC"
                        ? {
                              listening: {
                                  parts: 4,
                                  questions: 100,
                              },
                              reading: {
                                  parts: 3,
                                  questions: 100,
                              },
                          }
                        : {
                              listening: {
                                  parts: 4,
                                  questions: 40,
                              },
                              reading: {
                                  parts: 1,
                                  questions: 40,
                              },
                              writing: {
                                  parts: 2,
                                  questions: 2,
                              },
                          },
                _count: {
                    participants: 0,
                    testQuestions: selectedMockTestType === "TOEIC" ? 200 : 82,
                },
                creator: {
                    name: "Auto Generated",
                    email: "system@example.com",
                    roleId: 1,
                    id: 1,
                    role: { id: 1, name: "System" },
                    isDeleted: false,
                    active: true,
                },
                creatorId: 1,
                participants: [],
                testQuestions: [],
                testAttempts: [],
                isFeatured: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Lưu test vào localStorage
            localStorage.setItem(
                `mockTestInfo_${safeTestId}`,
                JSON.stringify(mockTest)
            );

            // Tạo mock questions
            const mockTestQuestions =
                selectedMockTestType === "TOEIC"
                    ? [
                          ...mockToeicTest.listening.part1.questions,
                          ...mockToeicTest.listening.part2.questions,
                          ...mockToeicTest.listening.part3.questions,
                          ...mockToeicTest.listening.part4.questions,
                          ...mockToeicTest.reading.part5.questions,
                          ...mockToeicTest.reading.part6.questions,
                          ...mockToeicTest.reading.part7.questions,
                      ]
                    : [
                          ...mockIeltsTest.listening.section1.questions,
                          ...mockIeltsTest.listening.section2.questions,
                          ...mockIeltsTest.listening.section3.questions,
                          ...mockIeltsTest.listening.section4.questions,
                          ...mockIeltsTest.reading.passages.questions,
                          ...mockIeltsTest.writing.tasks.questions,
                      ];

            // Lưu questions vào localStorage
            const mockTestData = {
                id: safeTestId,
                testId: safeTestId,
                questions: mockTestQuestions,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            localStorage.setItem(
                `mockTest_${safeTestId}`,
                JSON.stringify(mockTestData)
            );

            console.log(
                `Successfully created mock test with ${mockTestQuestions.length} questions`
            );

            // Reset state và reload
            setTest(mockTest);
            setError("");
            setErrorType("");
            setShowCreateMockTestModal(false);
            setMockDataGenerated(true);
        } catch (error) {
            console.error("Lỗi khi tạo mock test:", error);
            alert("Có lỗi xảy ra khi tạo bài kiểm tra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Start test
    const handleStartTest = async () => {
        if (!test) return;

        try {
            setIsStartingTest(true);

            // Kiểm tra xem bài test có câu hỏi hay không
            if (test._count.testQuestions === 0) {
                // Kiểm tra xem có mock data không
                const mockData = localStorage.getItem(`mockTest_${test.id}`);

                if (!mockData) {
                    // Nếu không có mock data, hiển thị modal tạo mock data
                    setShowNoContentModal(true);
                    setIsStartingTest(false);
                    return;
                }
            } else {
                // Nếu có câu hỏi trong database nhưng chưa có mock data, tạo mock data
                const mockData = localStorage.getItem(`mockTest_${test.id}`);
                if (!mockData) {
                    // Tự động tạo mock data
                    generateMockData();
                    // Đảm bảo dữ liệu đã được lưu vào localStorage
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }

            console.log(`Starting test attempt for test ID: ${test.id}`);

            // Tạo attempt ID giả cho việc theo dõi tiến độ
            const mockAttemptId = `mock-attempt-${Date.now()}`;

            // Giả lập một test attempt
            const mockAttempt = {
                id: mockAttemptId,
                testId: test.id,
                startTime: new Date().toISOString(),
                completed: false,
                answers: [],
            };

            localStorage.setItem(
                `mockAttempt_${mockAttemptId}`,
                JSON.stringify(mockAttempt)
            );

            // Đảm bảo testId là chuỗi khi chuyển đến trang mock-test
            const safeTestId = test.id.toString();

            // Chuyển đến trang mock test
            router.push(
                `/online-tests/mock-test?testId=${safeTestId}&mockId=${mockAttemptId}`
            );
        } catch (err: any) {
            console.error("Error starting test:", err);
            alert("Có lỗi xảy ra khi bắt đầu bài kiểm tra. Vui lòng thử lại.");
        } finally {
            setIsStartingTest(false);
        }
    };

    // Helper functions
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`;
        }
        return `${mins} phút`;
    };

    const getSectionColor = (section: SectionType) => {
        switch (section) {
            case "listening":
                return "bg-blue-100 text-blue-800";
            case "reading":
                return "bg-green-100 text-green-800";
            case "writing":
                return "bg-purple-100 text-purple-800";
            case "speaking":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatTags = (tags: string) => {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link
                        href="/online-tests"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Quay lại danh sách bài kiểm tra
                    </Link>
                </div>
                <div className="bg-red-50 rounded-lg p-6 text-red-700 mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Đã xảy ra lỗi
                    </h2>
                    <p>{error || "Không thể tải thông tin bài kiểm tra"}</p>
                </div>

                {errorType === "notFound" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Tạo bài kiểm tra mock data
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Bài kiểm tra bạn tìm kiếm không tồn tại. Bạn có
                                thể tạo một bài kiểm tra mẫu với dữ liệu giả lập
                                để luyện tập.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowCreateMockTestModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                <Sparkles className="h-5 w-5 mr-2" />
                                Tạo bài kiểm tra mẫu
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal tạo bài kiểm tra mẫu */}
                {showCreateMockTestModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                            <div className="text-center mb-4">
                                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                                    <Sparkles className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    Tạo bài kiểm tra mẫu
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Tạo một bài kiểm tra với dữ liệu mẫu để
                                    luyện tập theo chuẩn quốc tế.
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiêu đề bài kiểm tra
                                    </label>
                                    <input
                                        type="text"
                                        value={mockTestTitle}
                                        onChange={(e) =>
                                            setMockTestTitle(e.target.value)
                                        }
                                        placeholder="Ví dụ: TOEIC Reading Practice Test"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại bài kiểm tra
                                    </label>
                                    <select
                                        value={selectedMockTestType}
                                        onChange={(e) =>
                                            setSelectedMockTestType(
                                                e.target.value as TestType
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    >
                                        <option value="TOEIC">
                                            TOEIC (200 câu hỏi)
                                        </option>
                                        <option value="IELTS">
                                            IELTS (82 câu hỏi)
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Độ khó
                                    </label>
                                    <select
                                        value={selectedMockTestDifficulty}
                                        onChange={(e) =>
                                            setSelectedMockTestDifficulty(
                                                e.target.value as TestDifficulty
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    >
                                        {[
                                            "Beginner",
                                            "Intermediate",
                                            "Advanced",
                                            "Expert",
                                        ].map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
                                <div className="flex">
                                    <MessageCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-700">
                                        <p className="font-medium mb-1">
                                            Lưu ý:
                                        </p>
                                        <p>
                                            Dữ liệu giả này chỉ dùng để thử
                                            nghiệm và sẽ được lưu trên trình
                                            duyệt của bạn. Nó sẽ tuân theo chuẩn{" "}
                                            {selectedMockTestType} và có thể
                                            được sử dụng để luyện tập.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={createMockTestForInvalidId}
                                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang tạo...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Tạo bài kiểm tra mẫu
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() =>
                                        setShowCreateMockTestModal(false)
                                    }
                                    className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg"
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link
                    href="/online-tests"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Quay lại danh sách bài kiểm tra
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${
                                    test.testType === "TOEIC"
                                        ? "bg-blue-100 text-blue-800"
                                        : ""
                                }
                                ${
                                    test.testType === "IELTS"
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                }
                                ${
                                    test.testType === "Placement"
                                        ? "bg-orange-100 text-orange-800"
                                        : ""
                                }
                                ${
                                    test.testType === "General"
                                        ? "bg-purple-100 text-purple-800"
                                        : ""
                                }
                            `}
                            >
                                {test.testType}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                {test.difficulty}
                            </span>
                            {test.isAIGenerated && (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                    <svg
                                        className="mr-1 h-3 w-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    AI Generated
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            {test.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 mb-5 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDuration(test.duration)}
                            </div>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {test._count.participants} người đã làm
                            </div>
                            <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                {test._count.testQuestions} câu hỏi
                            </div>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                Độ phổ biến: {test.popularity}%
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                Tỷ lệ hoàn thành: {test.completionRate}%
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">{test.description}</p>

                        {/* Tags */}
                        {test.tags && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Chủ đề và từ khóa
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {formatTags(test.tags).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Test structure */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Cấu trúc bài kiểm tra
                            </h3>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {test.sections &&
                                    Object.entries(test.sections).map(
                                        ([section, details]) => (
                                            <div
                                                key={section}
                                                className="flex items-start rounded-lg border border-gray-200 p-4"
                                            >
                                                <div
                                                    className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getSectionColor(
                                                        section as SectionType
                                                    )}`}
                                                >
                                                    {section ===
                                                        "listening" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V8Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 18V22"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M8 22H16"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "reading" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "writing" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M4 20H20"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M4 20H8L18 10L14 6L4 16V20Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {section === "speaking" && (
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M7 15L6 19L12 17L18 19L17 15"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-medium capitalize text-gray-900">
                                                        {section}
                                                    </h4>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        <p>
                                                            {details.parts} phần
                                                        </p>
                                                        <p>
                                                            {details.questions}{" "}
                                                            câu hỏi
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Hướng dẫn làm bài
                            </h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                <div className="prose max-w-none text-sm">
                                    {test.instructions}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <button
                                    onClick={handleStartTest}
                                    disabled={isStartingTest}
                                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                                >
                                    {isStartingTest ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="mr-2 h-4 w-4 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang chuẩn bị...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Play className="mr-2 h-5 w-5" />
                                            Bắt đầu làm bài
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Thời gian làm bài:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatDuration(test.duration)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Tổng số câu hỏi:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test._count.testQuestions}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span className="text-sm text-gray-500">
                                        Độ khó:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test.difficulty}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Người tạo:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {test.creator?.name || "Admin"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Chia sẻ bài kiểm tra
                                </button>
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Download className="mr-2 h-4 w-4" />
                                    Tải xuống bản PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal khi bài test chưa có nội dung */}
            {showNoContentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <div className="text-center mb-4">
                            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Bài kiểm tra chưa có nội dung
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Bài kiểm tra này chưa có nội dung. Bạn có muốn
                                tạo mock data để thực hành?
                            </p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
                            <div className="flex">
                                <MessageCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-700">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <p>
                                        Dữ liệu giả này chỉ dùng để thử nghiệm
                                        và sẽ được lưu trên trình duyệt của bạn.
                                        Nó sẽ tuân theo chuẩn {test.testType} và
                                        có thể được sử dụng để luyện tập.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={async () => {
                                    const success = generateMockData();
                                    setShowNoContentModal(false);

                                    if (success) {
                                        // Đảm bảo dữ liệu đã được lưu vào localStorage
                                        await new Promise((resolve) =>
                                            setTimeout(resolve, 300)
                                        );
                                        handleStartTest();
                                    } else {
                                        alert(
                                            "Có lỗi xảy ra khi tạo dữ liệu. Vui lòng thử lại."
                                        );
                                    }
                                }}
                                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Tạo dữ liệu thử nghiệm và bắt đầu
                            </button>

                            <button
                                onClick={() => setShowNoContentModal(false)}
                                className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestDetail;
