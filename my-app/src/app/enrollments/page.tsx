import { useEffect, useState } from "react";
import { getEnrollments } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import Enrollment from "@/interfaces/enrollment";

export default function Enrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (!user) return; // Nếu user là null, không gọi API

        async function fetchData() {
            try {
                const data = await getEnrollments(user?.userId);
                setEnrollments(data);
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        }

        fetchData();
    }, [user]);

    if (!user) {
        return <div>Please log in to view your enrolled courses.</div>;
    }

    return (
        <div>
            <h1>Enrolled Courses</h1>
            <ul>
                {enrollments.map((enrollment) => (
                    // <li key={enrollment?.id}>
                    //     {enrollment.course.title} - Progress:{" "}
                    //     {enrollment.progress.length}
                    // </li>
                ))}
            </ul>
        </div>
    );
}
