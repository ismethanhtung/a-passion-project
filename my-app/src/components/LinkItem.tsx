// components/LinkItem.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface LinkItemProps {
    text?: string; // Text hiển thị
    href?: string; // URL của liên kết
    iconSrc?: string; // Đường dẫn đến file SVG hoặc ảnh
}

export default function LinkItem({ text, href, iconSrc }: LinkItemProps) {
    const linkHref = href || (text ? `/${text.toLowerCase()}` : "#");

    return (
        <Link
            href={linkHref}
            className="span flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition duration-300"
        >
            {/* Hiển thị icon nếu có */}
            {iconSrc && (
                <img
                    src={iconSrc}
                    alt={text || "icon"}
                    className="w-16 h-16" // Tùy chỉnh kích thước
                />
            )}
            {/* Hiển thị text nếu có */}
            {text && <span className="text-[14px]">{text}</span>}
        </Link>
    );
}
