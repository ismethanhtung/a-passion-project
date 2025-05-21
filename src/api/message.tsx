const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchMessages = async () => {
    const response = await fetch(`${API_BASE_URL}/message`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get messages.");
    }
    return response.json();
};

export const fetchLimitMessages = async () => {
    const response = await fetch(`${API_BASE_URL}/message/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get messages.");
    }
    return response.json();
};

export const fetchConversationMessages = async (conversationId: any) => {
    const response = await fetch(
        `${API_BASE_URL}/conversation/${conversationId}/messages`,
        {
            credentials: "include",
        }
    );
    if (!response.ok) {
        throw new Error("Cant get conversation messages.");
    }
    return response.json();
};

export const fetchMessageById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/message/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get message.");
    }
    return response.json();
};

export const addMessage = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add message.");
    }
    return response.json();
};

export const deleteMessage = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/message/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete message.");
    }
    return response.json();
};

export const updateMessage = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/message/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update message.");
    }
    return response.json();
};
