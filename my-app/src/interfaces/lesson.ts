interface Lesson {
    id: number;
    title: string;
    content: string;
    videoUrl: string;
    duration: string;
    isLocked: boolean;
    courseId: number;
}

export default Lesson;
