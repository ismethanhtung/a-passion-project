"use client";

import React, { useEffect, useState } from "react";
import {
    Search,
    Calendar,
    Clock,
    Tag,
    ChevronRight,
    TrendingUp,
    Clock3,
    Filter,
    BookOpen,
    ExternalLink,
    Share2,
    Bookmark,
    ThumbsUp,
    MessageSquare,
    ArrowUpRight,
    ChevronDown,
    User,
} from "lucide-react";
import Pagination from "@/components/Pagination";

interface Blog {
    id?: string;
    title: string;
    description: string;
    urlToImage: string;
    url: string;
    publishedAt: string;
    category?: string;
    author?: string;
    readingTime?: string;
    tags?: string[];
    isFeatured?: boolean;
    likes?: number;
    comments?: number;
}

// Dữ liệu mẫu với thông tin bổ sung
const dummyBlogs: Blog[] = [
    {
        id: "1",
        title: "Mastering English Pronunciation: A Step-by-Step Guide",
        description:
            "Improve your pronunciation with these practical tips and exercises designed for learners at all levels.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x460/c439b1d591/why-study-english-in-england.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/mastering-pronunciation/",
        publishedAt: "2024-05-07",
        category: "Pronunciation",
        author: "Sarah Johnson",
        readingTime: "8 min",
        tags: ["pronunciation", "speaking", "tips"],
        isFeatured: true,
        likes: 258,
        comments: 42,
    },
    {
        id: "2",
        title: "English Slang Words You Need to Know",
        description:
            "Learn the most common slang expressions used in daily conversations to sound more natural when speaking English.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x400/e85218baea/10-books-to-learn-english-with_square-568x400.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/slang-words/",
        publishedAt: "2024-05-14",
        category: "Vocabulary",
        author: "David Miller",
        readingTime: "6 min",
        tags: ["slang", "vocabulary", "casual"],
        isFeatured: false,
        likes: 176,
        comments: 28,
    },
    {
        id: "3",
        title: "10 Best Podcasts for Learning English",
        description:
            "Discover engaging podcasts that help you learn English on the go, perfect for busy learners who want to improve listening skills.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/bc72d8a8aa/10-most-difficult-words-in-english_568x464.png/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/best-podcasts-for-learning/",
        publishedAt: "2024-05-17",
        category: "Listening",
        author: "Emma Thompson",
        readingTime: "10 min",
        tags: ["podcasts", "listening", "resources"],
        isFeatured: true,
        likes: 342,
        comments: 56,
    },
    {
        id: "4",
        title: "How to Think in English and Speak Fluently",
        description:
            "Change your mindset and start thinking in English naturally with these proven cognitive techniques and daily exercises.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/think-in-english/",
        publishedAt: "2024-05-09",
        category: "Speaking",
        author: "Michael Chen",
        readingTime: "7 min",
        tags: ["fluency", "speaking", "mindset"],
        isFeatured: false,
        likes: 215,
        comments: 38,
    },
    {
        id: "5",
        title: "Common English Phrasal Verbs and Their Meanings",
        description:
            "Understand and use essential phrasal verbs like a native speaker with this comprehensive guide and practice exercises.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/phrasal-verbs-explained/",
        publishedAt: "2024-05-06",
        category: "Grammar",
        author: "Jennifer Adams",
        readingTime: "9 min",
        tags: ["phrasal verbs", "grammar", "vocabulary"],
        isFeatured: false,
        likes: 193,
        comments: 31,
    },
    {
        id: "6",
        title: "How to Improve Your English Writing Skills",
        description:
            "Practical tips and exercises to enhance your writing ability for academic, professional, and everyday communication contexts.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x460/c439b1d591/why-study-english-in-england.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/writing-skills/",
        publishedAt: "2024-05-08",
        category: "Writing",
        author: "Robert Wilson",
        readingTime: "12 min",
        tags: ["writing", "academic", "skills"],
        isFeatured: false,
        likes: 168,
        comments: 24,
    },
    {
        id: "7",
        title: "Fun Ways to Practice English Every Day",
        description:
            "Make learning English enjoyable with these engaging activities that you can easily incorporate into your daily routine.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x400/e85218baea/10-books-to-learn-english-with_square-568x400.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/fun-ways-to-learn/",
        publishedAt: "2024-05-11",
        category: "Learning Tips",
        author: "Lisa Garcia",
        readingTime: "5 min",
        tags: ["practice", "fun", "daily"],
        isFeatured: false,
        likes: 289,
        comments: 47,
    },
    {
        id: "8",
        title: "English Pronunciation Mistakes to Avoid",
        description:
            "Learn how to pronounce difficult English words correctly and avoid common pronunciation errors made by non-native speakers.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/bc72d8a8aa/10-most-difficult-words-in-english_568x464.png/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/pronunciation-mistakes/",
        publishedAt: "2024-05-13",
        category: "Pronunciation",
        author: "Thomas Brown",
        readingTime: "8 min",
        tags: ["pronunciation", "mistakes", "practice"],
        isFeatured: false,
        likes: 204,
        comments: 36,
    },
    {
        id: "9",
        title: "How to Understand Native English Speakers",
        description:
            "Train your ears to follow fast English conversations with ease using these specialized listening techniques and resources.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/listening-skills/",
        publishedAt: "2024-05-16",
        category: "Listening",
        author: "James Taylor",
        readingTime: "7 min",
        tags: ["listening", "native speakers", "comprehension"],
        isFeatured: false,
        likes: 231,
        comments: 41,
    },
    {
        id: "10",
        title: "Essential English Phrases for Travelers",
        description:
            "Useful English phrases for ordering food, asking for directions, and navigating common travel situations with confidence.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/travel-phrases/",
        publishedAt: "2024-05-18",
        category: "Travel",
        author: "Emily Wilson",
        readingTime: "6 min",
        tags: ["travel", "phrases", "practical"],
        isFeatured: true,
        likes: 275,
        comments: 39,
    },
    {
        id: "11",
        title: "The Science of Language Learning: How Your Brain Processes New Words",
        description:
            "Explore the fascinating neuroscience behind language acquisition and how understanding these processes can help you learn more effectively.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/science-of-language-learning/",
        publishedAt: "2024-05-03",
        category: "Learning Science",
        author: "Dr. Rebecca Carter",
        readingTime: "15 min",
        tags: ["neuroscience", "learning", "research"],
        isFeatured: false,
        likes: 312,
        comments: 52,
    },
    {
        id: "12",
        title: "7 Effective Strategies for IELTS Reading Success",
        description:
            "Master the IELTS reading section with these time-tested strategies that improve comprehension, speed, and accuracy.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x400/e85218baea/10-books-to-learn-english-with_square-568x400.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/ielts-reading-strategies/",
        publishedAt: "2024-05-01",
        category: "Exam Preparation",
        author: "Alex Zhang",
        readingTime: "11 min",
        tags: ["IELTS", "reading", "exam tips"],
        isFeatured: false,
        likes: 248,
        comments: 45,
    },
];

// All unique categories and tags for filtering
const allCategories = Array.from(
    new Set(dummyBlogs.map((blog) => blog.category || ""))
);
const allTags = Array.from(
    new Set(dummyBlogs.flatMap((blog) => blog.tags || []))
);

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>(dummyBlogs);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(dummyBlogs);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "popular">("date");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const itemsPerPage = 6;

    useEffect(() => {
        // Filter blogs based on search term, category, and tag
        let filtered = blogs;

        if (searchTerm) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    blog.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(
                (blog) => blog.category === selectedCategory
            );
        }

        if (selectedTag) {
            filtered = filtered.filter((blog) =>
                blog.tags?.includes(selectedTag)
            );
        }

        // Sort blogs
        if (sortBy === "popular") {
            filtered = [...filtered].sort(
                (a, b) => (b.likes || 0) - (a.likes || 0)
            );
        } else {
            filtered = [...filtered].sort(
                (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
            );
        }

        setFilteredBlogs(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [blogs, searchTerm, selectedCategory, selectedTag, sortBy]);

    // Get featured blogs
    const featuredBlogs = blogs.filter((blog) => blog.isFeatured);

    // Calculate pagination
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const currentBlogs = filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedTag(null);
        setSortBy("date");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Blog & Resources
                        </h1>
                        <p className="text-lg text-indigo-200 mb-8">
                            Discover insights, tips, and strategies to enhance
                            your language learning journey
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-indigo-300" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles by keywords, topics, or titles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 bg-indigo-800/30 border border-indigo-700 rounded-lg placeholder-indigo-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Featured Articles Section (if there are featured blogs) */}
                {featuredBlogs.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                            Featured Articles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBlogs.slice(0, 3).map((blog) => (
                                <a
                                    key={blog.id}
                                    href={blog.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="relative">
                                        <img
                                            src={blog.urlToImage}
                                            alt={blog.title}
                                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                        />
                                        {blog.category && (
                                            <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                                {blog.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {blog.description}
                                        </p>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1.5" />
                                                <span>
                                                    {formatDate(
                                                        blog.publishedAt
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-blue-600 font-medium">
                                                <span>Read More</span>
                                                <ArrowUpRight className="h-4 w-4 ml-1.5" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters and Sorting */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            All Articles
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value as "date" | "popular"
                                    )
                                }
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date">Latest</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Expanded filter options */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() =>
                                                setSelectedCategory(null)
                                            }
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                selectedCategory === null
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-200"
                                            } transition-colors`}
                                        >
                                            All
                                        </button>
                                        {allCategories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category
                                                    )
                                                }
                                                className={`px-3 py-1 text-sm rounded-full ${
                                                    selectedCategory ===
                                                    category
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                                } transition-colors`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedTag(null)}
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                selectedTag === null
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-200"
                                            } transition-colors`}
                                        >
                                            All
                                        </button>
                                        {allTags.slice(0, 5).map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    setSelectedTag(tag)
                                                }
                                                className={`px-3 py-1 text-sm rounded-full ${
                                                    selectedTag === tag
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                                } transition-colors`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-sm text-gray-700 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {currentBlogs.map((blog) => (
                        <a
                            key={blog.id}
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-full"
                        >
                            <div className="relative">
                                <img
                                    src={blog.urlToImage}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                />
                                {blog.category && (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                        {blog.category}
                                    </span>
                                )}
                            </div>
                            <div className="p-6 flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                                    {blog.description}
                                </p>

                                {/* Author and reading time */}
                                <div className="flex items-center text-xs text-gray-500 mb-4">
                                    {blog.author && (
                                        <div className="flex items-center mr-4">
                                            <User className="h-3.5 w-3.5 mr-1" />
                                            <span>{blog.author}</span>
                                        </div>
                                    )}
                                    {blog.readingTime && (
                                        <div className="flex items-center">
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            <span>{blog.readingTime} read</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    {formatDate(blog.publishedAt)}
                                </div>
                                <div className="flex items-center space-x-3 text-gray-400">
                                    <div className="flex items-center">
                                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                        <span className="text-xs">
                                            {blog.likes}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                        <span className="text-xs">
                                            {blog.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {/* Empty state when no blogs match filters */}
                {currentBlogs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No articles found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            We couldn't find any articles matching your current
                            filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
