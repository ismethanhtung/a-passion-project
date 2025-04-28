export default interface Comment {
    id: number;
    content: string;
    postId: number;
    author: {
        id: number;
        name: string;
    };
    createdAt: string;
}
