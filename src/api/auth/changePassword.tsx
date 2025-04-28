const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Can't Change Password.");
    }
    return response;
};
