"use server";
import client from "./edgedb";

interface MessageProps {
  messageId: string;
  conversationId: string;
  sender: string;
  messageText: string;
  created_at?: string;
  audioUrl?: string;
}

export const setMessages = async ({
  messageId,
  conversationId,
  sender,
  messageText,
  audioUrl,
}: MessageProps) => {
  const query = `
    INSERT Messages {
      message_id := <str>$messageId,
      conversation_id := <str>$conversationId,
      audio_url := <str>$audioUrl,
      sender := <str>$sender,
      message_text := <str>$messageText
    }
  `;

  const params = {
    messageId,
    conversationId,
    sender,
    messageText,
    audioUrl, // Ensure audio_url is always defined
  };

  await client.querySingle(query, params);
};
