"use client";

import { BentoGridItem } from "@/components/ui/bento-grid";
import { topDebates } from "@/constants/default";
import { debateListState } from "@/state/state";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";

const Page: React.FC = () => {
  const [updatedState] = useRecoilState(debateListState);

  const debates = updatedState.length ? updatedState : topDebates;

  console.log("updatedState", updatedState);

  return (
    <div className="p-5 max-w-7xl w-full space-y-8">
      <div className="space-y-3 text-center">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pt-5 space-y-3">
          <h2>Top Debates</h2>
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            Exclusively customised for you
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 w-max place-content-center py-2">
          {debates.map((debate, index) => (
            <Link key={index} href={`/chat/${debate.id}`}>
              <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden p-4 flex flex-col items-start w-72">
                <img
                  src={debate.imageUrl}
                  alt={debate.title}
                  className="w-full h-64 object-cover mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                  {debate.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Date Added: {debate.dateAdded}
                </p>
                <p className="text-sm text-gray-500">Time: {debate.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="py-5">
          <h2 className="text-2xl font-bold">{"Made for You"}</h2>
          <p className="text-sm text-gray-600">
            {"Your personal playlists. Updated daily."}
          </p>
        </div>
        <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-2 px-2 md:px-0 lg:grid-cols-4 gap-4 mx-auto">
          {topDebates.slice(0, 7).map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              image={item.imageUrl}
              className={""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
