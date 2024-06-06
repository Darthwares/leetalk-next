import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ClaudeIcon, OpenAiIcon, PlayIcon, PauseIcon } from "./svg";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Message } from "@/types/types";
import { Avatar } from "@/components/ui/avatar";
import { XIcon } from "lucide-react";
import { showAudioPlayingState } from "@/state/state";
import { useSetRecoilState } from "recoil";

interface PlayListProps {
  playlist: Message[];
  topic: string;
  currentMusicIndex: number;
  isPlaying: boolean;
  onPlayListClick: (index: number) => void;
}

const PlayList = ({
  playlist,
  topic,
  currentMusicIndex,
  isPlaying,
  onPlayListClick,
}: PlayListProps) => {
  const setShowAudioPlayer = useSetRecoilState(showAudioPlayingState);

  return (
    <>
      <Sheet key="right">
        <SheetTrigger asChild>
          <div className="flex items-center">
            <ListBulletIcon className="h-6 w-6 cursor-pointer" />
            <XIcon
              onClick={() => {
                setShowAudioPlayer(false);
              }}
              className="bg-slate-700 cursor-pointer rounded-full p-1 w-5 h-5 text-white absolute -top-6 bottom-0 right-3 "
            />
          </div>
        </SheetTrigger>
        <SheetContent side={"right"} className="z-[52]">
          <SheetHeader>
            <SheetTitle className="text-left">{topic}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 h-[90vh] mt-5 overflow-y-auto pb-20 mb-20">
            {playlist.map((play, id) => {
              const isCurrent = id === currentMusicIndex;
              return (
                <div
                  className="flex flex-col cursor-pointer items-center w-full space-y-2 bg-white rounded-lg md:max-w-md"
                  key={id}
                  onClick={() => onPlayListClick(id)}
                >
                  <div className="flex items-center w-full p-4 space-x-4 bg-gray-100 rounded-lg">
                    <Avatar>
                      {play.sender === "openAIDebater" ? (
                        <OpenAiIcon />
                      ) : (
                        <ClaudeIcon />
                      )}
                    </Avatar>
                    <div className="flex flex-col flex-grow">
                      <span className="font-semibold">{play.sender}</span>
                      <span className="text-sm line-clamp-1 text-gray-600">
                        {play.message_text}
                      </span>
                    </div>
                    {isCurrent && (
                      <button
                        className={`${
                          isCurrent && "p-1"
                        } bg-black text-white rounded-full`}
                      >
                        {isCurrent && isPlaying ? (
                          <PauseIcon className="h-5 w-5" />
                        ) : (
                          <PlayIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PlayList;
