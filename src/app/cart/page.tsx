"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCartById, deleteCart, updateCart } from "@/api/cart";
import { useRouter } from "next/navigation";

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchCartById(user.id)
                .then((data) => {
                    setCartItems(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 py-96">
                <img src="/icons/loading.gif" alt="Loading..." className="w-12 h-12" />
                <p className="mt-4 text-lg text-gray-700">loading cart...</p>
            </div>
        );
    }

    if (!cartItems.length) {
        return (
            <div className="text-center text-3xl text-red-300 font-bold py-96">
                Your cart is empty
            </div>
        );
    }

    const handleBuyNow = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        const selectedCourses = cartItems.filter((item) => selectedItems.has(item.id));
        if (selectedCourses.length === 0) {
            return alert("Vui lòng chọn ít nhất một mục để thanh toán.");
        }

        const totalAmount = selectedCourses.reduce(
            (sum, item) => sum + (item.course.newPrice || item.course.price) * item.quantity,
            0
        );

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchase/create_payment_url`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: totalAmount,
                        orderDescription: `Thanh toán cho các khóa học: ${selectedCourses
                            .map((item) => item.course.title)
                            .join(", ")}`,
                        orderType: "education",
                        language: "vn",
                        userId: user.id,
                        courses: selectedCourses.map((item) => ({
                            courseId: item.course.id,
                            quantity: item.quantity,
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            } else {
                alert("Không thể tạo URL thanh toán. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

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

    const handleCourseClick = (courseId: number) => {
        router.push(`/courses/${courseId}`);
    };

    return (
        <div className="container mx-auto p-8 flex gap-8">
            <div className="w-3/4 bg-white p-6 rounded-lg border-2 border-violet-200">
                <h1 className="text-3xl font-semibold my-10">Your Cart</h1>
                {cartItems.map(({ id, course, quantity }) => (
                    <div key={id} className="flex justify-between items-center border-t p-4">
                        <div className="flex items-center gap-4 w-1/2">
                            <input
                                type="checkbox"
                                checked={selectedItems.has(id)}
                                onChange={() => toggleSelect(id)}
                            />
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <div>
                                <h2
                                    className="text-xl font-semibold cursor-pointer"
                                    onClick={() => handleCourseClick(course.id)}
                                >
                                    {course.title}
                                </h2>
                            </div>
                        </div>
                        <p>
                            {course.newPrice.toLocaleString("vi-VN") ||
                                course.price.toLocaleString("vi-VN")}
                            đ
                        </p>

                        <div className="flex items-center gap-6">
                            <button onClick={() => updateQuantity(id, quantity - 1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => updateQuantity(id, quantity + 1)}>+</button>
                            <button onClick={() => deleteItem(id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-1/3 bg-white p-6 rounded-lg border-2 border-violet-200">
                <h2 className="text-2xl font-semibold py-8">Summary</h2>

                <div className="my-2">Do you have promo code?</div>

                <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-2 border mb-4"
                />

                <div className="flex justify-between py-4">
                    <span>Total:</span>
                    <span className="text-green-600 font-semibold">{totalPrice}đ</span>
                </div>
                <button
                    onClick={handleBuyNow}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2"
                >
                    Checkout
                </button>

                <div className="mt-4 text-sm text-gray-400">Need help? Call me at 0926550470</div>
            </div>
        </div>
    );
};

export default CartPage;
