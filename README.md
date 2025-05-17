# Ứng dụng học ngoại ngữ - Hỗ trợ phát âm

## Tính năng mới: Hỗ trợ phát âm và sửa lỗi phát âm

Chức năng này cho phép người dùng:

-   Thu âm giọng nói và chuyển đổi thành văn bản
-   Đánh giá chất lượng phát âm
-   Nhận phản hồi chi tiết và gợi ý cải thiện
-   Nghe lại bản ghi âm của mình

## Cách sửa lỗi cuối cùng

Trong quá trình hiện thực chức năng, có một lỗi TypeScript trong file `src/app/pronunciation/page.tsx` về việc sử dụng URL.createObjectURL với Blob | null. Để sửa lỗi này, hãy thực hiện các bước sau:

1. Mở file `src/app/pronunciation/page.tsx`
2. Tìm dòng có lỗi (khoảng dòng 307)
3. Sửa đoạn code sau:

```typescript
// Thêm hàm phát âm thanh đã ghi
const playRecordedAudio = () => {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
};
```

Thành:

```typescript
// Thêm hàm phát âm thanh đã ghi
const playRecordedAudio = () => {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    } else if (recordedAudioBlob) {
        // Tạo URL mới nếu chưa có
        const newAudioUrl = URL.createObjectURL(recordedAudioBlob);
        setAudioUrl(newAudioUrl);
        const audio = new Audio(newAudioUrl);
        audio.play();
    }
};
```

## Cài đặt GROQ API Key

Để sử dụng chức năng phân tích phát âm nâng cao với LLM, bạn cần:

1. Đăng ký tài khoản tại [console.groq.com](https://console.groq.com/)
2. Tạo API key mới
3. Tạo file `.env.local` tại thư mục gốc với nội dung:

```
GROQ_API_KEY=your_api_key_here
```

4. Khởi động lại server để áp dụng API key

## Những công nghệ đã sử dụng

1. **Web Speech API**: Thu thập giọng nói người dùng (miễn phí)
2. **MediaRecorder API**: Thu âm giọng nói khi Web Speech API không hỗ trợ (miễn phí)
3. **Groq LLM**: Phân tích và cải thiện phát âm (API miễn phí)

## Cách sử dụng

1. Truy cập trang `/pronunciation`
2. Chọn ngôn ngữ bạn muốn luyện tập
3. Chọn một trong hai chế độ:
    - **Câu có sẵn**: Luyện tập với câu mẫu
    - **Văn bản tùy chỉnh**: Nhập văn bản riêng
4. Nhấn nút microphone để bắt đầu ghi âm
5. Đọc câu văn đã chọn
6. Nhấn lại nút microphone để dừng ghi âm
7. Xem kết quả phân tích và gợi ý cải thiện
8. Có thể nghe lại bản ghi âm để tự đánh giá
9. Nhấn "Thử lại" để tiếp tục luyện tập

## Cách mở rộng tính năng trong tương lai

1. Tích hợp với DALL-E để tạo hình ảnh minh họa cho từ khó
2. Thêm tùy chọn giọng đọc mẫu với nhiều giọng địa phương khác nhau
3. Tích hợp với API TTS để đọc mẫu chất lượng cao
4. Tạo tính năng theo dõi tiến trình và thống kê cải thiện qua thời gian

# Tính năng nhận dạng và đánh giá phát âm

## Tích hợp Vosk Speech Recognition

Ứng dụng đã được tích hợp với Vosk để hỗ trợ nhận dạng giọng nói ngay cả khi không có kết nối Internet. Tính năng này giúp người dùng có thể luyện tập phát âm ở bất kỳ đâu, không phụ thuộc vào kết nối mạng.

### Cách sử dụng:

1. Truy cập trang `/pronunciation` để bắt đầu luyện tập
2. Hệ thống sẽ tự động tải model Vosk khi cần thiết
3. Khi bạn bấm vào nút ghi âm, hệ thống sẽ:
    - Thử sử dụng Web Speech API trước (cần kết nối Internet)
    - Nếu gặp lỗi network, tự động chuyển sang dùng Vosk
    - Phân tích chất lượng phát âm dựa trên kết quả nhận dạng

### Ưu điểm của Vosk:

-   Hoạt động hoàn toàn offline
-   Hỗ trợ nhiều ngôn ngữ
-   Nhận dạng chính xác cao
-   Xử lý nhanh ngay trên trình duyệt

## Hướng dẫn sử dụng

1. Chọn chế độ: **Cụm từ có sẵn** hoặc **Nhập nội dung**
2. Chọn ngôn ngữ bạn muốn luyện tập
3. Nhấn nút **Bắt đầu ghi âm** và đọc to, rõ ràng
4. Xem phản hồi và đánh giá về phát âm của bạn
5. Sử dụng gợi ý để cải thiện phát âm

## Xử lý lỗi

Nếu gặp vấn đề khi nhận dạng giọng nói:

-   Đảm bảo đã cho phép trình duyệt truy cập microphone
-   Thử làm mới trang và ghi âm lại
-   Kiểm tra microphone có hoạt động bình thường không
-   Sử dụng trình duyệt Chrome, Edge hoặc Safari mới nhất

## Lưu ý kỹ thuật

-   Vosk model sẽ được tải khi cần thiết (~50MB)
-   Khi không có kết nối Internet, hệ thống vẫn có thể phân tích phát âm bằng Vosk

## Cấu hình Speech-to-Text

Pronunciation Coach sử dụng Groq API để chuyển đổi giọng nói thành văn bản và đánh giá phát âm. Để sử dụng đầy đủ tính năng này, bạn cần cấu hình API key của Groq.

### Cách cấu hình

1. Tạo file `.env.local` tại thư mục gốc của dự án
2. Thêm API key của bạn vào file:

```
# Groq API Key (cho Speech-to-Text và phân tích phát âm)
GROQ_API_KEY=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
```

3. Khởi động lại server

### Chức năng Speech-to-Text

Pronunciation Coach sử dụng Groq API với model `distil-whisper-large-v3-en` để chuyển đổi giọng nói thành văn bản với độ chính xác cao. Các tính năng:

-   Nhận dạng giọng nói tiếng Anh với độ chính xác cao
-   Xử lý nhanh chóng với tốc độ thời gian thực
-   Phân tích phát âm chi tiết dựa trên kết quả nhận dạng
-   Tự động chuyển sang Web Speech API nếu không có kết nối mạng

### Chế độ dự phòng

Nếu không có kết nối mạng hoặc API key không hợp lệ, Pronunciation Coach sẽ tự động chuyển sang sử dụng Web Speech API của trình duyệt để tiếp tục hoạt động mà không bị gián đoạn.

## Cập nhật mới nhất

### Tính năng mới: Tải xuống bản ghi âm

-   Giờ đây người dùng có thể tải xuống bản ghi âm của họ để lưu trữ hoặc chia sẻ
-   Nút tải xuống được cung cấp cả trong màn hình chính và trong lịch sử luyện tập
-   Các file được lưu dưới định dạng .webm với thời gian tạo trong tên file

### Sửa lỗi

-   Đã khắc phục lỗi khi gửi yêu cầu đến Groq API Speech-to-Text
-   Cải thiện xử lý lỗi khi không kết nối được với Groq API, tự động chuyển sang chế độ mô phỏng
-   Thay đổi định dạng file gửi đi để tương thích tốt hơn với API
-   Thêm thông tin gỡ lỗi chi tiết hơn khi có lỗi xảy ra

### Lưu ý khi sử dụng

Nếu bạn gặp lỗi "Error: 500 Internal Server Error" khi sử dụng tính năng chuyển đổi giọng nói thành văn bản, nguyên nhân có thể do:

1. Kết nối với Groq API bị gián đoạn
2. API key đã hết hạn hoặc không hợp lệ
3. File âm thanh có định dạng không được hỗ trợ

Trong những trường hợp này, hệ thống sẽ tự động chuyển sang chế độ mô phỏng để bạn vẫn có thể tiếp tục luyện tập.
