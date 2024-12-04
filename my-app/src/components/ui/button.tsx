"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    href?: string;
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
        "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

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
