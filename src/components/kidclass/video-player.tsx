"use client";

import { useRef, useState } from "react";
import {
  FastForward,
  Maximize,
  Pause,
  PictureInPicture2,
  Play,
  Rewind,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const getVideoEmbedUrl = (url?: string) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

export function VideoPlayer({
  src,
  title,
  onEnded,
}: {
  src: string;
  title: string;
  onEnded?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const embedUrl = getVideoEmbedUrl(src);

  if (embedUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
          src={embedUrl}
          title={title}
        />
      </div>
    );
  }

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        toast.error("The video could not start playing.");
      }
    } else {
      video.pause();
    }
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
  };

  const restart = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    try {
      await video.play();
    } catch {
      toast.error("The video could not restart.");
    }
  };

  const changeRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    video.preservesPitch = true;
    setPlaybackRate(rate);
  };

  const changeVolume = (nextVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const openPictureInPicture = async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) {
      toast.error("Picture-in-picture is not supported by this browser.");
      return;
    }

    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch {
      toast.error("Picture-in-picture could not be opened.");
    }
  };

  const openFullscreen = async () => {
    try {
      await containerRef.current?.requestFullscreen();
    } catch {
      toast.error("Fullscreen could not be opened.");
    }
  };

  return (
    <div
      className="group relative flex aspect-video w-full max-w-full items-center justify-center overflow-hidden bg-black"
      ref={containerRef}
    >
      <video
        aria-label={title}
        className="size-full object-contain"
        onClick={togglePlayback}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
        onLoadedMetadata={(event) => {
          event.currentTarget.preservesPitch = true;
          setDuration(event.currentTarget.duration);
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
      >
        Your browser does not support video playback.
      </video>

      {!playing ? (
        <button
          aria-label="Play video"
          className="absolute grid size-14 place-items-center rounded-full bg-white/90 text-sky-800 shadow-2xl transition hover:scale-105 sm:size-20"
          onClick={togglePlayback}
          type="button"
        >
          <Play className="ml-1 size-7 fill-current sm:size-9" />
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-2 pb-2 pt-8 text-white opacity-100 transition sm:px-5 sm:pb-3 sm:pt-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-9 text-right text-[10px] tabular-nums sm:w-11 sm:text-xs">{formatTime(currentTime)}</span>
          <input
            aria-label="Video progress"
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-sky-500"
            max={duration || 0}
            onChange={(event) => {
              const nextTime = Number(event.target.value);
              if (videoRef.current) videoRef.current.currentTime = nextTime;
              setCurrentTime(nextTime);
            }}
            step="0.1"
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
          <span className="w-9 text-[10px] tabular-nums sm:w-11 sm:text-xs">{formatTime(duration)}</span>
        </div>

        <div className="mt-1 flex items-center gap-0.5 sm:mt-2 sm:gap-1">
          <ControlButton className="hidden sm:inline-flex" label="Restart" onClick={restart}><RotateCcw /></ControlButton>
          <ControlButton className="hidden sm:inline-flex" label="Back 10 seconds" onClick={() => seek(-10)}><Rewind /></ControlButton>
          <ControlButton label={playing ? "Pause" : "Play"} onClick={togglePlayback}>
            {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          </ControlButton>
          <ControlButton className="hidden sm:inline-flex" label="Forward 10 seconds" onClick={() => seek(10)}><FastForward /></ControlButton>
          <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted ? <VolumeX /> : <Volume2 />}
          </ControlButton>
          <input
            aria-label="Volume"
            className="hidden w-20 cursor-pointer accent-sky-500 sm:block"
            max="1"
            min="0"
            onChange={(event) => changeVolume(Number(event.target.value))}
            step="0.05"
            type="range"
            value={muted ? 0 : volume}
          />

          <div className="ml-auto flex items-center gap-1">
            <label className="flex h-8 items-center gap-1 rounded-lg bg-white/10 px-1.5 text-[10px] font-bold sm:px-2 sm:text-xs">
              <span className="hidden sm:inline">Speed</span>
              <select
                aria-label="Playback speed with original voice pitch"
                className="bg-transparent outline-none [&>option]:text-black"
                onChange={(event) => changeRate(Number(event.target.value))}
                value={playbackRate}
              >
                {playbackRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 1 ? "1× Original" : `${rate}×`}
                  </option>
                ))}
              </select>
            </label>
            <ControlButton className="hidden sm:inline-flex" label="Picture in picture" onClick={openPictureInPicture}>
              <PictureInPicture2 />
            </ControlButton>
            <ControlButton label="Fullscreen" onClick={openFullscreen}><Maximize /></ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  className,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      className={`size-8 bg-white/10 p-0 text-white hover:bg-white/20 [&_svg]:size-4 sm:size-9 ${className ?? ""}`}
      onClick={onClick}
      size="icon"
      title={label}
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  );
}
