// components/Navbar.tsx
import LinkItem from "./LinkItem";
import SearchButton from "./SearchButton";
import Button from "./button";
import Image from "next/image";

export default function Navbar() {
    const links = [
        "Courses",
        "Learning Program",
        "Online Tests",
        "Flashcards",
        "Blog",
        "",
    ];

    return (
        <nav className="h-16 bg-white border-b border-gray-150">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Group Logo và Links */}
                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <LinkItem href="/" iconSrc="images/home.svg" />

                    {/* Navigation Links */}
                    <div className="flex space-x-8 text-red-100">
                        {links.map((link) => (
                            <LinkItem key={link} text={link} />
                        ))}
                    </div>
                </div>

                {/* Group Button và Login */}
                <div className="flex items-center space-x-8">
                    <Button text="Sign in" href="/signin" />
                    {/* Login */}
                    <div className="text-blue-600 font-semibold">
                        <LinkItem text="Login" href="/login" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
