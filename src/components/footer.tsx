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
        <footer className="bg-gradient-to-r from-violet-50 to-red-50 text-gray-900 pt-20 pb-10 border-t border-gray-300">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    {/* Company Information */}
                    <div>
                        <h2 className="font-bold text-2xl mb-6 bg-gradient-to-r from-[#6E59A5] to-[#33C3F0] bg-clip-text text-transparent">
                            LinguaX
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Revolutionizing language learning with innovative
                            methods, expert teachers, and an immersive
                            experience.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="bg-gray-200 hover:bg-violet-200 p-2 rounded-full transition-colors"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-200 hover:bg-violet-200 p-2 rounded-full transition-colors"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-200 hover:bg-violet-200 p-2 rounded-full transition-colors"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-200 hover:bg-violet-200 p-2 rounded-full transition-colors"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-200 hover:bg-violet-200 p-2 rounded-full transition-colors"
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
                                { name: "Online Tests", href: "/online-tests" },
                                {
                                    name: "Learning Paths",
                                    href: "/learning-paths",
                                },
                                { name: "Blog", href: "/blogs" },
                                { name: "About Us", href: "/footer/about" },
                                { name: "Contact Us", href: "/footer/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-700 hover:text-[#6E59A5] hover:translate-x-1 transition-all flex items-center"
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
                                { name: "English", href: "/courses/" },
                                { name: "Spanish", href: "/courses/" },
                                { name: "French", href: "/courses/" },
                                { name: "German", href: "/courses/" },
                                { name: "Japanese", href: "/courses/" },
                                { name: "Chinese", href: "/courses/" },
                            ].map((language) => (
                                <li key={language.name}>
                                    <Link
                                        href={language.href}
                                        className="text-gray-700 hover:text-[#6E59A5] hover:translate-x-1 transition-all flex items-center"
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
                                    className="flex items-start text-gray-700 hover:text-[#6E59A5] transition-colors"
                                >
                                    <MapPin
                                        size={18}
                                        className="mr-3 mt-1 flex-shrink-0"
                                    />
                                    <span>
                                        Ho Chi Minh City, Vietnam, 600000
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+84926550470"
                                    className="flex items-center text-gray-700 hover:text-[#6E59A5] transition-colors"
                                >
                                    <Phone
                                        size={18}
                                        className="mr-3 flex-shrink-0"
                                    />
                                    <span>+84 926 550 470</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:ismethanhtung@gmail.com"
                                    className="flex items-center text-gray-700 hover:text-[#6E59A5] transition-colors"
                                >
                                    <Mail
                                        size={18}
                                        className="mr-3 flex-shrink-0"
                                    />
                                    <span>ismethanhtung@gmail.com</span>
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
                                    className="bg-white text-gray-900 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-[#6E59A5] text-sm"
                                />
                                <button className="bg-[#6E59A5] hover:bg-[#5c4a8c] text-white px-4 py-2 rounded-r-md transition-colors text-sm w-32">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-gray-300 text-center md:flex md:justify-between md:text-left">
                    <p className="text-gray-700 text-sm mb-4 md:mb-0">
                        © {currentYear} LinguaX. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-4">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-700 hover:text-[#6E59A5] transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-700 hover:text-[#6E59A5] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-sm text-gray-700 hover:text-[#6E59A5] transition-colors"
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
