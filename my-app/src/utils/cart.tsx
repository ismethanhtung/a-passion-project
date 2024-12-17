const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCartById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get cart.");
    }
    return response.json();
};

export const addCart = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add cart.");
    }
    return response.json();
};

export const addToCart = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add cart.");
    }
    return response.json();
};

export const deleteCart = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete cart.");
    }
    return response.json();
};

export const updateCart = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update cart.");
    }
    return response.json();
};
