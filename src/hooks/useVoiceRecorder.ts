import { useState, useCallback, useEffect } from "react";

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Khởi tạo và làm sạch URL khi component unmount
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    // Bắt đầu ghi âm
    const startRecording = useCallback(async () => {
        // Reset state
        setAudioChunks([]);
        setAudioBlob(null);
        setAudioUrl(null);
        setError(null);

        try {
            // Yêu cầu quyền truy cập microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            // Tạo MediaRecorder mới
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            // Xử lý sự kiện khi có dữ liệu mới
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioChunks((prev) => [...prev, event.data]);
                }
            };

            // Bắt đầu ghi âm
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Lỗi khi bắt đầu ghi âm:", err);
            setError(
                "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập."
            );
        }
    }, []);

    // Dừng ghi âm
    const stopRecording = useCallback(() => {
        if (mediaRecorder && isRecording) {
            // Dừng MediaRecorder
            mediaRecorder.stop();
            setIsRecording(false);

            // Xử lý dữ liệu khi hoàn thành
            mediaRecorder.onstop = () => {
                // Tạo Blob từ các chunks đã thu thập
                const audioData = new Blob(audioChunks, { type: "audio/wav" });
                setAudioBlob(audioData);

                // Tạo URL để phát lại
                const url = URL.createObjectURL(audioData);
                setAudioUrl(url);

                // Dừng tất cả các tracks của stream
                const tracks = mediaRecorder.stream.getTracks();
                tracks.forEach((track) => track.stop());
            };
        }
    }, [mediaRecorder, isRecording, audioChunks]);

    // Xóa bản ghi âm
    const clearRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setAudioChunks([]);
    }, [audioUrl]);

    return {
        isRecording,
        audioBlob,
        audioUrl,
        error,
        startRecording,
        stopRecording,
        clearRecording,
    };
}
