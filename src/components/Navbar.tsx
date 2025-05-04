"use client";
import { useState, useEffect } from "react";
import LinkItem from "./LinkItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { handleLogoutApi } from "@/api/auth/logout";
import { logout, setUser, setTokens } from "@/store/userSlice";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Chatbot from "./Chatbot";
import Link from "next/link";
import {
    Book,
    BookOpen,
    CalendarDays,
    ChevronDown,
    FileText,
    FlaskConical,
    LogIn,
    Menu,
    MessageSquare,
    Search,
    UserPlus,
} from "lucide-react";

export default function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [dropdown, setDropdown] = useState<
        null | "manage" | "user" | "notification"
    >(null);
    const user = useSelector((state: RootState) => state.user.user);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<
        { sender: string; text: string }[]
    >([]);
    const [input, setInput] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Kiểm tra khi component mount
        checkIfMobile();

        // Thêm event listener cho resize
        window.addEventListener("resize", checkIfMobile);

        // Cleanup
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

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
            dispatch(logout());
            router.push("/");
        } catch (error) {
            console.log(error);
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const links = [
        "Courses",
        "Online Tests",
        "Blogs",
        "Docs",
        "Learning Paths",
        "Learning Program",
        "Flashcard",
        "Forum",
    ];

    const manages = [
        "user",
        "course",
        "test",
        // "blog",
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Navigation items with their routes and child items
    const NAV_ITEMS = [
        {
            title: "Courses",
            path: "/courses",
            icon: <Book className="mr-2 h-4 w-4" />,
            children: [
                { title: "Featured Courses", path: "/courses/featured" },
                { title: "New Releases", path: "/courses/new" },
                { title: "Popular Languages", path: "/courses/popular" },
                { title: "All Courses", path: "/courses" },
            ],
        },
        {
            title: "Online Tests",
            path: "/online-tests",
            icon: <FlaskConical className="mr-2 h-4 w-4" />,
        },
        {
            title: "Learning",
            path: "/learning",
            icon: <BookOpen className="mr-2 h-4 w-4" />,
            children: [
                { title: "Learning Paths", path: "/learning/paths" },
                { title: "Learning Programs", path: "/learning/programs" },
                { title: "Flashcards", path: "/flashcards" },
            ],
        },
        {
            title: "Resources",
            path: "/resources",
            icon: <FileText className="mr-2 h-4 w-4" />,
            children: [
                { title: "Blog", path: "/blog" },
                { title: "Documentation", path: "/docs" },
                { title: "Forum", path: "/forum" },
                { title: "Pronunciation Coach", path: "/pronunciation" },
            ],
        },
    ];

    // Dropdown menu component
    interface DropdownMenuProps {
        isOpen: boolean;
        onClose: () => void;
        trigger: React.ReactNode;
        children: React.ReactNode;
    }

    const DropdownMenu = ({
        isOpen,
        onClose,
        trigger,
        children,
    }: DropdownMenuProps) => {
        return (
            <div className="relative">
                {trigger}
                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    const handleDropdownToggle = (index: number) => {
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(index);
        }
    };

    if (loading) {
        return (
            <div className="sticky top-0 h-16 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center"></div>
        );
    }

    // const toggleChat = () => setShowChat((prev) => !prev);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
            <div className="container mx-auto px-20 py-2 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#6E59A5] to-[#33C3F0] bg-clip-text text-transparent">
                            LinguaX
                        </span>
                    </Link>
                </div>

                {isMobile ? (
                    <>
                        <button
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu size={24} className="text-gray-700" />
                        </button>
                        {isMenuOpen && (
                            <div className="fixed inset-0 top-16 bg-white z-40 animate-slide-in-right overflow-y-auto max-h-[calc(100vh-4rem)]">
                                <div className="flex flex-col p-4 gap-3">
                                    {NAV_ITEMS.map((item, index) => (
                                        <div key={item.title} className="py-2">
                                            {item.children ? (
                                                <div className="space-y-2">
                                                    <div
                                                        className="flex items-center font-semibold text-sm cursor-pointer transition-colors hover:text-purple-600"
                                                        onClick={() =>
                                                            handleDropdownToggle(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {item.icon}
                                                        {item.title}
                                                        <ChevronDown
                                                            className={`ml-auto h-4 w-4 transform ${
                                                                openDropdown ===
                                                                index
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </div>
                                                    {openDropdown === index && (
                                                        <div className="ml-6 flex flex-col gap-2">
                                                            {item.children.map(
                                                                (child) => (
                                                                    <Link
                                                                        key={
                                                                            child.title
                                                                        }
                                                                        href={
                                                                            child.path
                                                                        }
                                                                        className="py-2 text-gray-600 hover:text-purple-600"
                                                                        onClick={() =>
                                                                            setIsMenuOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link
                                                    href={item.path}
                                                    className="flex items-center font-semibold text-lg transition-colors hover:text-purple-600"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    {item.icon}
                                                    {item.title}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                    {!user ? (
                                        <div className="mt-4 space-y-2">
                                            <Link href="/auth/login">
                                                <button className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    Log In
                                                </button>
                                            </Link>
                                            <Link href="/auth/signup">
                                                <button className="w-full flex items-center justify-start px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Sign Up
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Phần user menu cho mobile khi đã đăng nhập */}
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="hidden lg:flex items-center space-x-4 text-sm">
                            {NAV_ITEMS.map((item, index) => (
                                <div key={item.title} className="relative">
                                    {item.children ? (
                                        <DropdownMenu
                                            isOpen={openDropdown === index}
                                            onClose={() =>
                                                setOpenDropdown(null)
                                            }
                                            trigger={
                                                <button
                                                    className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-purple-600 text-sm"
                                                    onClick={() =>
                                                        handleDropdownToggle(
                                                            index
                                                        )
                                                    }
                                                >
                                                    {item.title}{" "}
                                                    <ChevronDown className="h-4 w-4 ml-1" />
                                                </button>
                                            }
                                        >
                                            <div className="py-1">
                                                <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100 mb-1">
                                                    {item.icon}
                                                    <span className="ml-2">
                                                        {item.title}
                                                    </span>
                                                </div>
                                                <div className="h-px bg-gray-200 my-1"></div>
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.title}
                                                        href={child.path}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors duration-150"
                                                    >
                                                        {child.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </DropdownMenu>
                                    ) : (
                                        <Link href={item.path}>
                                            <button className="px-3 py-2 text-gray-700 hover:text-purple-600">
                                                {item.title}
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!user ? (
                            <div className="hidden lg:flex items-center space-x-2">
                                <button className="p-3 rounded-md hover:bg-gray-200 transition-colors duration-150">
                                    <Search className="h-4 w-4" />
                                </button>
                                <Link href="/auth/login">
                                    <button className="text-sm px-3 py-2 text-gray-700 hover:text-purple-600 border border-gray-300 rounded-lg hover:border-purple-600 transition-all duration-150">
                                        Log In
                                    </button>
                                </Link>
                                <Link href="/auth/signup">
                                    <button className="text-sm px-3 py-2 bg-[#6E59A5] text-white rounded-lg  transition-colors duration-150">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-4">
                                <button className="p-2 rounded-lg hover:bg-gray-200">
                                    <Search className="h-5 w-5" />
                                </button>
                                <div className="relative dropdown">
                                    <div className="flex items-center gap-6">
                                        <button
                                            className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            onClick={() =>
                                                toggleDropdown("notification")
                                            }
                                        >
                                            <img
                                                className="w-6 h-6"
                                                src="/icons/notification.png"
                                                alt="Notifications"
                                            />
                                            <span className="absolute top-1 right-1.5 inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                                        </button>
                                        <a href="/chat">
                                            <img
                                                className="w-6 h-6"
                                                src="/icons/message.png"
                                                alt="Message"
                                            />
                                        </a>
                                        <Chatbot />

                                        <button
                                            className="relative flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            onClick={() =>
                                                toggleDropdown("user")
                                            }
                                        >
                                            <img
                                                className="size-10 p-1 rounded-full border border-gray-200 "
                                                src="/images/avatar/avatar2.png"
                                                alt="User Avatar"
                                            />
                                        </button>
                                    </div>
                                    {dropdown === "notification" && (
                                        <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-100 px-4 py-3 border-b text-sm font-semibold text-gray-800">
                                                Notifications
                                            </div>
                                            {/* Giữ lại phần thông báo hiện tại */}
                                            <ul className="divide-y divide-gray-200">
                                                <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        New Course Available
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        2 hours ago
                                                    </p>
                                                </li>
                                                <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        Your subscription will
                                                        expire soon
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Yesterday
                                                    </p>
                                                </li>
                                                <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        New Blog Post: Learning
                                                        Strategies
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        3 days ago
                                                    </p>
                                                </li>
                                            </ul>
                                            <div className="text-center bg-gray-50 py-2">
                                                <a
                                                    href="/notifications"
                                                    className="text-sm font-medium text-purple-500 hover:underline"
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
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <ul className="py-2">
                                                <li>
                                                    <a
                                                        href="/profile"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Profile
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="/settings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Settings
                                                    </a>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                .animate-slide-in-right {
                    animation: slideInRight 0.3s forwards;
                }
            `}</style>
        </nav>
    );
}
