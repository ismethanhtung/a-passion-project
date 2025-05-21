import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProvider from "@/store/ClientProvider";
import Footer from "@/components/footer";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
    title: "Code Alone",
    description: "Learning Code",
    icons: {
        icon: "/images/vietnam.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body style={{ fontFamily: "Poppins, sans-serif" }}>
                <ClientProvider>
                    <ToastProvider>
                        <Navbar />
                        {children}
                        <Footer />
                    </ToastProvider>
                </ClientProvider>
            </body>
        </html>
    );
}
