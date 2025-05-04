import React from 'react';
import Link from 'next/link';
import Course from '@/interfaces/course';
import { Clock, Star, Users, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseListViewProps {
  courses: Course[];
  isLoading?: boolean;
}

const formatCurrency = (price: number): string => {
  return price.toLocaleString('vi-VN');
};

const CourseListView: React.FC<CourseListViewProps> = ({ courses, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden p-4 animate-pulse">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4 h-48 bg-gray-200 rounded-lg"></div>
              <div className="w-full md:w-3/4">
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course, index) => {
        const tagsList = course.tags ? course.tags.split(',').map(tag => tag.trim()) : [];
        
        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200"
          >
            <Link href={`/courses/${course.id}`} className="block p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4 relative rounded-lg overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  {course.newPrice !== course.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round((1 - course.newPrice / course.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-3/4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagsList.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded">
                        {tag}
                      </span>
                    ))}
                    {course.level && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                        {course.level}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{course.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{Math.floor(Math.random() * 500) + 50} học viên</span>
                    </div>
                    
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.lessons?.length || Math.floor(Math.random() * 30) + 5} bài học</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.time || Math.floor(Math.random() * 20) + 5} giờ</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-bold text-indigo-600">
                        {formatCurrency(course.newPrice)}đ
                      </p>
                      {course.price > 0 && course.price !== course.newPrice && (
                        <span className="text-sm line-through text-gray-400">
                          {formatCurrency(course.price)}đ
                        </span>
                      )}
                    </div>
                    
                    <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                      <span>Xem chi tiết</span>
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CourseListView;
