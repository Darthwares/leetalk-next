"use client";

import { PauseIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { PlayIcon } from "./svg";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentAudioIndexState,
  isGlobalAudioPlayingState,
  playFullAudioState,
  showAudioPlayingState,
  showCurrentPlayingURL,
} from "@/state/state";

interface TextToSpeechButtonProps {
  senderType?: string;
  index?: number;
  audioURL?: string;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  senderType,
  index,
  audioURL,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useRecoilState(
    currentAudioIndexState
  );
  const setPlayFullAudio = useSetRecoilState(playFullAudioState);
  const setCurrentPlayingURL = useSetRecoilState(showCurrentPlayingURL);
  const setShowAudioPlayerState = useSetRecoilState(showAudioPlayingState);
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useRecoilState(
    isGlobalAudioPlayingState
  );

  useEffect(() => {
    if (currentAudioIndex !== index && isPlaying) {
      setIsPlaying(false);
    } else if (currentAudioIndex === index && isGlobalAudioPlaying) {
      setIsPlaying(true);
    }
  }, [currentAudioIndex, index, isPlaying, isGlobalAudioPlaying]);

  const handleClick = async () => {
    setCurrentPlayingURL(audioURL!);
    if (currentAudioIndex !== index) {
      setCurrentAudioIndex(index!);
      setPlayFullAudio(true);
      setShowAudioPlayerState(true);
      setIsPlaying(true);
      setIsGlobalAudioPlaying(true);
    } else {
      setShowAudioPlayerState(true);
      setIsPlaying(!isPlaying);
      setIsGlobalAudioPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex w-full gap-2 items-center">
      <div className="flex w-full py-2 items-center gap-3">
        <button
          onClick={handleClick}
          className={`${
            senderType === "openAIDebater"
              ? "bg-black text-white"
              : "bg-white text-black"
          } rounded-full p-2`}
        >
          {currentAudioIndex === index && isPlaying && isGlobalAudioPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TextToSpeechButton;
