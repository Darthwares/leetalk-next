'use client';
import ShowMarkdown from './showMarkdown';
import { processMessages } from '@/constants/default';
import MessageCard from './debates/debateMessageCard';
import {
  conversationIdState,
  loaderState,
  messagesState,
  showDebateInputBoxState,
  waitingMessageState,
} from '@/state/state';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { publishConversation } from '@/lib/helper/edgedb/getCategoryList';
import Link from 'next/link';
export default function ShowChats() {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [waitingMessage] = useRecoilState(waitingMessageState);
  const [loader] = useRecoilState(loaderState);
  const setShowDebateInputBox = useSetRecoilState(showDebateInputBoxState);
  const [messages, setMessagesList] = useRecoilState(messagesState);
  const messageList = processMessages(messages);
  const [id] = useRecoilState(conversationIdState);
  console.log('messages', id, messages);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageList]);
  return (
    <div
      className={`${
        messages?.length > 0 && 'bg-gray-100'
      } bg-white flex flex-col py-10 rounded-lg`}
    >
      {messages?.length > 0 && (
        <div className="flex justify-end">
          <Button
            className="max-w-fit flex gap-2 py-3"
            onClick={() => {
              setMessagesList([]);
              setShowDebateInputBox(true);
            }}
          >
            Start new debate
          </Button>
        </div>
      )}
      {/* add a lottie and refine UI*/}
      {loader && <>AI is Debating for you!</>}
      {/* refine UI */}
      {!loader && messages.length > 0 && (
        <Button>
          <a href={`/chat/${id}`}>Click to view your debate</a>
        </Button>
      )}
      {/* if !loader then show a lottie and message */}
      {/* not required  */}
      {/* {messages.length > 0 ? (
        <div className="flex-grow overflow-y-auto py-4 space-y-8">
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
          <div className="flex justify-end w-full">
            <Link
              href={"/my-debates"}
              className="max-w-fit flex gap-2 py-3"
              onClick={async () => {
                // setMessagesList([]);
                // setShowDebateInputBox(true);
                await publishConversation(id);
              }}
            >
              <Button>Publish Debate</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-w-lg mx-auto w-full justify-center items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">{waitingMessage}</h1>
          <img
            className="h-full sm:h-[19.5rem] w-full"
            src="/debate.png"
            alt="debate-image"
          />
        </div>
      )} */}
    </div>
  );
}
