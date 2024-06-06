"use client";

import ShowMarkdown from "./showMarkdown";
import { processMessages } from "@/constants/default";
import MessageCard from "./debates/debateMessageCard";
import {
  conversationIdState,
  currentAudioIndexState,
  debateCategoryState,
  loaderState,
  messagesState,
  playFullAudioState,
  showPublishState,
  showTopicState,
} from "@/state/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { publishConversation } from "@/lib/helper/edgedb/getCategoryList";
import Link from "next/link";
import DebateHeader from "./reusableDebateHeader";
import { handleShare } from "@/lib/helper/handleShare";
import TextToSpeechButton from "./textToSpeech";

export default function ShowChats() {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useRecoilState(messagesState);
  const [id] = useRecoilState(conversationIdState);
  const [publishState, setPublishState] = useRecoilState(showPublishState);
  const [inputValue] = useRecoilState(showTopicState);
  const setCurrentMusicIndex = useSetRecoilState(currentAudioIndexState);
  const [playFullAudio] = useRecoilState(playFullAudioState);
  const [currentIndex] = useRecoilState(currentAudioIndexState);
  const [loader, setLoader] = useRecoilState(loaderState);
  const [activeCategory, setSelectedCategory] =
    useRecoilState(debateCategoryState);

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === "system"
    ) {
      setPublishState(true);
    } else {
      setPublishState(false);
    }
  }, [messages, setPublishState]);

  const processedMessages = processMessages(messages);

  useEffect(() => {
    if (playFullAudio) {
      setCurrentMusicIndex(currentIndex);
    }
  }, [playFullAudio, currentIndex]);

  return (
    <div
      className={`${
        messages?.length > 0 && "bg-gray-100"
      } bg-white flex flex-col py-5 rounded-lg`}
    >
      {loader && messages.length === 0 && (
        <>
          <div className="flex justify-center">
            <h2 className="py-2 leading-none tracking-tight text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              {" "}
              AI is Debating for you!
            </h2>
          </div>
          <div className="w-full">
            <div className="h-72 lg:h-96">
              <lottie-player
                src="/ai-debating.json"
                background="white"
                speed={1}
                loop
                autoplay
                data-testid="lottie"
              />
            </div>
          </div>
        </>
      )}

      {processedMessages.remainingMessages.length > 0 && (
        <div className="flex-grow overflow-y-auto py-4 space-y-8">
          <DebateHeader
            topic={inputValue}
            path={"/my-debates"}
            text={"See all debates"}
            handleShare={() =>
              handleShare(
                "Check this out!",
                "I found this interesting:",
                document.location.href
              )
            }
            category={activeCategory!}
          />

          {processedMessages.remainingMessages?.map((message, id) => {
            return (
              <MessageCard
                key={id}
                message={message}
                senderType={message.sender}
                index={id}
              />
            );
          })}
          <div ref={messageRef} />
          {processedMessages?.conclusion && (
            <div className="bg-green-100 p-4 space-y-2">
              <h3 className="text-xl font-bold">Conclusion:</h3>
              <TextToSpeechButton
                senderType={messages[messages.length - 1].sender}
                index={messages.length - 1}
                audioURL={messages[messages.length - 1].audio_url}
              />
              <ShowMarkdown content={processedMessages?.conclusion} />
            </div>
          )}
        </div>
      )}
      {publishState && (
        <div className="fixed bottom-0 gap-5 left-0 w-full bg-white shadow-lg px-4 flex justify-end">
          <Link
            href={"/my-debates"}
            className="max-w-fit flex gap-2 py-1"
            onClick={async () => {
              setMessages([]);
              setSelectedCategory(null);
              setLoader(false);
              await publishConversation(id);
            }}
          >
            <Button>Publish Debate</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
