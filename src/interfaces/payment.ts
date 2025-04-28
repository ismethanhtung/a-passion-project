import User from "./user";

interface Payment {
    id: number;
    userId: number;
    amount: number;
    paymentDate: string;
    method: string;
    user: User;
}

export default Payment;
