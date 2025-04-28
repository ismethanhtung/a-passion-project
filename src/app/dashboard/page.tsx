"use client";

import Link from "next/link";
import React from "react";

const Settings: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center text-red-300 my-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md border-violet-200 border-2">
                    <h2 className="text-xl font-semibold">Total Learning Time</h2>
                    <p className="text-2xl font-bold text-blue-500">1h</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border-violet-200 border-2">
                    <h2 className="text-xl font-semibold">Courses Learned</h2>
                    <p className="text-2xl font-bold text-green-500">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border-violet-200 border-2">
                    <h2 className="text-xl font-semibold">Blogs</h2>
                    <p className="text-2xl font-bold text-red-500">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md border-violet-200 border-2">
                    <h2 className="text-xl font-semibold">Threads</h2>
                    <p className="text-2xl font-bold text-red-500">0</p>
                </div>
            </div>

            {/* Quick Settings */}
            <div className="bg-white p-6 rounded-lg shadow-md border-violet-200 border-2">
                <h2 className="text-2xl font-semibold mb-4">Quick Settings</h2>
                <ul className="space-y-3">
                    <li className="border-b pb-2">
                        <Link href={"/courses"} className="text-blue-500 hover:underline">
                            Manage Courses
                        </Link>
                    </li>
                    <li className="border-b pb-2">
                        <Link href={"/"} className="text-blue-500 hover:underline">
                            Subscription Plans
                        </Link>
                    </li>
                    <li>
                        <Link href={"/settings"} className="text-blue-500 hover:underline">
                            Account Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Settings;
