"use client";

import React from "react";

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
            "The reading materials are engaging and simple to follow. I’ve improved my vocabulary significantly in just a few weeks!",
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
        <div className="h-96 border-2 border-gray-200 rounded-2xl p-6 mx-6 flex flex-col justify-between">
            <div className="flex items-center mb-8">
                <img
                    src={userImage}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                />
                <div>
                    <h1 className="font-bold">{userName}</h1>
                    <h2 className="text-sm text-gray-500">{userLevel}</h2>
                </div>
            </div>

            <div className="flex items-center space-x-1 mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <img key={index} src="/icons/star.png" className="size-3" />
                ))}
            </div>

            <div className="text-gray-500 mb-6">{comment}</div>
            <div className="text-xs text-black bg-red-200 w-max px-2 py-1 rounded-lg">
                {category}
            </div>
            <div className=" flex font-bold text-sm pt-2">{course}</div>
        </div>
    );
}

export default function CommentList() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {comments.map((comment, index) => (
                <Comment key={index} {...comment} />
            ))}
        </div>
    );
}
