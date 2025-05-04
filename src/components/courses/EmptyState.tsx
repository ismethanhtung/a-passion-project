import React from "react";
import { SearchX, RefreshCw } from "lucide-react";

interface EmptyStateProps {
    resetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ resetFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
                <SearchX size={64} className="text-gray-400" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
                No courses found
            </h3>

            <p className="text-gray-600 text-center mb-6 max-w-md">
                No courses found that match the current filters. Please try
                adjusting the filters or searching with different keywords.
            </p>

            <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
                <RefreshCw size={16} className="mr-2" />
                <span>Clear filters</span>
            </button>
        </div>
    );
};

export default EmptyState;
