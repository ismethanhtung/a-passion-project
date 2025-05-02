"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
    text?: string;
    children?: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
    size?: "small" | "medium" | "large" | "sm" | "lg";
    disabled?: boolean;
    href?: string;
    className?: string;
}

export default function Button({
    text,
    children,
    onClick,
    variant = "primary",
    size = "medium",
    disabled = false,
    href,
    className = "",
}: ButtonProps) {
    const baseStyles =
        "py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ";

    const sizeStyles = {
        small: "px-3 py-1 text-sm",
        sm: "px-3 py-1 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg",
        lg: "px-6 py-3 text-lg",
    };

    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
            "bg-gray-300 text-black hover:bg-gray-400 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline:
            "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const content = children || text;

    if (href) {
        return (
            <Link
                href={href}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} inline-block text-center ${className}`}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${
                variantStyles[variant]
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}
