import React from "react";

interface VideoProps {
    videoUrl: string;
    isLocked?: boolean;
}

export const Video: React.FC<VideoProps> = ({ videoUrl, isLocked = false }) => {
    const embedUrl = videoUrl.includes("youtube")
        ? videoUrl
              .replace("watch?v=", "embed/")
              .replace("/watch/", "/embed/")
              .replace("youtu.be/", "youtube.com/embed/")
        : videoUrl.includes("vimeo")
        ? videoUrl.replace("vimeo.com/", "player.vimeo.com/video/")
        : null;

    const handleVideoError = () => {
        alert("Không thể phát video này. Vui lòng thử lại sau.");
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            {isLocked ? (
                <div className="flex items-center justify-center bg-gray-700 text-white p-8 rounded-lg">
                    <p className="text-lg font-semibold">Video bị khóa</p>
                </div>
            ) : embedUrl ? (
                <iframe
                    src={`${embedUrl}?title=0&byline=0&portrait=0&badge=0&autopause=0`}
                    className="w-full rounded-lg aspect-video"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    title="Embedded Video"
                    onError={handleVideoError}
                ></iframe>
            ) : (
                <div className="text-red-500 text-center">
                    URL video không hợp lệ.
                </div>
            )}
        </div>
    );
};
