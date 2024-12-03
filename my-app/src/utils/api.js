const API_URL = "http://localhost:5000";

export async function createPurchase(userId, courseId, amount) {
    const response = await fetch(`${API_URL}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, amount }),
    });
    return response.json();
}

export async function createEnrollment(userId, courseId) {
    const response = await fetch(`${API_URL}/enrollment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
    });
    return response.json();
}

export async function getPurchases(userId) {
    const response = await fetch(`${API_URL}/purchases/${userId}`);
    return response.json();
}

export async function getEnrollments(userId) {
    const response = await fetch(`${API_URL}/enrollments/${userId}`);
    return response.json();
}
