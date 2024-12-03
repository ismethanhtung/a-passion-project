"use client";

import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
    const { user, logout } = useUser();
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                logout(); // Gọi hàm logout từ context
            } else {
                console.error("Đăng xuất không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const links = [
        "Courses",
        "Learning Program",
        "Online Tests",
        "Flashcards",
        "Blog",
    ];
    const manages = [
        "user-db",
        "course-db",
        "test-db",
        "blog-db",
        "question-db",
        "category-db",
        "lesson-db",
    ];

    // Đóng dropdown khi nhấn ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const manageDropdown = document.getElementById(
                "manage-dropdown-menu"
            );
            const userDropdown = document.getElementById("user-dropdown-menu");

            if (
                manageDropdown &&
                !manageDropdown.contains(event.target as Node) &&
                !event
                    .composedPath()
                    .some((el) =>
                        (el as HTMLElement).id?.includes(
                            "manage-dropdown-button"
                        )
                    )
            ) {
                setIsManageOpen(false);
            }

            if (
                userDropdown &&
                !userDropdown.contains(event.target as Node) &&
                !event
                    .composedPath()
                    .some((el) =>
                        (el as HTMLElement).id?.includes("user-dropdown-button")
                    )
            ) {
                setIsUserOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 h-16 bg-white z-50 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <LinkItem href="/" text="Home" />
                    <div className="flex space-x-8">
                        {links.map((link) => (
                            <LinkItem key={link} text={link} />
                        ))}
                    </div>
                </div>

                {user ? (
                    <div className="flex items-center space-x-8">
                        {/* Manage DB Dropdown */}
                        <div className="relative">
                            <button
                                id="manage-dropdown-button"
                                onClick={() => setIsManageOpen(!isManageOpen)}
                                className="font-medium text-sm"
                            >
                                Manage DB
                            </button>
                            {isManageOpen && (
                                <div
                                    id="manage-dropdown-menu"
                                    className="absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow"
                                >
                                    <ul className="py-2 px-4 text-sm text-gray-700">
                                        {manages.map((manage) => (
                                            <li key={manage}>
                                                <LinkItem
                                                    href={`/db/${manage}`}
                                                    text={manage}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                id="user-dropdown-button"
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className="font-medium text-sm"
                            >
                                Hi, {user.name}!
                            </button>
                            {isUserOpen && (
                                <div
                                    id="user-dropdown-menu"
                                    className="absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow"
                                >
                                    <ul className="py-2 text-sm text-gray-700">
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Dashboard
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Settings
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={handleLogout}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-8">
                        <LinkItem text="Login" href="/login" />
                    </div>
                )}
            </div>
        </nav>
    );
}
