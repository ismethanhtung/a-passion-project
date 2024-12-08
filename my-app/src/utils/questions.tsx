const API_BASE_URL = "http://localhost:5000";

export async function createPurchase(
    userId: number,
    courseId: number,
    amount: number
) {
    const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, amount }),
    });
    return response.json();
}

export async function getPurchases(userId: number) {
    const response = await fetch(`${API_BASE_URL}/purchases/${userId}`);
    return response.json();
}

export async function fetchQuestions() {
    const response = await fetch("http://localhost:5000/questions");
    return await response.json();
}
