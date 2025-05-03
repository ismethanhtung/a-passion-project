# Tính năng luyện giao tiếp (nói)

Tính năng này cho phép người dùng luyện tập kỹ năng giao tiếp (nói) với AI qua nhiều chủ đề có sẵn hoặc tự tạo ngữ cảnh.

## Quy trình hoạt động

1. Người dùng chọn chủ đề hoặc tạo ngữ cảnh tùy chỉnh
2. Người dùng nói vào microphone để trả lời
3. Hệ thống chuyển đổi âm thanh thành văn bản
4. AI phản hồi và duy trì cuộc hội thoại
5. Người dùng tiếp tục đối thoại với AI
6. Sau khi kết thúc, AI đánh giá kỹ năng giao tiếp của người dùng

## Cài đặt

### Yêu cầu hệ thống

-   Node.js 18+
-   NPM hoặc Yarn

### Cài đặt AssemblyAI API Key (tuỳ chọn)

Để sử dụng tính năng nhận dạng giọng nói chất lượng cao, bạn cần đăng ký API key từ [AssemblyAI](https://www.assemblyai.com/):

1. Đăng ký tài khoản tại AssemblyAI
2. Lấy API key từ dashboard
3. Thêm API key vào tệp `.env.local`:

```bash
ASSEMBLY_AI_API_KEY=your_api_key_here
```

Nếu không có API key, hệ thống sẽ sử dụng phương pháp nhận dạng giọng nói offline với Vosk hoặc sử dụng dữ liệu mẫu cho mục đích phát triển.

## Cấu trúc tệp

```
src/
  ├── app/
  │   ├── conversation/
  │   │   └── page.tsx         # Trang chính cho tính năng luyện giao tiếp
  │   └── api/
  │       └── speech-to-text/  # API xử lý chuyển đổi giọng nói thành văn bản
  │           └── route.ts
  ├── components/
  │   └── conversation/
  │       ├── Feedback.tsx     # Hiển thị đánh giá từ AI
  │       ├── MessageList.tsx  # Hiển thị danh sách tin nhắn
  │       └── TopicSelector.tsx # Chọn chủ đề hội thoại
  ├── hooks/
  │   ├── useVoiceRecorder.ts  # Hook quản lý ghi âm
  │   └── useConversationTopics.ts # Hook quản lý chủ đề
  └── lib/
      ├── conversation-service.ts # Xử lý logic hội thoại
      └── vosk-service.ts         # Nhận dạng giọng nói offline
```

## Tính năng

### Đa ngôn ngữ

Hỗ trợ nhiều ngôn ngữ khác nhau:

-   Tiếng Anh (Mỹ)
-   Tiếng Anh (Anh)
-   Tiếng Việt
-   Tiếng Pháp
-   Tiếng Nhật

### Cấp độ khó

Người dùng có thể chọn cấp độ khó phù hợp với trình độ:

-   Cơ bản (Beginner)
-   Trung cấp (Intermediate)
-   Nâng cao (Advanced)

### Chủ đề đa dạng

Cung cấp nhiều chủ đề hội thoại được phân loại theo danh mục:

-   Du lịch
-   Công việc
-   Xã hội
-   Mua sắm
-   Cá nhân
-   Ẩm thực
-   Sức khỏe

### Tùy chỉnh ngữ cảnh

Người dùng có thể tạo ngữ cảnh hội thoại tùy chỉnh theo nhu cầu cá nhân.

### Đánh giá chi tiết

Sau khi kết thúc hội thoại, AI đánh giá chi tiết về:

-   Điểm mạnh
-   Điểm cần cải thiện
-   Ví dụ cụ thể
-   Điểm số tổng thể
-   Các bước tiếp theo để nâng cao khả năng

### Lưu lịch sử hội thoại

Người dùng có thể lưu lịch sử hội thoại để xem lại sau.

## Phát triển

### Thêm chủ đề mới

Để thêm chủ đề mới, chỉnh sửa tệp `src/hooks/useConversationTopics.ts` và thêm đối tượng mới vào mảng `sampleTopics`:

```typescript
{
    id: "unique_id",
    title: "Tiêu đề chủ đề",
    description: "Mô tả ngắn gọn",
    level: "beginner" | "intermediate" | "advanced",
    category: "Danh mục",
    initialPrompt: "Chi tiết ngữ cảnh hội thoại"
}
```

## Giải quyết sự cố

### Microphone không hoạt động

-   Đảm bảo bạn đã cấp quyền truy cập microphone cho trình duyệt
-   Kiểm tra xem microphone có hoạt động trong các ứng dụng khác không
-   Thử làm mới trang

### Nhận dạng giọng nói không chính xác

-   Nói chậm và rõ ràng
-   Kiểm tra xem đã chọn đúng ngôn ngữ chưa
-   Đảm bảo môi trường xung quanh không quá ồn ào

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ với chúng tôi tại [email@example.com](mailto:email@example.com).

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).
