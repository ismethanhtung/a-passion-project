const API_BASE_URL = "http://localhost:5000";

export const handleLoginApi = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant handleLogin.");
    }
    return response;
};
