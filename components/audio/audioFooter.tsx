import React from 'react'
import { ClaudeIcon, OpenAiIcon } from '../svg';
import PlayList from '../playList';
interface AudioFooterProps {
  playlist: Array<{ src: string; sender: string }>;
  currentMusicIndex: number;
  nextSpeakerIndex: number;
  isPlaying: boolean;
  topic: string;
  messages: any[];
  handlePlayListClick: (index: number, conversation_id?: string) => void;
}

const AudioFooter = ({
  playlist,
  currentMusicIndex,
  nextSpeakerIndex,
  isPlaying,
  topic,
  messages,
  handlePlayListClick,
}: AudioFooterProps) => {
  return (
    <div className="flex items-center w-full justify-between gap-5">
      <div className="items-center flex w-full justify-between text-gray-700">
        <div className="hidden sm:flex">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              {playlist[currentMusicIndex]?.sender === 'openAIDebater' ? (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              {playlist[nextSpeakerIndex]?.sender === 'openAIDebater' ? (
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
        {playlist.length > 0 && (
          <p>{`${currentMusicIndex + 1} of ${playlist.length}`}</p>
        )}
      </div>
      <PlayList
        topic={topic}
        playlist={messages}
        currentMusicIndex={currentMusicIndex}
        isPlaying={isPlaying}
        onPlayListClick={handlePlayListClick}
      />
    </div>
  );
};

export default AudioFooter