"use client";

import React from "react";

export default function Contact() {
    return (
        <div className="text-sm">
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <img src="/icons/pin.png" alt="Address Icon" className="w-5 h-5 mr-2" />
                    <h1 className="font-bold text-lg text-gray-700">Address</h1>
                </div>
                <p className="text-gray-500 pl-7">
                    250 Pham Van Dong St., <br />
                    Pleiku City, <br />
                    Gia Lai Province,
                    <br /> Viet Nam 🇻🇳
                </p>
            </div>

            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <img src="/icons/mail.png" alt="Email Icon" className="w-5 h-5 mr-2" />
                    <h1 className="font-bold text-lg text-gray-700">Email</h1>
                </div>
                <p className="text-gray-500 pl-7">ismethanhtung@gmail.com</p>
            </div>

            <div>
                <div className="flex items-center mb-2">
                    <img src="/icons/telephone.png" alt="Phone Icon" className="w-5 h-5 mr-2" />
                    <h1 className="font-bold text-lg text-gray-700">Phone</h1>
                </div>
                <p className="text-gray-500 pl-7">0926550470</p>
            </div>
        </div>
    );
}
