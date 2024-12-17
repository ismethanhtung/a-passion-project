"use client";
import { useState, useEffect } from "react";
import { fetchCartById, addCart, deleteCart } from "@/utils/cart";
import { useUser } from "@/context/UserContext";

interface CartItem {
    id: number;
    courseId: number;
    quantity: number;
    course: {
        title: string;
        price: number;
    };
}

const CartPage = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { user, login } = useUser();

    const userId = user?.id; // Thay bằng logic lấy userId thực tế (VD: từ auth)

    useEffect(() => {
        const loadCart = async () => {
            const data = await fetchCartById(userId);
            setCart(data);
        };
        loadCart();
    }, []);

    const handleRemove = async (id: number) => {
        await deleteCart(id);
        setCart(cart.filter((item) => item.id !== id));
    };

    return (
        <div>
            <h1>Giỏ hàng</h1>
            {cart.length > 0 ? (
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            {item.course.title} - {item.quantity} x {item.course.price}$
                            <button onClick={() => handleRemove(item.id)}>Xóa</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Giỏ hàng trống</p>
            )}
        </div>
    );
};

export default CartPage;
