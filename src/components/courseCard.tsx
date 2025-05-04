import React from "react";
import Link from "next/link";
import { Clock, Star, Users, BookOpen } from "lucide-react";

interface CourseCardProps {
    id: number;
    thumbnail: string;
    tags?: string;
    title: string;
    description: string;
    price: number;
    newPrice: number;
    rating?: number;
    time?: number;
    students?: number;
    lessons?: number;
}

const formatCurrency = (price: number): string => {
    return price.toLocaleString("vi-VN");
};

const CourseCard: React.FC<CourseCardProps> = ({
    id,
    thumbnail,
    tags = "",
    title,
    description,
    price,
    newPrice,
    rating = 4.5,
    time = 10,
    students = Math.floor(Math.random() * 50) + 50,
    lessons = Math.floor(Math.random() * 30) + 5,
}) => {
    // Convert tags string to array for rendering
    const tagsList = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    return (
        <Link
            href={`/courses/${id}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#6E59A5]/30 flex flex-col h-full transform hover:-translate-y-1"
        >
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {tagsList.length > 0 && (
                    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                        {tagsList.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[#6E59A5]  text-white text-xs font-medium rounded-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-20">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {students} học viên
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {lessons} bài học
                    </div>
                </div>
            </div>

            <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#6E59A5] transition-colors">
                    {title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 italic">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-lg font-bold text-[#6E59A5]">
                            {formatCurrency(newPrice)}đ
                        </p>
                        {price > 0 && price !== newPrice && (
                            <span className="text-xs line-through text-gray-400">
                                {formatCurrency(price)}đ
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium ml-1">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{time} Hrs</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
