import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedCategories: { id: number; name: string }[];
  selectedLevels: string[];
  selectedLanguages: string[];
  selectedTags: string[];
  selectedRating: number | null;
  selectedDuration: string | null;
  priceRange: [number, number];
  maxPrice: number;
  removeCategory: (id: number) => void;
  removeLevel: (level: string) => void;
  removeLanguage: (language: string) => void;
  removeTag: (tag: string) => void;
  removeRating: () => void;
  removeDuration: () => void;
  resetPriceRange: () => void;
  clearAllFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategories,
  selectedLevels,
  selectedLanguages,
  selectedTags,
  selectedRating,
  selectedDuration,
  priceRange,
  maxPrice,
  removeCategory,
  removeLevel,
  removeLanguage,
  removeTag,
  removeRating,
  removeDuration,
  resetPriceRange,
  clearAllFilters
}) => {
  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedLevels.length > 0 || 
    selectedLanguages.length > 0 || 
    selectedTags.length > 0 || 
    selectedRating !== null || 
    selectedDuration !== null || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice;
  
  if (!hasActiveFilters) return null;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };
  
  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'short': return 'Ngắn (< 5 giờ)';
      case 'medium': return 'Trung bình (5-10 giờ)';
      case 'long': return 'Dài (> 10 giờ)';
      default: return duration;
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <X size={14} className="mr-1" />
            Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map(category => (
          <div 
            key={`category-${category.id}`}
            className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Danh mục: {category.name}</span>
            <button 
              onClick={() => removeCategory(category.id)}
              className="ml-2 text-indigo-500 hover:text-indigo-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedLevels.map(level => (
          <div 
            key={`level-${level}`}
            className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Cấp độ: {level}</span>
            <button 
              onClick={() => removeLevel(level)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedLanguages.map(language => (
          <div 
            key={`language-${language}`}
            className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Ngôn ngữ: {language}</span>
            <button 
              onClick={() => removeLanguage(language)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedTags.map(tag => (
          <div 
            key={`tag-${tag}`}
            className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Tag: {tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="ml-2 text-purple-500 hover:text-purple-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedRating !== null && (
          <div 
            className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Đánh giá: {selectedRating}+ sao</span>
            <button 
              onClick={removeRating}
              className="ml-2 text-yellow-500 hover:text-yellow-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {selectedDuration !== null && (
          <div 
            className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Thời lượng: {getDurationLabel(selectedDuration)}</span>
            <button 
              onClick={removeDuration}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <div 
            className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            <span>Giá: {formatPrice(priceRange[0])}đ - {formatPrice(priceRange[1])}đ</span>
            <button 
              onClick={resetPriceRange}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
