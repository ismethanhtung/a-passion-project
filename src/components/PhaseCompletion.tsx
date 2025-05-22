"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

interface PhaseCompletionProps {
    phaseNumber: number;
    phaseTitle: string;
    passed: boolean;
    score: number;
    testType: string;
    onContinue: () => void;
    onCreateNewPath: () => void;
}

const PhaseCompletion: React.FC<PhaseCompletionProps> = ({
    phaseNumber,
    phaseTitle,
    passed,
    score,
    testType,
    onContinue,
    onCreateNewPath,
}) => {
    // Tạo thông điệp dựa trên loại bài kiểm tra và kết quả
    const getMessage = () => {
        if (passed) {
            if (testType === "ielts") {
                return {
                    title: "Chúc mừng bạn đã vượt qua bài kiểm tra IELTS!",
                    description:
                        "Bạn đã thể hiện sự hiểu biết tốt về các kỹ năng IELTS cần thiết cho giai đoạn này. Hãy tiếp tục phát triển trong giai đoạn tiếp theo.",
                };
            } else if (testType === "toeic") {
                return {
                    title: "Xuất sắc! Bạn đã vượt qua bài kiểm tra TOEIC!",
                    description:
                        "Bạn đã nắm vững các kỹ năng TOEIC cần thiết cho giai đoạn này. Hãy tiếp tục phát triển trong giai đoạn tiếp theo.",
                };
            } else {
                return {
                    title: "Chúc mừng! Bạn đã hoàn thành xuất sắc giai đoạn này!",
                    description:
                        "Bạn đã thể hiện sự hiểu biết tốt về các kỹ năng ngôn ngữ cần thiết. Hãy tiếp tục phát triển trong giai đoạn tiếp theo.",
                };
            }
        } else {
            if (testType === "ielts") {
                return {
                    title: "Bạn cần ôn tập thêm về IELTS",
                    description:
                        "Bạn vẫn cần củng cố thêm kiến thức và kỹ năng IELTS trong giai đoạn này. Hãy xem lại các tài liệu và thử lại.",
                };
            } else if (testType === "toeic") {
                return {
                    title: "Bạn cần ôn tập thêm về TOEIC",
                    description:
                        "Bạn vẫn cần củng cố thêm kiến thức và kỹ năng TOEIC trong giai đoạn này. Hãy xem lại các tài liệu và thử lại.",
                };
            } else {
                return {
                    title: "Bạn cần ôn tập thêm",
                    description:
                        "Bạn vẫn cần củng cố thêm kiến thức và kỹ năng trong giai đoạn này. Hãy xem lại các tài liệu và thử lại.",
                };
            }
        }
    };

    const message = getMessage();

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader
                className={`${
                    passed ? "bg-green-50" : "bg-amber-50"
                } rounded-t-lg`}
            >
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        {passed ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-amber-500 mr-2" />
                        )}
                        <span>Kết quả giai đoạn {phaseNumber}</span>
                    </div>
                    <Badge
                        variant={passed ? "default" : "outline"}
                        className={passed ? "" : "text-amber-600"}
                    >
                        Điểm: {score}/100
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    <div className="text-center">
                        <h3
                            className={`text-lg font-medium ${
                                passed ? "text-green-700" : "text-amber-700"
                            } mb-2`}
                        >
                            {message.title}
                        </h3>
                        <p className="text-gray-600">{message.description}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">
                            Thông tin giai đoạn
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Giai đoạn:</strong> {phaseNumber} -{" "}
                            {phaseTitle}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Loại bài kiểm tra:</strong>{" "}
                            {testType.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Kết quả:</strong>{" "}
                            {passed ? "Đạt" : "Chưa đạt"}
                        </p>
                    </div>

                    {!passed && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-amber-700">
                                        Bạn có muốn tiếp tục với lộ trình hiện
                                        tại?
                                    </h4>
                                    <p className="text-sm text-amber-600 mt-1">
                                        Bạn có thể tiếp tục với lộ trình hiện
                                        tại hoặc tạo một lộ trình mới phù hợp
                                        hơn với trình độ của bạn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center space-x-3 pt-4">
                        {!passed && (
                            <Button
                                variant="outline"
                                onClick={onCreateNewPath}
                                className="flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Tạo lộ trình mới
                            </Button>
                        )}

                        <Button
                            onClick={onContinue}
                            className="flex items-center"
                        >
                            {passed ? (
                                <>
                                    Tiếp tục giai đoạn {phaseNumber + 1}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            ) : (
                                "Tiếp tục với lộ trình hiện tại"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PhaseCompletion;
