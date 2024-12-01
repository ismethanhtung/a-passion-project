"use client";

import { useState } from "react";
import LinkItem from "./LinkItem";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
    const { user, logout } = useUser(); // Lấy user và hàm logout từ UserContext
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    const toggleMegaMenu = () => {
        setIsMegaMenuOpen((prev) => !prev);
    };

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
    console.log(user);
    const links = [
        "Courses",
        "Learning Program",
        "Online Tests",
        "Flashcards",
        "Blog",
    ];
    const manages = [
        "user",
        "course-db",
        "test-db",
        "blog-db",
        "question-db",
        "category-db",
    ];

    return (
        <nav className="sticky top-0 h-16 bg-white border-b border-gray-150">
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
                        <div className="flex space-x-8">
                            {manages.map((manage) => (
                                <LinkItem key={manage} text={manage} />
                            ))}
                        </div>
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="font-medium text-sm"
                            >
                                Hi, {user.name}!
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute mt-2">
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
