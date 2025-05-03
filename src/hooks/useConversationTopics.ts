import { useState, useEffect } from "react";
import { ConversationTopic } from "@/app/conversation/page";

export function useConversationTopics() {
    const [topics, setTopics] = useState<ConversationTopic[]>([]);
    const [selectedTopic, setSelectedTopic] =
        useState<ConversationTopic | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Lấy danh sách chủ đề từ API hoặc sử dụng dữ liệu mẫu
        const fetchTopics = async () => {
            setIsLoading(true);
            try {
                // Trong môi trường thực tế, bạn có thể lấy dữ liệu từ API
                // const response = await fetch('/api/conversation-topics');
                // const data = await response.json();
                // setTopics(data);

                // Dữ liệu mẫu cho mục đích phát triển
                const sampleTopics: ConversationTopic[] = [
                    {
                        id: "t1",
                        title: "Đặt phòng khách sạn",
                        description:
                            "Thực hành đặt phòng khách sạn, yêu cầu các dịch vụ đặc biệt và giải quyết vấn đề.",
                        level: "beginner",
                        category: "Du lịch",
                        initialPrompt:
                            "Bạn đang cố gắng đặt phòng tại một khách sạn 5 sao. Bạn cần một phòng cho 3 người trong 5 đêm, với bữa sáng và yêu cầu đặc biệt về chế độ ăn không gluten.",
                    },
                    {
                        id: "t2",
                        title: "Phỏng vấn xin việc",
                        description:
                            "Luyện tập trả lời câu hỏi phỏng vấn phổ biến và mô tả kinh nghiệm làm việc.",
                        level: "intermediate",
                        category: "Công việc",
                        initialPrompt:
                            "Bạn đang phỏng vấn cho vị trí chuyên viên marketing. Người phỏng vấn sẽ hỏi về kinh nghiệm, kỹ năng, và lý do bạn muốn gia nhập công ty họ.",
                    },
                    {
                        id: "t3",
                        title: "Bày tỏ ý kiến cá nhân",
                        description:
                            "Tranh luận và bày tỏ quan điểm về các chủ đề xã hội hiện tại.",
                        level: "advanced",
                        category: "Xã hội",
                        initialPrompt:
                            "Thảo luận về ảnh hưởng của mạng xã hội đến sức khỏe tâm thần ở giới trẻ. Bày tỏ quan điểm của bạn và đưa ra lập luận ủng hộ hoặc phản đối.",
                    },
                    {
                        id: "t4",
                        title: "Mua sắm tại cửa hàng",
                        description:
                            "Hỏi về sản phẩm, so sánh giá cả và thương lượng.",
                        level: "beginner",
                        category: "Mua sắm",
                        initialPrompt:
                            "Bạn đang mua sắm quần áo tại một cửa hàng. Bạn cần tìm quần áo phù hợp với kích cỡ và phong cách của mình, và muốn biết về chính sách đổi trả.",
                    },
                    {
                        id: "t5",
                        title: "Giới thiệu bản thân",
                        description:
                            "Tập cách giới thiệu bản thân một cách chuyên nghiệp trong các tình huống khác nhau.",
                        level: "beginner",
                        category: "Cá nhân",
                        initialPrompt:
                            "Bạn đang tham dự một buổi gặp gỡ giao lưu nghề nghiệp. Hãy giới thiệu bản thân, công việc, sở thích và mục tiêu nghề nghiệp của bạn.",
                    },
                    {
                        id: "t6",
                        title: "Tranh luận về vấn đề môi trường",
                        description:
                            "Thảo luận về các giải pháp cho vấn đề môi trường và biến đổi khí hậu.",
                        level: "advanced",
                        category: "Xã hội",
                        initialPrompt:
                            "Thảo luận về vai trò của cá nhân và doanh nghiệp trong việc giải quyết khủng hoảng khí hậu. Đề xuất các giải pháp cụ thể và phản hồi các lập luận phản đối.",
                    },
                    {
                        id: "t7",
                        title: "Đặt món tại nhà hàng",
                        description:
                            "Thực hành đặt bàn, gọi món và xử lý các tình huống tại nhà hàng.",
                        level: "beginner",
                        category: "Ẩm thực",
                        initialPrompt:
                            "Bạn đang ăn tối tại một nhà hàng sang trọng. Hãy đặt bàn, hỏi thông tin về các món đặc biệt và dị ứng thực phẩm, và xử lý một vấn đề với đơn hàng của bạn.",
                    },
                    {
                        id: "t8",
                        title: "Hỏi đường và định hướng",
                        description:
                            "Tập cách hỏi và chỉ đường khi du lịch hoặc di chuyển ở nơi lạ.",
                        level: "beginner",
                        category: "Du lịch",
                        initialPrompt:
                            "Bạn đang ở một thành phố mới và cần tìm đường đến một địa điểm du lịch nổi tiếng. Hỏi người địa phương về hướng đi, phương tiện công cộng và các điểm tham quan khác trong khu vực.",
                    },
                    {
                        id: "t9",
                        title: "Thảo luận về sức khỏe và dinh dưỡng",
                        description:
                            "Trao đổi về thói quen sức khỏe, chế độ ăn uống và rèn luyện thể thao.",
                        level: "intermediate",
                        category: "Sức khỏe",
                        initialPrompt:
                            "Bạn đang nói chuyện với một chuyên gia dinh dưỡng về mục tiêu sức khỏe của mình. Thảo luận về chế độ ăn hiện tại, thói quen tập thể dục và nhận lời khuyên để cải thiện sức khỏe tổng thể.",
                    },
                    {
                        id: "t10",
                        title: "Đàm phán trong kinh doanh",
                        description:
                            "Luyện tập kỹ năng đàm phán, thương lượng hợp đồng và giá cả.",
                        level: "advanced",
                        category: "Công việc",
                        initialPrompt:
                            "Bạn đang đàm phán một hợp đồng kinh doanh quan trọng với đối tác tiềm năng. Thảo luận về điều khoản, giá cả, thời hạn và các yêu cầu đặc biệt, và cố gắng đạt được thỏa thuận có lợi cho cả hai bên.",
                    },
                ];

                setTopics(sampleTopics);

                // Chọn chủ đề đầu tiên làm mặc định
                if (sampleTopics.length > 0) {
                    setSelectedTopic(sampleTopics[0]);
                }
            } catch (err) {
                console.error("Lỗi khi tải chủ đề hội thoại:", err);
                setError(
                    "Không thể tải danh sách chủ đề. Vui lòng thử lại sau."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return {
        topics,
        selectedTopic,
        setSelectedTopic,
        isLoading,
        error,
    };
}
