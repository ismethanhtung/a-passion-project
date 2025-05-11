// Cải thiện hàm xử lý âm thanh đã ghi
const processAudioBlob = async (audioBlob: Blob) => {
    try {
        setIsAnalyzing(true);
        setErrorMessage(null);

        // Kiểm tra rõ ràng rằng có Blob hợp lệ trước khi xử lý
        if (!audioBlob || audioBlob.size === 0) {
            throw new Error("Không có dữ liệu âm thanh được ghi lại");
        }

        // Lấy văn bản gốc dựa trên chế độ (phrase hoặc custom)
        const originalText =
            practiceMode === "phrase" ? currentPhrase : customInput;

        // Tạo FormData để gửi lên server
        const formData = new FormData();
        formData.append("audio", audioBlob, "recorded_audio.wav");
        formData.append("text", originalText);
        formData.append("language", selectedLanguage);

        console.log(`Đang xử lý âm thanh... (${audioBlob.size} bytes)`);
        console.log("Văn bản gốc:", originalText);
        console.log("Ngôn ngữ:", selectedLanguage);

        // Hiển thị trạng thái đang xử lý
        setTranscript("Đang xử lý âm thanh...");

        try {
            // Gửi request đến API endpoint để phân tích phát âm với file âm thanh thực tế
            const response = await fetch("/api/pronunciation", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Lỗi khi gửi yêu cầu tới server: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`Lỗi từ server: ${data.error}`);
            }

            console.log("Kết quả phân tích từ server:", data);

            // Cập nhật transcript với văn bản đã nhận dạng từ server
            if (data.recordedText) {
                setTranscript(data.recordedText);
            } else {
                setTranscript(
                    "Không thể nhận dạng giọng nói. Vui lòng thử lại và nói rõ hơn."
                );
            }

            // Hiển thị kết quả phân tích
            setFeedback(data);

            // Cập nhật lịch sử nếu có audioUrl và đã nhận dạng được ít nhất một từ
            if (
                audioUrl &&
                data.recordedText &&
                data.recordedText.trim() !== ""
            ) {
                // Cập nhật với cả URL âm thanh để sau này có thể phát lại
                const historyItem = {
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
                } catch (error) {
                    console.error(
                        "Error saving history to localStorage:",
                        error
                    );
                }
            } else if (!data.recordedText || data.recordedText.trim() === "") {
                // Thông báo nếu không nhận dạng được giọng nói
                setErrorMessage(
                    "Không thể nhận dạng giọng nói của bạn. Vui lòng thử lại và nói to, rõ ràng hơn."
                );
            }
        } catch (serverError) {
            console.error("Lỗi khi phân tích phát âm từ server:", serverError);

            // Thử phương pháp dự phòng - xử lý trực tiếp qua Web Speech API
            try {
                // Hiển thị thông báo chuyển sang phương pháp dự phòng
                setTranscript("Đang sử dụng phương pháp dự phòng...");

                const transcriptionResult =
                    await transcribeAudioWithWebSpeechAPI(
                        audioBlob,
                        selectedLanguage
                    );

                if (transcriptionResult && transcriptionResult.trim() !== "") {
                    console.log("Kết quả Web Speech API:", transcriptionResult);
                    setTranscript(transcriptionResult);

                    // Phân tích phát âm bằng API server nếu có transcription
                    try {
                        const analysisResponse = await fetch(
                            "/api/pronunciation",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    recordedText: transcriptionResult,
                                    originalText: originalText,
                                    language: selectedLanguage,
                                }),
                            }
                        );

                        if (analysisResponse.ok) {
                            const analysisData = await analysisResponse.json();
                            setFeedback(analysisData);

                            // Cập nhật lịch sử
                            if (audioUrl) {
                                const historyItem = {
                                    text: originalText,
                                    score: analysisData.overallScore,
                                    date: new Date(),
                                    audioUrl: audioUrl,
                                };

                                setHistory((prevHistory) => [
                                    historyItem,
                                    ...prevHistory,
                                ]);

                                // Lưu lịch sử vào localStorage
                                try {
                                    localStorage.setItem(
                                        "pronunciationHistory",
                                        JSON.stringify([
                                            historyItem,
                                            ...history,
                                        ])
                                    );
                                } catch (error) {
                                    console.error(
                                        "Error saving history to localStorage:",
                                        error
                                    );
                                }
                            }
                        } else {
                            throw new Error("Không thể phân tích phát âm");
                        }
                    } catch (analysisError) {
                        console.error(
                            "Lỗi khi phân tích phát âm:",
                            analysisError
                        );

                        // Sử dụng phương pháp phân tích client-side nếu server thất bại
                        const clientAnalysis = analyzeTranscription(
                            transcriptionResult,
                            originalText
                        );
                        setFeedback(clientAnalysis);

                        // Cập nhật lịch sử
                        if (audioUrl) {
                            const historyItem = {
                                text: originalText,
                                score: clientAnalysis.overallScore,
                                date: new Date(),
                                audioUrl: audioUrl,
                            };

                            setHistory((prevHistory) => [
                                historyItem,
                                ...prevHistory,
                            ]);

                            // Lưu lịch sử vào localStorage
                            try {
                                localStorage.setItem(
                                    "pronunciationHistory",
                                    JSON.stringify([historyItem, ...history])
                                );
                            } catch (error) {
                                console.error(
                                    "Error saving history to localStorage:",
                                    error
                                );
                            }
                        }
                    }
                } else {
                    throw new Error("Không thể nhận dạng giọng nói");
                }
            } catch (fallbackError) {
                console.error("Phương pháp dự phòng thất bại:", fallbackError);

                // Hiện thông báo lỗi cho người dùng
                setErrorMessage(
                    "Không thể phân tích phát âm của bạn. Vui lòng thử lại với giọng nói rõ ràng hơn."
                );
                setTranscript("");
            }
        }
    } catch (error: any) {
        console.error("Error processing pronunciation analysis:", error);
        setErrorMessage(
            getErrorMessage(ErrorType.OTHER, error.message || "Unknown error")
        );
        setTranscript("");
    } finally {
        setIsAnalyzing(false);
        setIsListening(false);
    }
};
