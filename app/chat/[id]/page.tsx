"use client";

import { useEffect } from "react";
import ShowMarkdown from "@/components/showMarkdown";
import MessageCard from "@/components/debates/debateMessageCard";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/components/svg";
import Link from "next/link";
import Loading from "@/components/loading";
import { useRecoilState } from "recoil";
import { loaderState, messagesState, singleTopicState } from "@/state/state";
import getSingleMessage from "@/lib/helper/edgedb/getSingleMessage";
import { processMessages } from "@/constants/default";
import getSingleTopic from "@/lib/helper/edgedb/getSingleTopic";
import { Conversations, Message } from "@/types/types";
import { ShareIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";

const ShowSingleChats = ({ params }: { params: { id: string } }) => {
  const [messages, setMessages] = useRecoilState(messagesState);
  const [topic, setTopic] = useRecoilState<any>(singleTopicState);
  const [loader] = useRecoilState<any>(loaderState);

  useEffect(() => {
    async function fetchData() {
      const [messageData, topicData] = await Promise.all([
        getSingleMessage(params.id),
        getSingleTopic(params.id),
      ]);
      setMessages(messageData as Message[]);
      setTopic((topicData as Conversations) || {});
    }

    fetchData();

    return () => {
      setMessages([]);
      setTopic({ topic: "", created_at: "", conversation_id: "" });
    };
  }, [params.id, setMessages, setTopic]);

  const processedMessages = processMessages(messages);

  if (messages.length === 0 && !loader) return <Loading />;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "I found this interesting:",
          url: document.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Share not supported on this platform");
    }
  };

  return (
    <>
      {processedMessages.remainingMessages && (
        <div className="flex flex-col w-full mx-auto p-4 md:p-6 bg-white shadow rounded-lg rounded-t-none">
          <div className="flex lg:flex-row flex-col pb-10 lg:pb-0 items-center justify-between w-full">
            {topic?.topic && (
              <div className="mx-auto w-full py-5">
                <h2 className="font-extrabold text-4xl">Debate Topic</h2>
                <div>
                  <h3 className="text-2xl py-5 font-bold">{topic.topic}</h3>

                  <div className="flex gap-2">
                    <div
                      className="flex items-center cursor-pointer space-x-1"
                      onClick={handleShare}
                    >
                      <ShareIcon className="h-5 w-5 text-gray-400" />

                      <span className="text-sm flex gap-1">
                        <span className="md:block hidden">Share</span>
                      </span>
                    </div>
                    <div className="flex items-center cursor-pointer space-x-1">
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm flex gap-1">
                        1.2k <span className="md:block hidden">views</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Link href="/debate">
                <Button className="max-w-fit flex gap-2 py-3">
                  Start new debate
                </Button>
              </Link>
            </div>
          </div>
          <div
            className={`${
              loader && "bg-gray-100"
            }  flex flex-col py-10 rounded-lg`}
          >
            <div className="flex-grow overflow-y-auto p-4 space-y-8">
              {processedMessages.remainingMessages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  senderType={message.sender}
                />
              ))}
              {processedMessages.conclusion && (
                <div className="bg-green-100 p-4 space-y-2">
                  <h3 className="text-xl font-bold">Conclusion:</h3>
                  <ShowMarkdown content={processedMessages.conclusion} />
                </div>
              )}
            </div>
          </div>
          {loader && (
            <div className="flex items-center justify-between mt-4">
              <Button className="w-full flex gap-2 py-3">
                <span className="text-lg">Listen </span>
                <PlayIcon />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShowSingleChats;
