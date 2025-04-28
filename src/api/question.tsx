const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchQuestions = async () => {
    const response = await fetch(`${API_BASE_URL}/question`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get questions.");
    }
    return response.json();
};

export const fetchLimitQuestions = async () => {
    const response = await fetch(`${API_BASE_URL}/question/limit`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get questions.");
    }
    return response.json();
};

export const fetchQuestionById = async (id: any) => {
    const response = await fetch(`${API_BASE_URL}/question/${id}`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant get question.");
    }
    return response.json();
};

export const addQuestion = async (parsedInput: object) => {
    const response = await fetch(`${API_BASE_URL}/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant add question.");
    }
    return response.json();
};

export const deleteQuestion = async (id: number) => {
    const response = await await fetch(`${API_BASE_URL}/question/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Cant delete question.");
    }
    return response.json();
};

export const updateQuestion = async (id: number, data: object) => {
    const response = await fetch(`${API_BASE_URL}/question/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Cant update question.");
    }
    return response.json();
};
