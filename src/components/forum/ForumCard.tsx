import React from "react";
import Link from "next/link";
import ForumThread from "@/interfaces/forum/forumThread";

interface ForumCardProps {
    thread: ForumThread;
}

const ForumCard: React.FC<ForumCardProps> = ({ thread }) => {
    return (
        <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-red-400 p-5 transition duration-200 bg-white">
            <h2 className="text-lg font-semibold text-red-300 mb-2">{thread.title}</h2>
            <p className="text-gray-700">{thread.content}</p>

            <p className="text-sm text-gray-500 mt-3">
                Created on {new Date(thread.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-4">
                <Link
                    href={`/forum/${thread.id}`}
                    className="inline-block bg-gray-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    View All Posts
                </Link>
            </div>
        </div>
    );
};

export default ForumCard;
