const API_BASE_URL = "http://localhost:5000";

export const handleSignUpApi = async (
    name: string,
    email: string,
    password: string
) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });
    return response;
};
