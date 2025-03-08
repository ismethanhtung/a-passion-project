import React from "react";
import FormWrapper from "../FormWrapper";
import { updateUser } from "@/api/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const LearningGoals: any = () => {
    const user = useSelector((state: RootState) => state.user.user);
    if (!user) {
        return alert("Bạn cần đăng nhập.");
    }
    const userId = user.id;
    const handleSubmit = async (formData: Record<string, string>) => {
        if (!userId) {
            alert("Không tìm thấy ID người dùng.");
            return;
        }

        try {
            console.log(formData);
            await updateUser(Number(userId), formData);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <FormWrapper
            title="Learning Goals"
            fields={[
                {
                    name: "learningPurpose",
                    label: "Học để làm gì?",
                    type: "text",
                    placeholder: "Công việc, giao tiếp, thi chứng chỉ...",
                },
                {
                    name: "specificGoals",
                    label: "Mục tiêu cụ thể?",
                    type: "text",
                    placeholder: "TOEIC 750+, IELTS 6.5+, giao tiếp thành thạo...",
                },
                {
                    name: "prioritySkills",
                    label: "Kỹ năng ưu tiên?",
                    type: "text",
                    placeholder: "Nghe - Nói, Đọc - Viết, Ngữ pháp...",
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
};

export default LearningGoals;
