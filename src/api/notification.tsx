const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/notification`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get notifications.");
    }
    return response.json();
};

export const fetchLimitNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/notification/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get notifications.");
    }
    return response.json();
};

export const fetchNotificationById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/notification/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get notification.");
    }
    return response.json();
};

export const addNotification = async (parsedInput: {
    userId: number;
    message: string;
    type?: string;
    data?: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add notification.");
    }
    return response.json();
};

export const deleteNotification = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/notification/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete notification.");
    }
    return response.json();
};

export const updateNotification = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/notification/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update notification.");
    }
    return response.json();
};
