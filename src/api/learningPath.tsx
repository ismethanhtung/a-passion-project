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

// Thêm khóa học được đề xuất vào lộ trình
export const addRecommendedCourse = async (
    pathId: number,
    courseId: number
) => {
    const response = await fetch(
        `${API_BASE_URL}/path/${pathId}/recommend-course`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId }),
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Không thể thêm khóa học đề xuất.");
    }
    return response.json();
};

// Kiểm tra người dùng đã đăng ký các khóa học trong lộ trình chưa
export const checkPathEnrollments = async (pathId: number) => {
    const response = await fetch(`${API_BASE_URL}/path/${pathId}/enrollments`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Không thể kiểm tra tình trạng đăng ký khóa học.");
    }
    return response.json();
};

// Cập nhật thời gian tạo lộ trình để tính thời gian nhắc nhở
export const updatePathTimestamp = async (pathId: number) => {
    const response = await fetch(
        `${API_BASE_URL}/path/${pathId}/update-timestamp`,
        {
            method: "PUT",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Không thể cập nhật thời gian lộ trình.");
    }
    return response.json();
};
