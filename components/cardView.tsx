import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlayIcon, PauseIcon } from "lucide-react";
import {
  FirstConversation,
  getDebatesWithCategory,
} from "@/lib/helper/edgedb/dbClient";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  showAudioPlayingState,
  showCurrentPlayingURL,
  singleTopicState,
  messagesState,
  currentAudioIndexState,
  playFullAudioState,
  isGlobalAudioPlayingState,
} from "@/state/state";
import { Message } from "@/types/types";
import Link from "next/link";
import Loading from "@/components/loading";
import { parseBlob } from "music-metadata-browser";
import TopTenList from "@/components/topTenList";

const calculateDuration = async (audioUrl: string) => {
  try {
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const metadata = await parseBlob(blob);
    return metadata.format.duration; // duration in seconds
  } catch (error) {
    console.error("Error fetching or parsing audio metadata:", error);
    return null;
  }
};

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
};

const DebateCarousel: React.FC<{
  title: string;
  debates: FirstConversation[];
  onPlay: (debate: FirstConversation) => void;
  currentPlayingId: string | null;
  isPlaying: boolean;
}> = ({ title, debates, onPlay, currentPlayingId, isPlaying }) => {
  const [durations, setDurations] = React.useState<any>({});
  const windowWidth = useWindowWidth();

  React.useEffect(() => {
    const fetchDurations = async () => {
      const newDurations: { [key: string]: number | null } = {};
      for (const debate of debates) {
        for (const message of debate.first_message!) {
          if (message.audio_url) {
            const duration = await calculateDuration(message.audio_url);
            newDurations[String(message.audio_url)] = duration || null;
          }
        }
      }
      setDurations(newDurations);
    };

    fetchDurations();
  }, [debates]);

  let itemsToShow = 1;
  if (windowWidth >= 1024) {
    itemsToShow = 4;
  } else if (windowWidth >= 768) {
    itemsToShow = 3;
  }

  return (
    <div className="px-4 mt-4">
      <h2 className="text-2xl font-bold pb-2 mt-3">{title}</h2>
      <Carousel opts={{ align: "start" }} className="relative">
        <CarouselContent className="w-full flex items-start gap-3 py-2">
          {debates.map((debate) => (
            <div
              key={debate.conversation_id}
              className="flex justify-center items-center gap-2"
            >
              <Card className="w-80 shadow-lg rounded-md sh">
                <CardHeader
                  className="relative flex justify-center items-center h-40 bg-cover bg-center rounded-t-md"
                  style={{
                    backgroundImage: `url(${debate.imageURL})`,
                  }}
                >
                  {/* work on this part */}
                  {/* <div className="absolute bottom-2 right-2 bg-black text-white text-xs rounded p-1">
                    {debate.first_message &&
                    durations[String(debate.first_message[0]?.audio_url)]
                      ? `${Math.round(
                          durations[
                            String(debate.first_message[0].audio_url)
                          ] / 60
                        )} min`
                      : "Loading..."}
                  </div> */}
                </CardHeader>
                <CardContent className="flex justify-between items-center p-4 gap-5">
                  <Link
                    href={`/chat/${debate.conversation_id}`}
                    className="font-bold text-sm text-left line-clamp-2"
                  >
                    {debate.topic}...
                  </Link>
                  <button
                    onClick={() => onPlay(debate)}
                    className="flex items-center text-white bg-slate-600 p-2 rounded-full hover:bg-slate-700"
                  >
                    {currentPlayingId === debate.conversation_id && isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="h-6 w-6" />
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          ))}
        </CarouselContent>
        {debates.length > itemsToShow && (
          <>
            <CarouselPrevious className="absolute lg:-left-12 left-0 top-[6.5rem] transform -translate-y-1/2" />
            <CarouselNext className="absolute right-0 lg:-right-12 top-[6.5rem] transform -translate-y-1/2" />
          </>
        )}
      </Carousel>
    </div>
  );
};

const CardView: React.FC = () => {
  const setShowAudioPlayer = useSetRecoilState(showAudioPlayingState);
  const setShowCurrentPlayingURL = useSetRecoilState(showCurrentPlayingURL);
  const setSingleTopicState = useSetRecoilState(singleTopicState);
  const setMessagesState = useSetRecoilState(messagesState);
  const setCurrentAudioIndex = useSetRecoilState(currentAudioIndexState);
  const setPlayFullAudio = useSetRecoilState(playFullAudioState);
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useRecoilState(
    isGlobalAudioPlayingState
  );

  const [technologyDebates, setTechnologyDebates] = React.useState<
    FirstConversation[]
  >([]);
  const [sportsDebates, setSportsDebates] = React.useState<FirstConversation[]>(
    []
  );
  const [historicalDebates, setHistoricalDebates] = React.useState<
    FirstConversation[]
  >([]);
  const [educationDebates, setEducationDebates] = React.useState<
    FirstConversation[]
  >([]);
  const [healthDebates, setHealthDebates] = React.useState<FirstConversation[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPlayingId, setCurrentPlayingId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    async function getDebatesList() {
      try {
        const [dataTechnology, dataHistory, dataSports, dataEducation, dataHealth] = await Promise.all([
          getDebatesWithCategory("Technology"),
          getDebatesWithCategory("Historical"),
          getDebatesWithCategory("Sports"),
          getDebatesWithCategory("Education"),
          getDebatesWithCategory("Health"),
        ]);

        setTechnologyDebates(dataTechnology);
        setHistoricalDebates(dataHistory);
        setSportsDebates(dataSports);
        setEducationDebates(dataEducation);
        setHealthDebates(dataHealth);
      } catch (error) {
        console.error("Error fetching debates:", error);
      } finally {
        setLoading(false);
      }
    }
    getDebatesList();
  }, []);

  const handlePlay = (debate: any) => {
    const audioUrls = debate.first_message
      .map((message: Message) => message.audio_url)
      .filter(Boolean);

    if (audioUrls.length > 0) {
      if (currentPlayingId === debate.conversation_id && isGlobalAudioPlaying) {
        setIsGlobalAudioPlaying(false);
      } else {
        setSingleTopicState(debate);
        setMessagesState(debate.first_message);
        setShowCurrentPlayingURL(audioUrls[0]);
        setCurrentAudioIndex(0);
        setPlayFullAudio(true);
        setIsGlobalAudioPlaying(true);
        setShowAudioPlayer(true);
        setCurrentPlayingId(debate.conversation_id);
      }
    } else {
      console.error("No valid audio URLs found for this debate.");
    }
  };

  return (
    <div className="w-full flex items-center flex-col justify-center">
      <div className="space-y-2 w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-5">
            <DebateCarousel
              title="Technology"
              debates={technologyDebates}
              onPlay={handlePlay}
              currentPlayingId={currentPlayingId}
              isPlaying={isGlobalAudioPlaying}
            />
            <DebateCarousel
              title="Historical"
              debates={historicalDebates}
              onPlay={handlePlay}
              currentPlayingId={currentPlayingId}
              isPlaying={isGlobalAudioPlaying}
            />
            <TopTenList />
            <DebateCarousel
              title="Sports"
              debates={sportsDebates}
              onPlay={handlePlay}
              currentPlayingId={currentPlayingId}
              isPlaying={isGlobalAudioPlaying}
            />
            <DebateCarousel
              title="Education"
              debates={educationDebates}
              onPlay={handlePlay}
              currentPlayingId={currentPlayingId}
              isPlaying={isGlobalAudioPlaying}
            />
            <DebateCarousel
              title="Health"
              debates={healthDebates}
              onPlay={handlePlay}
              currentPlayingId={currentPlayingId}
              isPlaying={isGlobalAudioPlaying}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardView;
