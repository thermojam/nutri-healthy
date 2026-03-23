"use client";

import {useState, useRef, memo} from "react";
import {Play, Volume2, VolumeX, Maximize, Minimize} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

/**
 * Video Player компонент
 * 
 * Лучшие практики:
 * - bundle-dynamic-imports: next/dynamic для тяжелых компонентов
 * - rerender-memo: memo для предотвращения лишних ререндеров
 * - rerender-use-ref-transient-values: useRef для часто меняющихся значений
 */

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    controls?: boolean;
}

/**
 * Кастомный Video Player с базовыми контролами
 */
export const VideoPlayer = memo(function VideoPlayer({
    src,
    poster,
    title,
    className,
    autoPlay = false,
    loop = false,
    controls = true,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;

        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;

        if (!document.fullscreenElement) {
            videoRef.current.parentElement?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setProgress(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const newTime = parseFloat(e.target.value);
        videoRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={cn("relative group bg-black rounded-xl overflow-hidden", className)}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => controls && !isPlaying && setShowControls(false)}
        >
            {/* Video элемент */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                title={title}
                className="w-full aspect-video"
                autoPlay={autoPlay}
                loop={loop}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                playsInline
            />

            {/* Overlay с контролами */}
            {controls && (
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40",
                        "transition-opacity duration-300",
                        showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    )}
                >
                    {/* Кнопка Play по центру */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="w-20 h-20 rounded-full bg-white/90 hover:bg-white transition-colors"
                                onClick={togglePlay}
                            >
                                <Play className="h-10 w-10 ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* Контролы снизу */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                        {/* Progress bar */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={progress}
                            onChange={handleProgressChange}
                            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                                     [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                                     [&::-webkit-slider-thumb]:bg-white"
                        />

                        {/* Кнопки управления */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Play/Pause */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <div className="w-5 h-5 flex gap-1">
                                            <div className="w-1.5 h-full bg-white rounded" />
                                            <div className="w-1.5 h-full bg-white rounded" />
                                        </div>
                                    ) : (
                                        <Play className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* Volume */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? (
                                        <VolumeX className="h-5 w-5" />
                                    ) : (
                                        <Volume2 className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* Время */}
                                <span className="text-xs text-white/80">
                                    {formatTime(progress)} / {formatTime(duration)}
                                </span>
                            </div>

                            {/* Fullscreen */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? (
                                    <Minimize className="h-5 w-5" />
                                ) : (
                                    <Maximize className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

/**
 * YouTube/Vimeo Embed с ленивой загрузкой
 */
export const LazyVideoEmbed = memo(function LazyVideoEmbed({
    videoUrl,
    poster,
    title,
    className,
}: {
    videoUrl: string;
    poster?: string;
    title?: string;
    className?: string;
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    const getEmbedUrl = () => {
        if (isYouTube) {
            const videoId = videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (isVimeo) {
            const videoId = videoUrl.split("/").pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return videoUrl;
    };

    return (
        <div className={cn("relative aspect-video bg-black rounded-xl overflow-hidden", className)}>
            {!isLoaded && poster && (
                <img
                    src={poster}
                    alt={title || "Video thumbnail"}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="w-20 h-20 rounded-full bg-white/90 hover:bg-white transition-colors"
                        onClick={() => setIsLoaded(true)}
                    >
                        <Play className="h-10 w-10 ml-1" />
                    </Button>
                </div>
            )}

            {isLoaded && (
                <iframe
                    src={getEmbedUrl()}
                    title={title || "Video player"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
});
