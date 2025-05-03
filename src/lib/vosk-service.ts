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
            // Đảm bảo Vosk đã được khởi tạo
            if (!this.model) {
                const initialized = await this.initialize();
                if (!initialized) {
                    throw new Error("Vosk model could not be initialized");
                }
            }

            // Tạo recognizer nếu chưa có
            const recognizer = this.createRecognizer();

            // Convert AudioBlob to AudioBuffer
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Xử lý audio data
            return new Promise((resolve, reject) => {
                // Lắng nghe kết quả
                const resultHandler = (message: any) => {
                    const result = message.result;
                    if (result && result.text) {
                        recognizer.removeEventListener("result", resultHandler);
                        resolve(result.text);
                    }
                };

                // Lắng nghe lỗi
                const errorHandler = (error: any) => {
                    recognizer.removeEventListener("error", errorHandler);
                    reject(error);
                };

                recognizer.on("result", resultHandler);
                recognizer.on("error", errorHandler);

                // Gửi dữ liệu âm thanh để phân tích
                try {
                    recognizer.acceptWaveform(audioBuffer);

                    // Sau một khoảng thời gian nếu không có kết quả, trả về chuỗi rỗng
                    setTimeout(() => {
                        recognizer.removeEventListener("result", resultHandler);
                        recognizer.removeEventListener("error", errorHandler);
                        resolve("");
                    }, 5000);
                } catch (error) {
                    errorHandler(error);
                }
            });
        } catch (error) {
            console.error("Error recognizing speech with Vosk:", error);
            throw error;
        }
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
