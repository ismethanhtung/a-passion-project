"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

interface Toast {
    id: string;
    title: string;
    description?: string;
    status?: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
    toasts: Toast[];
    toast: (props: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(
        ({ title, description, status = "info" }: Omit<Toast, "id">) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast = { id, title, description, status };
            setToasts((prevToasts) => [...prevToasts, newToast]);

            // Tự động xóa toast sau 3 giây
            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.filter((toast) => toast.id !== id)
                );
            }, 3000);
        },
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-md shadow-md min-w-[300px] max-w-md animate-slideIn ${
                            toast.status === "success"
                                ? "bg-green-500 text-white"
                                : toast.status === "error"
                                ? "bg-red-500 text-white"
                                : toast.status === "warning"
                                ? "bg-yellow-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">{toast.title}</h3>
                                {toast.description && (
                                    <p className="text-sm opacity-90 mt-1">
                                        {toast.description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white opacity-70 hover:opacity-100"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
