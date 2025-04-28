import React from "react";
import LinkItem from "./LinkItem";
import Contact from "./contact";

export default function Footer() {
    const learningPrograms = ["Listening", "Reading", "Speaking", "Writing"];
    const aboutUs = [
        { label: "About", href: "/footer/about" },
        { label: "Introduce", href: "/footer/introduce" },
        { label: "Policy", href: "/footer/policy" },
        { label: "Terms & Conditions", href: "/footer/terms" },
        { label: "Privacy policy", href: "/footer/privacy" },
        { label: "Payment policy", href: "/footer/payment" },
    ];
    const features = [
        { label: "Courses", href: "/courses" },
        { label: "Learning Program", href: "/learning-paths" },
        { label: "Online Tests", href: "/online-tests" },
        { label: "Flashcards", href: "/flashcard" },
        { label: "Blogs", href: "/blogs" },
    ];

    return (
        <footer className="w-full bg-red-50 pl-40 py-20 mt-20 text-gray-700 flex mt-48">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Contact />
                </div>

                <div>
                    <h2 className="font-bold text-lg mb-4">Learning Programs</h2>
                    <ul>
                        {learningPrograms.map((program, index) => (
                            <li key={index} className="mb-2">
                                <LinkItem text={program} href={`/courses`} />
                            </li>
                        ))}
                    </ul>
                </div>

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
