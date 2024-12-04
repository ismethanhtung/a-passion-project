export interface Review {
    id: number;
    userId: number;
    user: { name: string };
    courseId: number;
    rating: number;
    comment: string;
    createdAt: string;
}
