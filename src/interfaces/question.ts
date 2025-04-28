import Test from "./test";
interface Question {
    id: number;
    content: string;
    options: string;
    answer: string;
    testId: number;
    test: Test;
}

export default Question;
