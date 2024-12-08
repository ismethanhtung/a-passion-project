const API_BASE_URL = "http://localhost:5000";

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Không thể tải danh sách categories.");
    }
    return response.json();
};

export const addCategory = async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Không thể tải danh sách categories.");
    }
    return response.json();
};

export const deleteCategory = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Không thể tải danh sách categories.");
    }
    return response.json();
};
