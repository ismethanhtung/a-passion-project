// components/Navbar.tsx
import LinkItem from "./LinkItem";
import Button from "./button";

export default function Navbar() {
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
                    {/* Logo */}
                    {/* <LinkItem href="/" iconSrc="images/home.svg" /> */}
                    <LinkItem href="/" text="Home" />

                    {/* Navigation Links */}
                    <div className="flex space-x-8">
                        {links.map((link) => (
                            <LinkItem key={link} text={link} />
                        ))}
                    </div>
                </div>

                <div className="flex space-x-8">
                    {manages.map((manage) => (
                        <LinkItem key={manage} text={manage} />
                    ))}
                </div>

                {/* Group Button và Login */}
                <div className="flex items-center space-x-8">
                    <Button text="Login" href="/signin" />
                    {/* Login */}
                    <div className="font-semibold">
                        <LinkItem text="Login" href="/login" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
