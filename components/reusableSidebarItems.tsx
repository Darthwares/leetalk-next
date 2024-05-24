"use client";

import { formatDateAndTime } from "@/constants/default";
import { debateListState } from "@/state/state";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ReusableSidebarItems: React.FC = () => {
  const [updatedState] = useRecoilState(debateListState);

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  return (
    <div className="sm:p-5 max-w-7xl w-full space-y-8">
      {updatedState.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 py-10 lg:grid-cols-3 gap-4">
          {updatedState.map((debate, index) => (
            <Link key={index} href={`/chat/${debate.id}`}>
              <div className="row-span-1 cursor-pointer rounded-xl h-full group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-gray-300 gap-2 p-4 flex flex-col space-y-4">
                <Image
                  src={debate.imageUrl}
                  alt="categories image"
                  width={200}
                  height={200}
                  className="w-full aspect-square h-44 object-cover rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"
                />
                <div className="group-hover/bento:translate-x-2 space-y-2 transition duration-200">
                  <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
                    {debate.title}
                  </div>
                  <p className="text-sm text-gray-500">
                    Added: {formatDateAndTime(debate.dateAdded)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <p className="text-center text-xl text-gray-500">
            No debates recorded yet. Please check back later.
          </p>
          <div className="flex justify-center">
            <Link href="/debate">
              <Button className="max-w-fit flex gap-2 py-3">
                Start new debate
              </Button>
            </Link>
          </div>
          <div className="w-full pt-10">
            <div className="h-72 lg:h-96">
              <lottie-player
                src="/startDebate1.json"
                background="white"
                speed={1}
                loop
                autoplay
                data-testid="lottie"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReusableSidebarItems;
