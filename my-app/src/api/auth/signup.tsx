const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleSignUpApi = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
        throw new Error("Cant Sign Up.");
    }
    return response;
};
