"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { login } from "@/store/userSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const backendUrl = API_BASE_URL || "http://localhost:5000";

interface GoogleLoginButtonProps {
    onError: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onError }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleGoogleLoginSuccess = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse;
            console.log(credential);

            // Gửi credential (JWT) đến backend để xác thực
            const response = await fetch(`${backendUrl}/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ credential }),
            });

            const data = await response.json();
            console.log("Đăng nhập Google thành công:", data);
            console.log(data.response.user);

            dispatch(
                login({
                    user: data.response.user,
                    accessToken: data.response.accessToken,
                    refreshToken: data.response.refreshToken,
                })
            );

            router.push("/");
        } catch (err) {
            console.error("Lỗi khi đăng nhập Google:", err);
            onError("Lỗi khi đăng nhập Google.");
        }
    };

    const handleGoogleLoginError = () => {
        console.error("Đăng nhập Google thất bại");
        onError("Đăng nhập Google thất bại.");
    };

    return (
        <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
        />
    );
};

export default GoogleLoginButton;
