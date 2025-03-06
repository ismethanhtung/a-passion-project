"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createPurchase } from "@/api/purchase";

const PaymentResult = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState({ code: "", message: "" });
    const vnp_Amount = searchParams.get("vnp_Amount") || "0";
    const vnp_BankCode = searchParams.get("vnp_BankCode");
    const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
    const vnp_CardType = searchParams.get("vnp_CardType");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_PayDate = searchParams.get("vnp_PayDate");

    const match = vnp_OrderInfo?.match(/GD:(\d+)-(\d+)/) || "";
    const courseId = parseInt(match[1], 10);
    const userId = parseInt(match[2], 10);
    const href = `/courses/${courseId}`;

    useEffect(() => {
        const processPayment = async () => {
            const responseCode = searchParams.get("vnp_ResponseCode");

            if (responseCode === "00" && userId && courseId) {
                try {
                    await createPurchase(userId, courseId, parseInt(vnp_Amount));
                } catch (error) {
                    console.error("Error creating purchase:", error);
                }
            }

            const message =
                responseCode === "00"
                    ? "Thanh toán thành công!"
                    : "Thanh toán thất bại. Vui lòng thử lại!";
            setStatus({ code: responseCode || "97", message });
        };

        processPayment();
    }, [searchParams, vnp_Amount, userId, courseId]);

    return (
        <div className="border max-w-lg mx-auto mt-20 p-6 bg-white shadow-md rounded-lg text-center">
            <h1
                className={`text-3xl font-bold mt-12 ${
                    status.code === "00" ? "text-green-500" : "text-red-500"
                }`}
            >
                {status.message}
            </h1>
            <p className="text-sm text-gray-500 mt-6">
                Mã phản hồi: <span className="font-medium">{status.code}</span>
            </p>

            <div className="bg-white rounded-lg p-6 text-left">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Chi tiết thanh toán:</h2>
                <ul className="text-sm text-gray-700 space-y-3">
                    <li className="flex justify-between">
                        <span className="font-medium">Số tiền:</span>
                        <span>{parseInt(vnp_Amount) / 100}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Mã ngân hàng:</span>
                        <span>{vnp_BankCode}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Số giao dịch ngân hàng:</span>
                        <span>{vnp_BankTranNo}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Loại thẻ:</span>
                        <span>{vnp_CardType}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Thông tin đơn hàng:</span>
                        <span>{vnp_OrderInfo}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Ngày thanh toán:</span>
                        <span>{vnp_PayDate}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">User ID:</span>
                        <span>{userId}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Course ID:</span>
                        <span>{courseId}</span>
                    </li>
                </ul>
            </div>

            <div className="my-8 underline">
                <a href={href} className="text-blue-600 font-medium hover:underline">
                    Quay lại khóa học
                </a>
            </div>
        </div>
    );
};

export default PaymentResult;
