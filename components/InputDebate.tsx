"use client";

import { useEffect, useState } from "react";
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
import { PlaneIcon } from "./svg";
import { guid } from "@/constants/default";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationIdState,
  debateCategoryState,
  loaderState,
  messagesState,
} from "@/state/state";
import { setConversations } from "@/lib/helper/edgedb/setConversations";
import { useSession } from "next-auth/react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { categoryPage } from "@/constants/default";

export function InputDebate() {
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] =
    useRecoilState(debateCategoryState);
  const [inputValue, setInputValue] = useState("");
  const [id, setId] = useRecoilState(conversationIdState);
  const setMessagesList = useSetRecoilState(messagesState);
  const setLoader = useSetRecoilState(loaderState);
  const [error, setError] = useState("");
  const [retryDebate, setRetryDebate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  const handleStartDebate = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a debate topic!");
      return;
    }
    const id = guid();
    setId(id);
    await setConversations({
      conversationId: id,
      topic: inputValue.trim(),
      userId: session?.user?.id ?? "",
      category: selectedCategory!,
      publisher: false,
    });

    setLoader(true);

    try {
      const result = await runDebate(inputValue.trim(), id);
      if (result) {
        setMessagesList(result.messages);
        setLoader(false);
      }
    } catch (error) {
      setRetryDebate(true);
      console.log("Error starting debate:", error);
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
        setRetryDebate(false);
      }
    } catch (error) {
      console.log("Error retrying debate:", error);
      setLoader(false);
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {status === "authenticated" && selectedCategory && (
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
                <CardDescription>
                  You have selected: <strong>{selectedCategory}</strong>
                  <Button
                    variant="link"
                    className="ml-2"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Change Category
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="w-full border border-gray-300 dark:border-neutral-800 rounded-md p-2"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={5}
                />
                {error && <span className="text-red-500 text-sm">{error}</span>}
              </CardContent>
              <CardFooter>
                {!retryDebate && (
                  <Button
                    className="ml-2 whitespace-nowrap"
                    onClick={handleStartDebate}
                  >
                    Start Debate
                    <PlaneIcon className="ml-2 h-4 w-4" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
