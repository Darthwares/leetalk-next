'use client';

import { useEffect, useState } from 'react';
import ShowMarkdown from '@/components/showMarkdown';
import MessageCard from '@/components/debates/debateMessageCard';
import { Button } from '@/components/ui/button';
import { SpinnerIcon } from '@/components/svg';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import {
  loaderState,
  messagesState,
  singleTopicState,
} from '@/state/state';
import getSingleMessage from '@/lib/helper/edgedb/getSingleMessage';
import { processMessages } from '@/constants/default';
import getSingleTopic from '@/lib/helper/edgedb/getSingleTopic';
import { Conversations, Message } from '@/types/types';
import { ShareIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from 'lucide-react';
import TextToSpeechButton from '@/components/textToSpeech';
import SuccessToast from '@/components/successToast';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { publishConversation } from '@/lib/helper/edgedb/getCategoryList';
import Loading from '@/components/loading';

const ShowSingle = ({ params }: { params: { id: string } }) => {
  const [messages, setMessages] = useRecoilState(messagesState);
  const [topic, setTopic] = useRecoilState<any>(singleTopicState);
  const [loader] = useRecoilState<any>(loaderState);
  
  const { data: session,status } = useSession();
  const [debates, setDebates] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const data = await getSingleTopic(params.id);
        if (data) {
          setDebates(data as Conversations);
        }
      }
    };
    fetchData();
  }, [session, params.id]);

  const handlePublish = async (id: string) => {
    try {
      setLoading(true);
      const updatedDebate = await publishConversation(id);
      if (updatedDebate) {
        setLoading(false);
        toast({
          className: 'toastClass',
          action: (
            <div className="px-5">
              <SuccessToast
                title="Successfully published!"
                description="Your debate is now visible to other users."
                className="text-green-800 border-green-300 bg-green-100"
              />
            </div>
          ),
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        className: 'toastClass',
        action: (
          <div className="px-5">
            <SuccessToast
              title="Failed publish!"
              description="There was an error publishing your debate. Please try again."
              className="text-green-800 border-green-300 bg-green-100"
            />
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const [messageData, topicData] = await Promise.all([
        getSingleMessage(params.id),
        getSingleTopic(params.id),
      ]);
      setMessages(messageData as Message[]);
      setTopic((topicData as Conversations) || {});
    }

    fetchData();

    return () => {
      setMessages([]);
      setTopic({ topic: '', created_at: '', conversation_id: '' });
    };
  }, [params.id, setMessages, setTopic]);

  const processedMessages = processMessages(messages);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check this out!',
          text: 'I found this interesting:',
          url: document.location.href,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      console.log('Share not supported on this platform');
    }
  };

   if (status === 'loading') {
     return <Loading />;
   }

  return (
    <>
      {processedMessages.remainingMessages && !loading && (
        <div className="flex flex-col w-full mx-auto p-4 md:p-6 bg-white shadow rounded-lg rounded-t-none">
          <div className="flex lg:flex-row flex-col pb-10 lg:pb-0 items-center justify-between w-full">
            {topic?.topic && (
              <div className="mx-auto w-full py-5">
                <h2 className="font-extrabold text-4xl">Debate Topic</h2>
                <div>
                  <h3 className="text-2xl py-5 font-bold">{topic.topic}</h3>

                  <div className="flex gap-2">
                    <div
                      className="flex items-center cursor-pointer space-x-1"
                      onClick={handleShare}
                    >
                      <ShareIcon className="h-5 w-5 text-gray-400" />

                      <span className="text-sm flex gap-1">
                        <span className="md:block hidden">Share</span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* we can also publish direcly after clicking here, we can show a modal and then publish directly */}
              </div>
            )}
            <div className="flex justify-end">
              <Link href="/debate">
                <Button className="max-w-fit flex gap-2 py-3">
                  Start new debate
                </Button>
              </Link>
            </div>
          </div>
          <div
            className={`${
              loader && 'bg-gray-100'
            }  flex flex-col py-10 rounded-lg`}
          >
            <div className="flex-grow overflow-y-auto py-4 space-y-8">
              {processedMessages.remainingMessages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  senderType={message.sender}
                />
              ))}
              {processedMessages.conclusion && (
                <div className="bg-green-100 p-4 space-y-2">
                  <h3 className="text-xl font-bold">Conclusion:</h3>
                  <TextToSpeechButton
                    content={processedMessages.conclusion}
                    senderType={''}
                  />
                  <ShowMarkdown content={processedMessages.conclusion} />
                </div>
              )}
              { status==='authenticated' &&  session?.user.id === debates?.user_id && !loading && (
                <div className="fixed bottom-0 gap-5 left-0 w-full bg-white shadow-lg p-4 flex justify-end">
                  {!debates?.published && (
                    <Button
                      onClick={() => handlePublish(params.id)}
                      disabled={loading}
                      className="flex items-center cursor-pointer space-x-1"
                    >
                      <Link href={'/my-debates'}>
                        <span className="flex gap-1">
                          <span className="text-sm">
                            {loading ? (
                              <span className="flex items-center space-x-1">
                                <SpinnerIcon className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" />
                                Wait...
                              </span>
                            ) : (
                              <span className="flex gap-1 items-center space-x-1">
                                <EyeIcon className="h-5 w-5 text-white" />
                                Publish debate
                              </span>
                            )}
                          </span>
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowSingle;
