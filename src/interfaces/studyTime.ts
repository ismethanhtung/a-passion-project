import User from "./user";

interface StudyTime {
    id: number;
    userId: number;
    duration: number;
    user: User;
}

export default StudyTime;
