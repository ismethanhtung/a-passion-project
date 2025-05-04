import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Star, 
  Clock, 
  BookOpen, 
  Globe, 
  Tag, 
  DollarSign 
} from 'lucide-react';

interface FilterProps {
  categories: { id: number; name: string }[];
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
  selectedLevels: string[];
  setSelectedLevels: (levels: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  selectedDuration: string | null;
  setSelectedDuration: (duration: string | null) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
  clearAllFilters: () => void;
}

const CourseFilters: React.FC<FilterProps> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  maxPrice,
  selectedRating,
  setSelectedRating,
  selectedLevels,
  setSelectedLevels,
  selectedLanguages,
  setSelectedLanguages,
  selectedDuration,
  setSelectedDuration,
  selectedTags,
  setSelectedTags,
  availableTags,
  clearAllFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    level: true,
    language: true,
    duration: true,
    tags: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels(
      selectedLevels.includes(level)
        ? selectedLevels.filter(l => l !== level)
        : [...selectedLevels, level]
    );
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(language)
        ? selectedLanguages.filter(l => l !== language)
        : [...selectedLanguages, language]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const durations = [
    { value: 'short', label: 'Ngắn (< 5 giờ)' },
    { value: 'medium', label: 'Trung bình (5-10 giờ)' },
    { value: 'long', label: 'Dài (> 10 giờ)' }
  ];

  const languages = ['Tiếng Việt', 'English', 'Other'];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice || 
    selectedRating !== null || 
    selectedLevels.length > 0 || 
    selectedLanguages.length > 0 || 
    selectedDuration !== null || 
    selectedTags.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <X size={16} className="mr-1" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('categories')}
        >
          <div className="flex items-center">
            <Tag size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Danh mục</h3>
          </div>
          {expandedSections.categories ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.categories && (
          <div className="pl-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('price')}
        >
          <div className="flex items-center">
            <DollarSign size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Giá</h3>
          </div>
          {expandedSections.price ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.price && (
          <div className="pl-2 space-y-4">
            <Slider
              defaultValue={[priceRange[0], priceRange[1]]}
              max={maxPrice}
              step={10000}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-6"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {formatPrice(priceRange[0])}đ
              </span>
              <span className="text-sm font-medium text-gray-700">
                {formatPrice(priceRange[1])}đ
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('rating')}
        >
          <div className="flex items-center">
            <Star size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Đánh giá</h3>
          </div>
          {expandedSections.rating ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.rating && (
          <div className="pl-2 space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`rating-${rating}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600 flex items-center"
                >
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array(5 - rating).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-gray-300" />
                  ))}
                  <span className="ml-1">& up</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('level')}
        >
          <div className="flex items-center">
            <BookOpen size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Cấp độ</h3>
          </div>
          {expandedSections.level ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.level && (
          <div className="pl-2 space-y-2">
            {levels.map(level => (
              <div key={level} className="flex items-center">
                <input
                  type="checkbox"
                  id={`level-${level}`}
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleLevelChange(level)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`level-${level}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('language')}
        >
          <div className="flex items-center">
            <Globe size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Ngôn ngữ</h3>
          </div>
          {expandedSections.language ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.language && (
          <div className="pl-2 space-y-2">
            {languages.map(language => (
              <div key={language} className="flex items-center">
                <input
                  type="checkbox"
                  id={`language-${language}`}
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`language-${language}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {language}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('duration')}
        >
          <div className="flex items-center">
            <Clock size={18} className="mr-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Thời lượng</h3>
          </div>
          {expandedSections.duration ? 
            <ChevronUp size={18} className="text-gray-500" /> : 
            <ChevronDown size={18} className="text-gray-500" />
          }
        </div>
        
        {expandedSections.duration && (
          <div className="pl-2 space-y-2">
            {durations.map(duration => (
              <div key={duration.value} className="flex items-center">
                <input
                  type="radio"
                  id={`duration-${duration.value}`}
                  name="duration"
                  checked={selectedDuration === duration.value}
                  onChange={() => setSelectedDuration(selectedDuration === duration.value ? null : duration.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`duration-${duration.value}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                >
                  {duration.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer mb-3"
            onClick={() => toggleSection('tags')}
          >
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-indigo-600" />
              <h3 className="font-semibold text-gray-700">Tags</h3>
            </div>
            {expandedSections.tags ? 
              <ChevronUp size={18} className="text-gray-500" /> : 
              <ChevronDown size={18} className="text-gray-500" />
            }
          </div>
          
          {expandedSections.tags && (
            <div className="pl-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {availableTags.map(tag => (
                <div key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label 
                    htmlFor={`tag-${tag}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseFilters;
