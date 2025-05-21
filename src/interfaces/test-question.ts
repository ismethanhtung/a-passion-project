import { OnlineTest } from "./online-test";
import { TestAnswer } from "./test-answer";

export type QuestionType =
    | "single"
    | "multiple"
    | "fill"
    | "essay"
    | "speaking";
export type SectionType = "listening" | "reading" | "writing" | "speaking";

export interface TestQuestion {
    id: number;
    testId: number;
    content: string;
    type: QuestionType;
    options?: any; // JSON data for options
    correctAnswer?: any; // JSON data for answer
    part: number;
    sectionType: SectionType;
    explanation?: string;
    audioUrl?: string;
    imageUrl?: string;
    groupId?: number;
    order: number;
    test: OnlineTest;
    answers: TestAnswer[];
}
