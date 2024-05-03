import { messagesState } from "@/state/state";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { supabase } from "../supabase";

const useDebateMessages = () => {
  const [messages, setMessages] = useRecoilState(messagesState);

  const getMessages = async () => {
    await supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
  };

  useEffect(() => {
    getMessages();
  }, [supabase]);

  return {
    messages,
  };
};

export default useDebateMessages;
