"use client";
import Image from "next/image";
import Link from "next/link";
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
import { extractPlaylist } from "@/constants/default";
import { ClaudeIcon, OpenAiIcon } from "./svg";
import PlayList from "./playList";
import { XIcon } from "lucide-react";

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
  const [currentMusicIndex] = useRecoilState(currentAudioIndexState);
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

  const playlist = extractPlaylist(messages!);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNextAudio();
  };

  const nextSpeakerIndex = (currentMusicIndex + 1) % playlist.length;

  const handlePlayListClick = (index: number) => {
    setCurrentPlayingURL(audioURL!);
    if (currentAudioIndex === index) {
      setCurrentAudioIndex(index!);
      setPlayFullAudio(true);
      setIsPlaying(true);
      setIsGlobalAudioPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
      setIsGlobalAudioPlaying(!isPlaying);
    }
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
          className="w-full cursor-pointer h-1.5"
          max={duration}
        />
        <div className="flex gap-2 items-center md:hidden w-full justify-between px-3 py-2">
          <h2 className="text-16 font-normal text-white-2">
            {formatTime(currentTime)}
          </h2>

          <h2 className="text-16 font-normal text-white-2   ">
            {formatTime(duration)}
          </h2>
        </div>
      </div>
      <section className="glassmorphism-black flex md:h-20 w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        <div className="flex items-center gap-4 ">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player1"
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[160px] md:w-80 flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio?.author}</p>
          </div>
        </div>
        <div className="flex flex-col items-center mt-5 gap-0.5">
          <div className="flex items-center cursor-pointer gap-3 md:gap-6">
            <div className="flex items-center gap-1.5">
              <span role="img" aria-label="rewind" onClick={rewind}>
                <Image
                  src={"/rewind.svg"}
                  width={25}
                  height={25}
                  alt="player1"
                  className="aspect-square rounded-xl"
                />
              </span>
              <h2 className="text-12 font-bold text-white-4 hidden md:block">
                -5
              </h2>
            </div>
            <span
              role="img"
              aria-label={isGlobalAudioPlaying ? "pause" : "play"}
              onClick={togglePlayPause}
              style={{ fontSize: 30 }}
            >
              {isGlobalAudioPlaying ? (
                <Image
                  src={"/stop-icon.svg"}
                  width={25}
                  height={25}
                  alt="player1"
                  className="aspect-square rounded-xl"
                />
              ) : (
                <Image
                  src={"/play.svg"}
                  width={25}
                  height={25}
                  alt="player1"
                  className="aspect-square rounded-xl"
                />
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <h2 className="text-12 font-bold text-white-4 hidden md:block">
                +5
              </h2>
              <span role="img" aria-label="forward" onClick={forward}>
                <Image
                  src={"/fast-forward-icon.svg"}
                  width={25}
                  height={25}
                  alt="player1"
                  className="aspect-square rounded-xl"
                />
              </span>
            </div>
          </div>
          <div className="hidden sm:flex">
            <div className="flex items-center">
              <div>
                {playlist[currentMusicIndex]?.sender === "openAIDebater" ? (
                  <div className="inline-flex gap-1 items-center">
                    <OpenAiIcon className="w-5 h-5" />
                    <strong>OpenAI</strong>
                  </div>
                ) : (
                  <div className="inline-flex gap-1 items-center">
                    <ClaudeIcon className="w-5 h-5" />
                    <strong>Claude</strong>
                  </div>
                )}
              </div>
              <div className="h-10 pr-5 w-full">
                <lottie-player
                  src="/audio-wave2.json"
                  background=""
                  speed="1"
                  loop
                  autoplay
                  className="bg-gradient-to-r from-indigo-100 to-pink-200"
                ></lottie-player>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                {playlist[nextSpeakerIndex]?.sender === "openAIDebater" ? (
                  <div className="inline-flex gap-1 items-center">
                    <OpenAiIcon className="w-5 h-5" />
                    <strong>OpenAI</strong>
                  </div>
                ) : (
                  <div className="inline-flex gap-1 items-center">
                    <ClaudeIcon className="w-5 h-5" />
                    <strong>Claude</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-2 items-center">
            <h2 className="text-16 font-normal text-white-2">
              {formatTime(currentTime)}
            </h2>
            {"/"}
            <h2 className="text-16 font-normal text-white-2 max-md:hidden">
              {formatTime(duration)}
            </h2>
          </div>
          <div className="flex w-full gap-2">
            <span
              role="img"
              aria-label={isMuted ? "unmute" : "mute"}
              onClick={toggleMute}
              className="cursor-pointer"
              style={{ fontSize: 24 }}
            >
              {isMuted ? "🔇" : "🔊"}
            </span>
            <div className="md:flex items-center justify-between gap-5 hidden">
              <div className="items-center flex w-full justify-between text-gray-700">
                {playlist.length > 0 && (
                  <p>{`${currentMusicIndex + 1} of ${playlist.length}`}</p>
                )}
              </div>
              <PlayList
                topic={topic?.topic!}
                playlist={messages!}
                currentMusicIndex={currentMusicIndex}
                isPlaying={isPlaying}
                onPlayListClick={handlePlayListClick}
              />
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
