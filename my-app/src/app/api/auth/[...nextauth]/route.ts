import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const backendUrl = API_BASE_URL || "http://localhost:5000";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const response = await fetch(`${backendUrl}/google-login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            googleId: profile?.sub,
                        }),
                    });

                    const data = await response.json();
                    console.log("Đăng nhập thành công:", data);
                    return data.response;
                } catch (error) {
                    console.log(error);
                }
            }
            return true;
        },
    },
});

export { handler as GET, handler as POST };
