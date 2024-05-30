"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import getList from "@/lib/helper/edgedb/dbClient";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  debateCategoryState,
  loaderState,
  messagesState,
  showTopicState,
  topicListState,
} from "@/state/state";
import { Conversations } from "@/types/types";

interface TopicListProps {
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}
const TopicList = ({ setSidebarOpen }: TopicListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topics, setTopics] = useRecoilState(topicListState);
  const setMessagesList = useSetRecoilState(messagesState);
  const setSelectedCategory = useSetRecoilState(debateCategoryState);
  const setLoader = useSetRecoilState(loaderState);
  const setInputValue = useSetRecoilState(showTopicState);

  useEffect(() => {
    async function getBlogList() {
      const data = await getList();
      setTopics(data as Conversations[]);
    }
    getBlogList();
  }, []);

  const filteredTopics = useMemo(() => {
    return topics?.filter((topic: any) =>
      topic?.topic?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, topics]);

  return (
    <div className="flex flex-col w-full pb-10 h-full space-y-3 bg-white p-2 rounded-lg">
      <h2 className="bg-gray-800 text-white text-center rounded-md p-2">
        Topic Suggestions
      </h2>
      <div className="flex flex-col mb-4">
        <Input
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        {filteredTopics!?.length > 0 ? (
          <div className="space-y-2">
            {filteredTopics?.map((item, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg">
                <Link
                  href={`/chat/${item.conversation_id}`}
                  className="line-clamp-2 hover:line-clamp-none delay-200 translate-x-0 duration-150"
                  onClick={() => {
                    setSidebarOpen && setSidebarOpen(false);
                    setMessagesList([]);
                    setSelectedCategory(null);
                    setLoader(false);
                    setInputValue("");
                  }}
                >
                  {item.topic}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No topics found.</div>
        )}
      </div>
    </div>
  );
};

export default TopicList;
