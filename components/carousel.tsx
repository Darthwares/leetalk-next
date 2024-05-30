import * as React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { extractPlaylist, responsive } from "@/constants/default";
import { FirstConversation, getAllDebates } from "@/lib/helper/edgedb/dbClient";
import Link from "next/link";
import useHideAudio from "@/lib/helper/useHideAudio";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PauseIcon, PlayIcon } from "./svg";
import getSingleMessages from "@/lib/helper/edgedb/getSingleMessage";
import AudioFooter from "./audio/audioFooter";
import AudioHeader from "./audio/audioHeader";
import { Skeleton } from "@/components/ui/skeleton";

export function CarouselDemo() {
  const [topics, setTopics] = React.useState<FirstConversation[]>([]);
  const [isPlaceholder, setIsPlaceholder] = React.useState(true);
  const { hideAudioinIphone } = useHideAudio();
  const [currentMusicIndex, setCurrentMusicIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [conversationId, setConversationId] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [currentId, setCurrentId] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
  const audioPlayerRef = React.useRef<AudioPlayer>(null);

  React.useEffect(() => {
    async function getDebatesList() {
      const data = await getAllDebates();
      if (data.length > 0) {
        setTopics(data);
        setIsPlaceholder(false);
      }
    }
    getDebatesList();
  }, []);

  React.useEffect(() => {
    async function getMessages() {
      const data = await getSingleMessages(conversationId);
      if (data) {
        setMessages(data as any);
      }
    }
    if (conversationId) {
      getMessages();
    }
  }, [conversationId]);

  const playlist = extractPlaylist(messages);

  const handleClickPrevious = (): void => {
    setCurrentMusicIndex((prevIndex) =>
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
  };

  const handleClickNext = (): void => {
    setCurrentMusicIndex((prevIndex) =>
      prevIndex < playlist.length - 1 ? prevIndex + 1 : 0
    );
  };

  React.useEffect(() => {
    if (isPlaying) {
      audioPlayerRef.current?.audio.current?.play();
    } else {
      audioPlayerRef.current?.audio.current?.pause();
    }
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlayListClick = (index: number, conversation_id?: string) => {
    if (conversationId === conversation_id) {
      if (currentMusicIndex === index) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentMusicIndex(index || 0);
        setIsPlaying(true);
      }
    } else {
      setConversationId(conversation_id!);
      setCurrentMusicIndex(index || 0);
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    setShowAudioPlayer(false);
    setCurrentMusicIndex(0);
    setIsPlaying(false);
    setConversationId("");
    setMessages([]);
  };

  const nextSpeakerIndex = (currentMusicIndex + 1) % playlist.length;

  const renderSkeletons = () => {
    const skeletons = [];
    const skeletonCount = 3;

    for (let i = 0; i < skeletonCount; i++) {
      skeletons.push(
        <div
          key={i}
          className="h-full w-full md:w-[27.5rem] relative left-2 items-start p-4 md:p-8 rounded-lg space-y-5 bg-slate-50"
        >
          <Skeleton className="h-6 w-[200px] bg-slate-200" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-2 w-[350px] bg-slate-200" />
            <Skeleton className="h-2 w-[350px] bg-slate-200" />
          </div>
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-5 w-[50px] bg-slate-200" />
            <Skeleton className="h-5 w-[50px] bg-slate-200" />
          </div>
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
          </div>
        </div>
      );
    }

    return skeletons;
  };

  return (
    <div className="">
      <div className="py-5 space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Featured{" "}
          <span className="text-gray-600 text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            Debates
          </span>
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Explore the hottest debates and join the conversation.
        </p>
      </div>
      <div className="pt-4">
        {topics.length === 0 ? (
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            {renderSkeletons()}
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            className="space-x-4"
            itemClass="px-2"
          >
            {topics?.map((item, idx) => (
              <div
                key={idx}
                className={` ${
                  !isPlaceholder && item.first_message && hideAudioinIphone
                    ? "md:min-h-6"
                    : "md:min-h-40"
                }  h-full w-full items-start p-4 md:p-8 rounded-lg space-y-4`}
                style={{
                  background: "linear-gradient(45deg, #2B4162, #000000)",
                  backgroundSize: "400% 400%",
                }}
              >
                <Link href={`/chat/${item.conversation_id}`}>
                  <h2 className="text-2xl text-white line-clamp-2 font-bold">
                    {item.topic}
                  </h2>
                </Link>
                <p className="text-sm line-clamp-2 text-white">
                  {/* @ts-ignore */}
                  {`${item.first_message?.[0].message_text}`}
                </p>
                <div className="flex items-center justify-between w-full">
                  {item.category && (
                    <p className="text-sm text-slate-50 font-bold cursor-pointer p-2 bg-slate-900 rounded-md max-w-fit">
                      {item.category}
                    </p>
                  )}
                  <div className="flex justify-end w-full items-center">
                    <span className="text-sm text-white">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {
                  <div className="w-full">
                    <div
                      className=""
                      onClick={() => {
                        setConversationId(item.conversation_id);
                        setShowAudioPlayer(true);
                        setTopic(item.topic);
                        setCurrentId(item.conversation_id);
                        setCurrentId(item.conversation_id);
                        handlePlayListClick(0, item.conversation_id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="py-2 max-w-fit bg-white p-2 cursor-pointer rounded-full">
                          <div>
                            {currentId === item.conversation_id && isPlaying ? (
                              <PauseIcon className="w-6 h-6" />
                            ) : (
                              <PlayIcon className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                        {currentId === item.conversation_id && isPlaying ? (
                          <p className="text-white">Pause</p>
                        ) : (
                          <p className="text-white">Play</p>
                        )}
                      </div>
                    </div>
                  </div>
                }
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <div className="w-full max-w-7xl px-2 mx-auto">
        <div className="fixed w-full mx-auto bottom-2 sm:bottom-0 z-50 -right-1 sm:right-auto">
          {showAudioPlayer && (
            <AudioPlayer
              ref={audioPlayerRef}
              onEnded={handleClickNext}
              autoPlayAfterSrcChange={true}
              autoPlay={true}
              showSkipControls={true}
              showJumpControls={false}
              src={playlist[currentMusicIndex]?.src}
              onClickPrevious={handleClickPrevious}
              onClickNext={handleClickNext}
              onPlay={handlePlay}
              onPause={handlePause}
              header={<AudioHeader topic={topic} handleClose={handleClose} />}
              footer={
                <AudioFooter
                  playlist={playlist}
                  currentMusicIndex={currentMusicIndex}
                  nextSpeakerIndex={nextSpeakerIndex}
                  isPlaying={isPlaying}
                  topic={topic}
                  messages={messages}
                  handlePlayListClick={handlePlayListClick}
                />
              }
              style={{
                borderRadius: "10px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CarouselDemo;
