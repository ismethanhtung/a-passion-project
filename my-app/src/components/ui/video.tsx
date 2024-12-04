import React from "react";

interface VideoProps {
    videoUrl: string;
    isLocked?: boolean;
}

export const Video: React.FC<VideoProps> = ({ videoUrl, isLocked = false }) => {
    const embedUrl = videoUrl
        .replace("watch?v=", "embed/")
        .replace("/watch/", "/embed/")
        .replace("youtu.be/", "youtube.com/embed/");

    return (
        <div className="">
            {isLocked ? (
                <div className="flex items-center justify-center  bg-gray-700 text-white">
                    <p className="text-lg font-semibold">Video bị khóa</p>
                </div>
            ) : (
                <iframe
                    src={embedUrl}
                    title="YouTube video player"
                    className="w-full h-96"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
};
