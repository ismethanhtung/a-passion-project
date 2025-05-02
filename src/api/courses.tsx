const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCourses = async () => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        const response = await fetch(`${API_BASE_URL}/course`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể lấy khóa học: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchLimitCourses = async () => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        const response = await fetch(`${API_BASE_URL}/course/limit`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể lấy khóa học giới hạn: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching limited courses:", error);
        throw error;
    }
};

export const fetchCourseById = async (id: any) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID khóa học không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/course/${id}`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể lấy khóa học #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching course #${id}:`, error);
        throw error;
    }
};

export const addCourse = async (parsedInput: object) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!parsedInput) {
            throw new Error("Dữ liệu khóa học không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedInput),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể thêm khóa học: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error("Error adding course:", error);
        throw error;
    }
};

export const deleteCourse = async (id: number) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID khóa học không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/course/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể xóa khóa học #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error deleting course #${id}:`, error);
        throw error;
    }
};

export const updateCourse = async (id: number, data: object) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID khóa học không hợp lệ");
        }

        if (!data) {
            throw new Error("Dữ liệu khóa học không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/course/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể cập nhật khóa học #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error updating course #${id}:`, error);
        throw error;
    }
};
