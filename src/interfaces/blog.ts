import User from "./user";
export default interface Blog {
    id: number;
    title: string;
    content: string;
    authorId: number;
    published: boolean;
    createdAt: string;
    author: User;
}
