import React from "react";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    {/* Company Information */}
                    <div>
                        <h2 className="font-bold text-2xl mb-6 bg-gradient-to-r from-[#6E59A5] to-[#33C3F0] bg-clip-text text-transparent">
                            Lingua Nova
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Revolutionizing language learning with innovative
                            methods, expert teachers, and an immersive
                            experience.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-[#6E59A5] p-2 rounded-full transition-colors"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-[#6E59A5] p-2 rounded-full transition-colors"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-[#6E59A5] p-2 rounded-full transition-colors"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-[#6E59A5] p-2 rounded-full transition-colors"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-[#6E59A5] p-2 rounded-full transition-colors"
                            >
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Courses", href: "/courses" },
                                { name: "Online Tests", href: "/tests" },
                                {
                                    name: "Learning Paths",
                                    href: "/learning/paths",
                                },
                                { name: "Blog", href: "/blog" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center"
                                    >
                                        <ChevronRight
                                            size={14}
                                            className="opacity-70 mr-1"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Languages */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">
                            Popular Languages
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "English", href: "/courses/english" },
                                { name: "Spanish", href: "/courses/spanish" },
                                { name: "French", href: "/courses/french" },
                                { name: "German", href: "/courses/german" },
                                { name: "Japanese", href: "/courses/japanese" },
                                { name: "Chinese", href: "/courses/chinese" },
                            ].map((language) => (
                                <li key={language.name}>
                                    <Link
                                        href={language.href}
                                        className="text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center"
                                    >
                                        <ChevronRight
                                            size={14}
                                            className="opacity-70 mr-1"
                                        />
                                        {language.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-start text-gray-400 hover:text-white transition-colors"
                                >
                                    <MapPin
                                        size={18}
                                        className="mr-3 mt-1 flex-shrink-0"
                                    />
                                    <span>
                                        123 Education Street, Learning City,
                                        94103
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+18001234567"
                                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <Phone
                                        size={18}
                                        className="mr-3 flex-shrink-0"
                                    />
                                    <span>+1 (800) 123-4567</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:info@linguanova.com"
                                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <Mail
                                        size={18}
                                        className="mr-3 flex-shrink-0"
                                    />
                                    <span>info@linguanova.com</span>
                                </a>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <h4 className="font-medium mb-3">
                                Subscribe to our newsletter
                            </h4>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-[#6E59A5] text-sm"
                                />
                                <button className="bg-[#6E59A5] hover:bg-[#5c4a8c] text-white px-4 py-2 rounded-r-md transition-colors text-sm">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} Lingua Nova. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-4">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cookies Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
