"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

interface CommentProps {
    userName: string;
    userLevel: string;
    userImage: string;
    comment: string;
    category: string;
    course: string;
}

const comments: CommentProps[] = [
    {
        userName: "Anna Nguyen",
        userLevel: "Intermediate Learner",
        userImage: "/images/avatar/avatar1.png",
        comment:
            "The 'Learn English by Song' course made learning fun and easy. I can now understand lyrics better and sing along with confidence!",
        category: "Listening",
        course: "Learn English by Song",
    },
    {
        userName: "Brian Tran",
        userLevel: "Beginner",
        userImage: "/images/avatar/avatar2.png",
        comment:
            "The reading materials are engaging and simple to follow. I've improved my vocabulary significantly in just a few weeks!",
        category: "Reading",
        course: "Improve Your Reading Skills",
    },
    {
        userName: "Sarah Le",
        userLevel: "Advanced Speaker",
        userImage: "/images/avatar/avatar3.png",
        comment:
            "The writing exercises were both creative and practical. My essays and emails are now clearer and more professional.",
        category: "Writing",
        course: "Master English Writing",
    },
    {
        userName: "Michael Pham",
        userLevel: "Teacher",
        userImage: "/images/avatar/avatar4.png",
        comment:
            "The speaking course is fantastic! The role-playing scenarios helped me sound more natural and confident in conversations.",
        category: "Speaking",
        course: "Speak English Confidently",
    },
];

function Comment({
    userName,
    userLevel,
    comment,
    category,
    userImage,
    course,
}: CommentProps) {
    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#6E59A5]/30">
            <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#6E59A5]/10" />
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="relative">
                            <img
                                src={userImage}
                                className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-md"
                                alt={userName}
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#6E59A5] rounded-full flex items-center justify-center">
                                <Quote className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">
                                {userName}
                            </h3>
                            <p className="text-sm text-gray-500">{userLevel}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                        "{comment}"
                    </p>
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#6E59A5]/10 text-[#6E59A5]">
                        {category}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                        {course}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CommentList() {
    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 bg-[#6E59A5]/10 rounded-full text-sm font-medium text-[#6E59A5] mb-4">
                    Student Testimonials
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    What Our Students Say
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Hear from our students about how our courses have helped
                    them achieve their language learning goals
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {comments.map((comment, index) => (
                    <Comment key={index} {...comment} />
                ))}
            </div>
            <div className="text-center mt-12">
                <button className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-[#6E59A5] text-[#6E59A5] font-medium hover:bg-[#6E59A5]/5 transition-colors">
                    Read More Success Stories
                </button>
            </div>
        </section>
    );
}
