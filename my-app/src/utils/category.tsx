const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/category`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Không thể tải danh sách categories.");
    }
    return response.json();
};

export const addCategory = async (data: object) => {
    const response = await fetch(`${API_BASE_URL}/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant add category.");
    }
    return response.json();
};

export const deleteCategory = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/category/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant del category.");
    }
    return response.json();
};

export const updateCategory = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update category.");
    }
    return response.json();
};
