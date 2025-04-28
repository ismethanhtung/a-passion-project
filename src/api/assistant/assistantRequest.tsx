const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAssistantRequests = async () => {
    const response = await fetch(`${API_BASE_URL}/assistantRequest`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantRequests.");
    }
    return response.json();
};

export const fetchLimitAssistantRequests = async () => {
    const response = await fetch(`${API_BASE_URL}/assistantRequest/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantRequests.");
    }
    return response.json();
};

export const fetchAssistantRequestById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/assistantRequest/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get assistantRequest.");
    }
    return response.json();
};

export const addAssistantRequest = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/assistantRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add assistantRequest.");
    }
    return response.json();
};

export const deleteAssistantRequest = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/assistantRequest/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete assistantRequest.");
    }
    return response.json();
};

export const updateAssistantRequest = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/assistantRequest/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update assistantRequest.");
    }
    return response.json();
};
