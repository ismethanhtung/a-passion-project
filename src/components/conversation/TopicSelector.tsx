import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ConversationTopic } from "@/app/conversation/page";

interface TopicSelectorProps {
    topics: ConversationTopic[];
    selectedTopic: ConversationTopic | null;
    setSelectedTopic: (topic: ConversationTopic) => void;
    isCustom: boolean;
    setIsCustom: (isCustom: boolean) => void;
    customScenario: string;
    setCustomScenario: (scenario: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
    topics,
    selectedTopic,
    setSelectedTopic,
    isCustom,
    setIsCustom,
    customScenario,
    setCustomScenario,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<
        Record<string, boolean>
    >({});

    // Lọc và nhóm các chủ đề theo danh mục
    const filteredTopicsByCategory = topics.reduce<
        Record<string, ConversationTopic[]>
    >((acc, topic) => {
        // Bỏ qua nếu không khớp với từ khóa tìm kiếm
        if (
            searchTerm &&
            !topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !topic.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return acc;
        }

        // Thêm vào danh mục
        if (!acc[topic.category]) {
            acc[topic.category] = [];
        }
        acc[topic.category].push(topic);
        return acc;
    }, {});

    // Toggle mở rộng cho một danh mục
    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    return (
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex items-center space-x-2">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chọn chủ đề hoặc tạo ngữ cảnh tùy chỉnh
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm chủ đề..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isCustom}
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isCustom}
                            onChange={() => setIsCustom(!isCustom)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Tùy chỉnh
                        </span>
                    </label>
                </div>
            </div>

            {isCustom ? (
                <div className="w-full">
                    <textarea
                        placeholder="Mô tả ngữ cảnh hội thoại bạn muốn thực hành..."
                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                        value={customScenario}
                        onChange={(e) => setCustomScenario(e.target.value)}
                    />
                </div>
            ) : (
                <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    {Object.entries(filteredTopicsByCategory).length > 0 ? (
                        Object.entries(filteredTopicsByCategory).map(
                            ([category, topicsInCategory]) => (
                                <div
                                    key={category}
                                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                >
                                    <button
                                        className="flex items-center justify-between w-full p-4 text-left font-medium"
                                        onClick={() => toggleCategory(category)}
                                    >
                                        <span>{category}</span>
                                        {expandedCategories[category] ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>
                                    {expandedCategories[category] && (
                                        <div className="px-4 pb-4">
                                            <div className="space-y-2">
                                                {topicsInCategory.map(
                                                    (topic) => (
                                                        <div
                                                            key={topic.id}
                                                            className={`cursor-pointer p-3 rounded-md ${
                                                                selectedTopic?.id ===
                                                                topic.id
                                                                    ? "bg-blue-100 dark:bg-blue-900"
                                                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            }`}
                                                            onClick={() =>
                                                                setSelectedTopic(
                                                                    topic
                                                                )
                                                            }
                                                        >
                                                            <div className="flex justify-between">
                                                                <h3 className="font-medium">
                                                                    {
                                                                        topic.title
                                                                    }
                                                                </h3>
                                                                <span
                                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                                        topic.level ===
                                                                        "beginner"
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                            : topic.level ===
                                                                              "intermediate"
                                                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                    }`}
                                                                >
                                                                    {topic.level
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        topic.level.slice(
                                                                            1
                                                                        )}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {
                                                                    topic.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        )
                    ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Không tìm thấy chủ đề phù hợp
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
