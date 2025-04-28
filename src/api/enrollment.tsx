const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchEnrollments = async () => {
    const response = await fetch(`${API_BASE_URL}/enrollment`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get enrollments.");
    }
    return response.json();
};

export const fetchLimitEnrollments = async () => {
    const response = await fetch(`${API_BASE_URL}/enrollment/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get enrollments.");
    }
    return response.json();
};

export const fetchEnrollmentById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/enrollment/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get enrollment.");
    }
    return response.json();
};

export const addEnrollment = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/enrollment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add enrollment.");
    }
    return response.json();
};

export const deleteEnrollment = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/enrollment/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete enrollment.");
    }
    return response.json();
};

export const updateEnrollment = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/enrollment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update enrollment.");
    }
    return response.json();
};
