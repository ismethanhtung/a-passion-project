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
        if (user) {
            fetchCartById(user.id).then(setCartItems).catch(console.error);
        }
    }, [user]);

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        await updateCart(id, { quantity });
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const handleDeleteItem = async (id: number) => {
        await deleteCart(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleSelectItem = (id: number) => {
        setSelectedItems((prev) => {
            const updatedSelection = new Set(prev);
            if (updatedSelection.has(id)) {
                updatedSelection.delete(id);
            } else {
                updatedSelection.add(id);
            }
            return updatedSelection;
        });
    };

    const totalPrice = cartItems.reduce((sum, { id, course, quantity }) => {
        if (selectedItems.has(id)) {
            return sum + (course.newPrice || course.price) * quantity;
        }
        return sum;
    }, 0);

    if (!user) return <div className="text-center text-lg">You need to login</div>;
    if (!cartItems.length) return <div className="text-center text-lg">Your cart is empty</div>;

    return (
        <div className="container mx-auto p-8 flex gap-8">
            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Your Cart</h1>
                {cartItems.map(({ id, course, quantity }) => (
                    <div key={id} className="flex justify-between items-center border-b pb-4 mb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 object-cover rounded-md shadow-sm"
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
                                className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                            >
                                -
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                onClick={() => handleUpdateQuantity(id, quantity + 1)}
                                className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleDeleteItem(id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                            <input
                                type="checkbox"
                                checked={selectedItems.has(id)}
                                onChange={() => toggleSelectItem(id)}
                                className="w-4 h-4"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Purchase Summary</h2>
                <div className="flex justify-between mb-6">
                    <span className="text-lg text-gray-700">Total:</span>
                    <span className="text-xl font-semibold text-green-600">{totalPrice}đ</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;
