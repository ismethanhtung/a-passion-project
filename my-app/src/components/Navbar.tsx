"use client";
import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { handleLogoutApi } from "@/api/auth/logout";
import { logout, setUser, setTokens } from "@/store/userSlice";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [dropdown, setDropdown] = useState<null | "manage" | "user" | "notification">(null);
    const user = useSelector((state: RootState) => state.user.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const user = Cookie.get("user");
            const accessToken = Cookie.get("accessToken");
            const refreshToken = Cookie.get("refreshToken");

            if (user && accessToken && refreshToken) {
                dispatch(setUser({ user: JSON.parse(user) }));
                dispatch(setTokens({ accessToken, refreshToken }));
            }
            setLoading(false);
        };

        fetchUser();
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            const response = await handleLogoutApi();
            if (response.ok) {
                dispatch(logout());
                router.push("/");
            } else {
                console.error("Đăng xuất không thành công");
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const links = ["Courses", "Learning Program", "Online Tests", "Flashcards", "Blogs", "Forum"];

    const manages = [
        "user",
        "course",
        "test",
        "blog",
        "question",
        "category",
        "lesson",
        "review",
        "enrollment",
        "forumPost",
        "forumThread",
        "liveCourse",
        "liveSession",
        "notification",
        "payment",
        "progress",
        "purchase",
    ];

    const toggleDropdown = (type: "manage" | "user" | "notification") => {
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

    if (loading) {
        return (
            <div className="sticky top-0 h-16 z-50 bg-gray-100 flex items-center justify-center"></div>
        );
    }

    return (
        <div className="sticky top-0 h-16 z-50 bg-gray-100">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center h-full">
                <div className="flex items-center space-x-8 font-semibold">
                    <LinkItem href="/" text="Home" />
                    <div className="flex space-x-8 font-semibold">
                        {links.map((link) => (
                            <LinkItem key={link} text={link} />
                        ))}
                    </div>
                </div>

                {!user ? (
                    <div className="flex items-center space-x-8 font-semibold">
                        <LinkItem text="Login" href="/auth/login" />
                        <LinkItem text="Sign Up" href="/auth/signup" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-8">
                        {user.role.name === "admin" && (
                            <div className="relative dropdown">
                                <button
                                    onClick={() => toggleDropdown("manage")}
                                    className="font-bold text-sm"
                                >
                                    Manage DB
                                </button>
                                {dropdown === "manage" && (
                                    <div className="absolute top-12 right-0 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-100 px-4 py-3 border-b text-gray-700 text-sm font-semibold">
                                            Manage Options
                                        </div>

                                        <ul className="grid grid-cols-2 gap-2 py-4 px-4 text-sm font-medium text-gray-600">
                                            {manages.map((manage) => (
                                                <li key={manage}>
                                                    <LinkItem
                                                        href={`/db/${manage}`}
                                                        text={manage}
                                                        className="block px-3 py-2 text-center rounded-lg hover:bg-gray-100 hover:text-red-500 transition duration-200"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="relative dropdown">
                            <div className="flex items-center gap-8">
                                <button
                                    className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                                    onClick={() => toggleDropdown("notification")}
                                >
                                    <img
                                        className="w-6 h-6"
                                        src="/icons/notification.png"
                                        alt="Notifications"
                                    />
                                    <span className="absolute top-1 right-1 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                </button>
                                <a href="/chat">
                                    <img
                                        className="w-6 h-6"
                                        src="/icons/message.png"
                                        alt="Message"
                                    />
                                </a>
                                <button
                                    className="relative flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                                    onClick={() => toggleDropdown("user")}
                                >
                                    <img
                                        className="size-10 rounded-full border border-gray-200"
                                        src="/images/avatar/avatar3.png"
                                        alt="User Avatar"
                                    />
                                </button>
                            </div>
                            {dropdown === "notification" && (
                                <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-3 border-b text-sm font-semibold text-gray-800">
                                        Notifications
                                    </div>
                                    <ul className="divide-y divide-gray-200">
                                        <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-800">
                                                New Course Available
                                            </p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </li>
                                        <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-800">
                                                Your subscription will expire soon
                                            </p>
                                            <p className="text-xs text-gray-500">Yesterday</p>
                                        </li>
                                        <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-800">
                                                New Blog Post: Learning Strategies
                                            </p>
                                            <p className="text-xs text-gray-500">3 days ago</p>
                                        </li>
                                    </ul>
                                    <div className="text-center bg-gray-50 py-2">
                                        <a
                                            href="/notifications"
                                            className="text-sm font-medium text-red-500 hover:underline"
                                        >
                                            View all notifications
                                        </a>
                                    </div>
                                </div>
                            )}

                            {dropdown === "user" && (
                                <div className="absolute top-14 right-0 w-64 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-3 border-b">
                                        <p className="text-base font-semibold text-gray-800">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <ul className="py-2">
                                        {[
                                            { text: "Dashboard", href: "/dashboard" },
                                            { text: "Settings", href: "/settings" },
                                            { text: "Cart", href: "/cart" },
                                        ].map(({ text, href }) => (
                                            <li key={text}>
                                                <LinkItem
                                                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition duration-150"
                                                    text={text}
                                                    href={href}
                                                />
                                            </li>
                                        ))}
                                        <li>
                                            <a
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer transition duration-150"
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
