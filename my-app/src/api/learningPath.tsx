const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPaths = async () => {
    const response = await fetch(`${API_BASE_URL}/path`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng.");
    }
    return response.json();
};

export const fetchPathById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/path/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get path.");
    }
    return response.json();
};

export const deletePath = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/path/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    console.log(response);

    return response.json();
};

export const updatePath = async (id: number, pathData: object) => {
    const response = await fetch(`${API_BASE_URL}/path/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pathData),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Không thể cập nhật path.");
    }
    return response;
};
