import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

interface TestFilterProps {
    selectedCategory: string;
    selectedDifficulty: string;
    sortBy: string;
    onCategoryChange: (category: string) => void;
    onDifficultyChange: (difficulty: string) => void;
    onSortChange: (sort: string) => void;
}

const TestFilter: React.FC<TestFilterProps> = ({
    selectedCategory,
    selectedDifficulty,
    sortBy,
    onCategoryChange,
    onDifficultyChange,
    onSortChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const categories = ["All", "TOEIC", "IELTS", "Placement", "General"];
    const difficulties = ["", "Beginner", "Intermediate", "Advanced", "Expert"];
    const sortOptions = [
        { value: "popular", label: "Phổ biến nhất" },
        { value: "newest", label: "Mới nhất" },
        { value: "completion", label: "Tỷ lệ hoàn thành" },
    ];

    return (
        <div className="w-full md:w-auto">
            {/* Mobile filter button */}
            <div className="md:hidden w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg"
                >
                    <div className="flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-gray-500" />
                        <span>Lọc bài kiểm tra</span>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                            isOpen ? "transform rotate-180" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Desktop filter controls */}
            <div
                className={`md:flex gap-3 ${
                    isOpen ? "block mt-4" : "hidden md:block"
                }`}
            >
                {/* Category filter */}
                <div className="mb-3 md:mb-0">
                    <label className="block text-sm text-gray-500 mb-1">
                        Loại
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => onCategoryChange(category)}
                                className={`px-3 py-1.5 rounded-md text-sm ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty filter */}
                <div className="mb-3 md:mb-0 md:mx-4">
                    <label className="block text-sm text-gray-500 mb-1">
                        Độ khó
                    </label>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                        className="px-3 py-2 bg-gray-100 rounded-md text-sm w-full md:w-auto border-0 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả độ khó</option>
                        {difficulties.slice(1).map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                                {difficulty}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort filter */}
                <div>
                    <label className="block text-sm text-gray-500 mb-1">
                        Sắp xếp
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2 bg-gray-100 rounded-md text-sm w-full md:w-auto border-0 focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TestFilter;
