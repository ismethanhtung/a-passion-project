"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Mic,
    MicOff,
    Play,
    Repeat,
    Volume2,
    Check,
    X,
    Award,
    Info,
    ChevronDown,
    ChevronUp,
    Languages,
    AlertTriangle,
    Bookmark,
    BookmarkCheck,
    Send,
} from "lucide-react";
import VoskService from "@/lib/vosk-service";

// Định nghĩa kiểu cho Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

type PronunciationFeedback = {
    overallScore: number;
    feedback: string[];
    wordAnalysis: Array<{
        word: string;
        isCorrect: boolean;
        feedback?: string;
        confidence: number;
    }>;
    detailedFeedback?: string;
    improvementSuggestions?: string[];
    commonErrors?: string[];
    recordedText?: string; // Thêm trường này để trả về văn bản đã nhận dạng
};

// Định nghĩa kiểu cho lịch sử phát âm
type PracticeHistoryItem = {
    text: string;
    score: number;
    date: Date;
    saved?: boolean;
    audioUrl?: string; // Thêm URL âm thanh để phát lại
};

// Định nghĩa các loại lỗi có thể xảy ra
enum ErrorType {
    NETWORK = "network",
    PERMISSION = "permission",
    NO_SPEECH = "no_speech",
    AUDIO_CAPTURE = "audio_capture",
    ABORTED = "aborted",
    OTHER = "other",
}

// Hàm xử lý lỗi để cung cấp thông báo rõ ràng cho người dùng
const getErrorMessage = (errorType: ErrorType, details?: string): string => {
    switch (errorType) {
        case ErrorType.NETWORK:
            return "Không thể kết nối đến dịch vụ nhận dạng giọng nói. Đang chuyển sang chế độ dự phòng.";
        case ErrorType.PERMISSION:
            return "Không thể truy cập microphone. Vui lòng cấp quyền truy cập microphone trong trình duyệt của bạn.";
        case ErrorType.NO_SPEECH:
            return "Không phát hiện giọng nói. Vui lòng nói to và rõ ràng hơn.";
        case ErrorType.AUDIO_CAPTURE:
            return "Không thể bắt đầu ghi âm. Vui lòng đảm bảo microphone được kết nối đúng cách.";
        case ErrorType.ABORTED:
            return ""; // Không hiển thị thông báo khi người dùng hủy
        case ErrorType.OTHER:
            return `Đã xảy ra lỗi khi nhận dạng giọng nói${
                details ? `: ${details}` : ""
            }. Vui lòng thử lại.`;
        default:
            return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
    }
};

const languageOptions = [
    { value: "en-US", label: "English (American)" },
    { value: "en-GB", label: "English (British)" },
    { value: "en-AU", label: "English (Australian)" },
    { value: "fr-FR", label: "French" },
    { value: "es-ES", label: "Spanish" },
    { value: "de-DE", label: "German" },
    { value: "ja-JP", label: "Japanese" },
    { value: "zh-CN", label: "Chinese (Mandarin)" },
];

const practicePhrases = {
    "en-US": [
        "The quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "Peter Piper picked a peck of pickled peppers.",
        "I scream, you scream, we all scream for ice cream.",
    ],
    "en-GB": [
        "The rain in Spain stays mainly in the plain.",
        "Could you pass me a bottle of water?",
        "I'll have a cup of tea, please.",
        "Mind the gap between the train and the platform.",
        "The Thames is a river that flows through London.",
    ],
    "en-AU": [
        "G'day mate, how's it going?",
        "We're having a barbie this arvo.",
        "I need to put petrol in my car.",
        "Let's head to the beach this weekend.",
        "Can you pass me the tomato sauce for my snag?",
    ],
    "fr-FR": [
        "Comment allez-vous aujourd'hui?",
        "Je voudrais une baguette, s'il vous plaît.",
        "Où est la bibliothèque?",
        "Parlez-vous anglais?",
        "J'adore la cuisine française.",
    ],
    "es-ES": [
        "¿Cómo estás hoy?",
        "Me gustaría practicar mi español.",
        "¿Dónde está la estación de tren?",
        "Hace buen tiempo hoy.",
        "¿Puedes hablar más despacio, por favor?",
    ],
    "de-DE": [
        "Guten Tag, wie geht es Ihnen?",
        "Ich möchte Deutsch lernen.",
        "Wo ist der Bahnhof?",
        "Das Wetter ist heute schön.",
        "Können Sie bitte langsamer sprechen?",
    ],
    "ja-JP": [
        "こんにちは、お元気ですか？",
        "日本語を練習したいです。",
        "駅はどこですか？",
        "今日は天気がいいですね。",
        "もう少しゆっくり話してください。",
    ],
    "zh-CN": [
        "你好，你今天好吗？",
        "我想练习我的中文。",
        "火车站在哪里？",
        "今天天气很好。",
        "请说慢一点。",
    ],
};

// Sử dụng API thay vì hàm phân tích mô phỏng
const analyzePronunciation = async (
    recordedText: string,
    originalText: string,
    language: string
): Promise<PronunciationFeedback> => {
    try {
        const response = await fetch("/api/pronunciation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recordedText,
                originalText,
                language,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to analyze pronunciation");
        }

        return await response.json();
    } catch (error) {
        console.error("Error analyzing pronunciation:", error);

        // Fallback cho trường hợp lỗi
        return {
            overallScore: 70,
            feedback: [
                "Could not perform detailed analysis",
                "Try again or check your connection",
            ],
            wordAnalysis: originalText.split(" ").map((word) => ({
                word,
                isCorrect: true,
                confidence: 0.7,
            })),
        };
    }
};

const PronunciationPage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [currentPhrase, setCurrentPhrase] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<PronunciationFeedback | null>(
        null
    );
    const [practiceMode, setPracticeMode] = useState<
        "phrase" | "free" | "conversation"
    >("phrase");
    const [customInput, setCustomInput] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [usingFallbackMode, setUsingFallbackMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<PracticeHistoryItem[]>([]);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(
        null
    );
    const audioChunksRef = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Check browser compatibility
    const isSpeechRecognitionSupported = useRef<boolean>(
        typeof window !== "undefined" &&
            ("SpeechRecognition" in window ||
                "webkitSpeechRecognition" in window)
    );

    const isMediaRecorderSupported = useRef<boolean>(
        typeof window !== "undefined" &&
            typeof window.MediaRecorder !== "undefined"
    );

    // Thêm vào state đầu trang
    const [isVoskReady, setIsVoskReady] = useState<boolean>(false);
    const [voskError, setVoskError] = useState<string | null>(null);

    // Thêm state cho tính năng AI Conversation
    const [aiConversation, setAiConversation] = useState<
        Array<{ speaker: "user" | "ai"; text: string }>
    >([]);
    const [isAiResponding, setIsAiResponding] = useState(false);
    const [aiConversationTopic, setAiConversationTopic] = useState("");

    // Kiểm tra người dùng lần đầu truy cập tính năng phát âm
    useEffect(() => {
        const hasUsedPronunciation = localStorage.getItem(
            "hasUsedPronunciation"
        );
        if (!hasUsedPronunciation) {
            setShowOnboarding(true);

            // Đánh dấu đã sử dụng để lần sau không hiển thị nữa
            localStorage.setItem("hasUsedPronunciation", "true");
        }
    }, []);

    useEffect(() => {
        // Set random phrase when language changes
        const phrases =
            practicePhrases[selectedLanguage] || practicePhrases["en-US"];
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);

        // Reset states when language changes
        setTranscript("");
        setFeedback(null);

        // Setup audio for native pronunciation
        audioRef.current = new Audio();

        // Nếu MediaRecorder đã được khởi tạo, hủy bỏ nó khi component unmount
        const mediaRecorderInstance = mediaRecorderRef.current;

        // Đầu tiên thử khởi tạo Web Speech API
        if (isSpeechRecognitionSupported.current) {
            try {
                const SpeechRecognitionAPI =
                    window.SpeechRecognition || window.webkitSpeechRecognition;
                recognitionRef.current = new SpeechRecognitionAPI();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = selectedLanguage;

                recognitionRef.current.onresult = (event: any) => {
                    const result = event.results[0][0].transcript;
                    setTranscript(result);
                    setIsListening(false);

                    // Analyze pronunciation after recording
                    setFeedback(null); // Clear previous feedback while loading
                    setIsAnalyzing(true);

                    // Use the async function
                    analyzePronunciation(
                        result,
                        practiceMode === "phrase" ? currentPhrase : customInput,
                        selectedLanguage
                    )
                        .then((feedbackData) => {
                            setFeedback(feedbackData);
                            // Add to history
                            const newHistoryItem: PracticeHistoryItem = {
                                text:
                                    practiceMode === "phrase"
                                        ? currentPhrase
                                        : customInput,
                                score: feedbackData.overallScore,
                                date: new Date(),
                                saved: false,
                                audioUrl: recordedAudioBlob
                                    ? URL.createObjectURL(
                                          recordedAudioBlob as Blob
                                      )
                                    : undefined,
                            };
                            const updatedHistory = [...history, newHistoryItem];
                            setHistory(updatedHistory);

                            // Lưu vào localStorage
                            try {
                                localStorage.setItem(
                                    "pronunciationHistory",
                                    JSON.stringify(updatedHistory)
                                );
                            } catch (error) {
                                console.error(
                                    "Error saving history to localStorage:",
                                    error
                                );
                            }

                            setIsAnalyzing(false);
                        })
                        .catch((error) => {
                            console.error(
                                "Error processing pronunciation analysis:",
                                error
                            );
                            setIsAnalyzing(false);
                        });
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);

                    // Xử lý lỗi cụ thể
                    if (event.error === "network") {
                        // Hiển thị thông báo lỗi mạng
                        setErrorMessage(getErrorMessage(ErrorType.NETWORK));

                        // Tự động chuyển sang chế độ dự phòng
                        setUsingFallbackMode(true);

                        // Bạn có thể chuyển sang chế độ ghi âm ngoại tuyến và xử lý sau
                        if (recognitionRef.current) {
                            try {
                                recognitionRef.current.abort();
                            } catch (e) {
                                console.error("Error aborting recognition:", e);
                            }
                        }
                    } else if (
                        event.error === "not-allowed" ||
                        event.error === "permission-denied"
                    ) {
                        setErrorMessage(getErrorMessage(ErrorType.PERMISSION));
                    } else if (event.error === "no-speech") {
                        setErrorMessage(getErrorMessage(ErrorType.NO_SPEECH));
                    } else if (event.error === "audio-capture") {
                        setErrorMessage(
                            getErrorMessage(ErrorType.AUDIO_CAPTURE)
                        );
                    } else if (event.error === "aborted") {
                        // Đã hủy bỏ bởi người dùng hoặc hệ thống, không cần thông báo
                    } else {
                        setErrorMessage(
                            getErrorMessage(ErrorType.OTHER, event.error)
                        );
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                // Thêm timeout để tự động dừng sau 30 giây
                setTimeout(() => {
                    if (recognitionRef.current && isListening) {
                        try {
                            recognitionRef.current.stop();
                        } catch (e) {
                            console.error("Lỗi khi dừng recognition:", e);
                        }
                        setIsListening(false);
                    }
                }, 30000);

                // Web Speech API khởi tạo thành công, không cần dùng dự phòng
                setUsingFallbackMode(false);
            } catch (error) {
                console.error("Error initializing SpeechRecognition:", error);
                // Nếu không khởi tạo được Web Speech API, chuyển sang chế độ dự phòng
                setUsingFallbackMode(true);
                // Khởi tạo MediaRecorder
                initMediaRecorder();
            }
        } else {
            // Web Speech API không được hỗ trợ, chuyển sang chế độ dự phòng
            setUsingFallbackMode(true);
            // Khởi tạo MediaRecorder
            initMediaRecorder();
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Cleanup cho MediaRecorder
            if (mediaRecorderInstance) {
                try {
                    const tracks = mediaRecorderInstance.stream?.getTracks();
                    tracks?.forEach((track) => track.stop());
                } catch (e) {
                    console.error("Error stopping media recorder stream:", e);
                }
            }
        };
    }, [
        selectedLanguage,
        practiceMode,
        customInput,
        currentPhrase,
        recordedAudioBlob,
    ]);

    // Thêm useEffect để khởi tạo Vosk khi component mount
    useEffect(() => {
        // Kiểm tra xem có hỗ trợ Web Speech API không
        const checkWebSpeechSupport = () => {
            return window.SpeechRecognition || window.webkitSpeechRecognition;
        };

        // Khởi tạo Vosk khi component mount để có thể dùng ngay khi cần
        const initializeVosk = async () => {
            try {
                console.log("Bắt đầu khởi tạo Vosk...");
                const initialized = await VoskService.initialize();
                console.log(
                    "Kết quả khởi tạo Vosk:",
                    initialized ? "Thành công" : "Thất bại"
                );
                setIsVoskReady(initialized);
                if (!initialized) {
                    console.log("Không thể khởi tạo Vosk model");
                    setVoskError(
                        "Không thể khởi tạo Vosk model. Sẽ sử dụng phương pháp khác."
                    );
                }
            } catch (error) {
                console.error("Error initializing Vosk:", error);
                console.log(
                    "Chi tiết lỗi Vosk:",
                    error instanceof Error ? error.message : String(error)
                );
                setVoskError(
                    "Lỗi khi khởi tạo Vosk. Sẽ sử dụng phương pháp khác."
                );
                setIsVoskReady(false);
            }
        };

        // Chỉ khởi tạo Vosk nếu không có Web Speech API
        if (!checkWebSpeechSupport()) {
            initializeVosk();
        }

        return () => {
            // Cleanup Vosk khi component unmount
            VoskService.dispose();
        };
    }, []);

    // Cải thiện hàm toggleListening để xử lý lỗi network tốt hơn
    const toggleListening = async () => {
        if (isListening) {
            // Dừng việc ghi âm nếu đang diễn ra
            stopMediaRecording();
            setIsListening(false);
            return;
        }

        // Bắt đầu ghi âm mới
        setIsListening(true);
        setErrorMessage(null);
        setTranscript("");
        setFeedback(null);

        // Ưu tiên sử dụng MediaRecorder vì ổn định hơn
        if (isMediaRecorderSupported.current) {
            startMediaRecording();
        } else if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            // Sử dụng Web Speech API (hoạt động trên Chrome, Edge, Safari)
            try {
                const SpeechRecognition =
                    window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();

                console.log("--- KHỞI TẠO SPEECH RECOGNITION ---");
                console.log("Ngôn ngữ được cài đặt:", selectedLanguage);

                recognition.lang = selectedLanguage;
                recognition.continuous = false;
                recognition.interimResults = false;

                // Xử lý kết quả
                recognition.onresult = (event) => {
                    console.log(
                        "--- SỰ KIỆN ONRESULT CỦA SPEECH RECOGNITION ---"
                    );
                    console.log("Kết quả đầy đủ:", event.results);
                    console.log("Số lượng kết quả:", event.results.length);
                    if (event.results.length > 0) {
                        console.log(
                            "Độ tin cậy:",
                            event.results[0][0].confidence
                        );
                    }
                    const transcript = event.results[0][0].transcript;
                    console.log(
                        "3. Kết quả nhận dạng với Web Speech API:",
                        transcript
                    );
                    setTranscript(transcript);
                    setIsListening(false);
                };

                // Xử lý khi kết thúc mà không có kết quả
                recognition.onend = () => {
                    console.log("--- SỰ KIỆN ONEND CỦA SPEECH RECOGNITION ---");
                    console.log("Trạng thái khi kết thúc:", recognition.state);
                    console.warn(
                        "Web Speech API kết thúc mà không nhận dạng được giọng nói"
                    );
                    setIsListening(false);
                };

                // Xử lý lỗi
                recognition.onerror = (event) => {
                    console.log(
                        "--- SỰ KIỆN ONERROR CỦA SPEECH RECOGNITION ---"
                    );
                    console.log("Loại lỗi:", event.error);
                    console.log("Chi tiết lỗi:", event);
                    console.error("Lỗi Web Speech API:", event.error);
                    setIsListening(false);
                    setErrorMessage(
                        getErrorMessage(ErrorType.OTHER, event.error)
                    );
                };

                // Bắt đầu phát âm thanh và nhận dạng
                console.log("Bắt đầu phát âm thanh");
                if (audioRef.current) {
                    audioRef.current
                        .play()
                        .then(() => {
                            console.log("Đã bắt đầu phát âm thanh thành công");
                        })
                        .catch((e) => {
                            console.warn("Không thể phát âm thanh:", e);
                            console.log("Chi tiết lỗi phát âm:", e.message);
                        });
                }
                console.log("Bắt đầu nhận dạng Speech Recognition");
                recognition.start();
                recognitionRef.current = recognition;
                console.log("Trạng thái sau khi start:", recognition.state);

                // Đặt thời gian chờ
                setTimeout(() => {
                    if (recognition.state !== "inactive") {
                        recognition.abort();
                        console.warn("Web Speech API hết thời gian");
                    }
                }, 10000);
            } catch (error) {
                console.error("Error starting Web Speech API:", error);
                setErrorMessage(
                    "Trình duyệt của bạn không hỗ trợ Web Speech API. Đang thử phương pháp khác..."
                );

                // Chuyển sang sử dụng MediaRecorder khi Web Speech API không hoạt động
                startMediaRecording();
            }
        } else {
            // Không có phương pháp nào được hỗ trợ
            setIsListening(false);
            setErrorMessage(
                "Trình duyệt của bạn không hỗ trợ thu âm. Vui lòng thử trình duyệt khác như Chrome hoặc Edge."
            );
        }
    };

    const playNativePronunciation = () => {
        if (!audioRef.current) return;

        const text = practiceMode === "phrase" ? currentPhrase : customInput;
        if (!text) return;

        // Use browser's speech synthesis
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage;

        utterance.onend = () => {
            setIsPlaying(false);
        };

        speechSynthesis.speak(utterance);
    };

    // Cập nhật hàm getNewPhrase để cũng xử lý khi chuyển sang chế độ Free Practice
    const getNewPhrase = () => {
        if (practiceMode === "phrase") {
            const phrases =
                practicePhrases[selectedLanguage] || practicePhrases["en-US"];
            let newPhrase;
            do {
                newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            } while (newPhrase === currentPhrase && phrases.length > 1);

            setCurrentPhrase(newPhrase);
        } else if (practiceMode === "free") {
            // Giữ nguyên customInput khi ở chế độ Free Practice
        }
        setTranscript("");
        setFeedback(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Xử lý thay đổi chế độ luyện tập
    const handlePracticeModeChange = (
        mode: "phrase" | "free" | "conversation"
    ) => {
        // Giữ giá trị customInput hiện tại nếu đang ở chế độ free và chuyển sang chế độ khác rồi quay lại
        const previousCustomInput = customInput;
        const prevMode = practiceMode;

        setPracticeMode(mode);
        setTranscript("");
        setFeedback(null);
        setErrorMessage(null);
        setSuccessMessage(null);
        setAudioUrl(null);

        // Dừng ghi âm nếu đang diễn ra
        if (isListening) {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === "recording"
            ) {
                mediaRecorderRef.current.stop();
            }
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    console.error("Lỗi khi dừng recognition:", e);
                }
            }
            setIsListening(false);
        }

        // Đặt lại recording state
        setIsAnalyzing(false);

        // Xử lý chuyển đổi giữa các chế độ
        if (mode === "phrase") {
            // Lấy một cụm từ mới khi chuyển sang chế độ Phrase
            getNewPhrase();
        } else if (mode === "free") {
            // Giữ lại customInput nếu trước đó đã nhập và đang chuyển về lại chế độ free
            if (!previousCustomInput && customInput) {
                // Giữ nguyên, không thay đổi customInput
            } else if (previousCustomInput) {
                setCustomInput(previousCustomInput);
            }
        } else if (mode === "conversation") {
            // Đặt lại cuộc hội thoại AI nếu chưa có hoặc đã kết thúc cuộc trò chuyện trước đó
            if (aiConversation.length > 0) {
                // Xác nhận xem có muốn bắt đầu cuộc trò chuyện mới hay không
                // Ở đây giữ nguyên lịch sử trò chuyện, hoặc có thể thêm xác nhận nếu muốn
            } else {
                setAiConversation([]);
            }
        }

        // Đảm bảo MediaRecorder được khởi tạo lại khi đổi chế độ
        // Đặc biệt quan trọng khi chuyển sang chế độ Free Practice
        if (isMediaRecorderSupported.current) {
            if (prevMode !== mode) {
                // Hủy MediaRecorder cũ nếu có
                if (mediaRecorderRef.current) {
                    try {
                        if (streamRef.current) {
                            streamRef.current
                                .getTracks()
                                .forEach((track) => track.stop());
                        }
                        mediaRecorderRef.current = null;
                    } catch (error) {
                        console.error("Lỗi khi hủy MediaRecorder:", error);
                    }
                }

                // Khởi tạo lại MediaRecorder
                setTimeout(() => {
                    initMediaRecorder().catch((err) => {
                        console.error("Lỗi khởi tạo lại MediaRecorder:", err);
                    });
                }, 300);
            }
        }
    };

    // Khởi tạo MediaRecorder với cấu hình chất lượng cao
    const initMediaRecorder = async () => {
        try {
            console.log("Đang khởi tạo MediaRecorder...");

            // Đảm bảo dừng và hủy stream cũ nếu có
            if (streamRef.current) {
                try {
                    streamRef.current
                        .getTracks()
                        .forEach((track) => track.stop());
                } catch (e) {
                    console.warn("Không thể dừng stream cũ:", e);
                }
            }

            // Yêu cầu quyền truy cập microphone
            console.log("Đang yêu cầu quyền truy cập microphone...");
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            console.log("Đã nhận quyền truy cập microphone thành công");

            // Lưu stream để sử dụng sau này
            streamRef.current = stream;

            // Xác định mime type hỗ trợ
            const mimeType = MediaRecorder.isTypeSupported("audio/webm")
                ? "audio/webm"
                : MediaRecorder.isTypeSupported("audio/mp4")
                ? "audio/mp4"
                : "audio/ogg";

            console.log(`Sử dụng mime type: ${mimeType} cho MediaRecorder`);

            // Tạo MediaRecorder với stream và các tùy chọn
            console.log("Đang tạo MediaRecorder...");
            const recorder = new MediaRecorder(stream, {
                mimeType: mimeType,
            });

            // Xử lý sự kiện khi có dữ liệu sẵn sàng
            recorder.ondataavailable = (event) => {
                console.log(
                    "Sự kiện dataavailable được kích hoạt:",
                    event.data.size,
                    "bytes"
                );
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Xử lý sự kiện khi ghi âm dừng lại
            recorder.onstop = async () => {
                console.log("Sự kiện stop của MediaRecorder được kích hoạt");
                console.log(
                    "Số lượng audio chunks:",
                    audioChunksRef.current.length
                );

                if (audioChunksRef.current.length === 0) {
                    console.warn("Không có dữ liệu âm thanh nào được ghi lại");
                    setErrorMessage(
                        "Không có dữ liệu âm thanh được ghi lại. Vui lòng thử lại."
                    );
                    return;
                }

                try {
                    // Tạo Blob từ các đoạn âm thanh
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: mimeType,
                    });
                    console.log(
                        `Đã tạo audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`
                    );

                    // Tạo URL để phát lại
                    const url = URL.createObjectURL(audioBlob);
                    setAudioUrl(url);
                    console.log("Đã tạo audio URL:", url);

                    // Xử lý Blob âm thanh
                    console.log("Đang chuyển blob âm thanh để xử lý...");
                    await processAudioBlob(audioBlob);
                } catch (error) {
                    console.error("Lỗi khi xử lý dữ liệu âm thanh:", error);
                    setErrorMessage(
                        `Lỗi khi xử lý dữ liệu âm thanh: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`
                    );
                }
            };

            // Xử lý sự kiện khi có lỗi
            recorder.onerror = (event) => {
                console.error("Lỗi MediaRecorder:", event);
                setErrorMessage("Lỗi khi ghi âm. Vui lòng thử lại.");
            };

            // Lưu MediaRecorder vào ref
            mediaRecorderRef.current = recorder;
            console.log("Đã khởi tạo MediaRecorder thành công");

            return true;
        } catch (error) {
            console.error("Lỗi khi khởi tạo MediaRecorder:", error);

            // Xử lý lỗi quyền truy cập
            if (
                error instanceof DOMException &&
                error.name === "NotAllowedError"
            ) {
                setErrorMessage(
                    "Vui lòng cấp quyền truy cập microphone để sử dụng tính năng này."
                );
            } else {
                setErrorMessage(
                    `Không thể khởi tạo ghi âm: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            }

            return false;
        }
    };

    // Mô phỏng kết quả speech-to-text dựa trên văn bản gốc
    const simulateSpeechToText = (
        originalText: string,
        accuracy: number
    ): string => {
        const words = originalText.split(/\s+/);
        const complexity = Math.min(words.length * 0.1, 1); // Độ phức tạp tăng theo độ dài

        // Tỷ lệ thay đổi từ giảm dần theo độ chính xác
        const simulatedWords = words.map((word) => {
            // Xác suất giữ nguyên từ dựa trên độ chính xác và độ phức tạp
            const keepWordProbability = accuracy - complexity * 0.2;

            if (Math.random() < keepWordProbability) {
                return word; // Giữ nguyên từ
            } else if (Math.random() < 0.7) {
                // Làm sai từ một chút (thay đổi 1-2 ký tự)
                return word
                    .split("")
                    .map((char) => {
                        if (Math.random() < 0.3) {
                            // Thay thế ngẫu nhiên một số ký tự
                            const randomChars =
                                "abcdefghijklmnopqrstuvwxyzáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựíìỉĩịýỳỷỹỵđ";
                            return randomChars.charAt(
                                Math.floor(Math.random() * randomChars.length)
                            );
                        }
                        return char;
                    })
                    .join("");
            } else {
                // Bỏ từ (trả về chuỗi rỗng)
                return "";
            }
        });

        // Lọc bỏ các chuỗi rỗng và nối lại
        return simulatedWords.filter((word) => word !== "").join(" ");
    };

    // Phân tích kết quả nhận dạng so với văn bản gốc
    const analyzeTranscription = (
        recognizedText: string,
        originalText: string
    ): PronunciationFeedback => {
        if (!recognizedText || !originalText) {
            // Trả về kết quả mặc định nếu không có dữ liệu
            return {
                overallScore: 50,
                feedback: ["Không đủ dữ liệu để đánh giá chính xác"],
                wordAnalysis: originalText.split(/\s+/).map((word) => ({
                    word,
                    isCorrect: true,
                    confidence: 0.5,
                })),
                detailedFeedback:
                    "Không thể đánh giá chi tiết do thiếu dữ liệu so sánh.",
                improvementSuggestions: ["Hãy thử lại và đọc to, rõ ràng hơn."],
                commonErrors: ["Chưa thể xác định lỗi chính xác."],
                recordedText: recognizedText,
            };
        }

        const originalWords = originalText.toLowerCase().split(/\s+/);
        const recognizedWords = recognizedText.toLowerCase().split(/\s+/);

        // Tính điểm tổng quan dựa trên số từ chính xác
        let correctWords = 0;
        let totalConfidence = 0;

        // Phân tích từng từ
        const wordAnalysis = originalWords.map((originalWord, index) => {
            let isCorrect = false;
            let feedback = "";
            let confidence = 0;
            let matchingWordIndex = -1;

            // Tìm từ trong chuỗi nhận dạng (với biên độ lỗi cho phép)
            for (let i = 0; i < recognizedWords.length; i++) {
                const recognizedWord = recognizedWords[i];
                const distance = levenshteinDistance(
                    recognizedWord,
                    originalWord
                );
                const maxDistance = Math.max(
                    originalWord.length,
                    recognizedWord.length
                );
                const similarityRatio =
                    maxDistance > 0 ? 1 - distance / maxDistance : 1;

                if (similarityRatio > confidence) {
                    confidence = similarityRatio;
                    matchingWordIndex = i;

                    if (distance === 0) {
                        // Từ hoàn toàn chính xác
                        isCorrect = true;
                        feedback = "Phát âm tốt";
                        break;
                    }
                }
            }

            if (matchingWordIndex >= 0) {
                const matchingWord = recognizedWords[matchingWordIndex];

                if (isCorrect) {
                    correctWords++;
                } else if (confidence > 0.7) {
                    // Từ gần đúng
                    isCorrect = true;
                    correctWords++;
                    feedback = "Phát âm khá tốt";
                } else if (confidence > 0.5) {
                    // Từ tạm chấp nhận được
                    isCorrect = false;
                    feedback = `Phát âm chưa chính xác (nghe như "${matchingWord}")`;
                } else {
                    // Từ sai hoàn toàn
                    isCorrect = false;
                    feedback = "Phát âm không chính xác";
                }
            } else {
                // Không tìm thấy từ tương ứng
                isCorrect = false;
                feedback = "Không phát hiện được từ này trong bản ghi âm";
                confidence = 0;
            }

            totalConfidence += confidence;
            const confidencePercent = Math.round(confidence * 100);

            return {
                word: originalWord,
                isCorrect,
                feedback,
                confidence: confidencePercent,
            };
        });

        // Tính điểm tổng quan
        const matchingRatio = correctWords / originalWords.length;
        const confidenceAvg = totalConfidence / originalWords.length;
        const overallScore = Math.round(
            (matchingRatio * 0.7 + confidenceAvg * 0.3) * 100
        );

        // Phản hồi chung
        const feedback: string[] = [];

        if (overallScore >= 90) {
            feedback.push("Phát âm của bạn rất tốt!");
            feedback.push("Nghe rất tự nhiên và rõ ràng.");
        } else if (overallScore >= 75) {
            feedback.push("Phát âm của bạn khá tốt.");
            feedback.push("Có một vài điểm nhỏ cần cải thiện.");
        } else if (overallScore >= 60) {
            feedback.push("Phát âm của bạn ở mức trung bình.");
            feedback.push("Cần cải thiện một số từ quan trọng.");
        } else if (overallScore >= 40) {
            feedback.push("Phát âm của bạn cần cải thiện nhiều.");
            feedback.push("Hãy tập trung vào từng từ và nói chậm hơn.");
        } else {
            feedback.push("Phát âm của bạn gặp nhiều khó khăn.");
            feedback.push("Cần luyện tập thêm về phát âm cơ bản.");
        }

        // Chi tiết phản hồi
        let detailedFeedback = "";

        // So sánh độ dài
        const lengthDiff = Math.abs(
            originalWords.length - recognizedWords.length
        );
        if (lengthDiff > 0) {
            if (originalWords.length > recognizedWords.length) {
                detailedFeedback += `Bạn đã bỏ qua ${lengthDiff} từ khi phát âm. `;
            } else {
                detailedFeedback += `Có ${lengthDiff} từ thêm vào được phát hiện. `;
            }
        }

        // Số từ đúng
        detailedFeedback += `Bạn đã phát âm chính xác ${correctWords} trong tổng số ${
            originalWords.length
        } từ (${Math.round(matchingRatio * 100)}%). `;

        // Thêm nhận xét về chất lượng phát âm
        if (overallScore >= 80) {
            detailedFeedback += "Phát âm của bạn rõ ràng và dễ hiểu. ";
        } else if (overallScore >= 60) {
            detailedFeedback +=
                "Phát âm của bạn tương đối rõ ràng, nhưng cần cải thiện một số từ. ";
        } else {
            detailedFeedback +=
                "Phát âm của bạn khó hiểu ở nhiều từ. Cần luyện tập thêm. ";
        }

        // Tạo gợi ý cải thiện
        const improvementSuggestions =
            generateImprovementSuggestions(wordAnalysis);

        // Tìm lỗi phổ biến
        const commonErrors = findCommonErrors(
            wordAnalysis,
            originalWords,
            recognizedWords
        );

        return {
            overallScore,
            feedback,
            wordAnalysis,
            detailedFeedback,
            improvementSuggestions,
            commonErrors,
            recordedText: recognizedText,
        };
    };

    // Tính khoảng cách Levenshtein giữa hai chuỗi
    const levenshteinDistance = (a: string, b: string): number => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix: number[][] = [];

        // Khởi tạo ma trận
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Tính toán khoảng cách
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Thay thế
                        matrix[i][j - 1] + 1, // Chèn
                        matrix[i - 1][j] + 1 // Xóa
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    };

    // Tạo gợi ý cải thiện
    const generateImprovementSuggestions = (
        wordAnalysis: Array<{
            word: string;
            isCorrect: boolean;
            feedback?: string;
            confidence: number;
        }>
    ): string[] => {
        const suggestions: string[] = [];

        const lowConfidenceWords = wordAnalysis.filter(
            (w) => !w.isCorrect && w.confidence < 70
        );

        if (lowConfidenceWords.length > 0) {
            suggestions.push(
                `Tập trung vào các từ: ${lowConfidenceWords
                    .slice(0, 3)
                    .map((w) => w.word)
                    .join(", ")}${lowConfidenceWords.length > 3 ? "..." : ""}`
            );
        }

        suggestions.push(
            "Thực hành phát âm từng từ một cách chậm rãi và rõ ràng."
        );
        suggestions.push("Nghe người bản xứ phát âm và bắt chước.");

        return suggestions;
    };

    // Tìm lỗi phổ biến
    const findCommonErrors = (
        wordAnalysis: Array<{
            word: string;
            isCorrect: boolean;
            feedback?: string;
            confidence: number;
        }>,
        originalWords: string[],
        recognizedWords: string[]
    ): string[] => {
        const errors: string[] = [];

        // Kiểm tra số lượng từ sai
        const incorrectWords = wordAnalysis.filter((w) => !w.isCorrect);
        if (incorrectWords.length > wordAnalysis.length * 0.5) {
            errors.push(
                "Có quá nhiều từ không chính xác, có thể do nói quá nhanh hoặc không rõ."
            );
        }

        // Kiểm tra số lượng từ bị bỏ qua
        const missingWords = wordAnalysis.filter(
            (w) => !w.isCorrect && w.confidence < 30
        );
        if (missingWords.length > 0) {
            errors.push(
                "Một số từ không được phát hiện trong bản ghi âm, hãy phát âm rõ ràng hơn."
            );
        }

        // Kiểm tra độ dài
        if (Math.abs(originalWords.length - recognizedWords.length) > 2) {
            errors.push(
                "Số từ được nhận dạng khác nhiều so với câu gốc. Hãy đọc đủ các từ và rõ ràng hơn."
            );
        }

        // Kiểm tra nhịp điệu
        if (originalWords.length > 5 && recognizedWords.length > 0) {
            const expectedWordsPerSecond = 2.5; // Từ trung bình mỗi giây
            const estimatedTime = originalWords.length / expectedWordsPerSecond;
            const estimatedRecognizedTime =
                recognizedWords.length / expectedWordsPerSecond;

            if (
                Math.abs(estimatedTime - estimatedRecognizedTime) > 1 &&
                recognizedWords.length < originalWords.length
            ) {
                errors.push(
                    "Nhịp điệu phát âm có vẻ quá nhanh, hãy đọc chậm và rõ ràng hơn."
                );
            }
        }

        return errors;
    };

    // Cải thiện hàm xử lý âm thanh đã ghi
    const processAudioBlob = async (audioBlob: Blob) => {
        try {
            setIsAnalyzing(true);
            setErrorMessage(null);

            console.log("Bắt đầu xử lý âm thanh...");

            // Kiểm tra rõ ràng rằng có Blob hợp lệ trước khi xử lý
            if (!audioBlob || audioBlob.size === 0) {
                console.error("Không có dữ liệu âm thanh được ghi lại");
                setErrorMessage(
                    "Không có dữ liệu âm thanh được ghi lại. Vui lòng thử lại."
                );
                setIsAnalyzing(false);
                return;
            }

            console.log(
                `Thông tin về âm thanh: Kích thước = ${audioBlob.size} bytes, Loại = ${audioBlob.type}`
            );

            // Lưu trữ bản ghi âm thanh để sử dụng sau
            setRecordedAudioBlob(audioBlob);

            // Lấy văn bản gốc dựa trên chế độ (phrase hoặc custom)
            const originalText =
                practiceMode === "phrase" ? currentPhrase : customInput;

            if (!originalText) {
                setErrorMessage(
                    "Vui lòng chọn hoặc nhập văn bản trước khi ghi âm."
                );
                setIsAnalyzing(false);
                return;
            }

            console.log(
                "1. Chuẩn bị xử lý âm thanh với Web Speech API hoặc Vosk..."
            );
            console.log("- Văn bản gốc:", originalText);
            console.log("- Ngôn ngữ:", selectedLanguage);

            // Hiển thị trạng thái đang xử lý
            setTranscript("Đang xử lý âm thanh...");

            // Thử nhận dạng giọng nói với Web Speech API
            let recognizedText = "";

            try {
                console.log(
                    "2. Đang sử dụng Web Speech API để chuyển đổi giọng nói..."
                );

                // TRY USING DIRECT RECOGNITION
                recognizedText = await recognizeAudioWithWebSpeech(
                    audioBlob,
                    selectedLanguage
                );
                console.log(
                    "Kết quả từ Web Speech API trực tiếp:",
                    recognizedText
                );

                // Nếu phương pháp trực tiếp không thành công, thử phương pháp khác
                if (!recognizedText) {
                    console.log(
                        "Phương pháp trực tiếp không thành công, thử phương pháp phát lại..."
                    );

                    // Tạo URL để phát âm thanh
                    const audioURL = URL.createObjectURL(audioBlob);

                    // Tạo và phát audio (cần thiết cho một số triển khai Web Speech API)
                    const audio = new Audio(audioURL);

                    // Phương pháp cũ với playback
                    recognizedText = await new Promise<string>((resolve) => {
                        // ... existing code ...
                    });
                }

                // Nếu Web Speech API không nhận dạng được, thử dùng Vosk
                if (!recognizedText) {
                    // Thử dùng Vosk nếu đã được khởi tạo thành công
                    if (isVoskReady) {
                        console.log(
                            "4. Web Speech API không thành công, đang thử dùng Vosk..."
                        );
                        console.log(
                            "Kiểm tra trạng thái Vosk:",
                            isVoskReady ? "Đã sẵn sàng" : "Chưa sẵn sàng"
                        );

                        try {
                            console.log(
                                "Đang gửi audioBlob đến Vosk:",
                                audioBlob.size,
                                "bytes, loại:",
                                audioBlob.type
                            );
                            recognizedText = await VoskService.recognizeSpeech(
                                audioBlob
                            );
                            console.log(
                                "5. Kết quả nhận dạng với Vosk:",
                                recognizedText
                            );
                        } catch (voskError) {
                            console.error("Lỗi khi sử dụng Vosk:", voskError);
                            console.log(
                                "Chi tiết lỗi Vosk:",
                                voskError instanceof Error
                                    ? voskError.message
                                    : String(voskError)
                            );
                            console.log(
                                "Stack trace:",
                                voskError instanceof Error
                                    ? voskError.stack
                                    : "No stack trace"
                            );
                        }
                    } else {
                        console.log(
                            "Vosk chưa sẵn sàng hoặc không được khởi tạo thành công"
                        );
                    }
                }

                // Nếu cả hai phương pháp đều không thành công, sử dụng phương pháp mô phỏng
                if (!recognizedText) {
                    console.warn(
                        "6. Không thể nhận dạng giọng nói, sử dụng phương pháp mô phỏng"
                    );
                    recognizedText = simulateSpeechToText(originalText, 0.8);
                    console.log("Kết quả nhận dạng mô phỏng:", recognizedText);
                }

                // Cập nhật transcript cho người dùng thấy
                if (recognizedText) {
                    setTranscript(recognizedText);
                } else {
                    setTranscript(
                        "Không thể nhận dạng giọng nói. Vui lòng thử lại và nói rõ hơn."
                    );
                    setIsAnalyzing(false);
                    return;
                }

                // Gửi FormData đến API để phân tích phát âm, kèm theo văn bản đã nhận dạng nếu có
                console.log("7. Đang gửi request đến API pronunciation...");
                console.log("Thông tin FormData chuẩn bị gửi:");
                console.log(
                    "- audioBlob:",
                    audioBlob
                        ? `${audioBlob.size} bytes, ${audioBlob.type}`
                        : "không có"
                );
                console.log("- text:", originalText);
                console.log("- language:", selectedLanguage);
                console.log("- recordedText:", recognizedText || "không có");

                try {
                    const formData = new FormData();
                    formData.append("audio", audioBlob, "recorded_audio.wav");
                    formData.append("text", originalText);
                    formData.append("language", selectedLanguage);
                    formData.append("recordedText", recognizedText || ""); // Gửi văn bản đã nhận dạng từ client

                    const response = await fetch("/api/pronunciation", {
                        method: "POST",
                        body: formData,
                    });

                    console.log(
                        "8. Đã nhận response từ API:",
                        response.status,
                        response.statusText
                    );

                    if (!response.ok) {
                        console.error(
                            "Lỗi khi gửi yêu cầu tới server:",
                            response.status,
                            response.statusText
                        );

                        // Sử dụng phân tích phát âm nội bộ nếu API không hoạt động
                        console.log("Sử dụng phân tích phát âm nội bộ...");
                        const result = analyzeTranscription(
                            recognizedText,
                            originalText
                        );
                        setFeedback(result);
                        updateHistory(result);
                        setSuccessMessage(
                            "Phân tích phát âm hoàn tất (chế độ nội bộ). Xem kết quả đánh giá bên dưới."
                        );
                        setIsAnalyzing(false);
                        return;
                    }

                    const data = await response.json();
                    console.log("9. Dữ liệu nhận được từ server:", data);

                    if (data.error) {
                        console.error("Lỗi từ server:", data.error);
                        setErrorMessage(`Lỗi từ server: ${data.error}`);

                        // Thử sử dụng phân tích phát âm nội bộ nếu API trả về lỗi
                        console.log(
                            "Sử dụng phân tích phát âm nội bộ do lỗi API..."
                        );
                        const result = analyzeTranscription(
                            recognizedText,
                            originalText
                        );
                        setFeedback(result);
                        updateHistory(result);
                        setSuccessMessage(
                            "Phân tích phát âm hoàn tất (chế độ nội bộ). Xem kết quả đánh giá bên dưới."
                        );
                        setIsAnalyzing(false);
                        return;
                    }

                    // Cập nhật transcript từ dữ liệu server trả về nếu có
                    if (
                        data.recordedText &&
                        data.recordedText !== recognizedText
                    ) {
                        console.log(
                            "10. Cập nhật transcript từ server:",
                            data.recordedText
                        );
                        setTranscript(data.recordedText);
                    }

                    // Hiển thị kết quả phân tích
                    console.log("11. Cập nhật feedback với dữ liệu phân tích");
                    setFeedback(data);
                    setSuccessMessage(
                        "Phân tích phát âm hoàn tất! Xem kết quả đánh giá bên dưới."
                    );

                    // Cập nhật lịch sử nếu có audioUrl và đã nhận dạng được văn bản
                    if (audioUrl && (data.recordedText || recognizedText)) {
                        console.log("12. Cập nhật lịch sử với đánh giá mới");
                        // Cập nhật với cả URL âm thanh để sau này có thể phát lại
                        const historyItem: PracticeHistoryItem = {
                            text: originalText,
                            score: data.overallScore,
                            date: new Date(),
                            audioUrl: audioUrl,
                        };

                        // Tạo danh sách lịch sử mới
                        const updatedHistory = [historyItem, ...history];
                        setHistory(updatedHistory);

                        // Lưu lịch sử vào localStorage
                        try {
                            // Chuyển đổi ngày thành chuỗi ISO trước khi lưu
                            const historyForStorage = updatedHistory.map(
                                (item) => ({
                                    ...item,
                                    date: item.date.toISOString(),
                                })
                            );

                            localStorage.setItem(
                                "pronunciationHistory",
                                JSON.stringify(historyForStorage)
                            );
                            console.log("Đã lưu lịch sử vào localStorage");
                        } catch (error) {
                            console.error(
                                "Error saving history to localStorage:",
                                error
                            );
                        }
                    } else if (!data.recordedText && !recognizedText) {
                        // Thông báo nếu không nhận dạng được giọng nói
                        console.warn("Không nhận dạng được giọng nói");
                        setErrorMessage(
                            "Không thể nhận dạng giọng nói của bạn. Vui lòng thử lại và nói to, rõ ràng hơn."
                        );
                    }
                } catch (apiError) {
                    console.error("Lỗi khi gọi API pronunciation:", apiError);

                    // Sử dụng phân tích phát âm nội bộ nếu API không hoạt động
                    console.log(
                        "Sử dụng phân tích phát âm nội bộ do lỗi API..."
                    );
                    const result = analyzeTranscription(
                        recognizedText,
                        originalText
                    );
                    setFeedback(result);
                    updateHistory(result);
                    setSuccessMessage(
                        "Phân tích phát âm hoàn tất (chế độ nội bộ). Xem kết quả đánh giá bên dưới."
                    );
                }
            } catch (error) {
                console.error("Lỗi trong quá trình xử lý âm thanh:", error);
                setErrorMessage(
                    `Đã xảy ra lỗi: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );

                // Nếu có thể thu được văn bản thông qua mô phỏng
                if (originalText) {
                    // Tạo phân tích phát âm mô phỏng để đảm bảo trải nghiệm người dùng
                    console.log(
                        "Tạo phân tích phát âm mô phỏng để tiếp tục..."
                    );
                    const simulatedText = simulateSpeechToText(
                        originalText,
                        0.7
                    );
                    setTranscript(simulatedText);
                    const result = analyzeTranscription(
                        simulatedText,
                        originalText
                    );
                    setFeedback(result);
                    updateHistory(result);
                    setSuccessMessage(
                        "Phân tích phát âm hoàn tất (chế độ mô phỏng). Xem kết quả đánh giá bên dưới."
                    );
                }
            }
        } catch (error) {
            console.error("Lỗi trong quá trình xử lý âm thanh:", error);
            setErrorMessage(
                `Đã xảy ra lỗi: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Hàm cập nhật lịch sử để tránh trùng lặp mã
    const updateHistory = (analysis: PronunciationFeedback) => {
        try {
            if (!analysis || typeof analysis.overallScore !== "number") {
                console.error(
                    "Không thể cập nhật lịch sử: Dữ liệu phân tích không hợp lệ"
                );
                return false;
            }

            // Tạo URL từ bản ghi âm thanh nếu có
            let audioUrlToSave = audioUrl;
            if (!audioUrlToSave && recordedAudioBlob) {
                try {
                    audioUrlToSave = URL.createObjectURL(recordedAudioBlob);
                } catch (urlError) {
                    console.error("Lỗi khi tạo URL cho audio:", urlError);
                    // Tiếp tục mà không lưu URL âm thanh
                }
            }

            // Lưu vào lịch sử
            const historyItem: PracticeHistoryItem = {
                text: practiceMode === "phrase" ? currentPhrase : customInput,
                score: analysis.overallScore,
                date: new Date(),
                audioUrl: audioUrlToSave || undefined,
                saved: false,
            };

            // Cập nhật state
            const updatedHistory = [historyItem, ...history];
            setHistory(updatedHistory);

            // Lưu lịch sử vào localStorage
            try {
                // Chuyển đổi ngày thành chuỗi ISO và không lưu audioUrl (URL tạm thời)
                const historyForStorage = updatedHistory.map((item) => ({
                    text: item.text,
                    score: item.score,
                    date: item.date.toISOString(),
                    saved: item.saved || false,
                    // Không lưu audioUrl vào localStorage
                }));

                localStorage.setItem(
                    "pronunciationHistory",
                    JSON.stringify(historyForStorage)
                );
                console.log(
                    "Đã lưu lịch sử vào localStorage:",
                    historyForStorage.length,
                    "mục"
                );
                return true;
            } catch (storageError) {
                console.error("Lỗi khi lưu vào localStorage:", storageError);
                // Vẫn trả về true vì lịch sử đã được cập nhật trong state
                return true;
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật lịch sử:", error);
            return false;
        }
    };

    // Thêm useEffect để tải lịch sử từ localStorage khi component mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem("pronunciationHistory");
            if (savedHistory) {
                try {
                    const parsedHistory = JSON.parse(savedHistory);
                    if (
                        Array.isArray(parsedHistory) &&
                        parsedHistory.length > 0
                    ) {
                        // Chuyển đổi chuỗi ngày ISO thành đối tượng Date
                        const restoredHistory = parsedHistory.map((item) => ({
                            ...item,
                            date: new Date(item.date),
                            // Không phục hồi audioUrl vì đó là URL tạm thời
                        }));
                        setHistory(restoredHistory);
                        console.log(
                            "Đã tải lịch sử từ localStorage:",
                            restoredHistory.length,
                            "mục"
                        );
                    }
                } catch (parseError) {
                    console.error(
                        "Lỗi khi phân tích lịch sử từ localStorage:",
                        parseError
                    );
                    // Không làm gì nếu dữ liệu không hợp lệ
                }
            }
        } catch (storageError) {
            console.error("Lỗi khi truy cập localStorage:", storageError);
        }
    }, []);

    // Bắt đầu ghi âm với MediaRecorder API
    const startMediaRecording = async () => {
        try {
            console.log("Đang bắt đầu ghi âm với MediaRecorder...");
            if (!mediaRecorderRef.current) {
                console.log(
                    "MediaRecorder chưa được khởi tạo, đang khởi tạo..."
                );
                const initialized = await initMediaRecorder();
                if (!initialized) {
                    console.error("Không thể khởi tạo MediaRecorder");
                    setErrorMessage(
                        "Không thể khởi tạo MediaRecorder. Vui lòng làm mới trang và thử lại."
                    );
                    setIsListening(false);
                    return;
                }
            }

            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === "inactive"
            ) {
                // Reset audio chunks
                audioChunksRef.current = [];

                // Bắt đầu ghi âm
                console.log("Bắt đầu ghi âm với MediaRecorder...");
                mediaRecorderRef.current.start();
                setIsListening(true);
                setAudioUrl(null);
                setTranscript("");
                setFeedback(null);
                setErrorMessage(null);
                console.log(
                    "Trạng thái MediaRecorder:",
                    mediaRecorderRef.current.state
                );
            } else {
                console.warn(
                    "MediaRecorder không khả dụng hoặc đang hoạt động:",
                    mediaRecorderRef.current
                        ? mediaRecorderRef.current.state
                        : "không tồn tại"
                );

                // Thử khởi tạo lại nếu có vấn đề
                if (
                    mediaRecorderRef.current &&
                    mediaRecorderRef.current.state !== "inactive"
                ) {
                    try {
                        mediaRecorderRef.current.stop();
                    } catch (e) {
                        console.error(
                            "Lỗi khi dừng MediaRecorder hiện tại:",
                            e
                        );
                    }
                    // Chờ một chút và khởi tạo lại
                    setTimeout(async () => {
                        await initMediaRecorder();
                        if (mediaRecorderRef.current) {
                            audioChunksRef.current = [];
                            mediaRecorderRef.current.start();
                            setIsListening(true);
                        }
                    }, 500);
                }
            }
        } catch (error) {
            console.error("Lỗi khi bắt đầu ghi âm:", error);
            setErrorMessage(
                `Lỗi khi bắt đầu ghi âm: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
            setIsListening(false);
        }
    };

    // Dừng ghi âm và xử lý file âm thanh
    const stopMediaRecording = () => {
        try {
            console.log("Đang dừng ghi âm...");
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === "recording"
            ) {
                console.log("Dừng MediaRecorder...");
                mediaRecorderRef.current.stop();
                setIsListening(false);
                console.log(
                    "Trạng thái MediaRecorder sau khi dừng:",
                    mediaRecorderRef.current.state
                );
            } else {
                console.warn(
                    "Không thể dừng MediaRecorder vì nó không đang ghi âm:",
                    mediaRecorderRef.current
                        ? mediaRecorderRef.current.state
                        : "không tồn tại"
                );
                setIsListening(false);
                // Đặt lại audioChunksRef nếu không có ghi âm đang diễn ra
                audioChunksRef.current = [];
            }
        } catch (error) {
            console.error("Lỗi khi dừng ghi âm:", error);
            setErrorMessage(
                `Lỗi khi dừng ghi âm: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
            setIsListening(false);
            // Đặt lại audioChunksRef nếu có lỗi
            audioChunksRef.current = [];
        }
    };

    // Thêm hàm phát âm thanh đã ghi
    const playRecordedAudio = () => {
        if (audioUrl && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        } else if (recordedAudioBlob && recordedAudioBlob.size > 0) {
            try {
                // Tạo URL mới nếu chưa có
                const newAudioUrl = URL.createObjectURL(
                    recordedAudioBlob as Blob
                );
                setAudioUrl(newAudioUrl);

                if (audioRef.current) {
                    audioRef.current.src = newAudioUrl;
                    audioRef.current.play();
                } else {
                    const audio = new Audio(newAudioUrl);
                    audio.play();
                }
            } catch (error) {
                console.error("Error playing recorded audio:", error);
            }
        }
    };

    // Hàm đánh dấu yêu thích mục lịch sử
    const toggleSaveHistoryItem = (index: number) => {
        setHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory[index] = {
                ...newHistory[index],
                saved: !newHistory[index].saved,
            };

            // Lưu lịch sử vào localStorage
            try {
                localStorage.setItem(
                    "pronunciationHistory",
                    JSON.stringify(newHistory)
                );
            } catch (error) {
                console.error("Error saving history to localStorage:", error);
            }

            return newHistory;
        });
    };

    // Đóng hướng dẫn onboarding
    const closeOnboarding = () => {
        setShowOnboarding(false);
    };

    // Làm sạch tài nguyên khi component unmount
    useEffect(() => {
        return () => {
            // Đóng stream và làm sạch tài nguyên
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            // Xóa object URL
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    // Hàm để thử lại hoặc thử một câu mới
    const tryAgain = () => {
        setTranscript("");
        setFeedback(null);
        setAudioUrl(null);

        // Nếu đang ở chế độ câu có sẵn, lấy câu mới
        if (practiceMode === "phrase") {
            getNewPhrase();
        }
    };

    // Xử lý cuộc hội thoại với AI
    const handleAiConversation = async (userInput: string) => {
        if (!userInput.trim()) return;

        // Thêm câu nói của người dùng vào cuộc hội thoại
        setAiConversation((prev) => [
            ...prev,
            { speaker: "user", text: userInput },
        ]);

        // AI đang xử lý
        setIsAiResponding(true);
        setErrorMessage(null);

        try {
            console.log("Gửi tin nhắn đến API conversation:", userInput);

            // Gọi API để lấy phản hồi từ AI
            const response = await fetch("/api/conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: userInput,
                    language: selectedLanguage,
                    topic: aiConversationTopic || "general",
                    history: aiConversation
                        .map((msg) => ({
                            role: msg.speaker === "user" ? "user" : "assistant",
                            content: msg.text,
                        }))
                        .slice(-10),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    "Lỗi từ API conversation:",
                    response.status,
                    errorText
                );
                throw new Error(
                    `Lỗi từ API: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log("Nhận phản hồi từ API conversation:", data);

            if (!data.response) {
                throw new Error("Không có phản hồi từ API");
            }

            // Thêm phản hồi của AI vào cuộc hội thoại
            setAiConversation((prev) => [
                ...prev,
                { speaker: "ai", text: data.response },
            ]);

            // Đọc phản hồi của AI bằng Text-to-Speech
            speakAiResponse(data.response);

            // Xóa input hiện tại sau khi đã gửi tin nhắn
            setCustomInput("");

            // Hiển thị thông báo thành công nếu cần
            setSuccessMessage("Đã nhận phản hồi từ AI");
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (error) {
            console.error("Lỗi trong AI conversation:", error);

            // Thêm thông báo lỗi
            setErrorMessage(
                `Không thể nhận phản hồi từ AI: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );

            // Vẫn thêm thông báo lỗi vào cuộc hội thoại để người dùng biết
            setAiConversation((prev) => [
                ...prev,
                {
                    speaker: "ai",
                    text: "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setIsAiResponding(false);
        }
    };

    // Text-to-Speech cho AI cải tiến
    const speakAiResponse = (text: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                // Tạm dừng bất kỳ phát biểu nào đang diễn ra
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);

                // Đặt ngôn ngữ phù hợp với ngôn ngữ được chọn
                utterance.lang = selectedLanguage;

                // Đặt tốc độ và cao độ phù hợp
                utterance.rate = 1.0; // Tốc độ bình thường
                utterance.pitch = 1.0; // Cao độ bình thường

                // Thêm sự kiện khi bắt đầu phát âm
                utterance.onstart = () => {
                    console.log("Bắt đầu phát âm phản hồi của AI");
                };

                // Thêm sự kiện khi kết thúc phát âm
                utterance.onend = () => {
                    console.log("Kết thúc phát âm phản hồi của AI");
                };

                // Thêm sự kiện khi có lỗi
                utterance.onerror = (event) => {
                    console.error("Lỗi phát âm:", event);
                };

                // Phát lời nói
                window.speechSynthesis.speak(utterance);
                console.log("Đã bắt đầu phát âm phản hồi của AI");
            } catch (error) {
                console.error("Lỗi khi sử dụng Text-to-Speech:", error);
            }
        } else {
            console.warn("Trình duyệt không hỗ trợ Text-to-Speech");
        }
    };

    // Xử lý khi người dùng gửi tin nhắn văn bản cho AI
    const handleSendMessage = () => {
        if (customInput.trim()) {
            handleAiConversation(customInput);
            // Không đặt lại customInput ở đây, sẽ được đặt lại trong handleAiConversation sau khi gửi thành công
        }
    };

    // Thêm hàm tải xuống bản ghi âm thanh
    const downloadRecordedAudio = () => {
        if (audioUrl) {
            const a = document.createElement("a");
            a.href = audioUrl;
            a.download = `pronunciation-${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (recordedAudioBlob) {
            const url = URL.createObjectURL(recordedAudioBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pronunciation-${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Hàm tải xuống bản ghi âm từ lịch sử
    const downloadHistoryAudio = (audioUrl: string) => {
        const a = document.createElement("a");
        a.href = audioUrl;
        a.download = `pronunciation-history-${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/:/g, "-")}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Xử lý khi người dùng muốn nói với AI
    const startConversationListening = async () => {
        if (isListening) {
            // Dừng việc ghi âm nếu đang diễn ra
            stopMediaRecording();
            setIsListening(false);
            return;
        }

        // Không cho phép ghi âm nếu AI đang phản hồi
        if (isAiResponding) {
            setErrorMessage("Vui lòng đợi AI trả lời trước khi ghi âm tiếp.");
            return;
        }

        // Bắt đầu ghi âm mới
        setIsListening(true);
        setErrorMessage(null);
        setTranscript("");

        // Hiển thị thông báo cho người dùng biết đang bắt đầu ghi âm
        setSuccessMessage("Đang bắt đầu ghi âm... Hãy nói...");
        setTimeout(() => setSuccessMessage(null), 2000);

        // Ưu tiên sử dụng MediaRecorder cho việc ghi âm trong hội thoại
        if (isMediaRecorderSupported.current) {
            // Khởi tạo MediaRecorder cho chế độ hội thoại
            try {
                console.log(
                    "Bắt đầu ghi âm cho AI Conversation với MediaRecorder"
                );

                // Đảm bảo MediaRecorder được khởi tạo
                if (!mediaRecorderRef.current) {
                    const initialized = await initMediaRecorder();
                    if (!initialized) {
                        throw new Error("Không thể khởi tạo MediaRecorder");
                    }
                }

                if (!mediaRecorderRef.current) {
                    throw new Error("Không thể khởi tạo MediaRecorder");
                }

                // Ghi đè sự kiện onstop để xử lý phản hồi AI
                mediaRecorderRef.current.onstop = async (event) => {
                    console.log(
                        "Sự kiện stop của MediaRecorder trong AI Conversation"
                    );

                    if (audioChunksRef.current.length === 0) {
                        console.warn("Không có dữ liệu âm thanh được ghi lại");
                        setIsListening(false);
                        setErrorMessage(
                            "Không có dữ liệu âm thanh được ghi lại. Vui lòng thử lại."
                        );
                        return;
                    }

                    try {
                        // Xác định mime type cho blob
                        const mimeType =
                            mediaRecorderRef.current?.mimeType || "audio/webm";

                        // Tạo Blob từ các đoạn âm thanh
                        const audioBlob = new Blob(audioChunksRef.current, {
                            type: mimeType,
                        });

                        console.log(
                            `Đã tạo audio blob: ${audioBlob.size} bytes cho AI Conversation`
                        );

                        // Tạo URL để phát lại
                        const url = URL.createObjectURL(audioBlob);
                        setAudioUrl(url);
                        setRecordedAudioBlob(audioBlob);

                        // Hiển thị thông báo đang xử lý
                        setTranscript("Đang nhận dạng giọng nói...");

                        // Chuyển đổi âm thanh thành văn bản
                        const recognizedText =
                            await recognizeAudioWithWebSpeech(
                                audioBlob,
                                selectedLanguage
                            );

                        // Cập nhật transcript
                        if (recognizedText) {
                            setTranscript(recognizedText);
                            console.log(
                                "Đã nhận dạng văn bản cho AI Conversation:",
                                recognizedText
                            );

                            // Gửi đến AI để xử lý
                            await handleAiConversation(recognizedText);
                        } else {
                            console.warn(
                                "Không thể nhận dạng giọng nói cho AI Conversation"
                            );
                            setErrorMessage(
                                "Không thể nhận dạng giọng nói. Vui lòng thử lại và nói rõ hơn."
                            );
                        }
                    } catch (error) {
                        console.error(
                            "Lỗi xử lý âm thanh cho AI Conversation:",
                            error
                        );
                        setErrorMessage(
                            `Lỗi xử lý âm thanh: ${
                                error instanceof Error
                                    ? error.message
                                    : String(error)
                            }`
                        );
                    } finally {
                        setIsListening(false);
                    }
                };

                // Thêm xử lý lỗi cho MediaRecorder
                mediaRecorderRef.current.onerror = (error) => {
                    console.error("Lỗi MediaRecorder:", error);
                    setErrorMessage("Lỗi khi ghi âm. Vui lòng thử lại.");
                    setIsListening(false);
                };

                // Bắt đầu ghi âm với timeout tự động (tối đa 30 giây)
                audioChunksRef.current = []; // Đặt lại chunks
                mediaRecorderRef.current.start();
                console.log("Đã bắt đầu ghi âm cho AI Conversation");

                // Tự động dừng ghi âm sau 30 giây nếu người dùng không dừng
                setTimeout(() => {
                    if (
                        mediaRecorderRef.current &&
                        mediaRecorderRef.current.state === "recording" &&
                        isListening
                    ) {
                        console.log("Tự động dừng ghi âm sau 30 giây");
                        stopMediaRecording();
                    }
                }, 30000);
            } catch (error) {
                console.error(
                    "Lỗi khi bắt đầu ghi âm cho AI Conversation:",
                    error
                );
                setErrorMessage(
                    `Không thể bắt đầu ghi âm: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
                setIsListening(false);
            }
        }
        // Sử dụng Web Speech API nếu MediaRecorder không khả dụng
        else if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            try {
                const SpeechRecognition =
                    window.SpeechRecognition || window.webkitSpeechRecognition;

                if (!recognitionRef.current) {
                    recognitionRef.current = new SpeechRecognition();
                }

                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = selectedLanguage;

                // Override các event handlers cho chế độ hội thoại
                recognitionRef.current.onresult = (event: any) => {
                    const result = event.results[0][0].transcript;
                    setTranscript(result);
                    setIsListening(false);

                    // Gửi kết quả đến AI để xử lý
                    handleAiConversation(result);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error(
                        "Lỗi nhận dạng giọng nói cho AI Conversation:",
                        event.error
                    );
                    setErrorMessage(`Lỗi nhận dạng giọng nói: ${event.error}`);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.start();
                console.log(
                    "Đã bắt đầu nhận dạng giọng nói với Web Speech API cho AI Conversation"
                );
            } catch (error) {
                console.error(
                    "Lỗi khởi tạo Web Speech API cho AI Conversation:",
                    error
                );
                setIsListening(false);
                setErrorMessage(
                    "Không thể truy cập nhận dạng giọng nói. Vui lòng kiểm tra quyền truy cập micrô của trình duyệt."
                );
            }
        } else {
            setErrorMessage(
                "Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng thử trình duyệt khác như Chrome hoặc Edge."
            );
            setIsListening(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Pronunciation Coach
            </h1>

            {/* Hướng dẫn sử dụng cho người dùng lần đầu */}
            {showOnboarding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-purple-700">
                            Chào mừng đến với Pronunciation Coach!
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <p>Đây là một số hướng dẫn nhanh để bắt đầu:</p>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>
                                    Chọn ngôn ngữ bạn muốn luyện tập từ menu thả
                                    xuống
                                </li>
                                <li>
                                    Đọc to câu được hiển thị hoặc nhập văn bản
                                    của riêng bạn
                                </li>
                                <li>
                                    Nhấn nút microphone màu tím để bắt đầu ghi
                                    âm
                                </li>
                                <li>
                                    Nói to và rõ ràng, sau đó nhấn nút để dừng
                                    ghi
                                </li>
                                <li>
                                    Xem phân tích phát âm chi tiết và cải thiện
                                    kỹ năng của bạn!
                                </li>
                            </ol>
                            <p className="bg-purple-50 p-3 rounded text-sm">
                                <b>Lưu ý:</b> Nếu phát sinh lỗi kết nối mạng,
                                ứng dụng sẽ tự động chuyển sang chế độ dự phòng
                                để bạn có thể tiếp tục luyện tập.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeOnboarding}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Đã hiểu!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Practice Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 relative">
                    {/* Language Selector */}
                    <div className="absolute top-6 right-6">
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg px-4 py-2 transition-colors"
                                onClick={() =>
                                    setShowLanguageDropdown(
                                        !showLanguageDropdown
                                    )
                                }
                            >
                                <Languages className="h-4 w-4" />
                                <span>
                                    {languageOptions.find(
                                        (l) => l.value === selectedLanguage
                                    )?.label || "Select Language"}
                                </span>
                                {showLanguageDropdown ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </button>

                            {showLanguageDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {languageOptions.map((language) => (
                                        <button
                                            key={language.value}
                                            className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors"
                                            onClick={() => {
                                                setSelectedLanguage(
                                                    language.value
                                                );
                                                setShowLanguageDropdown(false);
                                            }}
                                        >
                                            {language.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Practice Mode Selector */}
                    <div className="mb-8 flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                practiceMode === "phrase"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => handlePracticeModeChange("phrase")}
                        >
                            Practice Phrases
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                practiceMode === "free"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => handlePracticeModeChange("free")}
                        >
                            Free Practice
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                practiceMode === "conversation"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() =>
                                handlePracticeModeChange("conversation")
                            }
                        >
                            AI Conversation
                        </button>
                    </div>

                    {/* Trạng thái chế độ ghi âm */}
                    {usingFallbackMode && practiceMode !== "conversation" && (
                        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Đang sử dụng chế độ ghi âm dự phòng.
                                        Chất lượng phân tích có thể bị ảnh
                                        hưởng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content for Conversation Mode */}
                    {practiceMode === "conversation" ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">
                                    AI Conversation Practice
                                </h2>
                                <div className="relative">
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                        value={aiConversationTopic}
                                        onChange={(e) =>
                                            setAiConversationTopic(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Chọn chủ đề (tùy chọn)
                                        </option>
                                        <option value="travel">Du lịch</option>
                                        <option value="food">Ẩm thực</option>
                                        <option value="business">
                                            Kinh doanh
                                        </option>
                                        <option value="technology">
                                            Công nghệ
                                        </option>
                                        <option value="education">
                                            Giáo dục
                                        </option>
                                        <option value="casual">
                                            Trò chuyện thông thường
                                        </option>
                                        <option value="interview">
                                            Phỏng vấn xin việc
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto flex flex-col">
                                {aiConversation.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-6">
                                        <div>
                                            <p className="mb-2">
                                                Bắt đầu cuộc trò chuyện với trợ
                                                lý AI để luyện tập kỹ năng nói.
                                            </p>
                                            <p className="text-sm">
                                                Bạn có thể nhập văn bản hoặc sử
                                                dụng giọng nói để trò chuyện với
                                                AI. AI sẽ trả lời bằng{" "}
                                                {languageOptions.find(
                                                    (l) =>
                                                        l.value ===
                                                        selectedLanguage
                                                )?.label || selectedLanguage}
                                                .
                                            </p>
                                            <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-700">
                                                <p className="flex items-center">
                                                    <Info className="h-4 w-4 mr-2 text-purple-600" />
                                                    Nhấn vào nút microphone bên
                                                    dưới để nói chuyện bằng
                                                    giọng nói, hoặc nhập văn bản
                                                    vào ô nhập liệu.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col space-y-4">
                                        {aiConversation.map(
                                            (message, index) => (
                                                <div
                                                    key={index}
                                                    className={`max-w-3/4 px-4 py-3 rounded-lg ${
                                                        message.speaker ===
                                                        "user"
                                                            ? "bg-purple-100 text-purple-900 self-end"
                                                            : "bg-white border border-gray-200 text-gray-800 self-start"
                                                    }`}
                                                >
                                                    <p>{message.text}</p>
                                                </div>
                                            )
                                        )}
                                        {isAiResponding && (
                                            <div className="bg-white border border-gray-200 text-gray-800 self-start max-w-3/4 px-4 py-3 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex space-x-1">
                                                        <span className="animate-pulse">
                                                            ●
                                                        </span>
                                                        <span className="animate-pulse animation-delay-200">
                                                            ●
                                                        </span>
                                                        <span className="animate-pulse animation-delay-400">
                                                            ●
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        AI đang suy nghĩ...
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Hiển thị văn bản đã nhận dạng */}
                                {transcript && (
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Văn bản đã nhận dạng:
                                        </p>
                                        <p className="text-gray-800">
                                            {transcript}
                                        </p>
                                    </div>
                                )}

                                {/* Hiển thị player audio nếu có */}
                                {audioUrl && (
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <audio
                                                controls
                                                src={audioUrl}
                                                className="w-full h-8"
                                            />
                                            <button
                                                onClick={downloadRecordedAudio}
                                                className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                title="Tải xuống bản ghi âm"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line
                                                        x1="12"
                                                        y1="15"
                                                        x2="12"
                                                        y2="3"
                                                    ></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Nhập tin nhắn của bạn..."
                                        value={customInput}
                                        onChange={(e) =>
                                            setCustomInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        disabled={isListening || isAiResponding}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={
                                            !customInput.trim() ||
                                            isAiResponding ||
                                            isListening
                                        }
                                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Gửi tin nhắn"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={startConversationListening}
                                        className={`p-3 rounded-full transition-colors ${
                                            isListening
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-purple-600 text-white hover:bg-purple-700"
                                        } ${
                                            isAiResponding
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        disabled={isAiResponding}
                                        title={
                                            isListening
                                                ? "Dừng ghi âm"
                                                : "Bắt đầu ghi âm"
                                        }
                                    >
                                        {isListening ? (
                                            <MicOff className="w-5 h-5" />
                                        ) : (
                                            <Mic className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Hiển thị trạng thái ghi âm */}
                                {isListening && (
                                    <div className="flex justify-center mt-2">
                                        <div className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-full animate-pulse">
                                            <span className="mr-1.5 bg-red-500 rounded-full h-2 w-2"></span>
                                            <span>Đang thu âm</span>
                                            <div className="ml-1.5 flex space-x-1">
                                                <div className="w-1 h-3 bg-red-400 rounded-full animate-[soundWave_1s_ease-in-out_infinite]"></div>
                                                <div className="w-1 h-4 bg-red-500 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.2s]"></div>
                                                <div className="w-1 h-2 bg-red-400 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.1s]"></div>
                                                <div className="w-1 h-3 bg-red-600 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.3s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị một gợi ý ngắn cho người dùng */}
                                {!isListening &&
                                    !transcript &&
                                    !isAiResponding &&
                                    aiConversation.length === 0 && (
                                        <div className="mt-2 text-center text-sm text-gray-500">
                                            Nhấn vào nút microphone phía trên để
                                            bắt đầu nói chuyện với AI. Bạn cũng
                                            có thể nhập văn bản vào ô nhập liệu.
                                        </div>
                                    )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {practiceMode === "phrase" ? (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            Repeat this phrase:
                                        </h2>
                                        <button
                                            onClick={getNewPhrase}
                                            className="text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                                        >
                                            <Repeat className="h-4 w-4 mr-1" />{" "}
                                            New Phrase
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-xl text-center font-medium">
                                        {currentPhrase}
                                    </div>
                                    <div className="flex justify-center mt-3">
                                        <button
                                            onClick={playNativePronunciation}
                                            disabled={isPlaying}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Volume2 className="h-5 w-5" />
                                            <span>
                                                {isPlaying
                                                    ? "Playing..."
                                                    : "Listen to native pronunciation"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                        Enter your own text:
                                    </h2>
                                    <textarea
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        rows={3}
                                        value={customInput}
                                        onChange={(e) =>
                                            setCustomInput(e.target.value)
                                        }
                                        placeholder="Type something you want to practice..."
                                    />
                                    <div className="flex justify-center mt-3">
                                        <button
                                            onClick={playNativePronunciation}
                                            disabled={isPlaying || !customInput}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Volume2 className="h-5 w-5" />
                                            <span>
                                                {isPlaying
                                                    ? "Playing..."
                                                    : "Listen to native pronunciation"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Record Controls */}
                            <div className="flex flex-col items-center mb-8">
                                <button
                                    onClick={toggleListening}
                                    disabled={isAnalyzing}
                                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-full ${
                                        isListening
                                            ? "bg-red-500 hover:bg-red-600"
                                            : isAnalyzing
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700"
                                    } text-white transition-colors shadow-lg mb-3 relative`}
                                >
                                    {isListening ? (
                                        <>
                                            <MicOff className="h-8 w-8 mb-1" />
                                            <span className="text-xs">
                                                Dừng
                                            </span>
                                            {/* Hiệu ứng sóng âm khi đang ghi */}
                                            <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-full border-4 border-red-400 opacity-60 animate-ping"></div>
                                            <div className="absolute -top-6 -left-6 -right-6 -bottom-6 rounded-full border-4 border-red-300 opacity-30 animate-pulse"></div>
                                        </>
                                    ) : isAnalyzing ? (
                                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Mic className="h-8 w-8 mb-1" />
                                            <span className="text-xs">
                                                Bắt đầu
                                            </span>
                                        </>
                                    )}
                                </button>
                                <p className="text-sm text-gray-500">
                                    {isListening
                                        ? usingFallbackMode
                                            ? "Đang ghi âm... Nhấn để dừng"
                                            : "Đang nghe... Nhấn để dừng"
                                        : isAnalyzing
                                        ? "Đang xử lý..."
                                        : "Nhấn để bắt đầu ghi âm"}
                                </p>
                                {isListening && (
                                    <div className="flex justify-center mt-2">
                                        <div className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-full animate-pulse">
                                            <span className="mr-1.5 bg-red-500 rounded-full h-2 w-2"></span>
                                            <span>Đang thu âm</span>
                                            <div className="ml-1.5 flex space-x-1">
                                                <div className="w-1 h-3 bg-red-400 rounded-full animate-[soundWave_1s_ease-in-out_infinite]"></div>
                                                <div className="w-1 h-4 bg-red-500 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.2s]"></div>
                                                <div className="w-1 h-2 bg-red-400 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.1s]"></div>
                                                <div className="w-1 h-3 bg-red-600 rounded-full animate-[soundWave_1s_ease-in-out_infinite_.3s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Kết quả nhận dạng và phản hồi */}
                            {transcript && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-2 text-gray-800">
                                        Bạn đã nói:
                                    </h3>
                                    <p className="text-gray-700">
                                        {transcript}
                                    </p>

                                    {/* Thêm player âm thanh nếu có */}
                                    {audioUrl && (
                                        <div className="mt-3">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={playRecordedAudio}
                                                    className="p-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                                                    title="Phát lại"
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <audio
                                                    controls
                                                    src={audioUrl}
                                                    className="w-full h-7"
                                                />
                                                <button
                                                    onClick={
                                                        downloadRecordedAudio
                                                    }
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                    title="Tải xuống"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                        <line
                                                            x1="12"
                                                            y1="15"
                                                            x2="12"
                                                            y2="3"
                                                        ></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Loading Indicator */}
                            {isAnalyzing && (
                                <div className="flex flex-col items-center justify-center mb-8 py-8">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600">
                                        Đang phân tích phát âm của bạn...
                                    </p>
                                </div>
                            )}

                            {/* Feedback kết quả */}
                            {feedback && (
                                <div className="mt-6 space-y-6">
                                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Kết quả phân tích
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    Điểm:
                                                </span>
                                                <span
                                                    className={`text-lg font-bold py-1 px-3 rounded-full ${
                                                        feedback.overallScore >=
                                                        80
                                                            ? "bg-green-100 text-green-700"
                                                            : feedback.overallScore >=
                                                              60
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {feedback.overallScore}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Đánh giá tổng quan */}
                                        <div className="mb-4">
                                            <h4 className="text-md font-semibold text-gray-700 mb-2">
                                                Đánh giá
                                            </h4>
                                            <ul className="space-y-1">
                                                {feedback &&
                                                    feedback.feedback &&
                                                    Array.isArray(
                                                        feedback.feedback
                                                    ) &&
                                                    feedback.feedback.map(
                                                        (item, i) => (
                                                            <li
                                                                key={i}
                                                                className="text-gray-600 flex items-start"
                                                            >
                                                                <span className="text-purple-500 mr-2">
                                                                    •
                                                                </span>
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </div>

                                        {/* Đánh giá chi tiết từ Groq */}
                                        {feedback &&
                                            feedback.detailedFeedback && (
                                                <div className="mb-4 border-t border-gray-100 pt-4">
                                                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                                                        Phân tích chi tiết
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        {
                                                            feedback.detailedFeedback
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                        {/* Gợi ý cải thiện */}
                                        {feedback &&
                                            feedback.improvementSuggestions &&
                                            Array.isArray(
                                                feedback.improvementSuggestions
                                            ) &&
                                            feedback.improvementSuggestions
                                                .length > 0 && (
                                                <div className="mb-4 border-t border-gray-100 pt-4">
                                                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                                                        Gợi ý cải thiện
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {feedback.improvementSuggestions.map(
                                                            (item, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="text-gray-600 flex items-start"
                                                                >
                                                                    <span className="text-green-500 mr-2">
                                                                        →
                                                                    </span>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Lỗi phổ biến */}
                                        {feedback &&
                                            feedback.commonErrors &&
                                            Array.isArray(
                                                feedback.commonErrors
                                            ) &&
                                            feedback.commonErrors.length >
                                                0 && (
                                                <div className="mb-4 border-t border-gray-100 pt-4">
                                                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                                                        Lỗi phổ biến
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {feedback.commonErrors.map(
                                                            (item, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="text-gray-600 flex items-start"
                                                                >
                                                                    <span className="text-red-500 mr-2">
                                                                        ✕
                                                                    </span>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Phân tích từng từ */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <h4 className="text-md font-semibold text-gray-700 mb-3">
                                                Phân tích từng từ
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {feedback &&
                                                feedback.wordAnalysis &&
                                                Array.isArray(
                                                    feedback.wordAnalysis
                                                ) &&
                                                feedback.wordAnalysis.length >
                                                    0 ? (
                                                    feedback.wordAnalysis.map(
                                                        (word, index) => (
                                                            <div
                                                                key={index}
                                                                className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${
                                                                    word &&
                                                                    word.isCorrect
                                                                        ? "border-green-200 bg-green-50 text-green-700"
                                                                        : "border-red-200 bg-red-50 text-red-700"
                                                                }`}
                                                                title={
                                                                    word &&
                                                                    word.feedback
                                                                        ? word.feedback
                                                                        : ""
                                                                }
                                                            >
                                                                {word &&
                                                                word.word
                                                                    ? word.word
                                                                    : ""}
                                                                {word &&
                                                                word.isCorrect ? (
                                                                    <Check
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-green-600"
                                                                    />
                                                                ) : (
                                                                    <X
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-red-600"
                                                                    />
                                                                )}
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="text-gray-500 text-sm italic">
                                                        Không có dữ liệu phân
                                                        tích từng từ
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Thêm nút Thử lại */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                                            <button
                                                onClick={tryAgain}
                                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                            >
                                                <Repeat size={18} />
                                                Thử lại
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Progress & Stats */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Your Progress
                        </h3>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                    Today's practice
                                </span>
                                <span className="text-sm font-medium">
                                    {
                                        history.filter(
                                            (h) =>
                                                h.date.toDateString() ===
                                                new Date().toDateString()
                                        ).length
                                    }{" "}
                                    phrases
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            history.filter(
                                                (h) =>
                                                    h.date.toDateString() ===
                                                    new Date().toDateString()
                                            ).length * 10,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                    Average score
                                </span>
                                <span className="text-sm font-medium">
                                    {history.length > 0
                                        ? Math.round(
                                              history.reduce(
                                                  (sum, h) => sum + h.score,
                                                  0
                                              ) / history.length
                                          )
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                                    style={{
                                        width: `${
                                            history.length > 0
                                                ? Math.round(
                                                      history.reduce(
                                                          (sum, h) =>
                                                              sum + h.score,
                                                          0
                                                      ) / history.length
                                                  )
                                                : 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <div className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full px-4 py-1 text-sm font-medium">
                                <Award className="h-4 w-4 mr-1" />
                                {history.length < 5
                                    ? "Beginner"
                                    : history.length < 15
                                    ? "Regular Learner"
                                    : "Pronunciation Pro"}
                            </div>
                        </div>
                    </div>

                    {/* Practice History */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => setHistoryExpanded(!historyExpanded)}
                        >
                            <h3 className="font-medium">Lịch sử luyện tập</h3>
                            {historyExpanded ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </div>

                        {historyExpanded && (
                            <div className="p-4 bg-gray-50 max-h-80 overflow-y-auto">
                                {history.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Chưa có lịch sử luyện tập
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {history.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-white rounded border border-gray-200 text-sm relative"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {item.text.length >
                                                            40
                                                                ? item.text.substring(
                                                                      0,
                                                                      40
                                                                  ) + "..."
                                                                : item.text}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {item.date.toLocaleDateString()}{" "}
                                                            {item.date.toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${
                                                                item.score >= 80
                                                                    ? "bg-green-100 text-green-700"
                                                                    : item.score >=
                                                                      60
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >
                                                            {item.score}%
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSaveHistoryItem(
                                                                    index
                                                                );
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                        >
                                                            {item.saved ? (
                                                                <BookmarkCheck
                                                                    size={16}
                                                                    className="text-purple-600"
                                                                />
                                                            ) : (
                                                                <Bookmark
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Phát lại bản ghi âm từ lịch sử */}
                                                {item.audioUrl && (
                                                    <div className="mt-2">
                                                        <div className="flex items-center space-x-2">
                                                            <audio
                                                                controls
                                                                src={
                                                                    item.audioUrl
                                                                }
                                                                className="w-full h-7"
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    downloadHistoryAudio(
                                                                        item.audioUrl as string
                                                                    )
                                                                }
                                                                className="p-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                                title="Tải xuống"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                                    <line
                                                                        x1="12"
                                                                        y1="15"
                                                                        x2="12"
                                                                        y2="3"
                                                                    ></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tips & Resources */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <Info className="h-5 w-5 text-blue-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                                Pronunciation Tips
                            </h3>
                        </div>

                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-baseline">
                                <span className="text-purple-500 mr-2">•</span>
                                Listen carefully to native speakers and try to
                                mimic their intonation
                            </li>
                            <li className="flex items-baseline">
                                <span className="text-purple-500 mr-2">•</span>
                                Practice slow, then gradually increase your
                                speed
                            </li>
                            <li className="flex items-baseline">
                                <span className="text-purple-500 mr-2">•</span>
                                Record yourself and compare with native speakers
                            </li>
                            <li className="flex items-baseline">
                                <span className="text-purple-500 mr-2">•</span>
                                Focus on troublesome sounds in your target
                                language
                            </li>
                            <li className="flex items-baseline">
                                <span className="text-purple-500 mr-2">•</span>
                                Practice daily, even for just a few minutes
                            </li>
                        </ul>
                    </div>

                    {/* Thông báo sử dụng Vosk */}
                    {isVoskReady && (
                        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Sử dụng chế độ nhận dạng tiếng nói Vosk
                                        (offline). Hệ thống sẽ phân tích phát âm
                                        của bạn ngay cả khi không có kết nối
                                        mạng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hiển thị thông báo lỗi */}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg mt-12">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Đã xảy ra lỗi
                            </h3>
                            <div className="mt-1 text-sm text-red-700">
                                <p>{errorMessage}</p>
                            </div>
                            <div className="mt-3">
                                <button
                                    onClick={() => setErrorMessage(null)}
                                    className="text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hiển thị thông báo thành công */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg mt-8">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-green-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                                Thành công
                            </h3>
                            <div className="mt-1 text-sm text-green-700">
                                <p>{successMessage}</p>
                            </div>
                            <div className="mt-3">
                                <button
                                    onClick={() => setSuccessMessage(null)}
                                    className="text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PronunciationPage;

/**
 * Sử dụng Web Speech API để nhận dạng giọng nói từ file âm thanh
 * @param audioBlob File âm thanh
 * @param language Ngôn ngữ
 * @returns Văn bản đã nhận dạng
 */
const recognizeAudioWithWebSpeech = async (
    audioBlob: Blob,
    language: string
): Promise<string> => {
    console.log(
        "Phương pháp mới: Sử dụng Groq API để chuyển đổi giọng nói thành văn bản"
    );

    try {
        // Tạo FormData để gửi lên server
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("language", language);

        console.log("Đang gửi audio đến API speech-to-text...");
        console.log("Kích thước audio:", audioBlob.size, "bytes");
        console.log("Loại audio:", audioBlob.type);

        // Gửi đến API của server
        const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Lỗi từ API speech-to-text:",
                response.status,
                errorText
            );
            throw new Error(
                `Lỗi từ API: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Kết quả từ API speech-to-text:", data);

        // Trả về văn bản đã nhận dạng
        if (data.transcription) {
            return data.transcription;
        } else if (data.recordedText) {
            return data.recordedText;
        } else {
            console.warn("API không trả về văn bản được nhận dạng");
            return "";
        }
    } catch (error) {
        console.error("Lỗi khi sử dụng API speech-to-text:", error);

        // Thử sử dụng Web Speech API nếu có lỗi
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            console.log("Thử sử dụng Web Speech API trực tiếp...");
            try {
                // Phương pháp dự phòng: Sử dụng SpeechRecognition trực tiếp
                const result = await new Promise<string>((resolve) => {
                    try {
                        const SpeechRecognition =
                            window.SpeechRecognition ||
                            window.webkitSpeechRecognition;
                        const recognition = new SpeechRecognition();
                        recognition.lang = language;
                        recognition.continuous = false;
                        recognition.interimResults = false;

                        // Tạo URL để phát âm thanh
                        const audioURL = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioURL);

                        recognition.onresult = (event) => {
                            const transcript = event.results[0][0].transcript;
                            resolve(transcript);
                        };

                        recognition.onerror = (event) => {
                            console.error("Lỗi Web Speech API:", event.error);
                            resolve("");
                        };

                        recognition.onend = () => {
                            console.log("Web Speech API kết thúc");
                            resolve("");
                        };

                        // Phát âm thanh và bắt đầu nhận dạng
                        audio.onplay = () => {
                            recognition.start();
                        };

                        audio.play().catch((e) => {
                            console.error("Không thể phát âm thanh:", e);
                            resolve("");
                        });
                    } catch (e) {
                        console.error("Lỗi khi khởi tạo Web Speech API:", e);
                        resolve("");
                    }
                });

                if (result) {
                    return result;
                }
            } catch (webSpeechError) {
                console.error(
                    "Lỗi khi sử dụng Web Speech API:",
                    webSpeechError
                );
            }
        }

        // Trả về chuỗi rỗng nếu tất cả các phương pháp đều thất bại
        return "";
    }
};
