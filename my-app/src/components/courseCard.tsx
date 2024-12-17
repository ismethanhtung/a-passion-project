import React from "react";
import Link from "next/link";

interface CourseCardProps {
    id: number;
    thumbnail: string;
    // tag: string;
    title: string;
    description: string;
    price: number;
    newPrice: number;
    // rating: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
    id,
    thumbnail,
    // tag,
    title,
    description,
    price,
    newPrice,
    // rating,
}) => {
    return (
        <Link
            href={`/courses/${id}`}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden transform flex flex-col"
        >
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-40 object-cover border-b-2 border-gray-200"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                {/* <span className="text-xs text-gray-500 uppercase">{tag}</span> */}
                <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600 py-2 mb-4">{description}</p>
                <div className="flex items-end justify-between mt-auto">
                    <div>
                        <p className=" text-lg font-bold text-indigo-600">{newPrice}đ</p>
                        {newPrice && (
                            <span className="text line-through text-yellow-400">{price}đ</span>
                        )}
                    </div>
                    <div className="flex bg-red-50 rounded-lg p-1">
                        <img src="/icons/star.png" className="size-3" />
                        <p className="text-xs pl-1 font-bold text-gray-500">{4.6}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
