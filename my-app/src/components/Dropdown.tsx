import LinkItem from "./LinkItem";
export const Dropdown = ({
    title,
    items,
    isOpen,
    onClose,
    className,
}: {
    title: string;
    items: { text: string; href?: string; onClick?: () => void }[];
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={`absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
        >
            <div className="bg-gray-100 px-4 py-3 border-b text-gray-700 text-sm font-semibold">
                {title}
            </div>
            <ul className="py-2">
                {items.map(({ text, href, onClick }) => (
                    <li key={text}>
                        {href ? (
                            <LinkItem
                                href={href}
                                text={text}
                                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500"
                            />
                        ) : (
                            <button
                                onClick={onClick}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-500"
                            >
                                {text}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
