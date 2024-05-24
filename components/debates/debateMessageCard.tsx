import React, { useEffect, useState } from "react";
import { timeAgo } from "@/constants/default";
import ShowMarkdown from "../showMarkdown";
import { ClaudeIcon, HeartIcon, MessageCircleIcon, OpenAiIcon } from "../svg";
import { Separator } from "@radix-ui/react-separator";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import {
  getPostLikeStatus,
  setPostLikes,
} from "@/lib/helper/edgedb/postLikeManager";
import { signIn, useSession } from "next-auth/react";
import TextToSpeechButton from "../textToSpeech";
import { useParams, useSearchParams } from "next/navigation";
import useHideAudio from "@/lib/helper/useHideAudio";

const comments = [
  { id: 1, user: "User 1", comment: "Great point!", time: "2 hours ago" },
  {
    id: 2,
    user: "User 2",
    comment: "I disagree with this.",
    time: "1 day ago",
  },
  {
    id: 3,
    user: "User 3",
    comment: "Could you provide more details?",
    time: "3 days ago",
  },
  {
    id: 3,
    user: "User 3",
    comment: "Could you provide more details?",
    time: "3 days ago",
  },
  {
    id: 3,
    user: "User 3",
    comment: "Could you provide more details?",
    time: "3 days ago",
  },
  {
    id: 3,
    user: "User 3",
    comment: "Could you provide more details?",
    time: "3 days ago",
  },
];

interface MessageProps {
  message: {
    conversation_id: string;
    message_id: string;
    sender: string;
    message_text: string;
    created_at: string;
  };
  senderType: string;
}

const MessageCard = ({ message, senderType }: MessageProps) => {
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const params = useParams();
  const { hideAudioinIphone } = useHideAudio();

  let userId = session?.user.id;
  let conversation_id = message.conversation_id;

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const likeStatus = await getPostLikeStatus({
        messageId: message.message_id,
      });
      setLiked(likeStatus.liked);
      setLikeCount(likeStatus.count);
    };

    if (message?.message_id) {
      fetchLikeStatus();
    }
  }, [message.message_id, userId]);

  const toggleLike = async () => {
    if (status === "unauthenticated") {
      return signIn("google", { callbackUrl: `/chat/${conversation_id}` });
    }

    const likeProps = {
      messageId: message.message_id,
      userId: userId!,
      conversationId: conversation_id,
    };

    const response = await setPostLikes(likeProps);
    if (response && response.liked) {
      setLiked(true);
      setLikeCount(response.count);
    } else {
      setLiked(false);
      setLikeCount(response.count);
    }
  };

  return (
    <div
      className={`lg:flex items-start max-w-7xl mx-auto gap-1 space-y-2 lg:space-y-0 lg:space-x-2 ${
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
          {hideAudioinIphone && (
            <TextToSpeechButton
              content={message.message_text}
              senderType={senderType}
            />
          )}
          <ShowMarkdown content={message.message_text} />

          {params.id && (
            <>
              <Separator className="text-gray-500" />
              <div className="border-t border-gray-300 mt-4 pt-4 flex items-center gap-x-3 md:space-x-2 dark:border-gray-600">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={toggleLike}
                >
                  <HeartIcon
                    className="h-5 w-5 text-gray-400"
                    fillColor={liked ? "red" : "gray"}
                  />
                  <span className="text-sm flex gap-1">
                    {likeCount} <span className="md:block hidden">likes</span>
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <MessageCircleIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm flex gap-1">
                        23 <span className="md:block hidden">comments</span>
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="space-y-4">
                      <DialogTitle className="flex text-left justify-start">
                        Comments
                      </DialogTitle>
                    </DialogHeader>

                    <div className="w-full">
                      <div className="mt-2 h-[300px] overflow-y-auto space-y-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-4 bg-gray-100 rounded-lg flex w-full items-start gap-4"
                          >
                            <Avatar className="bg-white">
                              <AvatarImage
                                alt={`@${comment.user}`}
                                src="/placeholder-user.jpg"
                              />
                              <AvatarFallback>{comment.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1 w-full">
                              <h3 className="font-semibold">{comment.user}</h3>
                              <p className="text-sm text-gray-600">
                                {comment.comment}
                              </p>
                              <div className="flex justify-end pt-2 text-sm font-medium">
                                <p className="">{comment.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <DialogFooter>
                          <div className="flex w-full flex-col justify-end mt-2 space-y-2 gap-5">
                            <Textarea placeholder="Leave a comment..." />
                            <div className="flex justify-end">
                              <Button className="w-full max-w-[10rem]">
                                Post
                              </Button>
                            </div>
                          </div>
                        </DialogFooter>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
        <p className="text-sm text-gray-800 pt-2 flex justify-end">
          {timeAgo(message?.created_at!)}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
