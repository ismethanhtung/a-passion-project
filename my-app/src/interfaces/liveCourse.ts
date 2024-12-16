import User from "./user";
import LiveSession from "./liveSession";

interface LiveCourse {
    id: number;
    title: string;
    description: string;
    instructorId: number;
    createdAt: string;
    instructor: User;
    liveSessions: LiveSession[];
}

export default LiveCourse;
