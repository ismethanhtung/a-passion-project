import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProvider from "@/store/ClientProvider";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "Code Alone",
    description: "Learning Code",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{ fontFamily: "Poppins, sans-serif" }}>
                <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
                <script src="https://files.bpcontent.cloud/2024/12/26/00/20241226003941-O4WQ8153.js"></script>
                <ClientProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </ClientProvider>
            </body>
        </html>
    );
}
