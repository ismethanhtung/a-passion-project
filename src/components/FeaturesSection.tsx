import React from "react";
import {
    BookOpen,
    TestTube,
    FileText,
    Calendar,
    FlaskConical,
    MessageSquare,
    BookText,
    Sparkles,
    ChevronRight,
    Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { cn } from '@/lib/utils';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    index: number;
    link: string;
}

const GRADIENT_COLORS = [
    "from-[#6E59A5] to-[#33C3F0]",
    "from-[#33C3F0] to-[#4ADE80]",
    "from-[#FF9666] to-[#FCC531]",
    "from-[#6E59A5] to-[#FF9666]",
];

const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    iconBg,
    index,
    link,
}) => {
    const gradientIndex = index % GRADIENT_COLORS.length;
    const gradient = GRADIENT_COLORS[gradientIndex];

    return (
        <div className="feature-card rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div
                className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
            >
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <Link
                href={link}
                className="inline-flex items-center text-sm font-medium text-[#6E59A5] hover:text-[#33C3F0] transition-colors"
            >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
        </div>
    );
};

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: "Interactive Courses",
            description:
                "Engage with interactive lessons designed by language experts to build speaking, listening, reading, and writing skills.",
            icon: <BookOpen className="h-6 w-6 text-white" />,
            iconBg: "bg-[#6E59A5]",
            link: "/courses",
        },
        {
            title: "Online Tests",
            description:
                "Assess your language proficiency with standardized tests and get detailed feedback on your progress.",
            icon: <TestTube className="h-6 w-6 text-white" />,
            iconBg: "bg-[#33C3F0]",
            link: "/online-tests",
        },
        {
            title: "Learning Blog",
            description:
                "Discover tips, techniques, and insights from polyglots and language educators to enhance your learning.",
            icon: <FileText className="h-6 w-6 text-white" />,
            iconBg: "bg-[#FF9666]",
            link: "/blogs",
        },
        {
            title: "Learning Paths",
            description:
                "Follow structured learning paths tailored to your goals, whether for travel, business, or academic purposes.",
            icon: <Calendar className="h-6 w-6 text-white" />,
            iconBg: "bg-[#4ADE80]",
            link: "/learning-paths",
        },
        {
            title: "Flashcards",
            description:
                "Memorize vocabulary efficiently with spaced repetition flashcards that adapt to your learning pace.",
            icon: <FlaskConical className="h-6 w-6 text-white" />,
            iconBg: "bg-[#F43F5E]",
            link: "/flashcard",
        },
        {
            title: "Community Forum",
            description:
                "Connect with fellow learners, ask questions, and practice with native speakers in our supportive community.",
            icon: <MessageSquare className="h-6 w-6 text-white" />,
            iconBg: "bg-[#8B5CF6]",
            link: "/forum",
        },
        {
            title: "Pronunciation Coach",
            description:
                "Improve your accent with our AI-powered pronunciation coach that provides real-time feedback on your speech.",
            icon: <Mic className="h-6 w-6 text-white" />,
            iconBg: "bg-[#EC4899]",
            link: "/pronunciation",
        },
        {
            title: "Comprehensive Docs",
            description:
                "Access detailed grammar guides, cultural notes, and language resources to deepen your understanding.",
            icon: <FileText className="h-6 w-6 text-white" />,
            iconBg: "bg-[#FCC531]",
            link: "/docs",
        },
    ];

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#33C3F0]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-12 -left-24 w-80 h-80 bg-[#6E59A5]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-16 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center bg-[#6E59A5]/5 rounded-full px-4 py-2 mb-4">
                        <Sparkles className="h-4 w-4 text-[#6E59A5] mr-2" />
                        <span className="text-sm font-medium text-[#6E59A5]">
                            What we offer
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-gray-700">
                        Everything You Need to Master a New Language
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our comprehensive platform offers multiple learning
                        approaches to ensure you develop all aspects of language
                        proficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            iconBg={feature.iconBg}
                            index={index}
                            link={feature.link}
                        />
                    ))}
                </div>

                {/* Highlighted feature section */}
                <div className="mt-24 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="p-8 md:p-12">
                            <div className="inline-flex items-center bg-[#6E59A5]/5 rounded-full px-4 py-2 mb-6">
                                <Sparkles className="h-4 w-4 text-[#6E59A5] mr-2" />
                                <span className="text-sm font-medium text-[#6E59A5]">
                                    Featured
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                AI-Powered Language Assistant
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Practice with our AI language assistant anytime,
                                anywhere. Get instant feedback on pronunciation,
                                grammar, and vocabulary usage to accelerate your
                                learning journey.
                            </p>
                            <div className="space-y-4 mb-8">
                                {[
                                    "Realistic conversations in 50+ languages",
                                    "Personalized feedback on your speech",
                                    "Available 24/7 for practice sessions",
                                    "Adapts to your proficiency level",
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-50 flex items-center justify-center mt-1 mr-3">
                                            <svg
                                                width="10"
                                                height="8"
                                                viewBox="0 0 10 8"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9 1L3.5 6.5L1 4"
                                                    stroke="#4ADE80"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <p>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <Button className="bg-gradient-to-r from-[#6E59A5] to-[#33C3F0] text-white px-6 py-3 rounded-lg hover:opacity-90">
                                Try it free
                            </Button>
                        </div>
                        <div className="bg-gradient-to-br from-[#010104] to-[#0c132c] h-full   md:p-0 hidden md:flex items-center justify-center">
                            <img
                                src="/images/ai-image.svg"
                                alt="AI Language Assistant"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://placehold.co/400x500/6E59A5/ffffff?text=AI+Language+Assistant";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
