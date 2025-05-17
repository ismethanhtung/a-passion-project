"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Mic, Square, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Danh sách chủ đề nói
const speakingPrompts = [
    {
        topic: "Introduce yourself",
        question: "Can you introduce yourself in English?",
        tips: "Nói về tên, tuổi, nghề nghiệp, sở thích. Ví dụ: My name is Anna. I am 20 years old. I like reading books.",
        example:
            "Hi, my name is Anna. I'm 20 years old and I'm a university student. I'm studying Business Administration. In my free time, I enjoy reading novels and watching movies. I also like to go hiking on weekends with my friends.",
        level: "beginner",
    },
    {
        topic: "Describe your hometown",
        question: "What is your hometown like?",
        tips: "Miêu tả vị trí, cảnh đẹp, con người. Ví dụ: My hometown is peaceful and beautiful. There are many green fields and friendly people.",
        example:
            "I come from a small town in the north. It's a peaceful place surrounded by mountains and rivers. The people there are very friendly and everyone knows each other. We have beautiful scenery with rice fields and traditional houses. The air is clean and the food is amazing, especially our local dishes.",
        level: "beginner",
    },
    {
        topic: "Talk about your favorite food",
        question: "What is your favorite food and why?",
        tips: "Nói về món ăn, lý do yêu thích, hương vị. Ví dụ: My favorite food is Pho. It is delicious and healthy.",
        example:
            "My favorite food is definitely pho, which is a Vietnamese noodle soup. I love it because it has a rich, flavorful broth that's both comforting and satisfying. The combination of rice noodles, tender beef slices, and fresh herbs creates a perfect balance of textures and tastes. It's healthy too, as it contains various vegetables and isn't too heavy.",
        level: "beginner",
    },
    {
        topic: "Describe your ideal job",
        question: "What would be your ideal job and why?",
        tips: "Nói về loại công việc, môi trường làm việc, lý do bạn thích nó.",
        example:
            "My ideal job would be working as a software developer in a tech company with a positive culture. I enjoy solving problems and creating useful applications. I'd like a job that offers flexibility, continuous learning opportunities, and a good work-life balance. Working in a collaborative team where I can contribute ideas and learn from colleagues would be perfect for me.",
        level: "intermediate",
    },
    {
        topic: "Discuss climate change",
        question: "What do you think about climate change and its effects?",
        tips: "Thảo luận về nguyên nhân, tác động và giải pháp cho biến đổi khí hậu.",
        example:
            "Climate change is one of the most pressing issues of our time. It's primarily caused by human activities like burning fossil fuels and deforestation. We're already seeing its effects through more frequent extreme weather events, rising sea levels, and disruptions to ecosystems. I believe we need urgent action at both individual and governmental levels to reduce carbon emissions, transition to renewable energy, and implement sustainable practices across all sectors.",
        level: "advanced",
    },
];

// Giao diện cho kết quả đánh giá
interface AssessmentResult {
    overallScore: number;
    feedback: string[];
    detailedFeedback: string;
    improvementSuggestions: string[];
    commonErrors: string[];
    recordedText: string;
}

export default function SpeakingLab() {
    const [index, setIndex] = useState(0);
    const [showTip, setShowTip] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const prompt = speakingPrompts[index];

    // State cho ghi âm
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [maxRecordingTime] = useState(60); // 60 giây

    // State cho kết quả đánh giá
    const [isAssessing, setIsAssessing] = useState(false);
    const [assessmentResult, setAssessmentResult] =
        useState<AssessmentResult | null>(null);

    // State cho tab hiện tại
    const [activeTab, setActiveTab] = useState("prompt");

    // Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Xử lý việc ghi âm
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/wav",
                });
                const audioUrl = URL.createObjectURL(audioBlob);

                setAudioBlob(audioBlob);
                setAudioUrl(audioUrl);
                setIsRecording(false);

                // Dừng timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // Tự động chuyển sang tab phát lại
                setActiveTab("playback");
            };

            // Bắt đầu ghi âm
            mediaRecorder.start(1000);
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prevTime) => {
                    const newTime = prevTime + 1;
                    if (newTime >= maxRecordingTime) {
                        stopRecording();
                    }
                    return newTime;
                });
            }, 1000);
        } catch (error) {
            toast.error("Không thể truy cập microphone");
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();

            // Dừng các track âm thanh
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    // Reset bản ghi âm
    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setAssessmentResult(null);
        setActiveTab("prompt");
    };

    // Gửi audio để đánh giá
    const submitForAssessment = async () => {
        if (!audioBlob) return;

        try {
            setIsAssessing(true);

            const formData = new FormData();
            formData.append("audio", audioBlob);
            formData.append("text", prompt.example);
            formData.append("language", "en-US");

            const response = await fetch("/api/speech-to-text", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gửi bản ghi âm");
            }

            const result = await response.json();
            setAssessmentResult(result);

            // Chuyển sang tab đánh giá
            setActiveTab("assessment");
        } catch (error) {
            toast.error("Có lỗi khi đánh giá bản ghi âm");
            console.error("Error submitting recording:", error);
        } finally {
            setIsAssessing(false);
        }
    };

    // Xử lý khi component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-cyan-800 mb-2 text-center">
                    Speaking Lab
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Luyện nói tiếng Anh với các chủ đề thực tế, ghi âm và nhận
                    phản hồi từ AI
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar với danh sách chủ đề */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chủ đề</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {speakingPrompts.map((p, i) => (
                                        <div
                                            key={i}
                                            className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                                                index === i
                                                    ? "bg-cyan-100 text-cyan-800"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => {
                                                setIndex(i);
                                                resetRecording();
                                            }}
                                        >
                                            <span className="line-clamp-1">
                                                {p.topic}
                                            </span>
                                            <Badge
                                                variant={
                                                    p.level === "beginner"
                                                        ? "outline"
                                                        : p.level ===
                                                          "intermediate"
                                                        ? "secondary"
                                                        : "destructive"
                                                }
                                            >
                                                {p.level}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Khu vực chính */}
                    <div className="md:col-span-3">
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <Tabs
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                >
                                    <TabsList className="grid grid-cols-3 mb-6">
                                        <TabsTrigger value="prompt">
                                            Đề bài
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="playback"
                                            disabled={!audioBlob}
                                        >
                                            Bản ghi
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="assessment"
                                            disabled={!assessmentResult}
                                        >
                                            Đánh giá
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab đề bài */}
                                    <TabsContent value="prompt">
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold text-cyan-700 mb-2">
                                                    {prompt.topic}
                                                </h2>
                                                <p className="text-gray-700 text-lg mb-4">
                                                    {prompt.question}
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowTip(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                    >
                                                        {showTip
                                                            ? "Ẩn gợi ý"
                                                            : "Xem gợi ý"}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowExample(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                    >
                                                        {showExample
                                                            ? "Ẩn câu trả lời mẫu"
                                                            : "Xem câu trả lời mẫu"}
                                                    </Button>
                                                </div>

                                                {showTip && (
                                                    <div className="bg-cyan-50 p-4 rounded-md mb-4">
                                                        <h3 className="font-medium text-cyan-800 mb-1">
                                                            Gợi ý:
                                                        </h3>
                                                        <p>{prompt.tips}</p>
                                                    </div>
                                                )}

                                                {showExample && (
                                                    <div className="bg-amber-50 p-4 rounded-md mb-4">
                                                        <h3 className="font-medium text-amber-800 mb-1">
                                                            Câu trả lời mẫu:
                                                        </h3>
                                                        <p>{prompt.example}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t pt-4">
                                                <h3 className="font-medium mb-2">
                                                    Ghi âm câu trả lời của bạn:
                                                </h3>

                                                <div className="flex justify-center">
                                                    {!isRecording ? (
                                                        <Button
                                                            className="gap-2"
                                                            onClick={
                                                                startRecording
                                                            }
                                                        >
                                                            <Mic size={18} />
                                                            Bắt đầu ghi âm
                                                        </Button>
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="mb-2 flex items-center justify-center gap-2">
                                                                <span className="animate-pulse text-red-500">
                                                                    ●
                                                                </span>
                                                                <span>
                                                                    Đang ghi âm:{" "}
                                                                    {formatTime(
                                                                        recordingTime
                                                                    )}
                                                                    /
                                                                    {formatTime(
                                                                        maxRecordingTime
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <Progress
                                                                value={
                                                                    (recordingTime /
                                                                        maxRecordingTime) *
                                                                    100
                                                                }
                                                                className="mb-3"
                                                            />

                                                            <Button
                                                                variant="destructive"
                                                                className="gap-2"
                                                                onClick={
                                                                    stopRecording
                                                                }
                                                            >
                                                                <Square
                                                                    size={18}
                                                                />
                                                                Dừng ghi âm
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Tab phát lại */}
                                    <TabsContent value="playback">
                                        <div className="space-y-4">
                                            <div className="bg-green-50 p-4 rounded-md">
                                                <h3 className="font-medium text-green-800 mb-2">
                                                    Bản ghi hoàn thành!
                                                </h3>
                                                <p>
                                                    Bạn có thể nghe lại bản ghi
                                                    âm hoặc gửi để nhận đánh giá
                                                </p>
                                            </div>

                                            <div className="flex justify-center my-6">
                                                {audioUrl && (
                                                    <audio
                                                        src={audioUrl}
                                                        controls
                                                        className="w-full max-w-md"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                    onClick={resetRecording}
                                                >
                                                    <RefreshCw size={18} />
                                                    Ghi âm lại
                                                </Button>

                                                <Button
                                                    className="gap-2"
                                                    onClick={
                                                        submitForAssessment
                                                    }
                                                    disabled={isAssessing}
                                                >
                                                    {isAssessing
                                                        ? "Đang đánh giá..."
                                                        : "Gửi để đánh giá"}
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Tab đánh giá */}
                                    <TabsContent value="assessment">
                                        {assessmentResult && (
                                            <div className="space-y-6">
                                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                                    <div
                                                        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                                                        style={{
                                                            backgroundColor:
                                                                assessmentResult.overallScore >=
                                                                80
                                                                    ? "#10b981"
                                                                    : assessmentResult.overallScore >=
                                                                      60
                                                                    ? "#f59e0b"
                                                                    : "#ef4444",
                                                        }}
                                                    >
                                                        {
                                                            assessmentResult.overallScore
                                                        }
                                                    </div>

                                                    <div>
                                                        <h3 className="font-medium text-lg">
                                                            Đánh giá của bạn
                                                        </h3>
                                                        <p className="text-gray-500 text-sm">
                                                            Dựa trên độ chính
                                                            xác phát âm và nội
                                                            dung
                                                        </p>

                                                        <div className="mt-2 flex gap-2 flex-wrap">
                                                            {assessmentResult.feedback.map(
                                                                (
                                                                    feedback,
                                                                    i
                                                                ) => (
                                                                    <Badge
                                                                        key={i}
                                                                        variant="secondary"
                                                                    >
                                                                        {
                                                                            feedback
                                                                        }
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Nội dung bạn đã nói:
                                                    </h3>
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <p className="text-gray-700">
                                                            {
                                                                assessmentResult.recordedText
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Phản hồi chi tiết:
                                                    </h3>
                                                    <p className="text-gray-700">
                                                        {
                                                            assessmentResult.detailedFeedback
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Gợi ý cải thiện:
                                                    </h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {assessmentResult.improvementSuggestions.map(
                                                            (suggestion, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="text-gray-700"
                                                                >
                                                                    {suggestion}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2">
                                                        Lỗi thường gặp:
                                                    </h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {assessmentResult.commonErrors.map(
                                                            (error, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="text-gray-700"
                                                                >
                                                                    {error}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4 border-t">
                                                    <Button
                                                        onClick={resetRecording}
                                                        className="gap-2"
                                                    >
                                                        <RefreshCw size={18} />
                                                        Thử lại
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIndex((i) =>
                                                                i ===
                                                                speakingPrompts.length -
                                                                    1
                                                                    ? 0
                                                                    : i + 1
                                                            );
                                                            resetRecording();
                                                        }}
                                                    >
                                                        Chủ đề tiếp theo
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
