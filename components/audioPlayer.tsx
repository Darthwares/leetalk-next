"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  currentAudioIndexState,
  isGlobalAudioPlayingState,
  playFullAudioState,
  showAudioPlayingState,
  showCurrentPlayingURL,
} from "@/state/state";
import { Message, Conversations } from "@/types/types";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

interface AudioPlayerProps {
  topic?: Conversations;
  messages?: Message[];
  audioURL?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  topic,
  messages,
  audioURL,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useRecoilState(
    currentAudioIndexState
  );
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useRecoilState(
    isGlobalAudioPlayingState
  );
  const setPlayFullAudio = useSetRecoilState(playFullAudioState);
  const [currentPlayingURL, setCurrentPlayingURL] = useRecoilState(
    showCurrentPlayingURL
  );
  const setShowAudioPlayer = useSetRecoilState(showAudioPlayingState);

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const audio = {
    audioUrl: currentPlayingURL,
    imageUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=80&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHByb2ZpbGV8ZW58MHx8fHwxNjQyNjk0NDMy&ixlib=rb-1.2.1&q=80&w=80",
    podcastId: topic?.conversation_id,
    author: topic?.category,
    title: topic?.topic,
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsGlobalAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsGlobalAudioPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * duration;
      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const handleNextAudio = () => {
    if (messages && messages.length > 0) {
      const nextIndex = (currentAudioIndex + 1) % messages.length;
      setCurrentAudioIndex(nextIndex);
      setCurrentPlayingURL(messages[nextIndex].audio_url!);
      setPlayFullAudio(true);
      setIsGlobalAudioPlaying(true);
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, [audio]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setTimeout(() => {
        audioRef.current!.play();
        setIsPlaying(true);
        setIsGlobalAudioPlaying(true);

        const messageElement = document.getElementById(
          `message-${currentAudioIndex}`
        );
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 2000);
    }
  }, [audio.audioUrl, currentAudioIndex]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNextAudio();
  };

  useEffect(() => {
    if (!isGlobalAudioPlaying && audioRef.current) {
      audioRef.current.pause();
    } else if (
      isGlobalAudioPlaying &&
      audioRef.current &&
      audioRef.current.paused
    ) {
      audioRef.current.play();
    }
  }, [isGlobalAudioPlaying]);

  return (
    <div
      className={cn(
        "flex size-full flex-col bg-white overflow-visible relative pb-2",
        {
          hidden: !audio?.audioUrl || audio?.audioUrl === "",
        }
      )}
    >
      <div ref={progressRef} onClick={handleProgressClick}>
        <Progress
          value={(currentTime / duration) * 100}
          className="w-full cursor-pointer h-1.5 lg:hidden block"
          max={duration}
        />
        <div className="flex gap-2 items-center lg:hidden w-full justify-between px-3 py-2 md:py-0 md:pt-2">
          <h2 className="text-16 font-normal text-white-2">
            {formatTime(currentTime)}
          </h2>

          <h2 className="text-16 font-normal text-white-2   ">
            {formatTime(duration)}
          </h2>
        </div>
      </div>
      <section className="glassmorphism-black flex md:h-20 w-full items-center justify-between px-4 max-lg:justify-between max-md:gap-7 lg:px-8">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        <div className="flex items-center lg:w-80 gap-4 w-full">
          <div className="flex w-full lg:w-80 flex-col">
            <h2 className="font-semibold w-full whitespace-normal md:whitespace-nowrap lg:whitespace-normal lg:w-80 line-clamp-1">
              {audio?.title}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-12 font-normal text-white-2">
                {audio?.author}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-16 font-normal text-white-2">
          {formatTime(currentTime)}
        </h2>
        <Progress
          value={(currentTime / duration) * 100}
          className="cursor-pointer w-[38rem] hidden lg:flex"
          max={duration}
          ref={progressRef}
          onClick={handleProgressClick}
        />
        <div className="hidden lg:flex items-center">
          <div className="flex gap-2 items-center">
            {/* {"/"} */}
            <h2 className="text-16 font-normal text-white-2 max-md:hidden">
              {formatTime(duration)}
            </h2>
          </div>
          {/* <div className="flex w-full gap-2">
            <span
              role="img"
              aria-label={isMuted ? "unmute" : "mute"}
              onClick={toggleMute}
              className="cursor-pointer"
              style={{ fontSize: 24 }}
            >
              {isMuted ? "🔇" : "🔊"}
            </span>
          </div> */}
        </div>
        <div className="flex flex-col items-center gap-0.5 w-60 md:w-40 ">
          <div className="flex items-center cursor-pointer gap-3">
            <div className="flex items-center gap-1.5">
              <span role="img" aria-label="rewind" onClick={rewind}>
                <img
                  src={"/rewind.svg"}
                  className="aspect-square rounded-xl w-8 h-8"
                />
              </span>
            </div>
            <span
              role="img"
              aria-label={isGlobalAudioPlaying ? "pause" : "play"}
              onClick={togglePlayPause}
              style={{ fontSize: 30 }}
            >
              {isGlobalAudioPlaying ? (
                <PauseIcon className="h-8 w-8 flex items-center text-white bg-slate-600 p-2 rounded-full hover:bg-slate-700" />
              ) : (
                <PlayIcon className="h-8 w-8 flex items-center text-white bg-slate-600 p-2 rounded-full hover:bg-slate-700" />
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <span role="img" aria-label="forward" onClick={forward}>
                <img
                  src={"/fast-forward-icon.svg"}
                  className="aspect-square rounded-xl w-8 h-8"
                />
              </span>
            </div>
          </div>
        </div>
      </section>
      <XIcon
        onClick={() => {
          setShowAudioPlayer(false);
        }}
        className="bg-slate-700 cursor-pointer rounded-full p-1 w-5 h-5 text-white absolute -top-6 bottom-0 right-3 "
      />
    </div>
  );
};

export default AudioPlayer;
