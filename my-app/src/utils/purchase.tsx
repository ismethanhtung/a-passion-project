const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
