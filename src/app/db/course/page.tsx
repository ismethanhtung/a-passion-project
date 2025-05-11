"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import JsonEditor from "@/components/JsonEditor";
import SingleCourseJsonEditor from "@/components/SingleCourseJsonEditor";
import BatchOperations from "@/components/BatchOperations";
import BulkJsonImport from "@/components/BulkJsonImport";
import CourseForm from "@/components/CourseForm";
import Course from "@/interfaces/course";
import {
    fetchCourses,
    addCourse,
    deleteCourse,
    updateCourse,
} from "@/api/courses";

type ViewMode =
    | "table"
    | "json"
    | "form"
    | "batch"
    | "single-json"
    | "bulk-import";

function CoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCourses = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchCourses();
            setCourses(response);
        } catch (error) {
            console.error(error);
            setError("Không thể tải danh sách khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCourse = async (newCourse: Partial<Course>) => {
        try {
            setIsLoading(true);
            setError(null);
            await addCourse(newCourse);
            await getCourses();
            setViewMode("table");
        } catch (error) {
            console.error(error);
            setError("Không thể thêm khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);
            await deleteCourse(id);
            await getCourses();
        } catch (error) {
            console.error(error);
            setError("Không thể xóa khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateCourse = async (updatedCourse: Course) => {
        try {
            setIsLoading(true);
            setError(null);
            await updateCourse(updatedCourse.id, updatedCourse);
            await getCourses();
        } catch (error) {
            console.error(error);
            setError("Không thể cập nhật khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveJson = async (data: Course | Course[]) => {
        try {
            setIsLoading(true);
            setError(null);

            if (Array.isArray(data)) {
                // Handle multiple courses update
                for (const course of data) {
                    if (course.id) {
                        await updateCourse(course.id, course);
                    } else {
                        await addCourse(course);
                    }
                }
            } else {
                // Handle single course update
                if (data.id) {
                    await updateCourse(data.id, data);
                } else {
                    await addCourse(data);
                }
            }

            await getCourses();
            setViewMode("table");
        } catch (error) {
            console.error(error);
            setError("Không thể lưu dữ liệu JSON");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportCourses = async (coursesToImport: Partial<Course>[]) => {
        try {
            setIsLoading(true);
            setError(null);

            for (const course of coursesToImport) {
                await addCourse(course);
            }

            await getCourses();
            setViewMode("table");
        } catch (error) {
            console.error(error);
            setError("Không thể nhập khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCourses = () => {
        try {
            const jsonData = JSON.stringify(courses, null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "courses.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setError("Không thể xuất khóa học");
        }
    };

    const handleExportSingleCourse = (course: Course) => {
        try {
            const jsonData = JSON.stringify(course, null, 2);
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `course-${course.id}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setError("Không thể xuất khóa học");
        }
    };

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setViewMode("form");
    };

    const handleEditCourseJson = (course: Course) => {
        setSelectedCourse(course);
        setViewMode("single-json");
    };

    const handleCancelForm = () => {
        setSelectedCourse(null);
        setViewMode("table");
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-4">Quản lý khóa học</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex mb-6 border-b">
                <button
                    className={`px-4 py-2 ${
                        viewMode === "table"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                    }`}
                    onClick={() => setViewMode("table")}
                >
                    Bảng dữ liệu
                </button>
                <button
                    className={`px-4 py-2 ${
                        viewMode === "json"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                    }`}
                    onClick={() => setViewMode("json")}
                >
                    Chỉnh sửa JSON
                </button>
                <button
                    className={`px-4 py-2 ${
                        viewMode === "form"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                    }`}
                    onClick={() => {
                        setSelectedCourse(null);
                        setViewMode("form");
                    }}
                >
                    Thêm khóa học
                </button>
                <button
                    className={`px-4 py-2 ${
                        viewMode === "batch"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                    }`}
                    onClick={() => setViewMode("batch")}
                >
                    Thao tác hàng loạt
                </button>
                <button
                    className={`px-4 py-2 ${
                        viewMode === "bulk-import"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                    }`}
                    onClick={() => setViewMode("bulk-import")}
                >
                    Nhập JSON
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="container">
                    {viewMode === "table" && (
                        <DBTable
                            data={courses}
                            columns={[
                                { key: "id" },
                                { key: "title" },
                                { key: "description" },
                                { key: "price" },
                                { key: "newPrice" },
                                { key: "teacherId" },
                                { key: "creatorId" },
                                { key: "categoryId" },
                            ]}
                            onCreate={handleAddCourse}
                            onUpdate={handleUpdateCourse}
                            onDelete={handleDeleteCourse}
                            onEditInForm={handleEditCourse}
                        />
                    )}

                    {viewMode === "json" && (
                        <JsonEditor
                            data={courses}
                            onSave={handleSaveJson}
                            isMultiple={true}
                        />
                    )}

                    {viewMode === "single-json" && selectedCourse && (
                        <SingleCourseJsonEditor
                            course={selectedCourse}
                            onSave={handleUpdateCourse}
                            onCancel={handleCancelForm}
                        />
                    )}

                    {viewMode === "form" && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-4">
                                {selectedCourse
                                    ? "Chỉnh sửa khóa học"
                                    : "Thêm khóa học mới"}
                            </h2>
                            <CourseForm
                                initialData={selectedCourse || {}}
                                onSubmit={
                                    selectedCourse
                                        ? handleUpdateCourse
                                        : handleAddCourse
                                }
                                onCancel={handleCancelForm}
                            />
                        </div>
                    )}

                    {viewMode === "batch" && (
                        <BatchOperations
                            onImport={handleImportCourses}
                            onExport={handleExportCourses}
                        />
                    )}

                    {viewMode === "bulk-import" && (
                        <BulkJsonImport
                            onImport={handleImportCourses}
                            onCancel={() => setViewMode("table")}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default CoursePage;
