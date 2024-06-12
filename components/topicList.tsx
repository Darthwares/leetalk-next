"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import getList from "@/lib/helper/edgedb/dbClient";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  debateCategoryState,
  loaderState,
  messagesState,
  showTopicState,
  topicListState,
  showAudioPlayingState,
  showCurrentPlayingURL,
  singleTopicState,
  currentAudioIndexState,
  playFullAudioState,
  isGlobalAudioPlayingState,
} from "@/state/state";
import { Conversations, Message } from "@/types/types";
import Image from "next/image";
import { PlayIcon, PauseIcon } from "lucide-react";
import getSingleMessages from "@/lib/helper/edgedb/getSingleMessage";

interface TopicListProps {
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

const TopicList = ({ setSidebarOpen }: TopicListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topics, setTopics] = useRecoilState(topicListState);
  const setMessagesList = useSetRecoilState<any>(messagesState);
  const setSelectedCategory = useSetRecoilState(debateCategoryState);
  const setLoader = useSetRecoilState(loaderState);
  const setInputValue = useSetRecoilState(showTopicState);

  const setShowAudioPlayer = useSetRecoilState(showAudioPlayingState);
  const setShowCurrentPlayingURL = useSetRecoilState(showCurrentPlayingURL);
  const setSingleTopicState = useSetRecoilState(singleTopicState);
  const setCurrentAudioIndex = useSetRecoilState(currentAudioIndexState);
  const setPlayFullAudio = useSetRecoilState(playFullAudioState);
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useRecoilState(
    isGlobalAudioPlayingState
  );

  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  useEffect(() => {
    async function getBlogList() {
      const data = await getList();
      setTopics(data as Conversations[]);
    }
    getBlogList();
  }, []);

  const filteredTopics = useMemo(() => {
    return topics?.filter((topic: any) =>
      topic?.topic?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, topics]);

  const handlePlay = async (debate: any) => {
    const singleMessageList = await getSingleMessages(debate.conversation_id);

    // const audioURLs = singleMessageList.map((message: any) => {
    //   return message.audio_url;
    // });
    const audioUrls = singleMessageList
      .map((message: any) => message.audio_url)
      .filter(Boolean);

    if (audioUrls.length > 0) {
      if (currentPlayingId === debate.conversation_id && isGlobalAudioPlaying) {
        setIsGlobalAudioPlaying(false);
      } else {
        setSingleTopicState(debate);
        setMessagesList(singleMessageList!);
        setShowCurrentPlayingURL(audioUrls[0]);
        setCurrentAudioIndex(0);
        setPlayFullAudio(true);
        setIsGlobalAudioPlaying(true);
        setShowAudioPlayer(true);
        setCurrentPlayingId(debate.conversation_id);
      }
    } else {
      console.error("No valid audio URLs found for this debate.");
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 h-full space-y-3 bg-white p-2 rounded-lg md:px-10 px-3">
      <div className="space-y-4">
        <div className="w-full text-3xl font-semibold">Search Topics</div>
        <div>
          <div className="flex flex-col mb-4">
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            {filteredTopics!?.length > 0 ? (
              <div className="md:space-y-4 space-y-2 pt-2">
                {filteredTopics?.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-100 rounded-lg flex items-center space-x-4"
                  >
                    <button
                      onClick={() => handlePlay(item)}
                      className="flex items-center text-white bg-slate-600 p-1 rounded-full hover:bg-slate-700 mt-2"
                    >
                      {currentPlayingId === item.conversation_id &&
                      isGlobalAudioPlaying ? (
                        <PauseIcon className="h-6 w-6" />
                      ) : (
                        <PlayIcon className="h-6 w-6" />
                      )}
                    </button>
                    <div className="flex items-center gap-3 top-1 relative">
                      <Image
                        src={item.imageURL}
                        alt={item.topic}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      <div className="flex flex-col flex-grow">
                        <Link
                          href={`/chat/${item.conversation_id}`}
                          className="line-clamp-2 hover:text-blue-800"
                          onClick={() => {
                            setSidebarOpen && setSidebarOpen(false);
                            setMessagesList([]);
                            setSelectedCategory(null);
                            setLoader(false);
                            setInputValue("");
                          }}
                        >
                          {item.topic}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No topics found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicList;
