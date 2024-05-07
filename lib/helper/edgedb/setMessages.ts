'use server';
import { createClient } from 'edgedb';

const client = createClient();

interface MessageProps {
  messageId: string;
  conversationId: string;
  sender: string;
  messageText: string;
  created_at?: string;
}

export const setMessages = async ({
  messageId,
  conversationId,
  sender,
  messageText,
}: MessageProps) => {
  const query = `
    INSERT Messages {
      message_id := <str>$messageId,
      conversation_id := <str>$conversationId,
      sender := <str>$sender,
      message_text := <str>$messageText
    }
  `;

  const params = {
    messageId,
    conversationId,
    sender,
    messageText,
  };

  const message = await client.querySingle(query, params);

  console.log('Message inserted:', message);
};
