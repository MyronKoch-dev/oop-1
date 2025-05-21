import Image from "next/image";

interface YouTubeVideoProps {
    videoId: string;
    title: string;
    className?: string;
}

export function YouTubeVideo({ videoId, title, className = "" }: YouTubeVideoProps) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const youtubeUrl = `https://youtu.be/${videoId}`;

    return (
        <div className={`relative group rounded-lg overflow-hidden ${className}`}>
            <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="relative aspect-video">
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                            <div className="w-0 h-0 border-t-8 border-b-8 border-transparent border-l-[16px] border-l-white ml-1"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/75 p-3 text-white">
                    <p className="font-medium line-clamp-1">{title}</p>
                </div>
            </a>
        </div>
    );
} 