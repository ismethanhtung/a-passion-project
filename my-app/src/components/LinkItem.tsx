import Link from "next/link";

interface LinkItemProps {
    text?: string;
    href?: string;
    iconSrc?: string;
    className?: string;
}

export default function LinkItem({
    text,
    href,
    iconSrc,
    className,
}: LinkItemProps) {
    const linkHref =
        href || (text ? `/${text.toLowerCase().replace(/\s+/g, "-")}` : "#");

    return (
        <Link
            href={linkHref}
            className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-300 ${
                className || ""
            }`}
        >
            {iconSrc && (
                <img src={iconSrc} alt={text || "icon"} className="w-6 h-6" />
            )}
            {text && <span className="text-[14px]">{text}</span>}
        </Link>
    );
}
