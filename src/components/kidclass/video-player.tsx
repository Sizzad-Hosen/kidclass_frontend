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
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black"
      ref={containerRef}
    >
      <video
        aria-label={title}
        className="max-h-full w-full"
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
          className="absolute grid size-20 place-items-center rounded-full bg-white/90 text-sky-800 shadow-2xl transition hover:scale-105"
          onClick={togglePlayback}
          type="button"
        >
          <Play className="ml-1 size-9 fill-current" />
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3 pb-3 pt-10 text-white opacity-100 transition sm:px-5">
        <div className="flex items-center gap-3">
          <span className="w-11 text-right text-xs tabular-nums">{formatTime(currentTime)}</span>
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
          <span className="w-11 text-xs tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          <ControlButton label="Restart" onClick={restart}><RotateCcw /></ControlButton>
          <ControlButton label="Back 10 seconds" onClick={() => seek(-10)}><Rewind /></ControlButton>
          <ControlButton label={playing ? "Pause" : "Play"} onClick={togglePlayback}>
            {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          </ControlButton>
          <ControlButton label="Forward 10 seconds" onClick={() => seek(10)}><FastForward /></ControlButton>
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
            <label className="flex h-8 items-center gap-1 rounded-lg bg-white/10 px-2 text-xs font-bold">
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
            <ControlButton label="Picture in picture" onClick={openPictureInPicture}>
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
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      className="bg-white/10 text-white hover:bg-white/20"
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
