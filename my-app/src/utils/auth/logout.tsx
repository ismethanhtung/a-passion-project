const API_BASE_URL = "http://localhost:5000";

export const handleLogoutApi = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant logout.");
    }
    return response;
};
