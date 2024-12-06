"use client";
import React, { useState, useEffect } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const router = useRouter();

    const handleSignUp = async () => {
        setError("");
        const name = `${firstName} ${lastName}`;
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

            alert("Đăng ký thành công!");
            router.push("/login");
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mx-auto content-center w-4/12">
                <div className="my-28 mx-8 p-8 bg-white p-6 rounded-3xl shadow-lg border-gray-100 border">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="text-center flex flex-col justify-center w-full mb-10">
                            <h1 className="my-6 text-2xl font-extrabold tracking-tight">
                                Welcome! Let's get started <br />
                                <span className="text-red-300">
                                    Create your account
                                </span>
                            </h1>
                        </div>
                    </div>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2.5 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    {/* Name input */}
                    <div className="flex justify-between mb-5">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border text-sm rounded-lg block w-1/2 p-2.5"
                            placeholder="first name"
                            required
                        />
                        <input
                            id="lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border text-sm rounded-lg block w-1/2 ml-2 p-2.5"
                            placeholder="last name"
                            required
                        />
                    </div>
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
                            placeholder="password"
                            className="border text-sm rounded-lg block w-full p-2.5 "
                        />
                    </div>

                    <button
                        onClick={handleSignUp}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                    >
                        Sign in
                    </button>
                    {/* Social login options */}
                    <div className="text-center">
                        <p className="text-gray-600 py-8">or continue with:</p>
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
                            Already have an account?
                        </p>
                        <LinkItem
                            text="Sign In"
                            href="/login"
                            className="hover:underline"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
