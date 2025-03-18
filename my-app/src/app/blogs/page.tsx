"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

const dummyBlogs = [
    {
        title: "Mastering English Pronunciation: A Step-by-Step Guide",
        description: "Improve your pronunciation with these practical tips and exercises.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x460/c439b1d591/why-study-english-in-england.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/mastering-pronunciation/",
        publishedAt: "2024-3-07",
    },
    {
        title: "English Slang Words You Need to Know",
        description: "Learn the most common slang expressions used in daily conversations.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x400/e85218baea/10-books-to-learn-english-with_square-568x400.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/slang-words/",
        publishedAt: "2024-3-14",
    },
    {
        title: "10 Best Podcasts for Learning English",
        description: "Discover engaging podcasts that help you learn English on the go.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/bc72d8a8aa/10-most-difficult-words-in-english_568x464.png/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/best-podcasts-for-learning/",
        publishedAt: "2024-3-17",
    },
    {
        title: "How to Think in English and Speak Fluently",
        description: "Change your mindset and start thinking in English naturally.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/think-in-english/",
        publishedAt: "2024-3-09",
    },
    {
        title: "Common English Phrasal Verbs and Their Meanings",
        description: "Understand and use essential phrasal verbs like a native speaker.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/phrasal-verbs-explained/",
        publishedAt: "2024-3-06",
    },
    {
        title: "How to Improve Your English Writing Skills",
        description: "Practical tips and exercises to enhance your writing ability.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x460/c439b1d591/why-study-english-in-england.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/writing-skills/",
        publishedAt: "2024-3-08",
    },
    {
        title: "Fun Ways to Practice English Every Day",
        description: "Make learning English enjoyable with these fun activities.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x400/e85218baea/10-books-to-learn-english-with_square-568x400.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/fun-ways-to-learn/",
        publishedAt: "2024-3-11",
    },
    {
        title: "English Pronunciation Mistakes to Avoid",
        description: "Learn how to pronounce difficult English words correctly.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/bc72d8a8aa/10-most-difficult-words-in-english_568x464.png/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/pronunciation-mistakes/",
        publishedAt: "2024-3-13",
    },
    {
        title: "Common English Phrasal Verbs and Their Meanings",
        description: "Understand and use essential phrasal verbs like a native speaker.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/phrasal-verbs-explained/",
        publishedAt: "2024-3-06",
    },
    {
        title: "How to Understand Native English Speakers",
        description: "Train your ears to follow fast English conversations with ease.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/listening-skills/",
        publishedAt: "2024-3-16",
    },
    {
        title: "Essential English Phrases for Travelers",
        description: "Useful English phrases for ordering food, asking for directions, and more.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/travel-phrases/",
        publishedAt: "2024-3-18",
    },
    {
        title: "How to Think in English and Speak Fluently",
        description: "Change your mindset and start thinking in English naturally.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/f6c5cad0a6/oldest_language_world_hero.jpg/m/620x0/filters:quality(70)/",
        url: "https://deepenglish.com/lessons/think-in-english/",
        publishedAt: "2024-3-09",
    },
    {
        title: "Common English Phrasal Verbs and Their Meanings",
        description: "Understand and use essential phrasal verbs like a native speaker.",
        urlToImage:
            "https://a.storyblok.com/f/112937/568x464/46401a0a80/study_english_with_blogs_web.jpg/m/620x0/filters:quality(70)/",
        url: "https://www.ef.com/wwen/blog/language/phrasal-verbs-explained/",
        publishedAt: "2024-3-06",
    },
];
const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState(dummyBlogs);
    const [filteredBlogs, setFilteredBlogs] = useState(dummyBlogs);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        filterBlogs(e.target.value);
    };

    const filterBlogs = (search: string) => {
        const filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBlogs(filtered);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-6xl font-bold text-center my-12 text-red-300">Latest Blogs</h1>

            <div className="flex justify-center mb-12">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBlogs.map((blog, index) => (
                    <div
                        key={index}
                        className="flex flex-col border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-violet-200"
                    >
                        <img
                            src={blog.urlToImage}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                        <p className="text-gray-600 mb-4">{blog.description}</p>
                        <div className="flex justify-between mt-auto">
                            <a
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Read More
                            </a>
                            <p className="text-gray-400 text-sm">
                                Published on: {blog.publishedAt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;
