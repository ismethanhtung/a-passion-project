import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ConfirmSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    totalQuestions: number;
    answeredQuestions: number;
}

const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    totalQuestions,
    answeredQuestions,
}) => {
    if (!isOpen) return null;

    const percentageAnswered = Math.round(
        (answeredQuestions / totalQuestions) * 100
    );
    const isAllAnswered = answeredQuestions === totalQuestions;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="text-center mb-5">
                    {isAllAnswered ? (
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    ) : (
                        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                            <AlertCircle className="h-6 w-6 text-amber-600" />
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {isAllAnswered
                            ? "Nộp bài kiểm tra?"
                            : "Bạn chưa hoàn thành tất cả câu hỏi"}
                    </h3>

                    <p className="text-gray-600 text-sm">
                        {isAllAnswered
                            ? "Bạn đã trả lời tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài?"
                            : `Bạn đã hoàn thành ${percentageAnswered}% (${answeredQuestions}/${totalQuestions} câu). Bạn có muốn nộp bài ngay bây giờ?`}
                    </p>
                </div>

                {!isAllAnswered && (
                    <div className="mb-5 bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-200 text-sm">
                        <p>
                            Những câu hỏi chưa được trả lời sẽ được tính là
                            không điểm. Bạn vẫn có thể quay lại và hoàn thành
                            chúng trước khi nộp bài.
                        </p>
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    <button
                        onClick={onConfirm}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                        Xác nhận nộp bài
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg"
                    >
                        Quay lại làm bài
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSubmitModal;
