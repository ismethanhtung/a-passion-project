const API_BASE_URL = "http://localhost:5000";

export const fetchReviews = async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch reviews.");
    }
    return response.json();
};

export const fetchReviewsById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch reviews.");
    }
    return response.json();
};

export const deleteReview = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant del review.");
    }
    return response.json();
};

export const addReview = async (
    courseId: number,
    rating: number,
    comment: string
) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, comment }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant add review.");
    }
    return response;
};
