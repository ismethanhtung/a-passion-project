"use client";
import React, { useState } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";
import { handleSignUpApi } from "@/api/auth/signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const name = `${firstName} ${lastName}`.trim();
        if (!firstName || !lastName || !email || !password) {
            setError("Tất cả các trường là bắt buộc.");
            return;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setError("Email không hợp lệ.");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        try {
            const response = await handleSignUpApi(name, email, password);
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Sign up thất bại.");
                return;
            }
            alert("Đăng ký thành công! Vui lòng xác nhận Email");
            router.push("/auth/login");
        } catch (err) {
            console.error("Lỗi khi đăng ký:", err);
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    if (!GOOGLE_CLIENT_ID)
        throw new Error("Google Client ID is not defined in environment variables.");

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <form className="container mx-auto" onSubmit={handleSignUp}>
                <div className="mx-auto content-center w-4/12">
                    <div className="my-28 mx-8 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="text-center flex flex-col justify-center w-full mb-10">
                                <h1 className="my-6 text-2xl font-extrabold tracking-tight">
                                    Welcome! Let's get started <br />
                                    <span className="text-red-300">Create your account</span>
                                </h1>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-2.5 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-between mb-5">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border text-sm rounded-lg block w-1/2 p-2.5"
                                placeholder="First name"
                                required
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border text-sm rounded-lg block w-1/2 ml-2 p-2.5"
                                placeholder="Last name"
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <input
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="border text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                        >
                            Sign up
                        </button>
                        <div className="text-center">
                            <p className="text-gray-600 py-4">or continue with:</p>
                            <div className="flex justify-center">
                                <GoogleLoginButton onError={setError} />
                            </div>
                            <div className="flex justify-between space-x-4 mt-4">
                                <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/2 rounded-lg">
                                    <img src="/logos/facebook.png" className="size-5" alt="" />
                                </button>
                                <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/2 rounded-lg">
                                    <img src="/logos/apple.png" className="size-5" alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex content-center justify-center">
                            <p className="text-gray-600 flex text-sm mr-2">
                                Already have an account?
                            </p>
                            <LinkItem
                                text="Sign In"
                                href="/auth/login"
                                className="hover:underline"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </GoogleOAuthProvider>
    );
}

export default SignUp;
