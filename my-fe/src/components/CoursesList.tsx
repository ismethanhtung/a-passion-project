import React from "react";
import CourseCard from "./courseCard";

const CoursesList: React.FC = () => {
    const COURSES = [
        {
            img: `/image/books/RectangleBig1.svg`,
            category: "Frank Herbert",
            title: "Dune",
            desc: "A classic epic that explores political intrigue and power struggles on a desert planet.",
            price: "$99",
            offPrice: "$79",
        },
        {
            img: `/image/books/RectangleBig7.svg`,
            category: "William Gibson",
            title: "Neuromancer",
            desc: "A pioneering cyberpunk novel filled with futuristic technology and hackers.",
            price: "$99",
            offPrice: "$79",
        },
        {
            img: `/image/books/RectangleBig1.svg`,
            category: "J.R.R. Tolkien",
            title: "The Hobbit",
            desc: "A timeless adventure through Middle-earth, featuring Bilbo Baggins and his quest.",
            price: "$99",
            offPrice: "$79",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {COURSES.map((course, index) => (
                <CourseCard key={index} {...course} />
            ))}
        </div>
    );
};

export default CoursesList;
