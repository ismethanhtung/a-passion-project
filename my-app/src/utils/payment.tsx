const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPayments = async () => {
    const response = await fetch(`${API_BASE_URL}/payment`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get payments.");
    }
    return response.json();
};

export const fetchLimitPayments = async () => {
    const response = await fetch(`${API_BASE_URL}/payment/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get payments.");
    }
    return response.json();
};

export const fetchPaymentById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/payment/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get payment.");
    }
    return response.json();
};

export const addPayment = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add payment.");
    }
    return response.json();
};

export const deletePayment = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/payment/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete payment.");
    }
    return response.json();
};

export const updatePayment = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update payment.");
    }
    return response.json();
};
