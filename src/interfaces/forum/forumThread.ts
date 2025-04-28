import User from "../user";
import ForumPost from "./forumPost";

interface ForumThread {
    id: number;
    title: string;
    content: string;
    authorId: number;
    createdAt: string;
    updatedAt?: string;
    author: User;
    forumPosts: ForumPost[];
}

export default ForumThread;
