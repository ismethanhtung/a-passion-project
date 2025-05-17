"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCartById, deleteCart, updateCart } from "@/api/cart";
import { useRouter } from "next/navigation";
import {
    Trash2,
    Minus,
    Plus,
    ShoppingCart,
    ArrowLeft,
    Tag,
    CreditCard,
    X,
    Check,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showCouponError, setShowCouponError] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchCartById(user.id)
                .then((data) => {
                    setCartItems(data);
                    // Auto-select all items by default
                    setSelectedItems(new Set(data.map((item: any) => item.id)));
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (!cartItems.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Bạn chưa có khóa học nào trong giỏ hàng.
                    </p>
                    <Link href="/courses">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Khám phá các khóa học
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleBuyNow = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        const selectedCourses = cartItems.filter((item) =>
            selectedItems.has(item.id)
        );
        if (selectedCourses.length === 0) {
            return alert("Vui lòng chọn ít nhất một mục để thanh toán.");
        }

        try {
            setProcessingCheckout(true);

            let totalAmount = selectedCourses.reduce(
                (sum, item) =>
                    sum +
                    (item.course.newPrice || item.course.price) * item.quantity,
                0
            );

            // Apply discount if coupon is valid
            if (couponApplied) {
                totalAmount = totalAmount * (1 - couponDiscount / 100);
            }

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
                        couponCode: couponApplied ? couponCode : undefined,
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
        } finally {
            setProcessingCheckout(false);
        }
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        updateCart(id, { quantity });
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const deleteItem = (id: number) => {
        deleteCart(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(id);
            return newSelected;
        });
    };

    const toggleSelect = (id: number) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map((item) => item.id)));
        }
    };

    const applyCoupon = () => {
        if (!couponCode.trim()) return;

        // Mock coupon validation - in a real app, you would call an API
        if (couponCode.toLowerCase() === "welcome10") {
            setCouponApplied(true);
            setCouponDiscount(10);
            setShowCouponError(false);
        } else if (couponCode.toLowerCase() === "summer20") {
            setCouponApplied(true);
            setCouponDiscount(20);
            setShowCouponError(false);
        } else {
            setCouponApplied(false);
            setCouponDiscount(0);
            setShowCouponError(true);
        }
    };

    const subTotal = cartItems.reduce(
        (sum, { id, course, quantity }) =>
            selectedItems.has(id)
                ? sum + (course.newPrice || course.price) * quantity
                : sum,
        0
    );

    const discount = couponApplied ? (subTotal * couponDiscount) / 100 : 0;
    const total = subTotal - discount;

    const handleCourseClick = (courseId: number) => {
        router.push(`/courses/${courseId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Giỏ hàng của bạn
                    </h1>
                    <div className="flex items-center text-gray-600">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        <p>{cartItems.length} khóa học trong giỏ hàng</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main cart items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                                <div className="flex items-center">
                                    <label className="inline-flex items-center bg-white rounded-md border border-gray-200 shadow-sm px-3 py-2 cursor-pointer hover:bg-indigo-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedItems.size ===
                                                cartItems.length
                                            }
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                                        />
                                        <span className="font-medium text-gray-700">
                                            Chọn tất cả ({selectedItems.size}/
                                            {cartItems.length})
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`py-6 px-6 border-b border-gray-100 last:border-0 transition-all ${
                                            selectedItems.has(item.id)
                                                ? "bg-white"
                                                : "bg-gray-50/50"
                                        } hover:bg-indigo-50/30`}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start gap-5">
                                            <div className="flex-shrink-0">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.has(
                                                            item.id
                                                        )}
                                                        onChange={() =>
                                                            toggleSelect(
                                                                item.id
                                                            )
                                                        }
                                                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </label>
                                            </div>

                                            <div
                                                className="w-28 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 transition-transform hover:scale-105 cursor-pointer group"
                                                onClick={() =>
                                                    handleCourseClick(
                                                        item.course.id
                                                    )
                                                }
                                            >
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={
                                                            item.course
                                                                .thumbnail ||
                                                            "/default-course.jpg"
                                                        }
                                                        alt={item.course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-indigo-800 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                                                        <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="bg-white rounded-full p-1.5">
                                                                <ArrowRight className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3
                                                    className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                                                    onClick={() =>
                                                        handleCourseClick(
                                                            item.course.id
                                                        )
                                                    }
                                                >
                                                    {item.course.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {item.course.tags
                                                        ?.split(",")
                                                        .map(
                                                            (
                                                                tag: string,
                                                                index: number
                                                            ) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                                                                >
                                                                    {tag.trim()}
                                                                </span>
                                                            )
                                                        )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                                                                item.quantity <=
                                                                1
                                                                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                                                    : "border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600"
                                                            } transition-colors`}
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="mx-3 w-8 text-center font-medium text-gray-700">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-lg font-semibold text-indigo-600">
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN"
                                                                ).format(
                                                                    item.course
                                                                        .newPrice ||
                                                                        item
                                                                            .course
                                                                            .price
                                                                )}
                                                                đ
                                                            </div>
                                                            {item.course.price >
                                                                item.course
                                                                    .newPrice && (
                                                                <div className="text-sm line-through text-gray-400">
                                                                    {new Intl.NumberFormat(
                                                                        "vi-VN"
                                                                    ).format(
                                                                        item
                                                                            .course
                                                                            .price
                                                                    )}
                                                                    đ
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                deleteItem(
                                                                    item.id
                                                                )
                                                            }
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Xóa khỏi giỏ hàng"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="h-10 w-10 text-indigo-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Giỏ hàng trống
                                    </h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        Bạn chưa có khóa học nào trong giỏ hàng.
                                        Hãy khám phá các khóa học phù hợp với
                                        bạn.
                                    </p>
                                </div>
                            )}
                        </div>

                        <Link href="/courses">
                            <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Tiếp tục mua sắm
                            </button>
                        </Link>
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-6">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                                <h2 className="text-xl font-bold mb-1">
                                    Tóm tắt đơn hàng
                                </h2>
                                <p className="text-indigo-100 text-sm">
                                    {selectedItems.size} khóa học được chọn
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã giảm giá
                                    </label>
                                    <div className="flex">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Tag className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) =>
                                                    setCouponCode(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={couponApplied}
                                                placeholder="Nhập mã giảm giá"
                                                className={`block w-full pl-10 pr-3 py-3 border ${
                                                    showCouponError
                                                        ? "border-red-300 focus:ring-red-500"
                                                        : couponApplied
                                                        ? "border-green-300 bg-green-50 focus:ring-green-500"
                                                        : "border-gray-300 focus:ring-indigo-500"
                                                } rounded-l-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm`}
                                            />
                                            {couponApplied && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <Check className="h-5 w-5 text-green-500" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={
                                                couponApplied
                                                    ? () => {
                                                          setCouponApplied(
                                                              false
                                                          );
                                                          setCouponDiscount(0);
                                                          setCouponCode("");
                                                          setShowCouponError(
                                                              false
                                                          );
                                                      }
                                                    : applyCoupon
                                            }
                                            className={`px-4 py-3 font-medium text-sm rounded-r-lg shadow-sm ${
                                                couponApplied
                                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                            } transition-colors`}
                                        >
                                            {couponApplied ? "Hủy" : "Áp dụng"}
                                        </button>
                                    </div>
                                    {showCouponError && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <X className="h-4 w-4 mr-1" />
                                            Mã giảm giá không hợp lệ
                                        </p>
                                    )}
                                    {couponApplied && (
                                        <p className="mt-2 text-sm text-green-600 flex items-center">
                                            <Check className="h-4 w-4 mr-1" />
                                            Đã áp dụng giảm {couponDiscount}%
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4 pb-6 border-b border-gray-100">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span className="font-medium">
                                            {new Intl.NumberFormat(
                                                "vi-VN"
                                            ).format(subTotal)}
                                            đ
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Giảm giá</span>
                                        <span className="text-green-600 font-medium">
                                            -
                                            {new Intl.NumberFormat(
                                                "vi-VN"
                                            ).format(discount)}
                                            đ
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 pb-6">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Tổng cộng</span>
                                        <span className="text-indigo-600">
                                            {new Intl.NumberFormat(
                                                "vi-VN"
                                            ).format(total)}
                                            đ
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={
                                        selectedItems.size === 0 ||
                                        processingCheckout
                                    }
                                    className={`w-full py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm
                                        ${
                                            selectedItems.size === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white transition-all transform hover:-translate-y-0.5 hover:shadow"
                                        }`}
                                >
                                    {processingCheckout ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Thanh toán ngay
                                        </>
                                    )}
                                </button>

                                <div className="bg-indigo-50 mt-6 p-4 rounded-lg border border-indigo-100">
                                    <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Thông tin thanh toán
                                    </h3>
                                    <ul className="text-xs text-indigo-700 space-y-1">
                                        <li className="flex items-start">
                                            <span className="mr-1">•</span>{" "}
                                            Chúng tôi chấp nhận thanh toán qua
                                            VNPay
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-1">•</span> Hoàn
                                            tiền 100% trong 30 ngày đầu nếu bạn
                                            không hài lòng
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Cần hỗ trợ? Gọi 0926550470
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
