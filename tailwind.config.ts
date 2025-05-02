import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                float: "float 5s ease-in-out infinite",
                "float-delay": "float-delay 7s ease-in-out infinite",
                "bounce-subtle": "bounce-subtle 3s ease-in-out infinite",
                "fade-in": "fade-in 0.5s ease-out forwards",
                "fade-in-up": "fade-in-up 0.8s ease-out forwards",
                "fade-in-right": "fade-in-right 0.8s ease-out forwards",
                gradient: "gradient 5s ease infinite",
                "expand-line": "expand-line 1s ease-out forwards",
                "pulse-shadow": "pulse-shadow 2s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "float-delay": {
                    "0%, 100%": {
                        transform: "translateY(0px) translateX(0px)",
                    },
                    "50%": { transform: "translateY(-8px) translateX(5px)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-right": {
                    "0%": { opacity: "0", transform: "translateX(30px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                gradient: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                "expand-line": {
                    "0%": { transform: "scaleX(0)", transformOrigin: "left" },
                    "100%": { transform: "scaleX(1)", transformOrigin: "left" },
                },
                "pulse-shadow": {
                    "0%, 100%": { boxShadow: "0 0 0 rgba(139, 92, 246, 0)" },
                    "50%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
