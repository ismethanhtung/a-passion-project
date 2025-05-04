import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface CourseSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    placeholder?: string;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
    searchTerm,
    setSearchTerm,
    placeholder = "Search for courses, skills, or instructors...",
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(localSearchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearchTerm, setSearchTerm]);

    const handleClear = () => {
        setLocalSearchTerm("");
        setSearchTerm("");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div
            className={`relative w-full transition-all duration-300 ${
                isFocused ? "ring-2 ring-indigo-500" : ""
            }`}
        >
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full py-3 pl-10 pr-10 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />

                {localSearchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {isFocused && localSearchTerm && (
                <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 text-xs text-gray-500">
                        Popular search suggestions:
                    </div>
                    <div className="p-2 space-y-1 text-red-300">
                        {["Toeic", "Ielts", "Speaking", "Listening"].map(
                            (suggestion) => (
                                <div
                                    key={suggestion}
                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                                    onClick={() => {
                                        setLocalSearchTerm(suggestion);
                                        setSearchTerm(suggestion);
                                        setIsFocused(false);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSearch;
