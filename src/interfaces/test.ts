import User from "./user";
import Question from "./question";

interface Test {
    id: number;
    title: string;
    description: string;
    creatorId: number;
    createdAt: string;
    questions: Question[];
    creator: User;
    participants: User[];
}

export default Test;
