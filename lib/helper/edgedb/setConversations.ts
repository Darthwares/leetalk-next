"use server";

import { createClient } from "edgedb";

const client = createClient();

interface ConversationProps {
  conversationId: string;
  userId?: string; // Optional
  topic: string;
  createdAt?: string; // Optional
}

export const setConversations = async ({
  conversationId,
  userId,
  topic,
  createdAt,
}: ConversationProps) => {
  const query = `
    INSERT Conversations {
      conversation_id := <str>$conversationId,
      topic := <str>$topic,
      ${userId ? `user_id := <str>$userId,` : ""}
      ${createdAt ? `created_at := <datetime>$createdAt` : ""}
    }
  `;

  const params = {
    conversationId,
    topic,
    ...(userId && { userId }),
    ...(createdAt && { createdAt }),
  };

  const conversation = await client.querySingle(query, params);

  console.log("Conversation inserted:", conversation);
};
