const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchLiveCourses = async () => {
    const response = await fetch(`${API_BASE_URL}/liveCourse`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveCourses.");
    }
    return response.json();
};

export const fetchLimitLiveCourses = async () => {
    const response = await fetch(`${API_BASE_URL}/liveCourse/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveCourses.");
    }
    return response.json();
};

export const fetchLiveCourseById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/liveCourse/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveCourse.");
    }
    return response.json();
};

export const addLiveCourse = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/liveCourse`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add liveCourse.");
    }
    return response.json();
};

export const deleteLiveCourse = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/liveCourse/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete liveCourse.");
    }
    return response.json();
};

export const updateLiveCourse = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/liveCourse/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update liveCourse.");
    }
    return response.json();
};
