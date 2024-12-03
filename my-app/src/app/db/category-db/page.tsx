"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Course from "@/interfaces/course";

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [jsonInput, setJsonInput] = useState(`{
        "title": "Khóa học mẫu",
        "description": "Mô tả khóa học mẫu",
        "price": 1000,
        "newPrice": 0,
        "teacherId": 1,
        "tag": "",
        "thumbnail": "https://res.cloudinary.com/dzbifaqwo/image/upload/v1732779752/evywaxrf1f6y5ynjuip8.jpg"
    }`);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null); // Dữ liệu bài kiểm tra đang chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchCourses = async () => {
        const response = await fetch("http://localhost:5000/courses");
        const data: Course[] = await response.json();
        setCourses(data);
    };

    const addCourse = async () => {
        const parsedInput = JSON.parse(jsonInput);
        const response = await fetch("http://localhost:5000/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedInput),
        });

        if (response.ok) {
            fetchCourses();
            setJsonInput(`{
        "title": "Khóa học mẫu",
        "description": "Mô tả khóa học mẫu",
        "price": 1000,
        "newPrice": 0,
        "teacherId": 1,
        "tag": "",
        "thumbnail": "https://res.cloudinary.com/dzbifaqwo/image/upload/v1732779752/evywaxrf1f6y5ynjuip8.jpg"
    }`);
        } else {
            alert("err");
        }
    };

    const deleteCourse = async (id: number) => {
        const response = await await fetch(
            `http://localhost:5000/courses/${id}`,
            {
                method: "DELETE",
            }
        );
        if (response.ok) fetchCourses();
        else alert("err");
    };

    const editCourse = (course: Course) => {
        setEditingCourse(course);
        setShowEditModal(true);
    };

    const updateCourse = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput); // Parse JSON từ textarea

            if (editingCourse) {
                const response = await fetch(
                    `http://localhost:5000/courses/${editingCourse.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(parsedInput),
                    }
                );

                if (response.ok) {
                    fetchCourses();
                    setEditingCourse(null);
                    setShowEditModal(false);
                    setJsonInput(`{
                        "title": "Khóa học mẫu",
                        "description": "Mô tả khóa học mẫu",
                        "price": 1000,
                        "newPrice": 0,
                        "teacherId": 1,
                        "tag": "",
                        "thumbnail": "https://res.cloudinary.com/dzbifaqwo/image/upload/v1732779752/evywaxrf1f6y5ynjuip8.jpg"
                    }`);
                } else {
                    alert("Không thể cập nhật.");
                }
            }
        } catch (error) {
            alert("Dữ liệu JSON không hợp lệ.");
        }
    };

    // Hiện thị Modal chỉnh sửa
    const renderEditModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Course</h2>
                <div className="mb-4">
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="border w-full p-2 h-32"
                    ></textarea>
                </div>
                <button
                    onClick={updateCourse}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Cập nhật
                </button>
                <button
                    onClick={() => setShowEditModal(false)}
                    className="ml-2 bg-red-500 text-white px-4 py-1 rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Courses</h1>

            {/* Form thêm */}
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="border w-full p-2 h-32"
            ></textarea>
            <div className="my-4">
                <button
                    onClick={addCourse}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Course
                </button>
            </div>

            {/* Danh sách bài kiểm tra */}
            <div className="container">
                <DBTable
                    data={courses}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "title", label: "Tiêu đề" },
                        { key: "description", label: "Mô tả" },
                        { key: "price", label: "Price" },
                        { key: "teacherId", label: "TeacherId" },
                        { key: "creatorId", label: "CreatorId" },
                    ]}
                    onEdit={editCourse}
                    onDelete={deleteCourse}
                />
            </div>

            {showEditModal && renderEditModal()}
        </div>
    );
}

export default CoursePage;
