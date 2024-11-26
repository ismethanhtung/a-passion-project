// components/SearchButton.tsx
"use client";

import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

export default function SearchButton() {
    const [isOpen, setIsOpen] = useState(false);

    // Mở hộp thoại khi nhấn Cmd+K hoặc Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 border rounded-md shadow-sm text-gray-700 hover:bg-gray-100"
            >
                Search
            </button>
            <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
