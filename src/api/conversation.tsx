const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchConversations = async () => {
    const response = await fetch(`${API_BASE_URL}/conversation`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch conversations.");
    }
    return response.json();
};

export const fetchConversationsById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/conversation/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant fetch conversations.");
    }
    return response.json();
};

export const deleteConversation = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/conversation/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant del conversation.");
    }
    return response.json();
};

export const addConversation = async (userId: any, title: string) => {
    const response = await fetch(`${API_BASE_URL}/conversation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant add conversation.");
    }
    return response;
};

export const updateConversation = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/conversation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update conversation.");
    }
    return response.json();
};
