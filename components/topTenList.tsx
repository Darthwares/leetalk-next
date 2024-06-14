import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTopTenConversations } from "@/lib/helper/edgedb/setConversations";
import { PauseIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

interface Conversation {
  topic: string;
  viewCount: number;
  conversation_id: string;
  imageURL: string;
}

const TopTenList: React.FC = () => {
  const [topConversations, setTopConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchTopConversations = async () => {
      try {
        const resp = await getTopTenConversations();
        setTopConversations(resp);
      } catch (error) {
        console.error("Failed to fetch top conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopConversations();
  }, []);

  if (loading) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top 10 Debates - Today</h2>
      <div className="relative">
        <Carousel opts={{ align: "start" }} className="relative w-full">
          <CarouselPrevious className="absolute lg:-left-12 left-0 top-[6.5rem] transform -translate-y-1/2" />
          <CarouselContent className="flex items-start gap-3 py-2 px-2">
            {topConversations.map((item, index) => (
              <div
                key={item.conversation_id}
                className="relative flex-shrink-0"
              >
                <Card className="w-80 h-full shadow-lg rounded-md">
                  <CardHeader
                    className="relative flex justify-center items-center h-40 bg-cover bg-center rounded-t-md"
                    style={{ backgroundImage: `url(${item.imageURL})` }}
                  >
                    <div className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold bg-white text-black">
                      {index + 1}
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center p-4 gap-5">
                    <Link href={`/chat/${item.conversation_id}`} className="font-bold text-sm text-left line-clamp-1">
                      {item.topic}
                    </Link>
                    {/* <button className="flex items-center text-white bg-slate-600 p-2 rounded-full shadow-md hover:bg-slate-700">
                      {currentPlayingId === item.conversation_id &&
                      isPlaying ? (
                        <PauseIcon className="h-6 w-6" />
                      ) : (
                        <PlayIcon className="h-6 w-6" />
                      )}
                    </button> */}
                  </CardContent>
                </Card>
              </div>
            ))}
          </CarouselContent>
          <CarouselNext className="absolute right-0 lg:-right-12 top-[6.5rem] transform -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};

export default TopTenList;
