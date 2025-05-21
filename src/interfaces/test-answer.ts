import User from "./user";
import { TestQuestion } from "./test-question";
import { TestAttempt } from "./test-attempt";

export interface TestAnswer {
    id: number;
    questionId: number;
    userId: number;
    attemptId: number;
    selectedAnswer?: any; // JSON data
    isCorrect?: boolean;
    score?: number;
    feedback?: string;
    markedForReview: boolean;
    createdAt: string;
    question: TestQuestion;
    user: User;
    attempt: TestAttempt;
}
