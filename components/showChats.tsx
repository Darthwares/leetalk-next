"use client";

import ShowMarkdown from "./showMarkdown";
import { processMessages } from "@/constants/default";
import useDebateMessages from "@/lib/helper/useDebateMessages";
import MessageCard from "./debates/debateMessageCard";
import {
  loaderState,
  messagesState,
  showDebateInputBoxState,
  waitingMessageState,
} from "@/state/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { io } from "socket.io-client";
import { Message } from "@/types/types";

const socket = io("http://localhost:5555");
const socketProd = io("leettalk-server.vercel.app", {
  transports: ["websocket"],
  path: "/socket.io",
  secure: true,
  reconnection: true,
  reconnectionAttempts: 5,
});

export default function ShowChats() {
  // const { messages } = useDebateMessages();
  const [loader] = useRecoilState(loaderState);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [waitingMessage] = useRecoilState(waitingMessageState);
  const setShowDebateInputBox = useSetRecoilState(showDebateInputBoxState);
  const [messages, setMessagesList] = useRecoilState(messagesState);
  const messageList = processMessages(messages);

  console.log("messages", messages);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  useEffect(() => {
    const handleMessage = (messageData: Message) => {
      console.log("Received message:", messageData);
      setMessagesList((prevMessages) => [...prevMessages, messageData]);
    };

    socketProd.on("message", handleMessage);

    return () => {
      socketProd.off("message", handleMessage);
    };
  }, []);

  return (
    <div
      className={`${
        messages?.length > 0 && "bg-gray-100"
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

      {messages.length > 0 ? (
        <div className="flex-grow overflow-y-auto p-4 space-y-8">
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
          {loader && (
            <p className="text-3xl text-gray-900 font-extrabold">
              AI is thinking
            </p>
          )}

          {messageList.conclusion && (
            <div className="bg-green-100">
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-bold">Conclusion:</h3>
                <ShowMarkdown content={messageList.conclusion} />
              </div>
            </div>
          )}

          <div className="flex justify-end w-full">
            <Button
              className="max-w-fit flex gap-2 py-3"
              onClick={() => {
                setMessagesList([]);
                setShowDebateInputBox(true);
              }}
            >
              Continue debate
            </Button>
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
      )}
    </div>
  );
}
