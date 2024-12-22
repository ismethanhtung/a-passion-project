const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAssistantLogs = async () => {
    const response = await fetch(`${API_BASE_URL}/assistantLog`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantLogs.");
    }
    return response.json();
};

export const fetchLimitAssistantLogs = async () => {
    const response = await fetch(`${API_BASE_URL}/assistantLog/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantLogs.");
    }
    return response.json();
};

export const fetchAssistantLogById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/assistantLog/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantLog.");
    }
    return response.json();
};

export const addAssistantLog = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/assistantLog`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add assistantLog.");
    }
    return response.json();
};

export const deleteAssistantLog = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/assistantLog/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete assistantLog.");
    }
    return response.json();
};

export const updateAssistantLog = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/assistantLog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update assistantLog.");
    }
    return response.json();
};
