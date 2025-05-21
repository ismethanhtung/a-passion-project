import User from "./user";
import { TestQuestion } from "./test-question.ts";
import { TestAttempt } from "./test-attempt.ts";

export type TestType = "TOEIC" | "IELTS" | "General" | "Placement";
export type TestDifficulty =
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
export type SectionType = "listening" | "reading" | "writing" | "speaking";

export interface OnlineTest {
    id: number;
    title: string;
    description: string;
    instructions: string;
    testType: TestType;
    difficulty: TestDifficulty;
    duration: number; // minutes
    tags: string;
    popularity: number;
    completionRate: number;
    isPublished: boolean;
    isFeatured: boolean;
    creatorId: number;
    creator: User;
    participants: User[];
    createdAt: string;
    updatedAt: string;
    sections?: {
        listening?: {
            parts: number;
            questions: number;
        };
        reading?: {
            parts: number;
            questions: number;
        };
        writing?: {
            parts: number;
            questions: number;
        };
        speaking?: {
            parts: number;
            questions: number;
        };
    };
    thumbnail?: string;
    isAIGenerated: boolean;
    testQuestions: TestQuestion[];
    testAttempts: TestAttempt[];
}
