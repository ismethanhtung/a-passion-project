"use client";
import React, { useState } from "react";
import LinkItem from "@/components/LinkItem";
import { useRouter } from "next/navigation";
import { login } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { handleLoginApi } from "@/api/auth/login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const backendUrl = API_BASE_URL || "http://localhost:5000";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const responseFacebook = async (response: any) => {
        console.log(response);
        const res = await fetch(`${backendUrl}/facebook-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: response,
            }),
        });

        const data = await res.json();
        console.log("Đăng nhập Facebook thành công:", data);

        dispatch(
            login({
                user: data.response.user,
                accessToken: data.response.accessToken,
                refreshToken: data.response.refreshToken,
            })
        );

        router.push("/");
    };

    const handleLogin = async () => {
        try {
            const response = await handleLoginApi(email, password);
            const data = await response.json();
            console.log("Đăng nhập thành công:", data);

            dispatch(
                login({
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                })
            );

            router.push("/");
        } catch (err) {
            console.error("Lỗi khi đăng nhập:", err);
            setError("Lỗi khi đăng nhập.");
        }
    };

    if (!GOOGLE_CLIENT_ID) {
        throw new Error("Google Client ID is not defined in environment variables.");
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="container mx-auto">
                <div className="mx-auto content-center w-4/12">
                    <div className="my-28 mx-8 p-8 bg-white p-6 rounded-3xl shadow-lg border-gray-100 border">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="text-center flex flex-col justify-center w-full mb-10">
                                <h1 className="my-6 text-2xl font-extrabold tracking-tight">
                                    Welcome back! <br />
                                    <span className="text-red-300">Login to your account</span>
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
                                className="border text-sm rounded-lg block w-full p-2.5"
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
                                    className="ms-2 text-sm font-medium text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>
                            <LinkItem
                                href="/auth/forgot-password"
                                text="Forgot password?"
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
                            <p className="text-gray-600 py-6">or log in with:</p>
                            <div className="flex justify-center">
                                <GoogleLoginButton onError={setError} />
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-between space-x-4 mt-4">
                                <FacebookLogin
                                    appId="1379549779684690"
                                    // autoLoad
                                    callback={responseFacebook}
                                    render={(renderProps: any) => (
                                        <button
                                            onClick={renderProps.onClick}
                                            className="flex justify-center items-center border border-gray-200 py-2.5 w-1/2 rounded-lg"
                                        >
                                            <img
                                                src="/logos/facebook.png"
                                                className="size-5"
                                                alt=""
                                            />
                                        </button>
                                    )}
                                />

                                <button className="flex justify-center items-center border border-gray-200 py-2.5 w-1/2 rounded-lg">
                                    <img src="/logos/apple.png" className="size-5" alt="" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex content-center justify-center">
                            <p className="text-gray-600 flex text-sm mr-2">
                                Don't have an account?
                            </p>
                            <LinkItem
                                text="Sign Up"
                                href="/auth/signup"
                                className="hover:underline"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;
