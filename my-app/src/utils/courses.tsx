// const API_URL = "http://localhost:5000";
// import { useState } from "react";

// import Course from "@/interfaces/course";
// const [courses, setCourses] = useState<Course[]>([]);
// const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

// export async function createPurchase(
//     userId: number,
//     courseId: number,
//     amount: number
// ) {
//     const response = await fetch(`${API_URL}/purchase`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, courseId, amount }),
//     });
//     return response.json();
// }

// export async function getPurchases(userId: number) {
//     const response = await fetch(`${API_URL}/purchases/${userId}`);
//     return response.json();
// }

// export const fetchCourse = async () => {
//     const response = await fetch("http://localhost:5000/courses");
//     const data: Course[] = await response.json();
//     setCourses(data);
//     setFilteredCourses(data); // Mặc định hiển thị tất cả khóa học
// };
