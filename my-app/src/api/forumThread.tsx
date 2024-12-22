const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchForumThreads = async () => {
    const response = await fetch(`${API_BASE_URL}/forumThread`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumThreads.");
    }
    return response.json();
};

export const fetchLimitForumThreads = async () => {
    const response = await fetch(`${API_BASE_URL}/forumThread/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumThreads.");
    }
    return response.json();
};

export const fetchForumThreadById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/forumThread/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumThread.");
    }
    return response.json();
};

export const addForumThread = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/forumThread`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add forumThread.");
    }
    return response.json();
};

export const deleteForumThread = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/forumThread/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete forumThread.");
    }
    return response.json();
};

export const updateForumThread = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/forumThread/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update forumThread.");
    }
    return response.json();
};
