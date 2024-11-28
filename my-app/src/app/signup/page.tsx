"use client";
import React, { useState, useEffect } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";
function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSignUp = async () => {
        setError(""); // Reset lỗi trước khi bắt đầu
        try {
            const response = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Sign up thất bại.");
                return;
            }

            const data = await response.json();
            console.log("Đăng ký thành công:", data);

            // Redirect hoặc cập nhật giao diện sau đăng ký thành công
            alert("Đăng ký thành công!");
            router.push("/login");
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center">
                    <h1 className="my-5 text-4xl font-extrabold tracking-tight">
                        The best offer <br />
                        <span className="text-blue-500">for your business</span>
                    </h1>

                    <p className="px-3 text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eveniet, itaque accusantium odio, soluta, corrupti
                        aliquam quibusdam tempora at cupiditate quis eum maiores
                        libero veritatis? Dicta facilis sint aliquid ipsum
                        atque?
                    </p>
                </div>

                <div className="md:w-1/2">
                    <div className="my-5 bg-white p-6 rounded-lg shadow-lg">
                        {error && (
                            <div className="mb-4 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />
                        </div>

                        <button
                            onClick={handleSignUp}
                            className="w-full bg-blue-500 text-white p-3 rounded-lg mb-4"
                        >
                            Sign up
                        </button>

                        <div className="text-center">
                            <p>or sign up with:</p>

                            <div className="flex justify-center space-x-4 mt-3">
                                <button className="bg-blue-600 text-white p-3 rounded-full">
                                    <i className="fab fa-facebook-f"></i>
                                </button>

                                <button className="bg-blue-400 text-white p-3 rounded-full">
                                    <i className="fab fa-twitter"></i>
                                </button>

                                <button className="bg-red-500 text-white p-3 rounded-full">
                                    <i className="fab fa-google"></i>
                                </button>

                                <button className="bg-gray-800 text-white p-3 rounded-full">
                                    <i className="fab fa-github"></i>
                                </button>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <LinkItem text="login"></LinkItem>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
