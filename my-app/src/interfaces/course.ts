import Lesson from "./lesson";
import Review from "./review";
import User from "./user";
import Category from "./category";
interface Course {
    id: number;
    title: string;
    description: string;
    objectives: string;
    price: number;
    newPrice: number;
    thumbnail: string;
    videoUrl: string;
    categoryId: number;
    creatorId: number;
    teacherId: number;
    createdAt: string;
    updatedAt: string;
    teacher: User;
    creator: User;
    category: Category;
    lessons: Lesson[];
    reviews: Review[];
    isPublished: boolean;
    isDeleted: boolean;
    tags: string;
}

export default Course;
