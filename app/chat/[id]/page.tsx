"use client";

import { useEffect } from "react";
import ShowMarkdown from "@/components/showMarkdown";
import { messagesState, singleTopicState } from "@/state/state";
import { useRecoilState } from "recoil";
import useSingleDebateMessage from "@/lib/helper/useSingleDebateMessage";
import MessageCard from "@/components/debates/debateMessageCard";
import { processMessages } from "@/constants/default";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/components/svg";
import useSingleTopics from "@/lib/helper/useSingleTopic";
import Link from "next/link";
import Loading from "@/components/loading";

const ShowSingleChats = ({ params }: { params: { id: string } }) => {
  const [messageList, setMessageList] = useRecoilState(messagesState);
  const [debateTopic, setDebateTopic] = useRecoilState(singleTopicState);
  const { fetchDebates } = useSingleDebateMessage();
  const { fetchSingleDebateTopic } = useSingleTopics();

  async function getDebates() {
    const  debate  = await fetchDebates(params.id);
    setMessageList(debate!);
  }
  async function getSpecificDebateTopic() {
    const topic = await fetchSingleDebateTopic(params.id);
    if(!topic) return
    setDebateTopic(topic!);
  }

  useEffect(() => {
    getDebates();

    getSpecificDebateTopic()

    return () => {
      setMessageList([]);
      setDebateTopic({
        topic: '',
        created_at: '',
        updated_at: '',
        conversation_id: '',
      });
    };
  }, [params.id]);

  const messages = processMessages(messageList);

  return (
    <>
      {messages?.remainingMessages.length! > 0 ? (
      <div className="flex flex-col w-full mx-auto p-4 md:p-6 bg-white shadow rounded-lg rounded-t-none">
        <div className="flex lg:flex-row flex-col pb-10 lg:pb-0 items-center justify-between w-full">
          {debateTopic?.topic && (
            <div className="mx-auto w-full py-5">
              <h2 className="font-extrabold text-4xl"> Debate Topic </h2>
              <h3 className="text-2xl py-5 font-bold">{debateTopic?.topic}</h3>
            </div>
          )}
          <div className="flex justify-end">
            <Link href="/">
              <Button
                className="max-w-fit flex gap-2 py-3"
                onClick={(e) => {
                  // e.preventDefault();
                }}
              >
                Start new debate
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-gray-100 flex flex-col py-10 rounded-lg">
          <div className="flex-grow overflow-y-auto p-4 space-y-8">
            {messages.remainingMessages?.map((message, id) => {
              return (
                <MessageCard
                  key={id}
                  message={message}
                  senderType={message.sender}
                />
              );
            })}
            {messages.conclusion && (
              <div className="bg-green-100">
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">Conclusion:</h3>
                  <ShowMarkdown content={messages.conclusion} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="mb-4 w-full">
            <Button className="w-full flex gap-2 py-3">
              <span className="text-lg">Listen </span>
              <PlayIcon />
            </Button>
          </div>
        </div>
      </div>
      ):<Loading />}
    </>
  );
};

export default ShowSingleChats;
