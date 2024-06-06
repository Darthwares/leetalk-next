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
    FILTER .published = true
    ORDER BY .created_at DESC;
  `);

  return conversations;
}

export interface FirstMessage {
  audio_url?: string;
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
  first_message?: FirstMessage[];
  audio_duration?: number;
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
        sender,
        audio_url
      }
      FILTER .conversation_id = Conversations.conversation_id
      ORDER BY .created_at
    ) {
      message_text,
      sender,
      audio_url
    }
  }
  FILTER .published = true
  `);

  return conversations as FirstConversation[];
}

export async function getConversationsByCategory(
  category: string
): Promise<{ conversation_id: string; topic: string }[]> {
  const conversations = await client.query(
    `
    SELECT Conversations {
      conversation_id,
      topic
    }
    FILTER .category = <str>$category AND .published = true
    LIMIT 3;
  `,
    { category }
  );

  return conversations as { conversation_id: string; topic: string }[];
}

export async function getSelectedCategory(category: string) {
  const conversations = await client.query(
    `
    SELECT Conversations {
      conversation_id,
      topic
    }
    FILTER .category = <str>$category AND .published = true
    LIMIT 4;
  `,
    { category }
  );

  return conversations as { conversation_id: string; topic: string }[];
}

export async function getDebatesWithCategory(
  category: string
): Promise<FirstConversation[]> {
  const conversations = await client.query(
    `
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
        sender,
        audio_url
      }
      FILTER .conversation_id = Conversations.conversation_id
      ORDER BY .created_at
    ) {
      message_text,
      sender,
      audio_url
    }
  }
  FILTER .category = <str>$category AND .published = true
  `,
    { category }
  );

  return conversations as FirstConversation[];
}
