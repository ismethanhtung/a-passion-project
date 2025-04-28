"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Payment from "@/interfaces/payment";
import { fetchPayments, addPayment, deletePayment, updatePayment } from "@/api/payment";

function PaymentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);

    const getPayments = async () => {
        try {
            const response = await fetchPayments();
            setPayments(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddPayment = async (newPayment: Partial<Payment>) => {
        try {
            await addPayment(newPayment);
            getPayments();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletePayment = async (id: number) => {
        try {
            await deletePayment(id);
            console.log(11);
            getPayments();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdatePayment = async (updatedPayment: Payment) => {
        try {
            await updatePayment(updatedPayment.id, updatedPayment);
            getPayments();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPayments();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">Payments management</h1>

            <div className="container">
                <DBTable
                    data={payments}
                    columns={[
                        { key: "id" },
                        { key: "userId" },
                        { key: "amount" },
                        { key: "paymentDate" },
                        { key: "method" },
                    ]}
                    onCreate={handleAddPayment}
                    onUpdate={handleUpdatePayment}
                    onDelete={handleDeletePayment}
                />
            </div>
        </div>
    );
}

export default PaymentPage;
