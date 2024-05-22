"use client";

import { debateListState } from "@/state/state";
import React, { Suspense } from "react";
import { useRecoilState } from "recoil";
import "react-multi-carousel/lib/styles.css";
import ReusableSidebarItems from "@/components/reusableSidebarItems";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CategoryContainer: React.FC = () => {
  const [updatedState] = useRecoilState(debateListState);

  return (
    <Suspense
      fallback={
        <div className="p-5 max-w-7xl w-full space-y-8">
          <div className="space-x-3 flex items-center ">
            <Link href={"/categories"} className="text-lg ">
              Category
            </Link>{" "}
            <span>{">"}</span>{" "}
            <span className="font-bold text-lg">Loading...</span>
          </div>
          <div className="space-y-3 text-center">
            <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pt-5 space-y-3">
              <h2>Loading...</h2>
            </div>
          </div>
          <ReusableSidebarItems />
        </div>
      }
    >
      <CategoryContainerWithSearchParams updatedState={updatedState} />
    </Suspense>
  );
};

const CategoryContainerWithSearchParams: React.FC<{
  updatedState: any[];
}> = ({ updatedState }) => {
  const params = useSearchParams();
  const selectedCategory = params.get("query");

  return (
    <div className="p-5 max-w-7xl w-full space-y-8">
      <div className="space-x-3 flex items-center ">
        <Link href={"/categories"} className="text-lg ">
          Category
        </Link>{" "}
        <span>{">"}</span>{" "}
        <span className="font-bold text-lg">{selectedCategory}</span>
      </div>
      <div className="space-y-3 text-center">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pt-5 space-y-3">
          <h2>{updatedState.length ? "Top Debates" : "No Debates Found"}</h2>
          {updatedState.length > 0 && (
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 tracking-normal to-pink-600">
              Exclusively customised for you
            </p>
          )}
        </div>
      </div>
      <ReusableSidebarItems />
    </div>
  );
};

export default CategoryContainer;