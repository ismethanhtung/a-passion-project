import React from "react";

// Add a more focused test-taking layout
export const metadata = {
    title: "Làm bài test | Code Alone",
    description:
        "Làm bài kiểm tra trực tuyến, giao diện tập trung, ẩn thanh điều hướng và footer.",
};

export default function TestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Hide navbar/footer by not rendering them here
    return (
        <html lang="en">
            <body
                style={{
                    fontFamily: "Poppins, sans-serif",
                    background: "#f8fafc",
                }}
            >
                <div className="min-h-screen flex flex-col">
                    {/* Optionally add a minimal header for test info or timer here */}
                    {children}
                </div>
            </body>
        </html>
    );
}
