const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchReviews = async () => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        const response = await fetch(`${API_BASE_URL}/review`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể lấy đánh giá: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const fetchReviewsById = async (id: any) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/review/${id}`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể lấy đánh giá cho khóa học #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching reviews for course #${id}:`, error);
        throw error;
    }
};

export const deleteReview = async (id: number) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID đánh giá không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/review/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể xóa đánh giá #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error deleting review #${id}:`, error);
        throw error;
    }
};

export const addReview = async (
    courseId: number,
    rating: number,
    comment: string
) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!courseId) {
            throw new Error("ID khóa học không hợp lệ");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Đánh giá phải từ 1-5 sao");
        }

        const response = await fetch(`${API_BASE_URL}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId, rating, comment }),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể thêm đánh giá: ${response.status}`
            );
        }

        return response;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const updateReview = async (id: number, data: object) => {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL không được cấu hình.");
        }

        if (!id) {
            throw new Error("ID đánh giá không hợp lệ");
        }

        if (!data) {
            throw new Error("Dữ liệu đánh giá không hợp lệ");
        }

        const response = await fetch(`${API_BASE_URL}/review/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Không thể cập nhật đánh giá #${id}: ${response.status}`
            );
        }

        return response.json();
    } catch (error) {
        console.error(`Error updating review #${id}:`, error);
        throw error;
    }
};
