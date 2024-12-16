const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchReviews = async () => {
    const response = await fetch(`${API_BASE_URL}/review`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch reviews.");
    }
    return response.json();
};

export const fetchReviewsById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/review/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch reviews.");
    }
    return response.json();
};

export const deleteReview = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/review/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant del review.");
    }
    return response.json();
};

export const addReview = async (courseId: number, rating: number, comment: string) => {
    const response = await fetch(`${API_BASE_URL}/review`, {
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

export const updateReview = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/review/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update review.");
    }
    return response.json();
};
