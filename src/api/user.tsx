const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/user`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng.");
    }
    return response.json();
};

export const fetchUserById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get user.");
    }
    return response.json();
};

export const deleteUser = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    console.log(response);

    return response.json();
};

export const updateUser = async (id: number, userData: object) => {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Không thể cập nhật người dùng.");
    }

    return response.json();
};
