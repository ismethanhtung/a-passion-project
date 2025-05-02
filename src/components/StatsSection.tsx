import React from "react";
import {
    Users,
    Globe,
    BookOpen,
    Award,
    Sparkles,
    BarChart3,
} from "lucide-react";

const StatsSection: React.FC = () => {
    const stats = [
        {
            icon: <Users className="h-8 w-8 text-[#6E59A5]" />,
            value: "10M+",
            label: "Active Students",
            description: "Learners from around the world",
            bgColor: "bg-[#6E59A5]/5",
            accentColor: "text-[#6E59A5]",
            animDelay: 0,
        },
        {
            icon: <Globe className="h-8 w-8 text-[#33C3F0]" />,
            value: "50+",
            label: "Languages",
            description: "From popular to rare languages",
            bgColor: "bg-[#33C3F0]/5",
            accentColor: "text-[#33C3F0]",
            animDelay: 0.1,
        },
        {
            icon: <BookOpen className="h-8 w-8 text-[#FF9666]" />,
            value: "5,000+",
            label: "Courses",
            description: "For all levels and needs",
            bgColor: "bg-[#FF9666]/5",
            accentColor: "text-[#FF9666]",
            animDelay: 0.2,
        },
        {
            icon: <Award className="h-8 w-8 text-[#4ADE80]" />,
            value: "95%",
            label: "Success Rate",
            description: "Students achieving their goals",
            bgColor: "bg-[#4ADE80]/5",
            accentColor: "text-[#4ADE80]",
            animDelay: 0.3,
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute h-80 w-80 rounded-full bg-[#6E59A5]/10 -top-20 -left-20 blur-3xl"></div>
                <div className="absolute h-60 w-60 rounded-full bg-[#33C3F0]/10 top-40 right-10 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center bg-[#6E59A5]/5 rounded-full px-4 py-2 mb-4">
                        <Sparkles className="h-4 w-4 text-[#6E59A5] mr-2" />
                        <span className="text-sm font-medium text-[#6E59A5]">
                            See our growth
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Trusted by Millions of Language Learners
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our platform has helped learners from across the globe
                        master new languages and achieve their communication
                        goals
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 ${stat.bgColor}`}
                            style={{ animationDelay: `${stat.animDelay}s` }}
                        >
                            <div
                                className={`mb-6 p-4 rounded-full ${stat.bgColor}`}
                            >
                                {stat.icon}
                            </div>
                            <div
                                className={`text-4xl lg:text-5xl font-bold mb-1 ${stat.accentColor}`}
                            >
                                {stat.value}
                            </div>
                            <p className="font-medium text-lg mb-3">
                                {stat.label}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-gradient-to-r from-[#6E59A5] to-[#33C3F0] rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid md:grid-cols-3 gap-6 p-8">
                        <div className="col-span-2 text-white p-4">
                            <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-sm">
                                Track your progress with analytics
                            </h3>
                            <p className="mb-6 text-white font-medium">
                                Our platform provides detailed insights into
                                your learning journey, helping you stay
                                motivated and on track.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1 shadow-md hover:bg-white/30 transition-colors">
                                    <div className="text-2xl font-bold text-white drop-shadow-sm">
                                        85%
                                    </div>
                                    <p className="text-sm text-white">
                                        Average completion rate
                                    </p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1 shadow-md hover:bg-white/30 transition-colors">
                                    <div className="text-2xl font-bold text-white drop-shadow-sm">
                                        27 min
                                    </div>
                                    <p className="text-sm text-white">
                                        Average daily learning
                                    </p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1 shadow-md hover:bg-white/30 transition-colors">
                                    <div className="text-2xl font-bold text-white drop-shadow-sm">
                                        92%
                                    </div>
                                    <p className="text-sm text-white">
                                        Student satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center">
                            <BarChart3 className="h-32 w-32 text-white drop-shadow-md" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
