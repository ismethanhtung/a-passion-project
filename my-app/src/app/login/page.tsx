"use client";
import React, { useState } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Đăng nhập thất bại.");
                return;
            }

            const data = await response.json();
            // console.log(response);
            console.log("Đăng nhập thành công:", data);

            alert("Đăng nhập thành công!");
            router.push("/");
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center">
                    <h1 className="my-5 text-4xl font-extrabold tracking-tight">
                        Welcome back! <br />
                        <span className="text-blue-500">
                            Login to your account
                        </span>
                    </h1>
                    <p className="px-3 text-gray-600">
                        Login to access your business account and manage your
                        profile.
                    </p>
                </div>

                <div className="md:w-1/2">
                    <div className="my-5 bg-white p-6 rounded-lg shadow-lg">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}
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
                            onClick={handleLogin}
                            className="w-full bg-blue-500 text-white p-3 rounded-lg mb-4"
                        >
                            Log in
                        </button>

                        <div className="text-center">
                            <p>or log in with:</p>
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
                                <p className="text-gray-600 flex">
                                    Don't have an account?{" "}
                                    <LinkItem text="signup" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
