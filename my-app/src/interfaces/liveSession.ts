import Course from "./course";
import LiveCourse from "./liveCourse";
interface LiveSession {
    id: number;
    liveCourseId: number;
    sessionDate: string;
    topic: string;
    liveCourse: LiveCourse;
    courseId: number;
    course: Course;
}
export default LiveSession;
