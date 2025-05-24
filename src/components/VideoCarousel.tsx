"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface VideoCarouselProps {
  generalVideos: Video[];
  tutorialVideos: Video[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  generalVideos,
  tutorialVideos,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "tutorial">("general");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const activeVideos = activeTab === "general" ? generalVideos : tutorialVideos;
  const currentVideo = activeVideos[currentVideoIndex];

  const getYouTubeVideoId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match ? match[1] : "";
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? activeVideos.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % activeVideos.length);
  };

  const handleTabChange = (tab: "general" | "tutorial") => {
    setActiveTab(tab);
    setCurrentVideoIndex(0);
  };

  if (activeVideos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No videos available for this category.
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Videos & Video Guides
      </h3>
      <p className="text-gray-400 mb-6">
        Just starting with Web3? Check out how Andromeda OS (aOS) makes it super
        easy to launch smart, scalable dApps without needing to code your own
        smart contracts!
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTabChange("general")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "general"
              ? "bg-[#4D3DF7] text-white"
              : "bg-[#1a1a1a] text-gray-300 hover:bg-[#333333]"
          }`}
        >
          General
        </button>
        <button
          onClick={() => handleTabChange("tutorial")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "tutorial"
              ? "bg-[#4D3DF7] text-white"
              : "bg-[#1a1a1a] text-gray-300 hover:bg-[#333333]"
          }`}
        >
          Tutorial
        </button>
      </div>

      {/* Video Display */}
      <div className="relative">
        {/* Main Video */}
        <div className="mb-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentVideo.url)}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-2">
              {currentVideo.title}
            </h4>
            {currentVideo.description && (
              <p className="text-gray-400 text-sm">
                {currentVideo.description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={activeVideos.length <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span> Prev
          </button>

          <div className="text-gray-400 text-sm">
            {currentVideoIndex + 1} of {activeVideos.length}
          </div>

          <button
            onClick={handleNext}
            disabled={activeVideos.length <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <span>→</span>
          </button>
        </div>

        {/* Thumbnail Carousel - STEP 1: Remove debug panel but keep simplified structure */}
        {activeVideos.length > 1 && (
          <div className="mt-6">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {activeVideos.map((video, index) => {
                const thumbnailUrl = getYouTubeThumbnail(video.url);
                return (
                  <button
                    key={video.id}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`flex-shrink-0 relative transition-all ${
                      index === currentVideoIndex
                        ? "ring-2 ring-[#4D3DF7]"
                        : "hover:ring-2 hover:ring-gray-500"
                    }`}
                  >
                    {/* Keep simple structure - just img without complex containers */}
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded-lg bg-red-500 border-2 border-yellow-500"
                      onError={(e) => {
                        console.error(
                          `❌ FAILED: ${video.title}`,
                          thumbnailUrl,
                        );
                        const target = e.target as HTMLImageElement;
                        target.className =
                          "w-32 h-20 rounded-lg bg-red-800 border-2 border-red-500 flex items-center justify-center text-white text-xs";
                        target.src = "";
                        target.style.display = "flex";
                        target.style.alignItems = "center";
                        target.style.justifyContent = "center";
                        target.textContent = "FAILED";
                      }}
                      onLoad={() => {
                        console.log(`✅ SUCCESS: ${video.title}`, thumbnailUrl);
                      }}
                      style={{
                        minHeight: "80px",
                        minWidth: "128px",
                        backgroundColor: "#ef4444",
                      }}
                    />

                    {/* Keep debug ID for now */}
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded max-w-32 truncate">
                      ID: {getYouTubeVideoId(video.url)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCarousel;
