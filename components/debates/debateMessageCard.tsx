import React from "react";
import { formatDate } from "@/constants/default";
import ShowMarkdown from "../showMarkdown";
import { ClaudeIcon, OpenAiIcon } from "../svg";
import { loaderState } from "@/state/state";
import { useRecoilState } from "recoil";

interface MessageProps {
  message: {
    message_text: string;
    sender: string;
    timestamp: string;
  };
  senderType: string;
}

const MessageCard: React.FC<MessageProps> = ({ message, senderType }) => {
  const [loader] = useRecoilState(loaderState);

  return (
    <div
      className={`lg:flex items-start gap-1 space-y-2 lg:space-y-0 lg:space-x-2 ${
        senderType === "claudeDebater" ? "justify-end" : ""
      }`}
    >
      <div className="flex gap-2 max-w-fit items-center">
        {senderType === "openAIDebater" && <OpenAiIcon />}
        <h3
          className={`flex items-start font-bold capitalize lg:hidden space-x-2 ${
            senderType === "claudeDebater" ? "justify-end" : ""
          }`}
        >
          {senderType === "openAIDebater" && senderType}
        </h3>
      </div>
      <div>
        <div
          className={`${
            senderType === "claudeDebater" ? "justify-end pb-2" : ""
          } flex gap-2 justify-end`}
        >
          {senderType === "claudeDebater" && <ClaudeIcon />}
          <h3
            className={`flex items-start capitalize pb-2 font-bold space-x-2 ${
              senderType === "claudeDebater" ? "justify-end" : ""
            }`}
          >
            {senderType === "claudeDebater" && senderType}
          </h3>
        </div>
        {senderType === "openAIDebater" && (
          <h3 className="lg:block -mt-2 capitalize pb-2.5 hidden font-bold">
            {senderType}
          </h3>
        )}
        <div
          className={`rounded-lg p-4 lg:mt-1.5 shadow w-full max-w-full lg:max-w-[40rem] ${
            senderType === "claudeDebater"
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
        >
          <ShowMarkdown content={message.message_text} />
        </div>
        <p className="text-sm text-gray-800 pt-2 flex justify-end">
          {formatDate(message?.timestamp!)}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
