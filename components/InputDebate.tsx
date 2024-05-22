'use client';

import { useEffect, useState } from 'react';
import { Button } from '@ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@ui/card';
import { runDebate } from '@/serverActions/runDebate';
import { Textarea } from '@ui/textarea';
import { PlaneIcon, SpinnerIcon } from './svg';
import { guid } from '@/constants/default';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  conversationIdState,
  debateCategoryState,
  loaderState,
  messagesState,
} from '@/state/state';
import { setConversations } from '@/lib/helper/edgedb/setConversations';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { categoryPage } from '@/constants/default';
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from '@/components/ui/select';
import SuccessToast from './successToast';
import { useToast } from './ui/use-toast';

export function InputDebate() {
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] =
    useRecoilState(debateCategoryState);
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [id, setId] = useRecoilState(conversationIdState);
  const [messageList,setMessagesList] = useRecoilState(messagesState);
  const [loader, setLoader] = useRecoilState(loaderState);
  const [error, setError] = useState('');
  const [retryDebate, setRetryDebate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [status, router]);

  const handleStartDebate = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a debate topic!');
      return;
    }
    setLoader(true);
    const id = guid();
    setId(id);
    await setConversations({
      conversationId: id,
      topic: inputValue.trim(),
      userId: session?.user?.id ?? '',
      category: selectedCategory!,
      publisher: false,
    });

    try {
      const result = await runDebate(inputValue.trim(), id);
      if (result) {
        setMessagesList(result.messages);
        setLoader(false);
        toast({
          className: 'toastClass',
          action: (
            <div className="px-5">
              <SuccessToast
                title="Debate successfully generated!"
                description="Your debate has been successfully generated. You can now proceed with your discussion."
                className="text-green-800 border-green-300 bg-green-50"
              />
            </div>
          ),
        });
      }
    } catch (error) {
      setRetryDebate(true);
      toast({
        className: 'toastClass',
        action: (
          <div className="px-5">
            <SuccessToast
              title="Something went wrong!"
              description="We encountered an issue while starting your debate. Please review your topic and try again."
              className="text-red-800 border-red-300 bg-red-50"
            />
          </div>
        ),
      });
      setLoader(false);
    }
  };

  const handleRetryDebate = async () => {
    setLoader(true);
    try {
      const result = await runDebate(inputValue.trim(), id);
      if (result) {
        setMessagesList(result.messages);
        setLoader(false);
        toast({
          className: 'toastClass',
          action: (
            <div className="px-5">
              <SuccessToast
                title="Debate successfully generated!"
                description="Your debate has been successfully generated. You can now proceed with your discussion."
                className="text-green-800 border-green-300 bg-green-50"
              />
            </div>
          ),
        });
        setRetryDebate(false);
      }
    } catch (error) {
      toast({
        className: 'toastClass',
        action: (
          <div className="px-5">
            <SuccessToast
              title="Something went wrong!"
              description="We encountered an issue while starting your debate. Please review your topic and try again."
              className="text-red-800 border-red-300 bg-red-50"
            />
          </div>
        ),
      });
      setLoader(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {status === 'authenticated' && !selectedCategory && (
          <motion.div
            key="category-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Select a Category</CardTitle>
                <CardDescription>
                  Please select a category to start your debate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {categoryPage.map((category) => (
                    <Button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <category.icon className="mr-2 h-5 w-5" />
                      {category.name}
                    </Button>
                  ))}
                </div>
                <div className="block sm:hidden w-full">
                  <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryPage.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <div className="w-full pt-5">
              <div className="h-72 w-full lg:h-[30rem]">
                <lottie-player
                  src="/select-categories.json"
                  background="white"
                  speed={1}
                  loop
                  autoplay
                  data-testid="lottie"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {status === 'authenticated' && selectedCategory && messageList.length ===0 && (
          <motion.div
            key="debate-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Enter a topic to debate</CardTitle>
                <CardDescription className="flex gap-3 flex-col sm:flex-row">
                  <span>You have selected:</span>{' '}
                  <div>
                    <button
                      className="text-slate-900 font-medium"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Change Category
                    </button>
                    <span className="text-slate-900 font-bold">
                      <span className="px-1.5">{`>`}</span>
                      {selectedCategory}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="w-full border border-gray-300 dark:border-neutral-800 rounded-md p-2"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={5}
                  disabled={loader}
                />
                {error && <span className="text-red-500 text-sm">{error}</span>}
              </CardContent>
              <CardFooter>
                {!retryDebate && (
                  <Button
                    className="ml-2 whitespace-nowrap"
                    onClick={handleStartDebate}
                    disabled={inputValue.length === 0 || loader}
                  >
                    <span className="flex gap-1">
                      <span className="text-sm">
                        {loader ? (
                          <span className="flex items-center space-x-1">
                            <SpinnerIcon className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" />
                            Generating...
                          </span>
                        ) : (
                          <span className="flex gap-1 items-center space-x-1">
                            Start Debate
                            <PlaneIcon className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </span>
                    </span>
                  </Button>
                )}
                {retryDebate && (
                  <Button
                    className="ml-2 whitespace-nowrap"
                    onClick={handleRetryDebate}
                  >
                    Retry Debate
                    <PlaneIcon className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            {!loader && messageList.length === 0 && (
              <div className="w-full">
                <div className="h-72 lg:h-96">
                  <lottie-player
                    src="/startDebate.json"
                    background="white"
                    speed={1}
                    loop
                    autoplay
                    data-testid="lottie"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
