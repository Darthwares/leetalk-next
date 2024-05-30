'use client';

import ShowMarkdown from './showMarkdown';
import { extractPlaylist, processMessages } from '@/constants/default';
import MessageCard from './debates/debateMessageCard';
import {
  conversationIdState,
  currentAudioIndexState,
  debateCategoryState,
  isGlobalAudioPlayingState,
  loaderState,
  messagesState,
  playFullAudioState,
  showAudioPlayingState,
  showPublishState,
  showTopicState,
} from '@/state/state';
import { useRecoilState } from 'recoil';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { publishConversation } from '@/lib/helper/edgedb/getCategoryList';
import Link from 'next/link';
import DebateHeader from './reusableDebateHeader';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import AudioHeader from './audio/audioHeader';
import AudioFooter from './audio/audioFooter';
import { handleShare } from '@/lib/helper/handleShare';
import TextToSpeechButton from './textToSpeech';

export default function ShowChats() {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useRecoilState(messagesState);
  const messageList = processMessages(messages);
  const [id] = useRecoilState(conversationIdState);
  const [publishState, setPublishState] = useRecoilState(showPublishState);
  const [inputValue] = useRecoilState(showTopicState);
  const [currentMusicIndex, setCurrentMusicIndex] = useRecoilState(
    currentAudioIndexState
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useRecoilState(
    showAudioPlayingState
  );
  const audioPlayerRef = useRef<AudioPlayer>(null);
  const [playFullAudio, setPlayFullAudio] = useRecoilState(playFullAudioState);
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useRecoilState(
    isGlobalAudioPlayingState
  );
  const [currentIndex, setCurrentIndex] = useRecoilState(
    currentAudioIndexState
  );
  const [loader, setLoader] = useRecoilState(loaderState);
  const [activeCategory, setSelectedCategory] =
    useRecoilState(debateCategoryState);

  useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === 'system'
    ) {
      setPublishState(true);
    } else {
      setPublishState(false);
    }
  }, [messages, setPublishState]);

  const playlist = extractPlaylist(messages);
  const processedMessages = processMessages(messages);

  const handleClickPrevious = (): void => {
    setCurrentMusicIndex((prevIndex) =>
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
    setPlayFullAudio(true);
  };

  const handleClickNext = (): void => {
    setCurrentMusicIndex((prevIndex) =>
      prevIndex < playlist.length - 1 ? prevIndex + 1 : 0
    );
    setPlayFullAudio(true);
  };

  useEffect(() => {
    if (playFullAudio) {
      setCurrentMusicIndex(currentIndex);
    }
  }, [playFullAudio, currentIndex]);

  useEffect(() => {
    if (isGlobalAudioPlaying) {
      audioPlayerRef.current?.audio.current?.play();
      setPlayFullAudio(isGlobalAudioPlaying);
    } else {
      audioPlayerRef.current?.audio.current?.pause();
      setPlayFullAudio(!isGlobalAudioPlaying);
    }
  }, [isGlobalAudioPlaying, setPlayFullAudio]);

  const handlePlay = () => {
    setIsGlobalAudioPlaying(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsGlobalAudioPlaying(false);
    setIsPlaying(false);
  };

  const handlePlayListClick = (index: number) => {
    if (currentMusicIndex === index) {
      setIsPlaying(!isPlaying);
      setIsGlobalAudioPlaying(!isPlaying);
    } else {
      setCurrentMusicIndex(index);
      setPlayFullAudio(true);
      setIsGlobalAudioPlaying(true);
      setIsPlaying(true);
    }
  };

  const nextSpeakerIndex = (currentMusicIndex + 1) % playlist.length;

  const handleClose = () => {
    setShowAudioPlayer(false);
  };

  console.log('processedMessages',processedMessages);

  return (
    <div
      className={`${
        messages?.length > 0 && 'bg-gray-100'
      } bg-white flex flex-col py-5 rounded-lg`}
    >
      {loader && messages.length === 0 && (
        <>
          <div className="flex justify-center">
            <h2 className="py-2 leading-none tracking-tight text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              {' '}
              AI is Debating for you!
            </h2>
          </div>
          <div className="w-full">
            <div className="h-72 lg:h-96">
              <lottie-player
                src="/ai-debating.json"
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

      {processedMessages.remainingMessages.length > 0 && (
        <div className="flex-grow overflow-y-auto py-4 space-y-8">
          <DebateHeader
            topic={inputValue}
            path={'/my-debates'}
            text={'See all debates'}
            handleShare={() =>
              handleShare(
                'Check this out!',
                'I found this interesting:',
                document.location.href
              )
            }
            category={activeCategory!}
          />

          {processedMessages.remainingMessages?.map((message, id) => {
            return (
              <MessageCard
                key={id}
                message={message}
                senderType={message.sender}
                index={id}
              />
            );
          })}
          <div ref={messageRef} />
          {processedMessages?.conclusion && (
            <div className="bg-green-100 p-4 space-y-2">
              <h3 className="text-xl font-bold">Conclusion:</h3>
              <TextToSpeechButton
                senderType={messages[messages.length - 1].sender}
                index={messages.length - 1}
              />
              <ShowMarkdown content={processedMessages?.conclusion} />
            </div>
          )}

          {showAudioPlayer && (
            <div className="w-full max-w-7xl px-2 mx-auto">
              <div className="fixed w-full mx-auto bottom-0 z-50 -right-1 sm:right-auto">
                <AudioPlayer
                  ref={audioPlayerRef}
                  onEnded={handleClickNext}
                  autoPlayAfterSrcChange={true}
                  showSkipControls={true}
                  showJumpControls={false}
                  src={playlist[currentMusicIndex]?.src}
                  onClickPrevious={handleClickPrevious}
                  onClickNext={handleClickNext}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  header={
                    <AudioHeader topic={inputValue} handleClose={handleClose} />
                  }
                  footer={
                    <AudioFooter
                      playlist={playlist}
                      currentMusicIndex={currentMusicIndex}
                      nextSpeakerIndex={nextSpeakerIndex}
                      isPlaying={isPlaying}
                      topic={inputValue}
                      messages={messages}
                      handlePlayListClick={handlePlayListClick}
                    />
                  }
                  style={{
                    borderRadius: '10px',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {publishState && (
        <div className="fixed bottom-0 gap-5 left-0 w-full bg-white shadow-lg px-4 flex justify-end">
          <Link
            href={'/my-debates'}
            className="max-w-fit flex gap-2 py-1"
            onClick={async () => {
              setMessages([]);
              setSelectedCategory(null);
              setLoader(false);
              await publishConversation(id);
            }}
          >
            <Button>Publish Debate</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
