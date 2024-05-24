"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@ui/card";
import { runDebate } from "@/serverActions/runDebate";
import { Textarea } from "@ui/textarea";
import { PlaneIcon, SpinnerIcon } from "./svg";
import { guid } from "@/constants/default";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationIdState,
  debateCategoryState,
  loaderState,
  messagesState,
  showPublishState,
  showTopicState,
} from "@/state/state";
import { setConversations } from "@/lib/helper/edgedb/setConversations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { categoryPage } from "@/constants/default";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import SuccessToast from "./successToast";
import { useToast } from "./ui/use-toast";
import {
  getConversationsByCategory,
  getSelectedCategory,
} from "@/lib/helper/edgedb/dbClient";
import Link from "next/link";

export function InputDebate() {
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] =
    useRecoilState(debateCategoryState);
  const { toast } = useToast();
  const [inputValue, setInputValue] = useRecoilState(showTopicState);
  const [id, setId] = useRecoilState(conversationIdState);
  const [messageList, setMessagesList] = useRecoilState(messagesState);
  const [loader, setLoader] = useRecoilState(loaderState);
  const [error, setError] = useState("");
  const [retryDebate, setRetryDebate] = useState(false);
  const [conversationList, setConversationList] = useState<
    { conversation_id: string; topic: string }[]
  >([]);
  const router = useRouter();
  const setPublishState = useSetRecoilState(showPublishState);
  const Idx = guid();

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [status, router]);

  const handleClick = async (category: string) => {
    setSelectedCategory(category);
    const data = await getSelectedCategory(category);
    setConversationList(data);
    console.log("data", data);
  };

  useEffect(() => {
    if (selectedCategory) {
      handleClick(selectedCategory);
    }
  }, [selectedCategory]);

  const handleRetryDebate = async () => {
    setLoader(true);
    const response = await fetch("api/langchain", {
      method: "POST",
      body: JSON.stringify({
        prompt: inputValue.trim(),
        key: Idx,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const text = new TextDecoder().decode(value);
          const jsonResponse = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
          for (const response of jsonResponse) {
            if (response.end) {
              // setIsDebateOver(true);
              setPublishState(true);
              break;
            } else {
              setMessagesList((prevData) => [...prevData, response]);
            }
          }
        }
        toast({
          className: "toastClass",
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
      toast({
        className: "toastClass",
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

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessagesList([]);
    setLoader(true);
    setId(Idx);

    await setConversations({
      conversationId: Idx,
      topic: inputValue.trim(),
      userId: session?.user?.id ?? "",
      category: selectedCategory!,
      publisher: false,
    });

    const response = await fetch("api/langchain", {
      method: "POST",
      body: JSON.stringify({
        prompt: inputValue.trim(),
        key: Idx,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const text = new TextDecoder().decode(value);
          const jsonResponse = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
          for (const response of jsonResponse) {
            if (response.end) {
              // setIsDebateOver(true);
              setPublishState(true);
              break;
            } else {
              setMessagesList((prevData) => [...prevData, response]);
            }
          }
        }
        toast({
          className: "toastClass",
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
      toast({
        className: "toastClass",
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
      setRetryDebate(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {status === "authenticated" && !selectedCategory && (
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
        {status === "authenticated" &&
          selectedCategory &&
          messageList.length === 0 && (
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
                    <span>You have selected:</span>{" "}
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
                <form onSubmit={handleChatSubmit}>
                  <CardContent>
                    <Textarea
                      className="w-full border border-gray-300 dark:border-neutral-800 rounded-md p-2"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      rows={5}
                      disabled={loader}
                    />
                    {error && (
                      <span className="text-red-500 text-sm">{error}</span>
                    )}
                  </CardContent>
                  <CardFooter>
                    {!retryDebate && (
                      <Button
                        type="submit"
                        className="ml-2 whitespace-nowrap"
                        // onClick={handleStartDebate}
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
                </form>
              </Card>
              {!loader && (
                <div className="w-full">
                  <div className="h-72 lg:h-96">
                    {conversationList.length > 0 && (
                      <div className="max-w-2xl px-5 md:px-7 my-8">
                        <div className="mb-4 text-xl font-semibold">
                          Other popular debates related to this category
                        </div>
                        <ul className="list-disc pl-5 space-y-2">
                          {conversationList.map((conversation) => (
                            <li
                              key={conversation.conversation_id}
                              className="hover:text-blue-500"
                            >
                              <Link
                                href={`/chat/${conversation.conversation_id}`}
                              >
                                {conversation.topic}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <ul className="space-y-2"></ul>
                      </div>
                    )}
                    {conversationList.length === 0 && (
                      <lottie-player
                        src="/startDebate.json"
                        background="white"
                        speed={1}
                        loop
                        autoplay
                        data-testid="lottie"
                      />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
