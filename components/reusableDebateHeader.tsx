"use client";

import { ShareIcon, TagIcon } from "lucide-react";
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

type DebateHeaderProps = {
  topic: string;
  handleShare: () => void;
  path: string;
  text: string;
  category: string;
  count?: number;
};

const DebateHeader: React.FC<DebateHeaderProps> = React.memo(
  ({ topic, path, text, category, handleShare, count }) => {
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
      <div className="w-full flex flex-col lg:flex-row items-center justify-between pb-10 lg:pb-0">
        {topic && (
          <div className="mx-auto w-full py-5">
            <h2 className="font-extrabold text-4xl">Debate Topic</h2>
            <div>
              <h3 className="text-2xl py-5 font-bold">{topic}</h3>
              <div className="flex gap-3">
                <div
                  className="flex items-center cursor-pointer space-x-1 border border-gray-200 bg-slate-50 p-2 rounded-md"
                  onClick={handleShare}
                  role="button"
                  aria-label="Share"
                >
                  <ShareIcon className="h-5 w-5 text-gray-400 " />
                  <span className="text-sm">Share</span>
                </div>
                <Link
                  href={`/categories?query=${category}`}
                  className="flex items-center space-x-1 border border-gray-200 bg-slate-50 p-2 rounded-md"
                  aria-label={category}
                >
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{category}</span>
                </Link>
                {count && (
                  <div className="flex border border-gray-200 bg-slate-50 p-2 rounded-md items-center space-x-1">
                    <span className="text-sm">{renderViewCount(count)}</span>
                  </div>
                )}
              </div>
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
        )}
      </div>
    );
  }
);

DebateHeader.displayName = "DebateHeader";

export default DebateHeader;
