import React from "react";
import LinkItem from "./LinkItem";
import Contact from "./contact";

export default function Footer() {
    const learningPrograms = ["Listening", "Reading", "Speaking", "Writing"];
    const aboutUs = [
        { label: "About", href: "/about" },
        { label: "Introduce", href: "/introduce" },
        { label: "Policy", href: "/policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Payment policy", href: "/payment" },
    ];
    const features = [
        { label: "Courses", href: "/courses" },
        { label: "Learning Program", href: "/programs" },
        { label: "Online Tests", href: "/tests" },
        { label: "Flashcards", href: "/flashcards" },
        { label: "Blogs", href: "/blogs" },
    ];

    return (
        <footer className="w-full bg-red-50 pl-40 py-20 mt-20 text-gray-700">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Contact Section */}
                <div>
                    <Contact />
                </div>

                {/* Learning Programs */}
                <div>
                    <h2 className="font-bold text-lg mb-4">
                        Learning Programs
                    </h2>
                    <ul>
                        {learningPrograms.map((program, index) => (
                            <li key={index} className="mb-2">
                                <LinkItem
                                    text={program}
                                    href={`/${program.toLowerCase()}`}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* About Us */}
                <div>
                    <h2 className="font-bold text-lg mb-4">About Us</h2>
                    <ul>
                        {aboutUs.map((item, index) => (
                            <li key={index} className="mb-2">
                                <LinkItem text={item.label} href={item.href} />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Features */}
                <div>
                    <h2 className="font-bold text-lg mb-4">Features</h2>
                    <ul>
                        {features.map((item, index) => (
                            <li key={index} className="mb-2">
                                <LinkItem text={item.label} href={item.href} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
