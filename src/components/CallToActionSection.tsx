import React from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

const CallToActionSection: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6E59A5] to-[#33C3F0] opacity-95"></div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <svg
                        className="absolute top-0 right-0 w-[40%] h-auto text-white opacity-15"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="currentColor"
                            d="M48.8,-64.5C63.8,-55.4,77.2,-42.3,81.6,-26.6C86,-10.9,81.5,7.4,74.4,23.4C67.3,39.5,57.6,53.3,44.1,62.3C30.7,71.3,13.6,75.5,-3.1,79.3C-19.8,83.1,-36.2,86.5,-47.5,78.9C-58.9,71.4,-65.2,52.7,-70.4,35.5C-75.6,18.3,-79.7,2.5,-76.7,-11.3C-73.7,-25.1,-63.7,-37,-51.4,-46.4C-39.1,-55.7,-24.6,-62.6,-8.4,-71.9C7.8,-81.2,33.9,-73.7,48.8,-64.5Z"
                            transform="translate(100 100)"
                        />
                    </svg>
                    <svg
                        className="absolute bottom-0 left-0 w-[40%] h-auto text-white opacity-15"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="currentColor"
                            d="M24.9,-40.8C34.6,-32.2,46.3,-28.5,52.3,-20.5C58.3,-12.5,58.6,-0.3,55.8,10.6C53,21.5,47.1,31.1,38.8,39.2C30.5,47.4,19.7,54.2,8.5,56.5C-2.7,58.8,-14.4,56.7,-27.3,52.9C-40.2,49.1,-54.3,43.7,-60.9,33.1C-67.5,22.5,-66.5,6.8,-62.8,-7.4C-59.1,-21.6,-52.6,-34.4,-42.6,-43.5C-32.5,-52.6,-18.8,-58,-7.4,-57.5C3.9,-57.1,15.2,-49.4,24.9,-40.8Z"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-sm">
                        Ready to Start Your Language Learning Journey?
                    </h2>
                    <p className="text-lg md:text-xl text-white font-medium mb-10 max-w-2xl mx-auto drop-shadow-sm">
                        Join over 10 students who have transformed their lives
                        through language learning. Start for free and discover
                        your potential today.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <Button
                            href="/courses"
                            className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-2 rounded-lg font-medium transition-colors shadow-lg"
                        >
                            Start Learning for Free
                        </Button>
                        <Button
                            href="/courses"
                            className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-2 rounded-lg font-medium transition-colors shadow-lg"
                        >
                            Explore All Courses{" "}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:bg-white/30 transition-colors">
                            <div className="text-4xl font-bold mb-2 text-white drop-shadow-sm">
                                50+
                            </div>
                            <p className="text-white font-medium">
                                Languages to Choose From
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:bg-white/30 transition-colors">
                            <div className="text-4xl font-bold mb-2 text-white drop-shadow-sm">
                                30+
                            </div>
                            <p className="text-white font-medium">
                                Days Free Trial
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:bg-white/30 transition-colors">
                            <div className="text-4xl font-bold mb-2 text-white drop-shadow-sm">
                                24/7
                            </div>
                            <p className="text-white font-medium">
                                Learning Support
                            </p>
                        </div>
                    </div>

                    <p className="mt-12 text-sm text-white font-medium drop-shadow-sm">
                        No credit card required. Cancel anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;
