"use client";

import { useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { guid } from "@/constants/default";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationIdState,
  loaderState,
  showDebateInputBoxState,
  waitingMessageState,
} from "@/state/state";
import { setConversations } from "@/lib/helper/edgedb/setConversations";
import { useSession } from "next-auth/react";
import Loading from "./loading";
import { useRouter } from "next/navigation";

export function InputDebate() {
  const { status } = useSession();

  const [inputValue, setInputValue] = useState("");
  const [id, setId] = useRecoilState(conversationIdState);
  const setWaitingMessage = useSetRecoilState(waitingMessageState);
  const setShowDebateInputBox = useSetRecoilState(showDebateInputBoxState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useRecoilState(loaderState);
  const router = useRouter();

  if (status === "unauthenticated") {
    setTimeout(() => {
      router.push("/");
    }, 3000);
    return null;
  }

  // console.log("id", id);

  return (
    <>
      {status === "authenticated" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enter a topic to debate</CardTitle>
            <CardDescription>
              Provide a topic or question to start a debate.
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
            <Button
              className="ml-2 whitespace-nowrap"
              onClick={async () => {
                if (!inputValue) {
                  setError("Please enter debate topic!");
                  return;
                }
                const id = guid();
                setId(id);

                // const { data: conversationData, error: conversationError } =
                //   await supabase
                //     .from("conversations")
                //     .insert({ conversation_id: id, topic: inputValue });

                // if (conversationError) {
                //   alert(conversationError.message);
                //   return;
                // }

                // if (conversationData) {
                //   console.log("conversationData", conversationData);
                // }

                // if (inputValue) {
                //   setWaitingMessage("Wait for the debate to start");
                //   setLoader(true);
                //   setShowDebateInputBox(false);
                // }

                await setConversations({
                  conversationId: id,
                  topic: inputValue.trim(),
                });

                const result = await runDebate(inputValue.trim(), id);
                if (result) {
                  setLoader(false);
                }
              }}
            >
              Start Debate
              <PlaneIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
