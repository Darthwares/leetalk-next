"use client";

import { BarChart2, CalendarIcon, ShareIcon, TagIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import {
  debateCategoryState,
  loaderState,
  messagesState,
  showTopicState,
} from "@/state/state";
import TimeFormatter from "./timeFormatter";

type DebateHeaderProps = {
  topic: string;
  handleShare: () => void;
  path: string;
  text: string;
  category: string;
  createdAt?: string;
  count?: number;
};

const DebateHeader: React.FC<DebateHeaderProps> = React.memo(
  ({ topic, path, text, category, handleShare, count, createdAt }) => {
    const setMessagesList = useSetRecoilState(messagesState);
    const setSelectedCategory = useSetRecoilState(debateCategoryState);
    const setLoader = useSetRecoilState(loaderState);
    const setInputValue = useSetRecoilState(showTopicState);

    const handleButtonClick = () => {
      if (text === "Start new debate") {
        setMessagesList([]);
        setSelectedCategory(null);
        setLoader(false);
        setInputValue("");
      }
    };

    const renderViewCount = (count?: number) => {
      if (count === undefined) return null;
      if (count === 0) return "No views yet";
      if (count === 1) return "1 view";
      return `${count} views`;
    };

    return (
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        {topic && (
          <div className="mx-auto w-full py-5 ">
            <h3 className="font-extrabold text-4xl">Debate Topic</h3>
            <h3 className="text-2xl py-5 font-bold">Q:{" "}{topic}</h3>
            <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center items-start   w-full gap-4">
                <div
                  className="flex items-center space-x-2 cursor-pointer max-w-fit"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </div>
                <Link
                  href={`/categories?query=${category}`}
                  aria-label={category}
                >
                  <div className="flex items-center space-x-2 max-w-fit">
                    <TagIcon className="h-4 w-4" />
                    <span>{category}</span>
                  </div>
                </Link>
               {location.pathname !== "/debate" && <div className="flex items-center space-x-2 max-w-fit">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    <TimeFormatter dateString={createdAt!} />
                  </span>
                </div>}
                {count !== undefined && (
                  <div className="flex items-center space-x-2 max-w-fit">
                    <BarChart2 className="h-4 w-4" />
                    <span>{renderViewCount(count + 1)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-5 md:pt-0">
                <Button
                  className="max-w-fit flex gap-2 py-3"
                  onClick={handleButtonClick}
                >
                  <Link href={path} passHref>
                    {text}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DebateHeader.displayName = "DebateHeader";

export default DebateHeader;
