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
    const [practiceMode, setPracticeMode] = useState<"phrase" | "free">(
        "phrase"
    );
    const [customInput, setCustomInput] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [usingFallbackMode, setUsingFallbackMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

    const getNewPhrase = () => {
        const phrases =
            practicePhrases[selectedLanguage] || practicePhrases["en-US"];
        let newPhrase;
        do {
            newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        } while (newPhrase === currentPhrase && phrases.length > 1);

        setCurrentPhrase(newPhrase);
        setTranscript("");
        setFeedback(null);
    };

    // Khởi tạo MediaRecorder với cấu hình chất lượng cao
    const initMediaRecorder = async () => {
        try {
            console.log("Đang khởi tạo MediaRecorder...");

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

            // Tạo MediaRecorder với stream và các tùy chọn
            console.log("Đang tạo MediaRecorder...");
            const recorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });

            // Xử lý sự kiện khi có dữ liệu sẵn sàng
            recorder.ondataavailable = (event) => {
                console.log(
                    "Sự kiện dataavailable được kích hoạt:",
                    event.data.size,
                    "bytes"
                );
                if (event.data.size > 0) {
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
                        type: "audio/webm",
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
        const originalWords = originalText.toLowerCase().split(/\s+/);
        const recognizedWords = recognizedText.toLowerCase().split(/\s+/);

        // Tính điểm tổng quan dựa trên số từ chính xác
        let correctWords = 0;

        // Phân tích từng từ
        const wordAnalysis = originalWords.map((originalWord, index) => {
            let isCorrect = false;
            let feedback = "";
            let confidence = 0;

            // Tìm từ trong chuỗi nhận dạng
            const matchingWord = recognizedWords.find(
                (word) =>
                    word === originalWord ||
                    levenshteinDistance(word, originalWord) <=
                        Math.ceil(originalWord.length * 0.3)
            );

            if (matchingWord) {
                const distance = levenshteinDistance(
                    matchingWord,
                    originalWord
                );

                // Tính độ tin cậy dựa trên khoảng cách Levenshtein
                const maxDistance = originalWord.length;
                confidence = Math.max(0, 100 - (distance / maxDistance) * 100);

                if (distance === 0) {
                    // Từ hoàn toàn chính xác
                    isCorrect = true;
                    confidence = 100;
                    correctWords++;
                } else if (distance <= Math.ceil(originalWord.length * 0.3)) {
                    // Từ gần đúng (có ít hơn 30% lỗi)
                    isCorrect = false;
                    feedback = "Từ này gần đúng, nhưng có lỗi phát âm";
                } else {
                    // Từ sai hoàn toàn
                    isCorrect = false;
                    feedback = "Phát âm không chính xác";
                }
            } else {
                // Không tìm thấy từ tương ứng
                isCorrect = false;
                feedback = "Không phát hiện được từ này trong bản ghi âm";
            }

            return {
                word: originalWord,
                isCorrect,
                feedback,
                confidence: Math.round(confidence),
            };
        });

        // Tính điểm tổng quan
        const overallScore = Math.round(
            (correctWords / originalWords.length) * 100
        );

        // Phản hồi chung
        const feedback: string[] = [];

        if (overallScore >= 90) {
            feedback.push("Phát âm của bạn rất tốt!");
        } else if (overallScore >= 70) {
            feedback.push(
                "Phát âm của bạn khá tốt, nhưng vẫn có thể cải thiện."
            );
        } else if (overallScore >= 50) {
            feedback.push("Phát âm của bạn cần cải thiện để dễ hiểu hơn.");
        } else {
            feedback.push(
                "Phát âm của bạn gặp nhiều khó khăn, cần nhiều luyện tập."
            );
        }

        // Gợi ý cải thiện
        const improvementSuggestions =
            generateImprovementSuggestions(wordAnalysis);

        return {
            overallScore,
            feedback,
            wordAnalysis,
            improvementSuggestions,
            commonErrors: findCommonErrors(wordAnalysis),
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
        }>
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
                throw new Error("Không có dữ liệu âm thanh được ghi lại");
            }

            console.log(
                `Thông tin về âm thanh: Kích thước = ${audioBlob.size} bytes, Loại = ${audioBlob.type}`
            );

            // Lấy văn bản gốc dựa trên chế độ (phrase hoặc custom)
            const originalText =
                practiceMode === "phrase" ? currentPhrase : customInput;

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
                    recognizedText = await new Promise<string>(
                        (resolve, reject) => {
                            // ... existing code ...
                        }
                    );
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

                // Nếu cả hai phương pháp đều không thành công, thông báo lỗi
                if (!recognizedText) {
                    console.warn(
                        "6. Không thể nhận dạng giọng nói, sẽ gửi yêu cầu mà không có văn bản đã ghi"
                    );
                }

                // Cập nhật transcript cho người dùng thấy
                if (recognizedText) {
                    setTranscript(recognizedText);
                } else {
                    setTranscript(
                        "Không thể nhận dạng giọng nói. Vui lòng thử lại và nói rõ hơn."
                    );
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
                    throw new Error(
                        `Lỗi khi gửi yêu cầu tới server: ${response.status} ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log("9. Dữ liệu nhận được từ server:", data);

                if (data.error) {
                    console.error("Lỗi từ server:", data.error);
                    throw new Error(`Lỗi từ server: ${data.error}`);
                }

                // Cập nhật transcript từ dữ liệu server trả về nếu có
                if (data.recordedText && data.recordedText !== recognizedText) {
                    console.log(
                        "10. Cập nhật transcript từ server:",
                        data.recordedText
                    );
                    setTranscript(data.recordedText);
                }

                // Hiển thị kết quả phân tích
                console.log("11. Cập nhật feedback với dữ liệu phân tích");
                setFeedback(data);

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

                    setHistory((prevHistory) => [historyItem, ...prevHistory]);

                    // Lưu lịch sử vào localStorage
                    try {
                        localStorage.setItem(
                            "pronunciationHistory",
                            JSON.stringify([historyItem, ...history])
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
            } catch (error) {
                console.error("Lỗi trong quá trình xử lý âm thanh:", error);
                setErrorMessage(
                    `Đã xảy ra lỗi: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
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
        // Lưu vào lịch sử
        const historyItem: PracticeHistoryItem = {
            text: practiceMode === "phrase" ? currentPhrase : customInput,
            score: analysis.overallScore,
            date: new Date(),
            audioUrl: audioUrl || undefined, // Sử dụng undefined thay vì null để phù hợp với kiểu
        };

        setHistory((prevHistory) => [historyItem, ...prevHistory]);

        // Lưu lịch sử vào localStorage
        try {
            localStorage.setItem(
                "pronunciationHistory",
                JSON.stringify([historyItem, ...history])
            );
        } catch (error) {
            console.error("Error saving history to localStorage:", error);
        }
    };

    // Bắt đầu ghi âm với MediaRecorder API
    const startMediaRecording = async () => {
        try {
            console.log("Đang bắt đầu ghi âm với MediaRecorder...");
            if (!mediaRecorderRef.current) {
                console.log(
                    "MediaRecorder chưa được khởi tạo, đang khởi tạo..."
                );
                await initMediaRecorder();
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
            }
        } catch (error) {
            console.error("Lỗi khi bắt đầu ghi âm:", error);
            setErrorMessage(
                `Lỗi khi bắt đầu ghi âm: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
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
            }
        } catch (error) {
            console.error("Lỗi khi dừng ghi âm:", error);
            setErrorMessage(
                `Lỗi khi dừng ghi âm: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
            setIsListening(false);
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

    // Tải lịch sử từ localStorage khi component mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem("pronunciationHistory");
            if (savedHistory) {
                // Chuyển đổi chuỗi ngày thành đối tượng Date
                const parsedHistory = JSON.parse(savedHistory).map(
                    (item: any) => ({
                        ...item,
                        date: new Date(item.date),
                    })
                );
                setHistory(parsedHistory);
            }
        } catch (error) {
            console.error("Error loading history from localStorage:", error);
        }
    }, []);

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
                            onClick={() => setPracticeMode("phrase")}
                        >
                            Practice Phrases
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                practiceMode === "free"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setPracticeMode("free")}
                        >
                            Free Practice
                        </button>
                    </div>

                    {/* Trạng thái chế độ ghi âm */}
                    {usingFallbackMode && (
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

                    {/* Thông báo lỗi */}
                    {errorMessage && (
                        <div className="mb-6 px-4 py-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Đã xảy ra lỗi
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{errorMessage}</p>

                                        {/* Hướng dẫn khắc phục dựa trên loại lỗi */}
                                        {errorMessage.includes(
                                            "microphone"
                                        ) && (
                                            <div className="mt-3 p-2 bg-white rounded border border-red-100">
                                                <p className="font-medium mb-1">
                                                    Cách khắc phục:
                                                </p>
                                                <ol className="list-decimal list-inside text-sm space-y-1">
                                                    <li>
                                                        Kiểm tra xem microphone
                                                        đã được kết nối đúng
                                                        cách
                                                    </li>
                                                    <li>
                                                        Nhấp vào biểu tượng
                                                        khóa/địa chỉ trên trình
                                                        duyệt
                                                    </li>
                                                    <li>
                                                        Chọn "Cho phép" đối với
                                                        quyền truy cập
                                                        microphone
                                                    </li>
                                                    <li>
                                                        Làm mới trang và thử lại
                                                    </li>
                                                </ol>
                                            </div>
                                        )}

                                        {errorMessage.includes("mạng") && (
                                            <div className="mt-3 p-2 bg-white rounded border border-red-100">
                                                <p className="font-medium mb-1">
                                                    Gợi ý:
                                                </p>
                                                <ul className="list-disc list-inside text-sm space-y-1">
                                                    <li>
                                                        Chế độ dự phòng đã được
                                                        kích hoạt tự động
                                                    </li>
                                                    <li>
                                                        Kiểm tra kết nối mạng và
                                                        thử lại sau
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            onClick={() =>
                                                setErrorMessage(null)
                                            }
                                            className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                                        >
                                            <span className="sr-only">
                                                Đóng
                                            </span>
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Text to Pronounce */}
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
                                    <Repeat className="h-4 w-4 mr-1" /> New
                                    Phrase
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
                                onChange={(e) => setCustomInput(e.target.value)}
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
                                    <span className="text-xs">Dừng</span>
                                    {/* Hiệu ứng sóng âm khi đang ghi */}
                                    <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-full border-4 border-red-400 opacity-60 animate-ping"></div>
                                    <div className="absolute -top-6 -left-6 -right-6 -bottom-6 rounded-full border-4 border-red-300 opacity-30 animate-pulse"></div>
                                </>
                            ) : isAnalyzing ? (
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Mic className="h-8 w-8 mb-1" />
                                    <span className="text-xs">Bắt đầu</span>
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
                            <p className="text-gray-700">{transcript}</p>

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
                                            className="w-full h-8"
                                        />
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
                                                feedback.overallScore >= 80
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
                                        {feedback.feedback.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-gray-600 flex items-start"
                                            >
                                                <span className="text-purple-500 mr-2">
                                                    •
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Đánh giá chi tiết từ Groq */}
                                {feedback.detailedFeedback && (
                                    <div className="mb-4 border-t border-gray-100 pt-4">
                                        <h4 className="text-md font-semibold text-gray-700 mb-2">
                                            Phân tích chi tiết
                                        </h4>
                                        <p className="text-gray-600">
                                            {feedback.detailedFeedback}
                                        </p>
                                    </div>
                                )}

                                {/* Gợi ý cải thiện */}
                                {feedback.improvementSuggestions &&
                                    feedback.improvementSuggestions.length >
                                        0 && (
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
                                {feedback.commonErrors &&
                                    feedback.commonErrors.length > 0 && (
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
                                        {feedback.wordAnalysis.map(
                                            (word, index) => (
                                                <div
                                                    key={index}
                                                    className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-1 ${
                                                        word.isCorrect
                                                            ? "border-green-200 bg-green-50 text-green-700"
                                                            : "border-red-200 bg-red-50 text-red-700"
                                                    }`}
                                                    title={word.feedback || ""}
                                                >
                                                    {word.word}
                                                    {word.isCorrect ? (
                                                        <Check
                                                            size={14}
                                                            className="text-green-600"
                                                        />
                                                    ) : (
                                                        <X
                                                            size={14}
                                                            className="text-red-600"
                                                        />
                                                    )}
                                                </div>
                                            )
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
                                                        <audio
                                                            controls
                                                            src={item.audioUrl}
                                                            className="w-full h-7"
                                                        />
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
        "Phương pháp mới: Sử dụng Web Speech API trực tiếp với file âm thanh"
    );

    if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
        console.warn("Web Speech API không được hỗ trợ trong trình duyệt này");
        return "";
    }

    try {
        // Tạo AudioContext
        const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        console.log(
            `AudioContext đã được tạo với sampleRate ${audioContext.sampleRate}Hz`
        );

        // Chuyển đổi Blob thành ArrayBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        console.log(
            `AudioBlob đã được chuyển thành ArrayBuffer ${arrayBuffer.byteLength} bytes`
        );

        // Giải mã âm thanh
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log(
            `AudioBuffer đã được giải mã: ${audioBuffer.duration}s, ${audioBuffer.numberOfChannels} kênh`
        );

        // Tạo source node
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Tạo ScriptProcessor để xử lý âm thanh
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

        // Khởi tạo SpeechRecognition
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = false;

        console.log("Khởi tạo SpeechRecognition với ngôn ngữ:", language);

        // Kết nối các node
        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        // Biến để lưu kết quả
        let transcript = "";

        // Khi có kết quả
        recognition.onresult = (event) => {
            console.log("SpeechRecognition: Có kết quả", event.results);
            const current = event.resultIndex;
            transcript = event.results[current][0].transcript;
            console.log("Đã nhận dạng giọng nói:", transcript);
        };

        // Khi có lỗi
        recognition.onerror = (event) => {
            console.error("SpeechRecognition: Lỗi", event.error);
        };

        // Khi kết thúc
        recognition.onend = () => {
            console.log("SpeechRecognition: Kết thúc");

            // Dừng xử lý âm thanh
            source.disconnect();
            scriptProcessor.disconnect();
        };

        // Bắt đầu nhận dạng
        recognition.start();
        console.log("SpeechRecognition: Đã bắt đầu");

        // Xử lý âm thanh và gửi đến SpeechRecognition
        scriptProcessor.onaudioprocess = (e) => {
            // Đây là nơi sẽ xử lý âm thanh từ audioBuffer và gửi đến SpeechRecognition
            // trong thực tế, đây là một quá trình phức tạp
            console.log("Đang xử lý âm thanh...");
        };

        // Bắt đầu phát âm thanh
        source.start(0);
        console.log("Đã bắt đầu phát âm thanh");

        // Đợi đến khi âm thanh kết thúc
        await new Promise<void>((resolve) => {
            source.onended = () => {
                console.log("Phát âm thanh đã kết thúc");

                // Dừng nhận dạng sau khi âm thanh kết thúc
                setTimeout(() => {
                    recognition.stop();
                    resolve();
                }, 500);
            };
        });

        // Đợi thêm một chút để đảm bảo SpeechRecognition có đủ thời gian xử lý
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

        return transcript;
    } catch (error) {
        console.error("Lỗi khi sử dụng Web Speech API trực tiếp:", error);
        return "";
    }
};
