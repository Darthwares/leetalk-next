import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const topTenData = [
  {
    title: "Santar",
    imageUrl: "/debate.png",
    rank: 1,
  },
  {
    title: "The Legend of Hanuman",
    imageUrl: "/debate.png",
    rank: 2,
  },
  {
    title: "Mangal Pandey Boys",
    imageUrl: "/debate.png",
    rank: 3,
  },
  {
    title: "Crakk",
    imageUrl: "/debate.png",
    rank: 4,
  },
  {
    title: "Baahubali",
    imageUrl: "/debate.png",
    rank: 5,
  },
  {
    title: "12th Fail",
    imageUrl: "/debate.png",
    rank: 6,
  },
  {
    title: "Sample Movie",
    imageUrl: "/debate.png",
    rank: 7,
  },
];

const TopTenList: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top 10 Debates - Today</h2>
      <div className="relative">
        <Carousel opts={{ align: "start" }} className="relative w-full">
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer" />
          <CarouselContent className="flex items-start gap-3 overflow-x-auto">
            {topTenData.map((item) => (
              <div key={item.rank} className="relative w-40 sm:w-48 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute top-2 left-2 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
                  {item.rank}
                </div>
                <div className="text-sm sm:text-lg">
                  {item.title}
                </div>
              </div>
            ))}
          </CarouselContent>
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer" />
        </Carousel>
      </div>
    </div>
  );
};

export default TopTenList;
