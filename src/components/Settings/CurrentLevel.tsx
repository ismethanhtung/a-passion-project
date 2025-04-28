import React from "react";
import FormWrapper from "../FormWrapper";
import { updateUser } from "@/api/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const CurrentLevel: any = () => {
    const router = useRouter();

    const user = useSelector((state: RootState) => state.user.user);
    if (!user) {
        router.push("/auth/login");
        return;
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
            console.log(error);
        }
    };

    return (
        <FormWrapper
            title="Current Level"
            fields={[
                {
                    name: "assessmentTest",
                    label: "Bài test đánh giá đầu vào",
                    type: "text",
                    placeholder: "CEFR A1-C2, điểm TOEIC/IELTS nếu có...",
                },
                {
                    name: "skillLevel",
                    label: "Trình độ từng kỹ năng",
                    type: "text",
                    placeholder: "Nghe tốt nhưng Nói kém, Ngữ pháp yếu...",
                },
                {
                    name: "knownVocabulary",
                    label: "Từ vựng đã biết khoảng bao nhiêu từ?",
                    type: "text",
                    placeholder: "Khoảng 1000 từ, 5000 từ...",
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
};

export default CurrentLevel;
