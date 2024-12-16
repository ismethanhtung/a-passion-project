import User from "./user";

interface Notification {
    id: number;
    userId: number;
    message: string;
    read: boolean;
    createdAt: string;
    user: User;
}

export default Notification;
