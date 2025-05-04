import React, { useState } from "react";
import { ChevronDown, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

export type SortOption =
    | "newest"
    | "popularity"
    | "price-low"
    | "price-high"
    | "rating"
    | "duration-short"
    | "duration-long";

interface CourseSortingProps {
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
}

const CourseSorting: React.FC<CourseSortingProps> = ({
    sortOption,
    setSortOption,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: "newest", label: "Newest", icon: <ArrowDown size={16} /> },
        {
            value: "popularity",
            label: "Popular",
            icon: <ArrowDown size={16} />,
        },
        {
            value: "price-low",
            label: "Price: Low to High",
            icon: <ArrowUp size={16} />,
        },
        {
            value: "price-high",
            label: "Price: High to Low",
            icon: <ArrowDown size={16} />,
        },
        {
            value: "rating",
            label: "Highest Rating",
            icon: <ArrowDown size={16} />,
        },
        {
            value: "duration-short",
            label: "Shortest Duration",
            icon: <ArrowUp size={16} />,
        },
        {
            value: "duration-long",
            label: "Longest Duration",
            icon: <ArrowDown size={16} />,
        },
    ];

    const currentOption =
        sortOptions.find((option) => option.value === sortOption) ||
        sortOptions[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <div className="flex items-center">
                    <ArrowUpDown size={16} className="mr-2 text-gray-500" />
                    <span>Sort by: </span>
                    <span className="ml-1 font-semibold text-indigo-600">
                        {currentOption.label}
                    </span>
                </div>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="py-1">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setSortOption(option.value as SortOption);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 ${
                                    option.value === sortOption
                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                        : "text-gray-700"
                                }`}
                            >
                                <span className="mr-2">{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSorting;
