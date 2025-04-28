"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Notification from "@/interfaces/notification";
import {
    fetchNotifications,
    addNotification,
    deleteNotification,
    updateNotification,
} from "@/api/notification";

function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const getNotifications = async () => {
        try {
            const response = await fetchNotifications();
            setNotifications(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddNotification = async (newNotification: Partial<Notification>) => {
        try {
            await addNotification(newNotification);
            getNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteNotification = async (id: number) => {
        try {
            await deleteNotification(id);
            console.log(11);
            getNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateNotification = async (updatedNotification: Notification) => {
        try {
            await updateNotification(updatedNotification.id, updatedNotification);
            getNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold py-8">Notifications management</h1>

            <div className="container">
                <DBTable
                    data={notifications}
                    columns={[
                        { key: "id" },
                        { key: "userId" },
                        { key: "message" },
                        { key: "read" },
                        { key: "createdAt" },
                    ]}
                    onCreate={handleAddNotification}
                    onUpdate={handleUpdateNotification}
                    onDelete={handleDeleteNotification}
                />
            </div>
        </div>
    );
}

export default NotificationPage;
