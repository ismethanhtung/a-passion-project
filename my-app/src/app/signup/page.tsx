import React from "react";
import LinkItem from "@/components/LinkItem";

function SignUp() {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center">
                    <h1 className="my-5 text-4xl font-extrabold tracking-tight">
                        The best offer <br />
                        <span className="text-blue-500">for your business</span>
                    </h1>

                    <p className="px-3 text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eveniet, itaque accusantium odio, soluta, corrupti
                        aliquam quibusdam tempora at cupiditate quis eum maiores
                        libero veritatis? Dicta facilis sint aliquid ipsum
                        atque?
                    </p>
                </div>

                <div className="md:w-1/2">
                    <div className="my-5 bg-white p-6 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="first-name"
                                    className="block text-gray-700 mb-2"
                                >
                                    First name
                                </label>
                                <input
                                    id="first-name"
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="last-name"
                                    className="block text-gray-700 mb-2"
                                >
                                    Last name
                                </label>
                                <input
                                    id="last-name"
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="subscribe"
                                className="mr-2"
                            />
                            <label
                                htmlFor="subscribe"
                                className="text-gray-600"
                            >
                                Subscribe to our newsletter
                            </label>
                        </div>

                        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mb-4">
                            Sign up
                        </button>

                        <div className="text-center">
                            <p>or sign up with:</p>

                            <div className="flex justify-center space-x-4 mt-3">
                                <button className="bg-blue-600 text-white p-3 rounded-full">
                                    <i className="fab fa-facebook-f"></i>
                                </button>

                                <button className="bg-blue-400 text-white p-3 rounded-full">
                                    <i className="fab fa-twitter"></i>
                                </button>

                                <button className="bg-red-500 text-white p-3 rounded-full">
                                    <i className="fab fa-google"></i>
                                </button>

                                <button className="bg-gray-800 text-white p-3 rounded-full">
                                    <i className="fab fa-github"></i>
                                </button>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    {/* <a href="/login" className="text-blue-500">
                                        Log in
                                    </a> */}
                                    <LinkItem text="login"></LinkItem>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
