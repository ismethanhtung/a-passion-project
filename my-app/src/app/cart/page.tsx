"use client";

import React, { useEffect, useState } from "react";
import { fetchCartById, deleteCart, updateCart } from "@/utils/cart";
import { useUser } from "@/context/UserContext";

const CartPage: React.FC = () => {
    const { user, loading: userLoading } = useUser();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !userLoading) {
            setLoading(true);
            fetchCartById(user.id)
                .then(setCartItems)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user, userLoading]);

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        await updateCart(id, { quantity });
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const handleDeleteItem = async (id: number) => {
        await deleteCart(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalPrice = cartItems.reduce(
        (sum, { course, quantity }) => sum + (course.newPrice || course.price) * quantity,
        0
    );

    if (userLoading || loading) return <div>Loading...</div>;
    if (!user) return <div>You need login</div>;
    if (!cartItems.length) return <div>Your cart is empty</div>;

    return (
        <div className="container mx-auto p-8 flex gap-8">
            <div className="w-2/3 bg-white rounded-lg border-2 border-gray-200 p-10">
                <h1 className="text-4xl font-bold text-red-300 mb-6">Your Cart</h1>
                {cartItems.map(({ id, course, quantity }) => (
                    <div key={id} className="flex justify-between items-center border-b pb-4 mb-4">
                        <div className="flex items-center gap-6">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-20 h-20 object-cover rounded-lg shadow-md"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {course.newPrice || course.price}đ
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleUpdateQuantity(id, quantity - 1)}
                                className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                            >
                                -
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                onClick={() => handleUpdateQuantity(id, quantity + 1)}
                                className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleDeleteItem(id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-1/3 bg-white rounded-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Purchase</h2>
                <div className="mb-6">
                    <div className="flex justify-between mb-4">
                        <span className="text-lg text-gray-700">Total:</span>
                        <span className="text-2xl font-bold text-green-600">{totalPrice}đ</span>
                    </div>

                    <div className="flex justify-between mb-4">
                        <span className="text-lg text-gray-700">Voucher:</span>
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            className="px-4 py-2 border border-gray-300 rounded-lg w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition">
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
