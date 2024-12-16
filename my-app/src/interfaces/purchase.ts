import User from "./user";
import Course from "./course";
interface Purchase {
    id: number;
    userId: number;
    courseId: number;
    user: User;
    course: Course;
    amount: number;
    purchasedAt: string;
}

export default Purchase;
