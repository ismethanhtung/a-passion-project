const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchForumPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/forumPost`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumPosts.");
    }
    return response.json();
};

export const fetchLimitForumPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/forumPost/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumPosts.");
    }
    return response.json();
};

export const fetchForumPostById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/forumPost/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get forumPost.");
    }
    return response.json();
};

export const addForumPost = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/forumPost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add forumPost.");
    }
    return response.json();
};

export const deleteForumPost = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/forumPost/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete forumPost.");
    }
    return response.json();
};

export const updateForumPost = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/forumPost/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update forumPost.");
    }
    return response.json();
};
