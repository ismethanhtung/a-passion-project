"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCartById, deleteCart, updateCart } from "@/api/cart";

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        user && fetchCartById(user.id).then(setCartItems).catch(console.error);
    }, [user]);

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        updateCart(id, { quantity });
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const deleteItem = (id: number) => {
        deleteCart(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) =>
            prev.has(id) ? new Set([...prev].filter((item) => item !== id)) : new Set(prev).add(id)
        );
    };

    const totalPrice = cartItems.reduce(
        (sum, { id, course, quantity }) =>
            selectedItems.has(id) ? sum + (course.newPrice || course.price) * quantity : sum,
        0
    );

    if (!user) return <div className="text-center text-lg">You need to login</div>;
    if (!cartItems.length) return <div className="text-center text-lg">Your cart is empty</div>;

    return (
        <div className="container mx-auto p-8 flex gap-8">
            <div className="w-2/3 bg-white p-6 rounded-lg border-2 border-gray-200">
                <h1 className="text-3xl font-semibold my-10">Your Cart</h1>
                {cartItems.map(({ id, course, quantity }) => (
                    <div key={id} className="flex justify-between items-center border-b p-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{course.title}</h2>
                                <p>{course.newPrice || course.price}đ</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => updateQuantity(id, quantity - 1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => updateQuantity(id, quantity + 1)}>+</button>
                            <button onClick={() => deleteItem(id)}>Delete</button>
                            <input
                                type="checkbox"
                                checked={selectedItems.has(id)}
                                onChange={() => toggleSelect(id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-1/3 bg-white p-6 rounded-lg border-2 border-gray-200">
                <h2 className="text-2xl font-semibold py-8">Summary</h2>
                <div className="flex justify-between mb-4">
                    <span>Total:</span>
                    <span className="text-green-600 font-semibold">{totalPrice}đ</span>
                </div>
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-2 border mb-4"
                />
                <button className="w-full bg-blue-500 text-white p-2">Checkout</button>
            </div>
        </div>
    );
};

export default CartPage;
