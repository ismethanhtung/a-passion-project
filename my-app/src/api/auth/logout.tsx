const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleLogoutApi = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        console.log("Cant logout.");
    }
    return response;
};
