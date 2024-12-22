import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
};

// Tạo các named export cho GET và POST
const handler = NextAuth(authOptions);

// Export các phương thức HTTP
export const GET = handler;
export const POST = handler;
