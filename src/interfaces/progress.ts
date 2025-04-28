import User from "./user";
import Enrollment from "./enrollment";

interface Progress {
    id: number;
    userId: number;
    lessonId: number;
    enrollmentId: number;
    status: string;
    completedAt: string;
    enrollment: Enrollment;
    user: User;
    score: number;
    feedback: string;
}

export default Progress;
