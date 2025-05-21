import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    Book,
    Bookmark,
    CheckCircle,
    Award,
    BookOpen,
    FileText,
    Users,
    Heart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface LearningPathRendererProps {
    jsonData: string;
}

const LearningPathRenderer: React.FC<LearningPathRendererProps> = ({
    jsonData,
}) => {
    const [activePhase, setActivePhase] = useState<string>("phase-1");
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    // Hàm cuộn tab sang trái
    const scrollTabsLeft = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
            });
        }
    };

    // Hàm cuộn tab sang phải
    const scrollTabsRight = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollBy({
                left: 200,
                behavior: "smooth",
            });
        }
    };

    let parsedData;
    try {
        parsedData = JSON.parse(jsonData);
    } catch (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                Không thể phân tích dữ liệu JSON. Vui lòng kiểm tra lại định
                dạng.
            </div>
        );
    }

    const learningPlan = parsedData?.learning_plan;

    if (!learningPlan) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-600">
                Không tìm thấy dữ liệu lộ trình học tập.
            </div>
        );
    }

    const {
        basic_information,
        phases,
        learning_strategy,
        evaluation_and_adjustment,
        additional_resources,
        advice,
    } = learningPlan;

    // Hàm xử lý khi thay đổi tab
    const handleTabChange = (value: string) => {
        setActivePhase(value);
    };

    return (
        <div className="learning-path-container w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 rounded-t-xl text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Lộ Trình Học Tập Cá Nhân Hóa
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                    <Badge
                        variant="outline"
                        className="bg-white/20 text-white border-white/30 px-3 py-1"
                    >
                        {basic_information?.goal?.target_score || "Mục tiêu"}
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-white/20 text-white border-white/30 px-3 py-1"
                    >
                        <Clock className="w-4 h-4 mr-1" />
                        {basic_information?.duration?.total_months || "?"} tháng
                    </Badge>
                </div>
                <p className="text-white/90 mb-2">
                    {basic_information?.goal?.description ||
                        "Không có mô tả mục tiêu"}
                </p>
            </div>

            {/* Basic Information */}
            <Card className="mb-6 border-t-0 rounded-t-none shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-violet-700">
                        Thông tin cơ bản
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                <BookOpen className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                Trình độ hiện tại
                            </h3>
                            <p className="text-gray-600 mb-1">
                                {basic_information?.current_level
                                    ?.description || "Chưa có thông tin"}
                            </p>
                            {basic_information?.current_level?.test_results && (
                                <p className="text-sm text-gray-500">
                                    {
                                        basic_information.current_level
                                            .test_results.test_name
                                    }
                                    :{" "}
                                    {
                                        basic_information.current_level
                                            .test_results.score
                                    }
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                Thời gian học tập
                            </h3>
                            <p className="text-gray-600">
                                {basic_information?.duration?.start_date} -{" "}
                                {basic_information?.duration?.end_date}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-medium text-gray-700 flex items-center mb-2">
                            <Award className="w-4 h-4 mr-2 text-violet-500" />{" "}
                            Kết quả mong đợi
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {basic_information?.expected_outcomes?.map(
                                (outcome: any, index: number) => (
                                    <li key={index}>{outcome.description}</li>
                                )
                            ) || <li>Chưa có thông tin</li>}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Phases */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-violet-700 mb-4">
                    Các giai đoạn học tập
                </h2>

                <Tabs
                    value={activePhase}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <div className="relative">
                        {/* Nút cuộn sang trái */}
                        <button
                            onClick={scrollTabsLeft}
                            className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white to-transparent px-1 flex items-center justify-center"
                            aria-label="Cuộn sang trái"
                        >
                            <ChevronLeft className="h-5 w-5 text-violet-500" />
                        </button>

                        {/* Tabs container với ref */}
                        <div
                            ref={tabsContainerRef}
                            className="overflow-hidden mx-6"
                        >
                            <TabsList className="mb-2 flex justify-start overflow-x-auto pb-1 scrollbar-hide w-full">
                                {phases?.map((phase: any, index: number) => (
                                    <TabsTrigger
                                        key={index}
                                        value={`phase-${phase.phase_number}`}
                                        className="min-w-[120px] whitespace-nowrap flex-shrink-0 text-sm px-4"
                                    >
                                        {phase.title ||
                                            `Giai đoạn ${phase.phase_number}`}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Nút cuộn sang phải */}
                        <button
                            onClick={scrollTabsRight}
                            className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white to-transparent px-1 flex items-center justify-center"
                            aria-label="Cuộn sang phải"
                        >
                            <ChevronRight className="h-5 w-5 text-violet-500" />
                        </button>
                    </div>

                    {phases?.map((phase: any, index: number) => (
                        <TabsContent
                            key={index}
                            value={`phase-${phase.phase_number}`}
                            className="border rounded-lg p-4"
                        >
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-lg text-violet-700">
                                        {phase.title ||
                                            `Giai đoạn ${phase.phase_number}`}
                                    </h3>
                                    <Badge
                                        variant="outline"
                                        className="bg-violet-50 text-violet-700 border-violet-200"
                                    >
                                        {phase.timeframe?.start_date} -{" "}
                                        {phase.timeframe?.end_date}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                            Mục tiêu giai đoạn
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {phase.goals?.map(
                                                (goal: any, idx: number) => (
                                                    <li key={idx}>
                                                        {goal.description}
                                                    </li>
                                                )
                                            ) || <li>Chưa có thông tin</li>}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                            Kỹ năng trọng tâm
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {phase.focus_skills?.map(
                                                (
                                                    skill: string,
                                                    idx: number
                                                ) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                )
                                            ) || (
                                                <span className="text-gray-500">
                                                    Chưa có thông tin
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                        <Book className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                        Tài liệu học tập
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {phase.resources?.map(
                                            (resource: any, idx: number) => (
                                                <Card
                                                    key={idx}
                                                    className="bg-gray-50"
                                                >
                                                    <CardHeader className="py-3 px-4">
                                                        <CardTitle className="text-base font-medium">
                                                            <a
                                                                href={
                                                                    resource.link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline flex items-center"
                                                            >
                                                                <FileText className="w-4 h-4 mr-2" />{" "}
                                                                {resource.name}
                                                            </a>
                                                        </CardTitle>
                                                        <CardDescription className="text-xs">
                                                            {resource.type}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="py-2 px-4">
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                resource.description
                                                            }
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )
                                        ) || (
                                            <p className="text-gray-500">
                                                Chưa có tài liệu
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                        <Bookmark className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                        Khóa học
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {phase.courses?.map(
                                            (course: any, idx: number) => (
                                                <Card
                                                    key={idx}
                                                    className="bg-gray-50"
                                                >
                                                    <CardHeader className="py-3 px-4">
                                                        <CardTitle className="text-base font-medium">
                                                            <a
                                                                href={
                                                                    course.link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {course.name}
                                                            </a>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="py-2 px-4">
                                                        <p className="text-sm text-gray-600">
                                                            {course.description}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )
                                        ) || (
                                            <p className="text-gray-500">
                                                Chưa có khóa học
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                        Lịch trình hàng tuần
                                    </h4>
                                    <div className="space-y-3">
                                        {phase.weekly_schedule?.map(
                                            (week: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="border rounded p-3 bg-white"
                                                >
                                                    <h5 className="font-medium text-violet-600 mb-1">
                                                        {week.weeks}
                                                    </h5>
                                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                        {week.activities.map(
                                                            (
                                                                activity: string,
                                                                actIdx: number
                                                            ) => (
                                                                <li
                                                                    key={actIdx}
                                                                    className="text-sm"
                                                                >
                                                                    {activity}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )
                                        ) || (
                                            <p className="text-gray-500">
                                                Chưa có lịch trình
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Learning Strategy */}
            <Card className="mb-6 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-violet-700">
                        Chiến lược học tập
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                <BookOpen className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                Phương pháp học
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {learning_strategy?.methods?.map(
                                    (method: string, index: number) => (
                                        <li key={index}>{method}</li>
                                    )
                                ) || <li>Chưa có thông tin</li>}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                <Clock className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                Kế hoạch hàng ngày
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {learning_strategy?.daily_plan?.map(
                                    (plan: any, index: number) => (
                                        <li key={index}>
                                            {plan.activity} - {plan.duration}
                                        </li>
                                    )
                                ) || <li>Chưa có thông tin</li>}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-medium text-gray-700 flex items-center mb-2">
                            <Heart className="w-4 h-4 mr-2 text-violet-500" />{" "}
                            Lời khuyên
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {advice?.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            )) || <li>Chưa có lời khuyên</li>}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card className="shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-violet-700">
                        Tài nguyên bổ sung
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        {additional_resources?.reference_materials &&
                            additional_resources.reference_materials.length >
                                0 && (
                                <div>
                                    <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                        <Book className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                        Tài liệu tham khảo
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {additional_resources.reference_materials.map(
                                            (material: any, idx: number) => (
                                                <Card
                                                    key={idx}
                                                    className="bg-gray-50"
                                                >
                                                    <CardHeader className="py-2 px-3">
                                                        <CardTitle className="text-sm font-medium">
                                                            <a
                                                                href={
                                                                    material.link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {material.name}
                                                            </a>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="py-1 px-3">
                                                        <p className="text-xs text-gray-600">
                                                            {
                                                                material.description
                                                            }
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {additional_resources?.communities &&
                            additional_resources.communities.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-gray-700 flex items-center mb-2">
                                        <Users className="w-4 h-4 mr-2 text-violet-500" />{" "}
                                        Cộng đồng học tập
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {additional_resources.communities.map(
                                            (community: any, idx: number) => (
                                                <Card
                                                    key={idx}
                                                    className="bg-gray-50"
                                                >
                                                    <CardHeader className="py-2 px-3">
                                                        <CardTitle className="text-sm font-medium">
                                                            {community.name}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="py-1 px-3">
                                                        <p className="text-xs text-gray-600">
                                                            {
                                                                community.description
                                                            }
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LearningPathRenderer;
