import User from "./user";

interface Message {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    sender: User;
    receiver: User;
    userId?: number;
    user?: User;
}

export default Message;
