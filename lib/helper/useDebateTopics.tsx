import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const useDebateTopics = () => {
  const [topics, setTopics] = useState<any[]>();

  const fetchDebates = async () => {
    const { data: conversationTopic, error: conversationError } = await supabase
      .from("conversations")
      .select().order('created_at', { ascending: false });

    if (conversationError) {
      console.error("Error fetching conversation:", conversationError);
      return;
    }

    if (conversationTopic) {
      setTopics(conversationTopic);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  return {
    topics,
  };
};

export default useDebateTopics;
