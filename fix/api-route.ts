// Mô phỏng chuyển đổi âm thanh thành văn bản với chất lượng cải thiện
async function simulateAudioTranscription(
    audioFile: File,
    originalText: string,
    language: string
): Promise<string> {
    // Mô phỏng độ trễ xử lý thực tế
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // QUAN TRỌNG: Luôn trả về chuỗi rỗng để báo hiệu rằng không thể xử lý được âm thanh
    // Điều này sẽ buộc hệ thống gửi văn bản rỗng đến API, yêu cầu người dùng thực sự nói để sử dụng chức năng
    console.warn(
        "KHÔNG SỬ DỤNG ÂM THANH MÔ PHỎNG - YÊU CẦU NGƯỜI DÙNG NÓI THỰC TẾ"
    );
    return "";
}
