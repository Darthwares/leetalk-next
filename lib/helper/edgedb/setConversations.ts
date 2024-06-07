"use server";

import { Conversations } from "@/types/types";
import client from "./edgedb";

interface ConversationProps {
  conversationId: string;
  userId?: string; // Optional
  topic: string;
  createdAt?: string; // Optional
  category: string;
  imageURL: string;
  publisher: boolean;
}

export const setConversations = async ({
  conversationId,
  userId,
  topic,
  createdAt,
  imageURL,
  category,
  publisher,
}: ConversationProps) => {
  const query = `
  INSERT Conversations {
    conversation_id := <str>$conversationId,
    topic := <str>$topic,
    category := <str>$category,
    imageURL := <str>$imageURL,
    published := <bool>$publisher,
    ${userId ? `user_id := <str>$userId,` : ""}
    ${createdAt ? `created_at := <datetime>$createdAt` : ""}
    }
  `;

  const params = {
    conversationId,
    topic,
    category,
    publisher,
    imageURL,
    ...(userId && { userId }),
    ...(createdAt && { createdAt }),
  };

  console.log("params", params);

  await client.querySingle(query, params);
};

export const incrementViewCount = async (conversation_id: string) => {
  console.log("conversation_id", conversation_id);
  const query = `
    WITH
      conversation := (
        SELECT Conversations
        FILTER .conversation_id = <str>$conversation_id
        AND .published = true
      )
    UPDATE Conversations
    FILTER .conversation_id = <str>$conversation_id
    SET {
      viewCount := .viewCount + 1
    }
  `;
  try {
    await client.query(query, { conversation_id });
    console.log(`View count incremented for conversation: ${conversation_id}`);
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
};

export const getCounterofConversation = async (conversation_id: string) => {
  const query = `
    SELECT Conversations {
      id,
      viewCount
    }
    FILTER .conversation_id = <str>$conversation_id AND .published = true;
  `;
  try {
    const response: any = await client.query(query, { conversation_id });
    return response[0].viewCount; // Return the viewCount.
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
};

export const getTopTenConversations = async () => {
  const query = `
    SELECT Conversations {
      topic,
      viewCount,
      conversation_id,
      imageURL
    }
    FILTER .published = true
    ORDER BY .viewCount DESC
    LIMIT 10;
  `;

  try {
    const topConversations = await client.query(query);
    return topConversations as Conversations[];
  } catch (error) {
    console.error("Failed to fetch top conversations:", error);
    throw new Error("Failed to fetch top conversations");
  }
};
