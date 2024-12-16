interface Lesson {
    id: number;
    title: string;
    content: string;
    videoUrl: string;
    videoTime: string;
    isLocked: boolean;
    courseId: number;
}

export default Lesson;
