import Course from "./course";
import User from "./user";
interface Enrollment {
    id: number;
    userId: number;
    courseId: number;
    enrolledAt: string;
    user: User;
    course: Course;
}

export default Enrollment;
