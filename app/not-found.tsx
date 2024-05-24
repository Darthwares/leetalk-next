"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const Custom404 = () => {
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <>
      <section className="flex items-center p-3 md:p-16 h-[calc(100vh-64px)] dark:bg-gray-900">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-7xl text-center flex flex-col lg:flex-row items-center gap-10 md:gap-20">
            <div className="h-[18rem] md:h-[40rem] w-full">
              <lottie-player
                src="/error-404.json"
                background=""
                speed="1"
                loop
                autoplay
                className="bg-gradient-to-r from-indigo-100 to-pink-200"
              ></lottie-player>
            </div>
            <div className="w-full">
              <p className="text-2xl font-semibold md:text-2xl">Not Found</p>
              <p className="mt-4 mb-8 ">
                Page You are looking for does not exist
              </p>
              <Link href="/">
                <Button  className="">
                  Go back to home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Custom404;
