"use client";
import React from "react";

const Sticker = () => {
    return (
        <div className="fixed right-64 top-1/4 p-5 bg-gradient-to-r from-yellow-200 to-red-200 text-gray-700 font-semibold text-center rounded-3xl shadow-xl w-64 transition-transform hover:scale-105">
            <p className="text-lg leading-tight">Sign in to take tests,</p>
            <p className="text-lg leading-tight">use the chatbot & get a personalized roadmap.</p>
            <div className="mt-3 border-t border-white/50 pt-3 text-sm">
                <p>Or log in as admin:</p>
                <p className="font-bold">admin@alo.com</p>
                <p className="font-bold">Password: admin</p>
            </div>
        </div>
    );
};

export default Sticker;
