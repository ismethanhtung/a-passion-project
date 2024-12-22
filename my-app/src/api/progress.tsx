const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchProgress = async () => {
    const response = await fetch(`${API_BASE_URL}/progress`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get progress.");
    }
    return response.json();
};

export const fetchLimitProgress = async () => {
    const response = await fetch(`${API_BASE_URL}/progress/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get progress.");
    }
    return response.json();
};

export const fetchProgressById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/progress/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get progress.");
    }
    return response.json();
};

export const addProgress = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add progress.");
    }
    return response.json();
};

export const deleteProgress = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/progress/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete progress.");
    }
    return response.json();
};

export const updateProgress = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/progress/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update progress.");
    }
    return response.json();
};
