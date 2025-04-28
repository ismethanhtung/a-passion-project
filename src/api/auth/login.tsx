const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        throw new Error("Cant Login.");
    }
    return response;
};
