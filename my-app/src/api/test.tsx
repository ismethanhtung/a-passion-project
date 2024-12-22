const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTests = async () => {
    const response = await fetch(`${API_BASE_URL}/test`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get tests.");
    }
    return response.json();
};

export const fetchLimitTests = async () => {
    const response = await fetch(`${API_BASE_URL}/test/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get tests.");
    }
    return response.json();
};

export const fetchTestById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/test/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get test.");
    }
    return response.json();
};

export const addTest = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/test`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add test.");
    }
    return response.json();
};

export const deleteTest = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/test/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete test.");
    }
    return response.json();
};

export const updateTest = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/test/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update test.");
    }
    return response.json();
};
