'use client';
import { SpeakerWaveIcon, PauseIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
const TextToSpeechButton = ({
  content,
  senderType,
}: {
  content: string;
  senderType: string;
}) => {
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  function playAudio(url: any, startTime: number = 0) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.currentTime = startTime;
      audio.onended = () => {
        setIsPlaying(false);
        resolve(null);
      };
      setAudioInstance(audio);
      audio.play();
      setIsPlaying(true);
    });
  }
  const handleClick = async () => {
    if (isPlaying && audioInstance) {
      audioInstance.pause();
      setIsPlaying(false);
      return;
    }
    if (audioInstance) {
      audioInstance.play();
      setIsPlaying(true);
      return;
    }
    const response = await fetch('/api/texttospeech', {
      method: 'POST',
      body: JSON.stringify({
        text: content,
        senderType: senderType === 'openAIDebater' ? 'alloy' : 'nova',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    await playAudio(url);
  };
  return (
    <button onClick={handleClick}>
      {isPlaying ? (
        <PauseIcon className="w-5 h-5" />
      ) : (
        <SpeakerWaveIcon className="w-5 h-5" />
      )}
    </button>
  );
};
export default TextToSpeechButton;
