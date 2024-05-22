"use server";

import client from "./edgedb";

export default async function getList() {
  const conversations = await client.query(`
    SELECT Conversations {
      conversation_id,
      user_id,
      topic,
      created_at,
      category,
      published
    }
    FILTER .published = true;
  `);

  console.log("conversations", conversations);

  return conversations;
}

export interface FirstMessage {
  message_text: string;
  sender: string;
}

export interface FirstConversation {
  conversation_id: string;
  user_id: string;
  topic: string;
  created_at: string;
  category: string;
  published: boolean;
  first_message?: FirstMessage;
}

export async function getAllDebates(): Promise<FirstConversation[]> {
  const conversations = await client.query(`
  SELECT Conversations {
    conversation_id,
    user_id,
    topic,
    created_at,
    category,
    published,
    first_message := (
      SELECT Messages {
        message_text,
        sender
      }
      FILTER .conversation_id = Conversations.conversation_id
      ORDER BY .created_at
      LIMIT 1
    ) {
      message_text,
      sender
    }
  }
  FILTER .published = true
  LIMIT 6;
  `);

  console.log("conversations", conversations);

  return conversations as FirstConversation[];
}


export async function getConversationsByCategory(category: string): Promise<{ conversation_id: string; topic: string }[]> {
  const conversations = await client.query(`
    SELECT Conversations {
      conversation_id,
      topic
    }
    FILTER .category = <str>$category
    LIMIT 3;
  `, { category });

  console.log("conversations by category", conversations);

  return conversations as { conversation_id: string; topic: string }[];
}
