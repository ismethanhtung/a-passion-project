const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const fetchLessons = async () => {
    const response = await fetch(`${API_BASE_URL}/lesson`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get lessons.");
    }
    return response.json();
};

export const addLesson = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/lesson`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant add lesson.");
    }

    return response.json();
};

export const deleteLesson = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/lesson/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant del lesson.");
    }
    return response.json();
};

export const updateLesson = async (id: number, parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/lesson/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update lesson.");
    }
    return response.json();
};
