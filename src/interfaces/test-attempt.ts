import User from "./user";
import { OnlineTest } from "./online-test";
import { TestAnswer } from "./test-answer";

export interface TestAttempt {
    id: number;
    testId: number;
    userId: number;
    startTime: string;
    endTime?: string;
    score?: number;
    sectionScores?: any; // JSON data
    completed: boolean;
    feedback?: string;
    test: OnlineTest;
    user: User;
    answers: TestAnswer[];
}
