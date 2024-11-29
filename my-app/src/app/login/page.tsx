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
            </div>
            <div className="max-w-sm  p-4">
                <div className="my-5 bg-white p-6 rounded-lg shadow-lg">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Email input */}
                    <div className="mb-5">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border text-sm rounded-lg block w-full p-2.5"
                            placeholder="name@hello.com"
                            required
                        />
                    </div>

                    {/* Password input */}
                    <div className="mb-5">
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border text-sm rounded-lg block w-full p-2.5 "
                        />
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                            />
                        </div>
                        <label
                            htmlFor="remember"
                            className="ms-2 text-sm font-medium text-gray-900 "
                        >
                            Remember me
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleLogin}
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>

                    {/* Social login options */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">or log in with:</p>
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
    );
}

export default Login;
