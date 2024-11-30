"use client";

import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import Button from "./button";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                setUser(null);
            } else {
                console.error("Đăng xuất không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user...");
                const response = await fetch(
                    "http://localhost:5000/auth/check",
                    {
                        method: "POST",
                        credentials: "include", // Gửi cookie
                    }
                );

                console.log("Response status:", response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Người dùng:", data.user);
                    setUser(data.user);
                } else {
                    console.warn("Không đăng nhập:", response.status);
                    setUser(null);
                }
            } catch (error) {
                console.error("Không lấy được thông tin người dùng:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

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
                {user && (
                    <div className="flex space-x-8">
                        {manages.map((manage) => (
                            <LinkItem key={manage} text={manage} />
                        ))}
                    </div>
                )}
                {!user ? (
                    <div className="flex items-center space-x-8">
                        <Button text="Login" href="/signin" />
                        <LinkItem text="Login" href="/login" />
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="font-medium text-sm"
                        >
                            Hi, {user.email}!
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute mt-2">
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
                                            href="#"
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
                )}
            </div>
        </nav>
    );
}
