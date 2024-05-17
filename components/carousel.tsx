import * as React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { PauseIcon, PlayIcon } from './svg';
import { Button } from './ui/button';
import { responsive } from '@/constants/default';

interface CarouselProps {
  items: any;
}

export function CarouselDemo({ items }: CarouselProps) {
  return (
    <div className="">
      <div className="py-10 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Featured Debates
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Explore the hottest debates and join the conversation.
        </p>
      </div>
      <Carousel responsive={responsive} className="space-x-4" itemClass="px-2">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className={` min-h-80 w-full items-start p-8 rounded-lg`}
            style={{
              background: "linear-gradient(45deg, #2B4162, #000000)",
              backgroundSize: "400% 400%",
            }}
          >
            <h2 className="text-2xl h-[60px] text-white line-clamp-2 font-bold">
              {item.title}
            </h2>
            <div className="flex items-center w-full pb-2 overflow-x-auto space-x-2 mt-4">
              {item.tags.map((tag: any, id: number) => (
                <span
                  key={id}
                  className="bg-black text-white whitespace-nowrap rounded-xl px-3 py-1 text-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="w-full relative -bottom-12">
              <div className="flex justify-between w-full items-center mt-4">
                <span className="text-sm text-white">
                  {item.date} | {item.duration}
                </span>
                <div>
                  <Button className="p-0" variant="ghost">
                    <PlayIcon className="h-6 w-6 text-white" />
                  </Button>
                  <Button className="p-0" variant="ghost">
                    <PauseIcon className="h-6 w-6 text-white" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
                <div
                  className="bg-[#0033CC] h-1.5 rounded-full"
                  style={{
                    width: item.progress,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-white mt-1">
                <span>00:00</span>
                <span>1:00:02</span>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
