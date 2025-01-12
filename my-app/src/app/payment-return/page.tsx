"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const PurchaseCourse = async (amount: number, courseId: number, userId: number) => {
    try {
        const response = await fetch("http://localhost:5000/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: amount,
                courseId: courseId,
                userId: userId,
            }),
        });
        const data = await response.json();

        console.log("238471293847123412", data);
    } catch (error) {
        console.log(error);
    }
};

const PaymentResult = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState({ code: "", message: "" });
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_BankCode = searchParams.get("vnp_BankCode");
    const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
    const vnp_CardType = searchParams.get("vnp_CardType");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_PayDate = searchParams.get("vnp_PayDate");
    useEffect(() => {
        const responseCode = searchParams.get("vnp_ResponseCode");

        const message =
            responseCode === "00"
                ? "Thanh toán thành công!"
                : "Thanh toán thất bại. Vui lòng thử lại!";
        setStatus({ code: responseCode || "97", message });
    }, [searchParams]);

    return (
        <div className="text-center mt-20">
            <h1 className="text-3xl font-bold">{status.message}</h1>
            <p className="text-gray-500 mt-2">Mã phản hồi: {status.code}</p>
            <p className="text-gray-500 mt-2">Amount: {vnp_Amount}</p>
            <p className="text-gray-500 mt-2">BankCode: {vnp_BankCode}</p>
            <p className="text-gray-500 mt-2">BankTranNo: {vnp_BankTranNo}</p>
            <p className="text-gray-500 mt-2">CardType: {vnp_CardType}</p>
            <p className="text-gray-500 mt-2">OrderInfo: {vnp_OrderInfo}</p>
            <p className="text-gray-500 mt-2">PayDate: {vnp_PayDate}</p>
        </div>
    );
};

export default PaymentResult;
