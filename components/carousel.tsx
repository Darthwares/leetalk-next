import * as React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { PauseIcon, PlayIcon } from "./svg";
import { responsive } from "@/constants/default";
import { FirstConversation, getAllDebates } from "@/lib/helper/edgedb/dbClient";
import TextToSpeechButton from "./textToSpeech";
import { Button } from "./ui/button";
import Link from "next/link";

interface CarouselProps {
  items: any;
}

const placeholderData: FirstConversation[] = [
  {
    conversation_id: "placeholder-1",
    user_id: "user-1",
    topic: "The Benefits of Online Learning in Modern Education",
    created_at: new Date().toISOString(),
    category: "Education",
    published: true,
    first_message: {
      message_text:
        "Online learning provides flexibility and accessibility to students from diverse backgrounds.",
      sender: "Education",
    },
  },
  {
    conversation_id: "placeholder-2",
    user_id: "user-2",
    topic: "The Impact of Sports on Youth Development",
    created_at: new Date().toISOString(),
    category: "Sports",
    published: true,
    first_message: {
      message_text:
        "Engaging in sports can significantly enhance physical and mental health in young individuals.",
      sender: "Sports",
    },
  },
  {
    conversation_id: "placeholder-3",
    user_id: "user-3",
    topic: "Uncovering the Mysteries of Ancient Civilizations",
    created_at: new Date().toISOString(),
    category: "History",
    published: true,
    first_message: {
      message_text:
        "Studying ancient civilizations helps us understand the cultural and technological advancements of the past.",
      sender: "Historical",
    },
  },
];

export function CarouselDemo({ items }: CarouselProps) {
  const [topics, setTopics] =
    React.useState<FirstConversation[]>(placeholderData);
  const [isPlaceholder, setIsPlaceholder] = React.useState(true);

  React.useEffect(() => {
    async function getDebatesList() {
      const data = await getAllDebates();
      if (data.length > 0) {
        setTopics(data);
        setIsPlaceholder(false);
      }
    }
    getDebatesList();
  }, []);

  return (
    <div className="">
      <div className="py-5 space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Featured{' '}
          <span className="text-gray-600 text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            Debates
          </span>
        </h2>

        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Explore the hottest debates and join the conversation.
        </p>
      </div>
      <Carousel responsive={responsive} className="space-x-4" itemClass="px-2">
        {topics.map((item, idx) => (
          <div
            key={idx}
            className={` ${
              !isPlaceholder && item.first_message
                ? 'md:min-h-72'
                : 'md:min-h-40'
            }  h-full w-full items-start p-4 md:p-8  rounded-lg space-y-4`}
            style={{
              background: 'linear-gradient(45deg, #2B4162, #000000)',
              backgroundSize: '400% 400%',
            }}
          >
            <Link href={`/chat/${item.conversation_id}`}>
              <h2 className="text-2xl h-[60px] text-white line-clamp-2 font-bold">
                {item.topic}
              </h2>
            </Link>
            <p className="text-sm line-clamp-2 text-white">
              {item.first_message?.message_text}
            </p>
            <div className="flex items-center justify-between w-full">
              {item.category && (
                <p className="text-sm text-slate-50 font-bold cursor-pointer p-2 bg-slate-900 rounded-md max-w-fit">
                  {item.category}
                </p>
              )}
              <div className="flex justify-end w-full items-center">
                <span className="text-sm text-white">
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            {!isPlaceholder && item.first_message && (
              <div className="w-full">
                <div className="w-full">
                  <TextToSpeechButton
                    content={item.first_message.message_text}
                    senderType={'claudeDebater'}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
