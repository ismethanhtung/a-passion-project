"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Download,
    HeartIcon,
    Play,
    Pause,
    BookOpen,
    X,
    Filter,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const podcastCategories = [
    "Tất cả",
    "Hội thoại",
    "Kinh doanh",
    "IELTS",
    "TOEIC",
    "Du lịch",
    "Tin tức",
    "Văn hóa",
];

const podcasts = [
    {
        id: 1,
        title: "Everyday English Conversations",
        desc: "Luyện nghe hội thoại thực tế, tốc độ tự nhiên, có transcript.",
        audio: "/audio/mock-podcast-1.mp3",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29udmVyc2F0aW9ufGVufDB8fDB8fHww",
        duration: "8:30",
        level: "Beginner",
        date: "2023-06-15",
        category: "Hội thoại",
        views: 1240,
        transcript: `
      A: Hi there! How are you doing today?
      B: I'm doing great, thanks for asking. How about you?
      A: Can't complain. The weather is beautiful today.
      B: It sure is! Perfect day for a walk in the park.
      A: Absolutely. Are you here for the English conversation meetup?
      B: Yes, I am. I'm trying to improve my speaking skills.
      A: Me too. I've been learning English for about two years now.
      B: That's impressive! Your English sounds very natural.
      A: Thank you! I practice a lot by watching movies and listening to podcasts.
      B: That's a great strategy. I should try that too.
    `,
    },
    {
        id: 2,
        title: "Business English Podcast",
        desc: "Từ vựng và mẫu câu giao tiếp trong môi trường công sở.",
        audio: "/audio/mock-podcast-2.mp3",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3MlMjBtZWV0aW5nfGVufDB8fDB8fHww",
        duration: "12:10",
        level: "Intermediate",
        date: "2023-07-22",
        category: "Kinh doanh",
        views: 890,
        transcript: `
      Welcome to today's Business English Podcast. In this episode, we're going to discuss effective email communication in a professional setting.
      
      When writing a business email, it's important to maintain a professional tone. Start with a clear subject line that summarizes the purpose of your email.
      
      Begin with an appropriate greeting, such as "Dear Mr./Ms. [Last Name]" for formal emails, or "Hello [First Name]" for more casual business relationships.
      
      Keep the body of your email concise and to the point. Use short paragraphs and bullet points when appropriate to make your email easy to read.
      
      End your email with a professional closing, such as "Best regards," "Sincerely," or "Thank you," followed by your name and contact information.
      
      Let's look at some useful phrases you can use in your business emails...
    `,
    },
    {
        id: 3,
        title: "IELTS Listening Practice",
        desc: "Chủ đề học thuật, luyện nghe cho kỳ thi IELTS.",
        audio: "/audio/mock-podcast-3.mp3",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZGVudCUyMGxpc3RlbmluZ3xlbnwwfHwwfHx8MA%3D%3D",
        duration: "15:00",
        level: "Advanced",
        date: "2023-08-10",
        category: "IELTS",
        views: 1560,
        transcript: `
      This is an IELTS listening practice recording. Today we'll be practicing Section 3, which typically features a conversation between up to four people set in an educational or training context.
      
      Listen carefully to the following conversation between a professor and two students discussing their research project.
      
      Professor: Good morning, Sarah and Michael. How is your research project coming along?
      
      Sarah: Good morning, Professor. We've made quite a bit of progress since our last meeting.
      
      Michael: Yes, we've collected all the data we need and have started analyzing it.
      
      Professor: That's excellent news. What were your initial findings?
      
      Sarah: Well, we found that 75% of participants showed a significant improvement after the intervention.
      
      Michael: However, we're still trying to determine if there are any confounding variables we need to account for.
      
      Professor: That's a good point, Michael. Have you considered controlling for age and educational background?
      
      Now, answer the following questions based on the conversation you just heard...
    `,
    },
    {
        id: 4,
        title: "Travel English Essentials",
        desc: "Từ vựng và mẫu câu cần thiết khi đi du lịch nước ngoài.",
        audio: "/audio/mock-podcast-4.mp3",
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsfGVufDB8fDB8fHww",
        duration: "10:15",
        level: "Beginner",
        date: "2023-09-05",
        category: "Du lịch",
        views: 720,
        transcript: `
      Welcome to Travel English Essentials! In this episode, we'll cover common phrases you'll need when staying at a hotel.
      
      When you arrive at a hotel, you'll need to check in. You might say: "Hello, I have a reservation under the name [Your Name]."
      
      If you have any special requests, you can ask: "Is it possible to have a room with a view?" or "Could I have a quiet room away from the elevator?"
      
      During your stay, you might need to request services. For example: "Could I have some extra towels, please?" or "What time is breakfast served?"
      
      When it's time to leave, you'll need to check out. You can say: "I'd like to check out, please. My room number is [Room Number]."
      
      Let's practice these phrases and learn some additional vocabulary that will be useful during your hotel stay...
    `,
    },
    {
        id: 5,
        title: "Daily News in Easy English",
        desc: "Bản tin thời sự hàng ngày với từ vựng đơn giản, phù hợp người mới học.",
        audio: "/audio/mock-podcast-5.mp3",
        image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D",
        duration: "6:20",
        level: "Beginner",
        date: "2023-10-12",
        category: "Tin tức",
        views: 550,
        transcript: `
      Welcome to Daily News in Easy English for October 12th, 2023.
      
      Our first story: Scientists have discovered a new species of butterfly in the Amazon rainforest. This butterfly has beautiful blue wings and is very rare. Researchers say it's important to protect the rainforest to save species like this one.
      
      Next story: A new study shows that learning a musical instrument helps children do better in math and science. Children who played music for at least one year scored higher on tests than those who didn't play any instruments.
      
      Sports news: The local soccer team won their match yesterday with a score of 3-1. They will play in the final match next weekend.
      
      Weather update: Tomorrow will be sunny with a few clouds. The temperature will be around 25 degrees Celsius.
      
      That's all for today's news. Tune in tomorrow for more Daily News in Easy English!
    `,
    },
];

export default function PodcastPage() {
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPodcast, setCurrentPodcast] = useState<
        (typeof podcasts)[0] | null
    >(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cập nhật thời gian phát khi audio đang phát
    useEffect(() => {
        if (audioRef.current) {
            const handleTimeUpdate = () => {
                setCurrentTime(audioRef.current?.currentTime || 0);
            };

            const handleLoadedMetadata = () => {
                setDuration(audioRef.current?.duration || 0);
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            audioRef.current.addEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );
            audioRef.current.addEventListener("ended", handleEnded);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        handleTimeUpdate
                    );
                    audioRef.current.removeEventListener(
                        "loadedmetadata",
                        handleLoadedMetadata
                    );
                    audioRef.current.removeEventListener("ended", handleEnded);
                }
            };
        }
    }, [currentPodcast]);

    // Lọc podcast theo danh mục và tìm kiếm
    const filteredPodcasts = podcasts.filter((pod) => {
        // Lọc theo danh mục
        if (activeCategory !== "Tất cả" && pod.category !== activeCategory) {
            return false;
        }

        // Lọc theo từ khóa tìm kiếm
        if (
            searchQuery &&
            !pod.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !pod.desc.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false;
        }

        return true;
    });

    // Xử lý phát/dừng podcast
    const togglePlayPause = (podcast: (typeof podcasts)[0]) => {
        if (currentPodcast?.id === podcast.id) {
            if (isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            setCurrentPodcast(podcast);
            setShowTranscript(false);
            setIsPlaying(true);

            // Cho thời gian để cập nhật audioRef
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                }
            }, 100);
        }
    };

    // Xử lý tải xuống podcast
    const handleDownload = (podcast: (typeof podcasts)[0]) => {
        // Trong thực tế, đây sẽ là một link tải xuống thực sự
        // Hiện tại chỉ hiện thông báo
        toast.success(`Đang tải xuống "${podcast.title}"`);
    };

    // Xử lý yêu thích podcast
    const toggleFavorite = (podcastId: number) => {
        if (favorites.includes(podcastId)) {
            setFavorites(favorites.filter((id) => id !== podcastId));
            toast.info("Đã xóa khỏi danh sách yêu thích");
        } else {
            setFavorites([...favorites, podcastId]);
            toast.success("Đã thêm vào danh sách yêu thích");
        }
    };

    // Format thời gian
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-indigo-800 mb-2">
                        Podcast tiếng Anh
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Luyện nghe tiếng Anh với các podcast chọn lọc, có
                        transcript và phân cấp trình độ. Học mọi lúc, mọi nơi
                        với các chủ đề đa dạng.
                    </p>
                </div>

                {/* Player bar - Hiện khi có podcast đang phát */}
                {currentPodcast && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-200 shadow-lg p-3 z-50">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <img
                                        src={currentPodcast.image}
                                        alt={currentPodcast.title}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-indigo-800 truncate">
                                            {currentPodcast.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {currentPodcast.level} •{" "}
                                            {currentPodcast.category}
                                        </p>
                                    </div>

                                    <Button
                                        variant={
                                            isPlaying ? "outline" : "default"
                                        }
                                        onClick={() =>
                                            togglePlayPause(currentPodcast)
                                        }
                                        className="md:hidden"
                                        size="sm"
                                    >
                                        {isPlaying ? (
                                            <Pause size={16} />
                                        ) : (
                                            <Play size={16} />
                                        )}
                                    </Button>
                                </div>

                                <div className="hidden md:flex items-center gap-2 flex-1">
                                    <span className="text-xs text-gray-500 w-10">
                                        {formatTime(currentTime)}
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500"
                                            style={{
                                                width: `${
                                                    (currentTime / duration) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 w-10">
                                        {formatTime(duration)}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant={
                                            isPlaying ? "outline" : "default"
                                        }
                                        onClick={() =>
                                            togglePlayPause(currentPodcast)
                                        }
                                        className="hidden md:flex"
                                        size="sm"
                                    >
                                        {isPlaying ? (
                                            <Pause size={16} />
                                        ) : (
                                            <Play size={16} />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowTranscript(!showTranscript)
                                        }
                                        size="sm"
                                    >
                                        {showTranscript ? (
                                            <X size={16} />
                                        ) : (
                                            <BookOpen size={16} />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            toggleFavorite(currentPodcast.id)
                                        }
                                        size="sm"
                                    >
                                        <HeartIcon
                                            size={16}
                                            fill={
                                                favorites.includes(
                                                    currentPodcast.id
                                                )
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleDownload(currentPodcast)
                                        }
                                        size="sm"
                                    >
                                        <Download size={16} />
                                    </Button>
                                </div>
                            </div>

                            {/* Audio element - hidden */}
                            <audio
                                ref={audioRef}
                                src={currentPodcast.audio}
                                className="hidden"
                            />

                            {/* Transcript panel */}
                            {showTranscript && (
                                <div className="mt-4 bg-indigo-50 p-4 rounded-md border border-indigo-200 max-h-60 overflow-y-auto">
                                    <h3 className="font-medium text-indigo-800 mb-2">
                                        Transcript:
                                    </h3>
                                    <div className="whitespace-pre-wrap text-gray-700 text-sm">
                                        {currentPodcast.transcript}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Tìm kiếm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative mb-4">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tìm podcast..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">
                                            Danh mục
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setShowFilterMenu(
                                                    !showFilterMenu
                                                )
                                            }
                                            className="md:hidden text-indigo-600 flex items-center gap-1"
                                        >
                                            <Filter size={16} />
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                    <div
                                        className={`space-y-1 ${
                                            showFilterMenu
                                                ? "block"
                                                : "hidden md:block"
                                        }`}
                                    >
                                        {podcastCategories.map((category) => (
                                            <div
                                                key={category}
                                                className={`cursor-pointer p-2 rounded-md ${
                                                    activeCategory === category
                                                        ? "bg-indigo-100 text-indigo-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    setActiveCategory(category)
                                                }
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-medium mb-2">
                                        Trình độ
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer"
                                        >
                                            Beginner
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer"
                                        >
                                            Intermediate
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer"
                                        >
                                            Advanced
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main content */}
                    <div className="lg:col-span-3">
                        {filteredPodcasts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPodcasts.map((pod) => (
                                    <Card
                                        key={pod.id}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative h-40 w-full">
                                            <img
                                                src={pod.image}
                                                alt={pod.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                                <Badge className="bg-indigo-500">
                                                    {pod.category}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-black/50 text-white border-0"
                                                >
                                                    {pod.level}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="pt-4">
                                            <h3 className="text-lg font-semibold text-indigo-800 mb-1 line-clamp-1">
                                                {pod.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {pod.desc}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <span>{pod.date}</span>
                                                <span>{pod.duration}</span>
                                                <span>
                                                    {pod.views} lượt nghe
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 gap-2"
                                                    onClick={() =>
                                                        togglePlayPause(pod)
                                                    }
                                                >
                                                    {currentPodcast?.id ===
                                                        pod.id && isPlaying ? (
                                                        <>
                                                            <Pause size={16} />
                                                            Tạm dừng
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play size={16} />
                                                            Nghe ngay
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        toggleFavorite(pod.id)
                                                    }
                                                >
                                                    <HeartIcon
                                                        size={18}
                                                        fill={
                                                            favorites.includes(
                                                                pod.id
                                                            )
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">
                                    Không tìm thấy podcast nào phù hợp với tìm
                                    kiếm của bạn.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
