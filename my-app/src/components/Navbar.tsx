"use client";

import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import Button from "./button";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");

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
    const manages = ["user", "course-db", "test-db", "blog-db", "question-db"];

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
                        <div className="flex items-center space-x-4 cursor-pointer group">
                            <h1 className="text-gray-800">Hi, {user.email}!</h1>
                            <span className="text-gray-600 group-hover:text-gray-900">
                                ▼
                            </span>
                        </div>
                        <div className="absolute top-32 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg hidden group-hover:block">
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            "http://localhost:5000/auth/logout",
                                            {
                                                method: "POST",
                                                credentials: "include", // Gửi cookie để xoá
                                            }
                                        );
                                        if (response.ok) {
                                            setUser(null); // Xóa trạng thái đăng nhập
                                        } else {
                                            console.error(
                                                "Đăng xuất không thành công"
                                            );
                                        }
                                    } catch (error) {
                                        console.error(
                                            "Lỗi khi đăng xuất:",
                                            error
                                        );
                                    }
                                }}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
