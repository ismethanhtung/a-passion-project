"use client";

import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import { useUser } from "@/context/UserContext";
import Button from "./ui/button";

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
        "Blogs",
    ];
    const manages = [
        "user-db",
        "course-db",
        "test-db",
        "blog-db",
        "question-db",
        "category-db",
        "lesson-db",
        "review-db",
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
        <nav className="sticky top-0 h-16 z-50 bg-red-50 opacity-95">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center h-full">
                <div className="flex items-center space-x-8 font-semibold">
                    <LinkItem href="/" text="Home" />
                    <div className="flex space-x-8 font-semibold">
                        {links.map((link) => (
                            <LinkItem key={link} text={link} />
                        ))}
                    </div>
                </div>

                {user ? (
                    <div className="flex items-center space-x-8">
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
                            <div>
                                <button
                                    type="button"
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                    id="user-dropdown-button"
                                >
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <img
                                        className="size-9 rounded-full border border-gray-200"
                                        src="/images/avatar/avatar3.png"
                                        alt=""
                                    />
                                </button>
                            </div>
                            {isUserOpen && (
                                <div
                                    id="user-dropdown-menu"
                                    className="absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow"
                                >
                                    <ul className="py-2 text-sm text-gray-700">
                                        <LinkItem
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            text="Dashboard"
                                            href="/dashboard"
                                        />{" "}
                                        <LinkItem
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            text="Settings"
                                            href="/settings"
                                        />
                                        <a
                                            onClick={handleLogout}
                                            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Logout
                                        </a>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-8 font-semibold">
                        <LinkItem text="Login" href="/login" />
                    </div>
                )}
            </div>
        </nav>
    );
}
