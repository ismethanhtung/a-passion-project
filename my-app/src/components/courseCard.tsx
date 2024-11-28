import React from "react";
interface CourseCardProps {
    thumbnail: string;
    tag: string;
    title: string;
    description: string;
    price: number;
    newPrice: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
    thumbnail,
    tag,
    title,
    description,
    price,
    newPrice,
}) => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <img
                src={thumbnail}
                alt={title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="text-sm text-gray-500">{tag}</div>
                <h2 className="text-xl font-semibold mt-2">{title}</h2>
                <p className="text-gray-700 mt-2">{description}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-gray-900">
                        {newPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        {price}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
