import Lesson from "./lesson";
import Review from "./review";
interface Course {
    id: number;
    title: string;
    description: string;
    tag: string;
    price: number;
    teacherId: number;
    creatorId: number;
    categoryId: number;
    thumbnail: string;
    newPrice: number;
    objectives: string;
    lessons: Lesson[];
    reviews: Review[];
    duration: string;
    rating: number;
}

export default Course;
