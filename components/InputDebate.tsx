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
import { Textarea } from "@ui/textarea";
import { PlaneIcon, SpinnerIcon } from "./svg";
import { debaterDetails, debaterOptions, guid } from "@/constants/default";
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
import { getSelectedCategory } from "@/lib/helper/edgedb/dbClient";
import Link from "next/link";
import checkIsTopicExist from "@/lib/helper/edgedb/checkIsTopicExist";
import deleteConversation from "@/lib/helper/edgedb/deleteConversation";

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
  const [selectedDebaters, setSelectedDebaters] = useState<string[]>([]);
  const [debateStarted, setDebateStarted] = useState(false);

  const router = useRouter();
  const setPublishState = useSetRecoilState(showPublishState);
  const idx = guid();

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
  };

  const handleDebaterSelect = (debaterKey: string) => {
    if (!debateStarted) {
      setSelectedDebaters((prevSelectedDebaters) => {
        if (prevSelectedDebaters.includes(debaterKey)) {
          return prevSelectedDebaters.filter((key) => key !== debaterKey);
        } else if (prevSelectedDebaters.length < 2) {
          return [...prevSelectedDebaters, debaterKey];
        } else {
          return prevSelectedDebaters;
        }
      });
    }
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
        key: idx,
        debaters: selectedDebaters, // Include selected debaters in the request
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
    setDebateStarted(true);

    const existingTopic = await checkIsTopicExist(inputValue.trim());
    if (existingTopic) {
      toast({
        className: "toastClass",
        action: (
          <div className="px-5">
            <SuccessToast
              title="Topic Already Exists!"
              description="The topic you have entered already exists. Please choose a different topic."
              className="text-yellow-800 border-yellow-300 bg-yellow-50"
            />
          </div>
        ),
      });
      setLoader(false);
      return;
    }

    setId(idx);

    try {
      const [imageResponse, debateResponse] = await Promise.all([
        fetch("/api/generateImage", {
          method: "POST",
          body: JSON.stringify({
            text: inputValue.trim(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch("api/langchain", {
          method: "POST",
          body: JSON.stringify({
            prompt: inputValue.trim(),
            key: idx,
            debaters: selectedDebaters, // Include selected debaters in the request
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      const imageData = await imageResponse.json();

      if (imageResponse.ok) {
        await setConversations({
          conversationId: idx,
          topic: inputValue.trim(),
          userId: session?.user?.id ?? "",
          category: selectedCategory!,
          publisher: false,
          imageURL: imageData.image,
        });
      }

      const reader = debateResponse.body?.getReader();
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
      // await deleteConversation(idx);
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
    <div className="w-full flex items-center justify-center flex-col">
      <div className="max-w-7xl w-full">
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
                    <Select
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
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
                    <CardTitle className="w-full md:text-center text-3xl font-semiboldxl text-left md:mb-5 mt-3">
                      Create new debate
                    </CardTitle>
                    <CardDescription className="flex gap-3 flex-col sm:flex-row items-center">
                      <span className="hidden md:block w-full max-w-fit">
                        Your Caterory:
                      </span>{" "}
                      <div className="mt-3 md:mt-0 flex items-center w-full justify-start">
                        <p className="text-slate-900 font-medium">
                          Change Category
                        </p>
                        <span className="text-slate-900 font-bold">
                          <span className="px-1.5">{`>`}</span>
                          <button className="underline"  onClick={() => setSelectedCategory(null)}>
                            {selectedCategory}
                          </button>
                        </span>
                      </div>
                    </CardDescription>
                    <strong className="text-sm pt-3">
                      Step 1: What question do you want discussed?
                    </strong>
                  </CardHeader>
                  <form onSubmit={handleChatSubmit}>
                    <CardContent>
                      <Textarea
                        className="w-full border border-gray-300 dark:border-neutral-800 rounded-md pt-2 "
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        rows={2}
                        disabled={loader}
                      />
                      {error && (
                        <span className="text-red-500 text-sm">{error}</span>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col ">
                      <p className="text-sm pt-2 pb-4 text-left w-full font-extrabold">
                        Step 2: Choose your debaters{" "}
                        <span className="font-medium">
                          (3 credits per model)
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 mb-4 items-center justify-between w-full">
                        <div className="flex gap-2 flex-wrap justify-start w-full">
                          {debaterOptions.map((debater) => (
                            <Button
                              type="button"
                              key={debater.key}
                              className={`relative hover:text-white ${
                                selectedDebaters.includes(debater.key)
                                  ? "bg-slate-900 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                              onClick={() => handleDebaterSelect(debater.key)}
                              disabled={debateStarted} // Disable button if debate has started
                            >
                              {debater.name}
                              {selectedDebaters.includes(debater.key) && (
                                <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                  {selectedDebaters.indexOf(debater.key) + 1}
                                </span>
                              )}
                            </Button>
                          ))}
                        </div>
                        {!retryDebate && (
                          <div className="w-full flex justify-end">
                            <Button
                              type="submit"
                              className="ml-2 whitespace-nowrap"
                              // onClick={handleStartDebate}
                              disabled={
                                inputValue.length === 0 ||
                                selectedDebaters.length < 2 ||
                                loader
                              }
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
                          </div>
                        )}
                        {retryDebate && (
                          <div className="w-full flex justify-end">
                            <Button
                              className="ml-2 whitespace-nowrap"
                              onClick={handleRetryDebate}
                            >
                              Retry Debate
                              <PlaneIcon className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </form>
                </Card>
                {selectedDebaters.length !== 0 && (
                  <div className="mx-auto p-4">
                    <h2 className="text-xl font-semibold mb-4">Participants</h2>
                    <div className="space-y-4">
                      {selectedDebaters.map((debaterKey) => {
                        const debater = debaterDetails[debaterKey];
                        return (
                          <div
                            className="flex items-center space-x-4"
                            key={debaterKey}
                          >
                            <img
                              src={debater.image}
                              alt={debater.name}
                              className="w-12 h-12 rounded-full bg-contain object-cover"
                            />
                            <div className="flex-grow">
                              <h3 className="text-lg font-medium">
                                {debater.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {debater.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
      </div>
    </div>
  );
}
