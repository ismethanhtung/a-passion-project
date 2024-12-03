import User from "./user";
import Course from "./course";
interface Purchase {
    id: number;
    userId: number;
    courseId: number;
    amount: number;
    user: User;
    course: Course;
}

export default Purchase;
