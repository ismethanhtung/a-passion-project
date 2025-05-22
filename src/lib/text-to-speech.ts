/**
 * Chuyển đổi văn bản thành giọng nói sử dụng Web Speech API
 * @param text Văn bản cần chuyển đổi
 * @param options Tùy chọn cho giọng nói
 * @returns Promise hoàn thành khi giọng nói đã kết thúc
 */
export function speakText(
    text: string,
    options: {
        voice?: string;
        rate?: number;
        pitch?: number;
        onStart?: () => void;
        onEnd?: () => void;
        onError?: (error: any) => void;
    } = {}
): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            reject(new Error("Trình duyệt không hỗ trợ Speech Synthesis API"));
            return;
        }

        // Dừng bất kỳ lời nói nào đang diễn ra
        window.speechSynthesis.cancel();

        // Tạo đối tượng SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(text);

        // Thiết lập các thông số
        utterance.lang = options.voice || "vi-VN";
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;

        // Thêm sự kiện
        utterance.onstart = () => {
            console.log("Bắt đầu phát âm");
            if (options.onStart) options.onStart();
        };

        utterance.onend = () => {
            console.log("Kết thúc phát âm");
            if (options.onEnd) options.onEnd();
            resolve();
        };

        utterance.onerror = (event) => {
            console.error("Lỗi phát âm:", event);
            if (options.onError) options.onError(event);
            reject(event);
        };

        // Thiết lập giọng đọc nếu có
        if (options.voice) {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(
                (v) =>
                    v.lang.includes(options.voice || "") ||
                    v.name.includes(options.voice || "")
            );

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        // Phát âm
        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Lấy danh sách giọng nói có sẵn từ Web Speech API
 * @returns Danh sách các giọng nói
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        console.warn("Trình duyệt không hỗ trợ Speech Synthesis API");
        return [];
    }

    return window.speechSynthesis.getVoices();
}

/**
 * Chuyển đổi văn bản thành âm thanh sử dụng API server
 * @param text Văn bản cần chuyển đổi
 * @param options Tùy chọn cho giọng nói
 * @returns Dữ liệu từ API
 */
export async function generateSpeech(
    text: string,
    options: {
        voice?: string;
        rate?: number;
        pitch?: number;
    } = {}
): Promise<any> {
    try {
        const response = await fetch("/api/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                voice: options.voice || "vi-VN",
                rate: options.rate || 1,
                pitch: options.pitch || 1,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Lỗi API: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi gọi API text-to-speech:", error);
        throw error;
    }
}
