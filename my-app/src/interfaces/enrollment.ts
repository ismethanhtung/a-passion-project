import Course from "./course";
import User from "./user";
interface Enrollment {
    id: number;
    userId: number;
    courseId: number;
    user: User;
    course: Course;
}

export default Enrollment;
