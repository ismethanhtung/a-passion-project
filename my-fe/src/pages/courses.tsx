import React from "react";
import CourseCard from "../components/courseCard"; // Import component CourseCard

// Định nghĩa data khóa học (có thể thay đổi từ API hoặc dữ liệu động)
const courses = [
    {
        img: "/image/books/RectangleBig1.svg",
        category: "J.R.R. Tolkien",
        title: "The Hobbit",
        desc: "A timeless adventure through Middle-earth, featuring Bilbo Baggins and his quest.",
        price: "$99",
        offPrice: "$79",
    },
    // Bạn có thể thêm các khóa học khác vào đây
    {
        img: "/image/books/RectangleBig2.svg",
        category: "George R. R. Martin",
        title: "A Game of Thrones",
        desc: "The first book in the epic A Song of Ice and Fire series.",
        price: "$119",
        offPrice: "$99",
    },
    {
        img: "/image/books/RectangleBig3.svg",
        category: "J.K. Rowling",
        title: "Harry Potter and the Sorcerer's Stone",
        desc: "Join Harry Potter as he discovers the magical world at Hogwarts School of Witchcraft and Wizardry.",
        price: "$89",
        offPrice: "$69",
    },
];

const sources: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Our Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} /> // Truyền các props vào CourseCard
                ))}
            </div>
        </div>
    );
};

export default sources;
