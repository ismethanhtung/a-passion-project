// Dịch vụ Vosk cho speech-to-text offline
// Dựa trên vosk-browser: https://github.com/ccoreilly/vosk-browser

interface VoskResult {
    result: {
        text: string;
    };
}

interface VoskPartialResult {
    result: {
        partial: string;
    };
}

// Dịch vụ xử lý Vosk
export class VoskService {
    private static instance: VoskService;
    private vosk: any = null;
    private model: any = null;
    private recognizer: any = null;
    // Sử dụng model online thay vì local
    private modelUrl =
        "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-vi-0.4.tar.gz";

    private constructor() {
        // Singleton pattern
    }

    /**
     * Trả về instance singleton của service
     */
    public static getInstance(): VoskService {
        if (!VoskService.instance) {
            VoskService.instance = new VoskService();
        }
        return VoskService.instance;
    }

    /**
     * Tải script Vosk từ CDN
     */
    private async loadVoskScript(): Promise<any> {
        if (typeof window === "undefined") return null;
        if (window.Vosk) return window.Vosk;

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js";
            script.async = true;
            script.onload = () => {
                if (window.Vosk) {
                    resolve(window.Vosk);
                } else {
                    reject(new Error("Failed to load Vosk script"));
                }
            };
            script.onerror = () => {
                reject(new Error("Failed to load Vosk script"));
            };
            document.body.appendChild(script);
        });
    }

    /**
     * Khởi tạo Vosk
     */
    public async initialize(customModelUrl?: string): Promise<boolean> {
        try {
            if (this.model) {
                return true; // Đã khởi tạo
            }

            console.log("Initializing Vosk...");
            if (customModelUrl) {
                this.modelUrl = customModelUrl;
            }

            // Thử sử dụng mô hình tiếng Việt nếu có, nếu không sử dụng tiếng Anh
            try {
                // Tải script Vosk từ CDN
                this.vosk = await this.loadVoskScript();

                // Tạo model Vosk - có thể sử dụng mô hình tiếng Việt
                this.model = await this.vosk.createModel(this.modelUrl);
            } catch (error) {
                console.warn(
                    "Không thể tải mô hình tiếng Việt, thử sử dụng mô hình tiếng Anh",
                    error
                );
                // Fallback: Sử dụng mô hình tiếng Anh
                this.modelUrl =
                    "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz";
                this.model = await this.vosk.createModel(this.modelUrl);
            }

            // Kiểm tra xem model có sẵn sàng không
            if (!this.model || !this.model.ready) {
                console.error("Vosk model could not be initialized");
                return false;
            }

            console.log("Vosk initialized successfully");
            return true;
        } catch (error) {
            console.error("Error initializing Vosk:", error);
            return false;
        }
    }

    /**
     * Tạo recognizer
     */
    public createRecognizer(): any {
        if (!this.model) {
            throw new Error("Model not initialized, call initialize() first");
        }

        if (!this.recognizer) {
            this.recognizer = new this.model.KaldiRecognizer();
        }

        return this.recognizer;
    }

    /**
     * Nhận dạng giọng nói từ audio blob
     */
    public async recognizeSpeech(audioBlob: Blob): Promise<string> {
        try {
            console.log("Vosk: Bắt đầu nhận dạng giọng nói...");
            console.log(
                `Vosk: Audio blob có kích thước ${audioBlob.size} bytes, loại ${audioBlob.type}`
            );

            // Đảm bảo Vosk đã được khởi tạo
            if (!this.model) {
                console.log("Vosk: Model chưa được khởi tạo, đang khởi tạo...");
                const initialized = await this.initialize();
                console.log(
                    `Vosk: Khởi tạo ${initialized ? "thành công" : "thất bại"}`
                );
                if (!initialized) {
                    throw new Error("Vosk model could not be initialized");
                }
            }

            // Tạo recognizer nếu chưa có
            console.log("Vosk: Đang tạo recognizer...");
            const recognizer = this.createRecognizer();
            console.log("Vosk: Đã tạo recognizer thành công");

            // Convert AudioBlob to AudioBuffer
            console.log("Vosk: Đang chuyển đổi AudioBlob thành ArrayBuffer...");
            const arrayBuffer = await audioBlob.arrayBuffer();
            console.log(
                `Vosk: Đã chuyển đổi thành ArrayBuffer có kích thước ${arrayBuffer.byteLength} bytes`
            );

            console.log("Vosk: Đang tạo AudioContext...");
            const audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            console.log(
                `Vosk: Đã tạo AudioContext với sampleRate ${audioContext.sampleRate}Hz`
            );

            console.log("Vosk: Đang giải mã AudioData...");
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            console.log(`Vosk: Đã giải mã AudioBuffer với ${audioBuffer.numberOfChannels} kênh, 
                độ dài ${audioBuffer.length} samples, 
                sample rate ${audioBuffer.sampleRate}Hz, 
                thời lượng ${audioBuffer.duration} giây`);

            // Chuyển đổi AudioBuffer thành Float32Array phù hợp với Vosk
            console.log(
                "Vosk: Đang chuyển đổi AudioBuffer thành Float32Array..."
            );
            const audioData = this.audioBufferToFloat32Array(audioBuffer);
            console.log(
                `Vosk: Đã chuyển đổi thành Float32Array có độ dài ${audioData.length}`
            );

            // Xử lý audio data
            return new Promise((resolve, reject) => {
                console.log("Vosk: Thiết lập handlers cho recognizer...");
                // Lắng nghe kết quả
                const resultHandler = (message: any) => {
                    console.log("Vosk: Nhận được sự kiện kết quả:", message);
                    const result = message.result;
                    if (result && result.text) {
                        console.log(
                            `Vosk: Nhận dạng thành công với kết quả: "${result.text}"`
                        );
                        recognizer.removeEventListener("result", resultHandler);
                        resolve(result.text);
                    } else {
                        console.log(
                            "Vosk: Nhận được kết quả không có văn bản:",
                            message
                        );
                    }
                };

                // Lắng nghe lỗi
                const errorHandler = (error: any) => {
                    console.error(
                        "Vosk: Có lỗi trong quá trình nhận dạng:",
                        error
                    );
                    recognizer.removeEventListener("error", errorHandler);
                    reject(error);
                };

                recognizer.on("result", resultHandler);
                recognizer.on("error", errorHandler);

                // Gửi dữ liệu âm thanh để phân tích
                try {
                    console.log(
                        "Vosk: Đang gửi dữ liệu âm thanh đến recognizer..."
                    );
                    // Thay đổi từ recognizer.acceptWaveform(audioBuffer) thành:
                    recognizer.acceptWaveform(audioData);
                    console.log("Vosk: Đã gửi dữ liệu âm thanh thành công");

                    // Sau một khoảng thời gian nếu không có kết quả, trả về chuỗi rỗng
                    console.log("Vosk: Thiết lập thời gian chờ 5 giây...");
                    setTimeout(() => {
                        console.log("Vosk: Hết thời gian chờ kết quả");
                        recognizer.removeEventListener("result", resultHandler);
                        recognizer.removeEventListener("error", errorHandler);
                        resolve("");
                    }, 5000);
                } catch (error) {
                    console.error("Vosk: Lỗi khi gửi dữ liệu âm thanh:", error);
                    errorHandler(error);
                }
            });
        } catch (error) {
            console.error(
                "Vosk: Lỗi tổng thể trong quá trình nhận dạng giọng nói:",
                error
            );
            console.error(
                "Vosk: Chi tiết lỗi:",
                error instanceof Error ? error.message : String(error)
            );
            console.error(
                "Vosk: Stack trace:",
                error instanceof Error ? error.stack : "Không có stack trace"
            );
            throw error;
        }
    }

    /**
     * Chuyển đổi AudioBuffer thành Float32Array thích hợp cho Vosk
     * @param audioBuffer AudioBuffer từ Web Audio API
     * @returns Float32Array phù hợp với Vosk
     */
    private audioBufferToFloat32Array(audioBuffer: AudioBuffer): Float32Array {
        console.log("Vosk: Đang chuyển đổi AudioBuffer sang Float32Array...");

        // Lấy kênh âm thanh đầu tiên
        const inputChannel = audioBuffer.getChannelData(0);

        // Nếu cần resampling (Vosk thường yêu cầu 16kHz)
        if (audioBuffer.sampleRate !== 16000) {
            console.log(
                `Vosk: Cần resampling từ ${audioBuffer.sampleRate}Hz xuống 16000Hz`
            );

            // Tính tỷ lệ resampling
            const ratio = 16000 / audioBuffer.sampleRate;
            const outputLength = Math.floor(inputChannel.length * ratio);
            const output = new Float32Array(outputLength);

            // Resampling đơn giản bằng linear interpolation
            for (let i = 0; i < outputLength; i++) {
                const position = i / ratio;
                const index = Math.floor(position);
                const fraction = position - index;

                if (index < inputChannel.length - 1) {
                    output[i] =
                        inputChannel[index] * (1 - fraction) +
                        inputChannel[index + 1] * fraction;
                } else {
                    output[i] = inputChannel[index];
                }
            }

            console.log(
                `Vosk: Đã resampling thành công, độ dài mới: ${output.length}`
            );
            return output;
        }

        // Nếu không cần resampling, trả về dữ liệu gốc
        console.log("Vosk: Không cần resampling, sử dụng dữ liệu âm thanh gốc");
        return inputChannel;
    }

    /**
     * Giải phóng tài nguyên
     */
    public dispose(): void {
        if (this.recognizer) {
            try {
                this.recognizer.remove();
            } catch (e) {
                console.error("Error removing recognizer:", e);
            }
            this.recognizer = null;
        }

        if (this.model) {
            try {
                this.model.terminate();
            } catch (e) {
                console.error("Error terminating model:", e);
            }
            this.model = null;
        }
    }
}

// Đảm bảo Typescript hiểu window.Vosk
declare global {
    interface Window {
        Vosk?: any;
    }
}

// Export instance mặc định
export default VoskService.getInstance();
