import { supabase } from "../supabase";

const useSingleDebateMessage = () => {

  const fetchDebates = async (conversationId: string) => {
    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .select("*")
      .eq("conversation_id", conversationId)
      .single();
    if (conversationError) {
      console.error("Error fetching conversation:", conversationError);
      return;
    }
    if (conversationData) {
      const { data: messageList, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationData.conversation_id);
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }
      if (messageList) {
        return messageList;
      }
    }
  };

  return {
    fetchDebates,
  };
};

export default useSingleDebateMessage;
