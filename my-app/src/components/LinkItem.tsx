import Link from "next/link";
import { ReactNode } from "react";

interface LinkItemProps {
    text?: string;
    href?: string;
    iconSrc?: string;
}

export default function LinkItem({ text, href, iconSrc }: LinkItemProps) {
    const linkHref =
        href || (text ? `/${text.toLowerCase().replace(/\s+/g, "-")}` : "#");

    return (
        <Link
            href={linkHref}
            className="span flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition duration-300"
        >
            {iconSrc && (
                <img src={iconSrc} alt={text || "icon"} className="w-16 h-16" />
            )}
            {text && <span className="text-[14px]">{text}</span>}
        </Link>
    );
}
