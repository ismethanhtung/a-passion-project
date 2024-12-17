import React from "react";
import Link from "next/link";
import ForumThread from "@/interfaces/forum/forumThread";

interface ForumCardProps {
    thread: ForumThread;
}

const ForumCard: React.FC<ForumCardProps> = ({ thread }) => {
    return (
        <div className="border rounded-lg shadow-md hover:shadow-lg p-4 transition duration-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">{thread.title}</h2>
            <div>{thread.content}</div>
            <p className="text-sm text-gray-500 mt-2">
                Created on {new Date(thread.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4">
                <Link
                    href={`/forum/${thread.id}`}
                    className="text-red-500 font-semibold hover:underline"
                >
                    View All Post
                </Link>
            </div>
        </div>
    );
};

export default ForumCard;
