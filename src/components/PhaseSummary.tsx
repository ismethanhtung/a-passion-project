"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, BookOpen, Clock, Calendar } from "lucide-react";

interface PhaseSummaryProps {
    phaseNumber: number;
    phaseTitle: string;
    startDate: string;
    endDate: string;
    completedResources: number;
    totalResources: number;
    completedCourses: number;
    totalCourses: number;
    keySkills: string[];
    onStartTest: () => void;
    onContinue: () => void;
}

const PhaseSummary: React.FC<PhaseSummaryProps> = ({
    phaseNumber,
    phaseTitle,
    startDate,
    endDate,
    completedResources,
    totalResources,
    completedCourses,
    totalCourses,
    keySkills,
    onStartTest,
    onContinue,
}) => {
    // Tính toán phần trăm hoàn thành
    const resourcesPercentage =
        Math.round((completedResources / totalResources) * 100) || 0;
    const coursesPercentage =
        Math.round((completedCourses / totalCourses) * 100) || 0;
    const overallPercentage = Math.round(
        (resourcesPercentage + coursesPercentage) / 2
    );

    // Xác định trạng thái sẵn sàng cho bài kiểm tra
    const isReadyForTest = overallPercentage >= 70;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="bg-violet-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Award className="w-6 h-6 text-violet-500 mr-2" />
                        <span>Tổng kết giai đoạn {phaseNumber}</span>
                    </div>
                    <Badge variant="outline" className="bg-white">
                        {overallPercentage}% hoàn thành
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-violet-700 mb-2">
                            {phaseTitle}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                                {startDate} - {endDate}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <BookOpen className="w-4 h-4 text-violet-500 mr-2" />
                                    <span className="font-medium">
                                        Tài liệu học tập
                                    </span>
                                </div>
                                <Badge
                                    variant={
                                        resourcesPercentage >= 70
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {resourcesPercentage}%
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                                Đã hoàn thành {completedResources}/
                                {totalResources} tài liệu
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-violet-500 mr-2" />
                                    <span className="font-medium">
                                        Khóa học
                                    </span>
                                </div>
                                <Badge
                                    variant={
                                        coursesPercentage >= 70
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {coursesPercentage}%
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                                Đã hoàn thành {completedCourses}/{totalCourses}{" "}
                                khóa học
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                            Kỹ năng đã học
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {keySkills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {isReadyForTest ? (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-green-700">
                                        Bạn đã sẵn sàng cho bài kiểm tra!
                                    </h4>
                                    <p className="text-sm text-green-600 mt-1">
                                        Hãy làm bài kiểm tra để đánh giá kiến
                                        thức và kỹ năng bạn đã học được trong
                                        giai đoạn này.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                            <div className="flex items-start">
                                <Clock className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-amber-700">
                                        Bạn cần hoàn thành thêm tài liệu và khóa
                                        học
                                    </h4>
                                    <p className="text-sm text-amber-600 mt-1">
                                        Hãy hoàn thành ít nhất 70% tài liệu và
                                        khóa học để sẵn sàng cho bài kiểm tra.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center space-x-3 pt-4">
                        <Button variant="outline" onClick={onContinue}>
                            Tiếp tục học
                        </Button>

                        <Button
                            onClick={onStartTest}
                            disabled={!isReadyForTest}
                        >
                            Làm bài kiểm tra
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PhaseSummary;
