import User from "../user";
import ForumThread from "./forumThread";
interface ForumPost {
    id: number;
    content: string;
    threadId: number;
    authorId: number;
    createdAt: string;
    updatedAt?: string;
    thread: ForumThread;
    author: User;
}

export default ForumPost;
