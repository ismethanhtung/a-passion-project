import React from "react";

interface CourseCardProps {
    img: string;
    category: string;
    title: string;
    desc: string;
    price: string;
    offPrice: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
    img,
    category,
    title,
    desc,
    price,
    offPrice,
}) => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <img src={img} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <div className="text-sm text-gray-500">{category}</div>
                <h2 className="text-xl font-semibold mt-2">{title}</h2>
                <p className="text-gray-700 mt-2">{desc}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-gray-900">
                        {offPrice}
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
