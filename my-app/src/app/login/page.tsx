"use client";
import React, { useState } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

function Login() {
    const { user, login } = useUser();
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
            console.log(response);
            console.log("Đăng nhập thành công:", data);
            login(data.user);
            console.log(user);

            router.push(`/`);
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setError("Lỗi khi đăng nhập.");
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mx-auto content-center w-4/12">
                <div className="my-28 mx-8 p-8 bg-white p-6 rounded-3xl shadow-lg border-gray-100 border">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="text-center flex flex-col justify-center w-full mb-10">
                            <h1 className="my-6 text-2xl font-extrabold tracking-tight">
                                Welcome back! <br />
                                <span className="text-red-300">
                                    Login to your account
                                </span>
                            </h1>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2.5 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

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

                    <div className="mb-5">
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="border text-sm rounded-lg block w-full p-2.5 "
                        />
                    </div>

                    <div className="flex justify-between w-full mb-5">
                        <div className="flex">
                            <div className="flex items-center h-5">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 border border-gray-300 rounded"
                                />
                            </div>
                            <label
                                htmlFor="remember"
                                className="ms-2 text-sm font-medium text-gray-900 "
                            >
                                Remember me
                            </label>
                        </div>
                        <LinkItem
                            text="Forgot password?"
                            href="/forgot-password"
                            className="hover:underline"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                    >
                        Sign in
                    </button>

                    <div className="text-center">
                        <p className="text-gray-600 py-8">or log in with:</p>
                        <div className="flex justify-between space-x-4">
                            <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/3 rounded-lg">
                                <img
                                    src="/logos/facebook.png"
                                    className="size-5"
                                    alt=""
                                />
                            </button>
                            <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/3 rounded-lg">
                                <img
                                    src="/logos/google.png"
                                    className="size-5"
                                    alt=""
                                />
                            </button>{" "}
                            <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/3 rounded-lg">
                                <img
                                    src="/logos/apple.png"
                                    className="size-5"
                                    alt=""
                                />
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex content-center justify-center">
                        <p className="text-gray-600 flex text-sm mr-2">
                            Don't have an account?
                        </p>
                        <LinkItem
                            text="Sign Up"
                            href="/signup"
                            className="hover:underline"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
