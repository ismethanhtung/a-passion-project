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

    return (
        <div className="container mx-auto">
            <div className="mx-auto content-center w-4/12">
                <div className="my-28 mx-8 p-8 bg-white p-6 rounded-3xl shadow-lg border-gray-100 border">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="text-center flex flex-col justify-center w-full mb-10">
                            <h1 className="my-6 text-2xl font-extrabold tracking-tight text-red-300">
                                Reset Password! <br />
                                <span className="text-sm text-gray-500">
                                    Enter your email to reset your password.
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

                    <button className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                        Reset password
                    </button>

                    <div className="mt-4 flex flex-col ">
                        <p className="text-gray-600  text-sm mr-2 content-center justify-center text-center">
                            Don’t have access anymore?
                        </p>
                        <LinkItem
                            text="Try another method"
                            className="hover:underline content-center justify-center text-blue-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
