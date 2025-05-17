"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = {
    variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        destructive:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline:
            "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        secondary:
            "bg-gray-300 text-black hover:bg-gray-400 focus:ring-gray-500",
        ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        link: "text-blue-600 underline-offset-4 hover:underline",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    },
    size: {
        default: "px-4 py-2 text-base",
        sm: "px-3 py-1 text-sm",
        lg: "px-6 py-3 text-lg",
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg",
    },
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants.variant;
    size?: keyof typeof buttonVariants.size;
    href?: string;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            href,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

        // Tính toán class dựa trên variant và size
        const variantStyle =
            buttonVariants.variant[variant] || buttonVariants.variant.default;
        const sizeStyle =
            buttonVariants.size[size] || buttonVariants.size.default;

        const buttonClass = cn(
            baseStyles,
            sizeStyle,
            variantStyle,
            props.disabled ? "opacity-50 cursor-not-allowed" : "",
            className
        );

        if (href) {
            return (
                <Link href={href} className={buttonClass}>
                    {children}
                </Link>
            );
        }

        return (
            <button className={buttonClass} ref={ref} {...props}>
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
