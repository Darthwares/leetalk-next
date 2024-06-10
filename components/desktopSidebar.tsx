"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categoryPage } from "@/constants/default";
import { classNames } from "@/lib/utils";
import getCategoryList from "@/lib/helper/edgedb/getCategoryList";
import {
  debateCategoryState,
  debateListState,
  loaderState,
  messagesState,
  showTopicState,
} from "@/state/state";
import { useSetRecoilState } from "recoil";
import { SpeechIcon } from "lucide-react";
import TopicList from "./topicList";
import Image from "next/image";

const DesktopSidebar = () => {
  const params = useSearchParams();
  const query = params.get("query");
  const setUpdatedState = useSetRecoilState(debateListState);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const setMessagesList = useSetRecoilState(messagesState);
  const setSelectedCategory = useSetRecoilState(debateCategoryState);
  const setLoader = useSetRecoilState(loaderState);
  const setInputValue = useSetRecoilState(showTopicState);

  const fetchAndFormatDebates = async (category: string) => {
    const list = await getCategoryList(category);
    return list.map((debate: any) => ({
      title: debate.topic,
      dateAdded: new Date(debate.created_at).toLocaleDateString(),
      id: debate.conversation_id,
      time: new Date(debate.created_at).toLocaleTimeString(),
      imageUrl: debate.imageURL,
    }));
  };

  useEffect(() => {
    if (query && categoryPage.some((item) => item.name === query)) {
      setActiveCategory(query);
      fetchAndFormatDebates(query).then((formattedList) => {
        setUpdatedState(formattedList);
      });
    }
  }, [query]);

  const handleDebates = async (category: string) => {
    setActiveCategory(category);
    const formattedList = await fetchAndFormatDebates(category);
    setUpdatedState(formattedList);
  };

  return (
    <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div className="flex h-16 pb-2 sticky top-0 z-20 border-r-2 border-gray-300 -pr-5 shrink-0 items-center">
        <Link
          href="/"
          onClick={() => {
            setMessagesList([]);
            setSelectedCategory(null);
            setInputValue("");
            setLoader(false);
          }}
          className="flex items-center cursor-pointer px-5 gap-2 font-semibold"
        >
          {/* <SpeechIcon className="h-6 w-6" /> */}
          <Image
            src={"/logo2.png"}
            width={25}
            height={25}
            alt="debat.ai logo"
          />
          <span>Debat.ai</span>
          {/* <span>Debate Anything</span> */}
        </Link>
      </div>
      <div className="w-full py-5 px-2">
        <h2 className="bg-gray-800 text-white text-center rounded-md py-2">
          All Categories
        </h2>
      </div>
      <div className="flex grow pt-5 flex-col gap-y-5 overflow-y-auto bg-gray-100 px-4 ring-1 ring-white/5">
        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-7">
            <div>
              <ul className="-mx-2 space-y-1">
                {categoryPage.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/categories?query=${item.name}`}
                      className={classNames(
                        activeCategory === item.name
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 cursor-pointer rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                      onClick={() => {
                        handleDebates(item.name);
                        setMessagesList([]);
                        // setAudioPlayer(false);
                        setSelectedCategory(null);
                        setLoader(false);
                        setInputValue("");
                      }}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="-mx-2">
              <TopicList />
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default DesktopSidebar;
