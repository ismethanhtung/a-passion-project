"use client";

import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import { useUser } from "@/context/UserContext";
import { handleLogoutApi } from "@/utils/auth/logout";

export default function Navbar() {
    const { user, logout, loading } = useUser();
    const [dropdown, setDropdown] = useState<null | "manage" | "user">(null);

    const handleLogout = async () => {
        try {
            const response = await handleLogoutApi();
            if (response.ok) logout();
            else console.error("Đăng xuất không thành công");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const links = ["Courses", "Learning Program", "Online Tests", "Flashcards", "Blogs"];

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

    const toggleDropdown = (type: "manage" | "user") => {
        setDropdown((prev) => (prev === type ? null : type));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".dropdown")) {
                setDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

                {user === null && !loading ? (
                    <div className="flex items-center space-x-8 font-semibold">
                        <LinkItem text="Login" href="/auth/login" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-8">
                        {user?.role.name === "admin" && loading && (
                            <div className="relative dropdown">
                                <button
                                    onClick={() => toggleDropdown("manage")}
                                    className="font-medium text-sm"
                                >
                                    Manage DB
                                </button>
                                {dropdown === "manage" && (
                                    <div className="absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow">
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
                        )}
                        <div className="relative dropdown">
                            <button
                                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                onClick={() => toggleDropdown("user")}
                            >
                                <img
                                    className="size-9 rounded-full border border-gray-200"
                                    src="/images/avatar/avatar3.png"
                                    alt="User Avatar"
                                />
                            </button>
                            {dropdown === "user" && (
                                <div className="absolute top-10 right-1 w-44 bg-white rounded-lg shadow">
                                    <ul className="py-2 text-sm text-gray-700">
                                        <LinkItem
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            text="Dashboard"
                                            href="/dashboard"
                                        />
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
                )}
            </div>
        </nav>
    );
}
