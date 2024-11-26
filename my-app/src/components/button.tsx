"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
    text: string; // Nội dung hiển thị trên nút
    onClick?: () => void; // Hành động khi bấm nút
    variant?: "primary" | "secondary" | "danger"; // Loại nút
    size?: "small" | "medium" | "large"; // Kích thước
    disabled?: boolean; // Trạng thái vô hiệu hóa
    href?: string; // URL liên kết
}

export default function Button({
    text,
    onClick,
    variant = "primary",
    size = "medium",
    disabled = false,
    href,
}: ButtonProps) {
    const baseStyles =
        "rounded-md items-center border border-slate-300 text-center text-sm shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

    const sizeStyles = {
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg",
    };

    const variantStyles = {
        primary: " text-white hover:bg-blue-700",
        secondary: "bg-gray-300 text-black hover:bg-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    if (href) {
        return (
            <Link
                href={href}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} inline-block text-center`}
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${
                variantStyles[variant]
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
