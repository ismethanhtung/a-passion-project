const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchLiveSessions = async () => {
    const response = await fetch(`${API_BASE_URL}/liveSession`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveSessions.");
    }
    return response.json();
};

export const fetchLimitLiveSessions = async () => {
    const response = await fetch(`${API_BASE_URL}/liveSession/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveSessions.");
    }
    return response.json();
};

export const fetchLiveSessionById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/liveSession/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get liveSession.");
    }
    return response.json();
};

export const addLiveSession = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/liveSession`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add liveSession.");
    }
    return response.json();
};

export const deleteLiveSession = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/liveSession/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete liveSession.");
    }
    return response.json();
};

export const updateLiveSession = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/liveSession/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update liveSession.");
    }
    return response.json();
};
