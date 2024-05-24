"use client";
import ShowMarkdown from "./showMarkdown";
import { processMessages } from "@/constants/default";
import MessageCard from "./debates/debateMessageCard";
import {
  conversationIdState,
  debateCategoryState,
  loaderState,
  messagesState,
  showPublishState,
  showTopicState,
} from "@/state/state";
import { useRecoilState } from "recoil";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { publishConversation } from "@/lib/helper/edgedb/getCategoryList";
import Link from "next/link";
import DebateHeader from "./reusableDebateHeader";

export default function ShowChats() {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [loader] = useRecoilState(loaderState);
  const [messages, setMessagesList] = useRecoilState(messagesState);
  const messageList = processMessages(messages);
  const [id] = useRecoilState(conversationIdState);
  const [publishState, setPublishState] = useRecoilState(showPublishState);
  const [activeCategory] = useRecoilState(debateCategoryState);
  const [inputValue] = useRecoilState(showTopicState);

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "I found this interesting:",
          url: document.location.href,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Share not supported on this platform");
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

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
  // ai-debating
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
      {/* refine UI */}
      {/* {!loader && messages.length > 0 && (
        <div className="w-full flex sm:space-y-10 flex-col justify-center items-center">
          <h2 className="py-2 leading-none tracking-tight text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            {' '}
            Your Debate is ready.
          </h2>
          <div className="w-full">
            <div className="h-72 lg:h-96">
              <lottie-player
                src="/generated-success1.json"
                background="white"
                speed={1}
                loop
                autoplay
                data-testid="lottie"
              />
            </div>
          </div>
          <Button variant={'link'} className="max-w-fit text-lg font-bold hover:text-blue-600">
            <a href={`/chat/${id}`}>Click to view your debate</a>
          </Button>
        </div>
      )} */}
      {/* if !loader then show a lottie and message */}
      {/* not required  */}
      {
        messages.length > 0 && (
          <div className="flex-grow overflow-y-auto py-4 space-y-8">
            <DebateHeader
              topic={inputValue}
              path={"/my-debates"}
              text={"See all debates"}
              handleShare={handleShare}
              category={activeCategory!}
            />

            {messageList.remainingMessages?.map((message, id) => {
              return (
                <MessageCard
                  key={id}
                  message={message}
                  senderType={message.sender}
                />
              );
            })}
            <div ref={messageRef} />
            {messageList.conclusion && (
              <div className="bg-green-100">
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">Conclusion:</h3>
                  <ShowMarkdown content={messageList.conclusion} />
                </div>
              </div>
            )}
            {publishState && (
              <div className="fixed bottom-0 gap-5 left-0 w-full bg-white shadow-lg p-4 flex justify-end">
                <Link
                  href={"/my-debates"}
                  className="max-w-fit flex gap-2 py-3"
                  onClick={async () => {
                    setMessagesList([]);
                    // setShowDebateInputBox(true);
                    await publishConversation(id);
                  }}
                >
                  <Button>Publish Debate</Button>
                </Link>
              </div>
            )}
          </div>
        )
        // : (
        //   <div className="flex flex-col max-w-lg mx-auto w-full justify-center items-center">
        //     <h1 className="text-2xl sm:text-3xl font-bold">{waitingMessage}</h1>
        //     <img
        //       className="h-full sm:h-[19.5rem] w-full"
        //       src="/debate.png"
        //       alt="debate-image"
        //     />
        //   </div>
        // )
      }
    </div>
  );
}
