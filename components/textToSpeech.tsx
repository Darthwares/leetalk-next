"use client";

import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import React from "react";

function playAudio(url: any) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.play();
  });
}

const TextToSpeechButton = ({
  content,
  senderType,
}: {
  content: string;
  senderType: string;
}) => {
  const handleClick = async () => {
    const response = await fetch("/api/texttospeech", {
      method: "POST",
      body: JSON.stringify({
        text: content,
        senderType: senderType === "openAIDebater" ? "alloy" : "nova"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    await playAudio(url);
  };

  return <button onClick={handleClick}>
    <SpeakerWaveIcon className="w-5 h-5 "/>
  </button>;
};

export default TextToSpeechButton;
