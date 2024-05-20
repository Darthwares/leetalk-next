"use server";

import client from "./edgedb";

export default async function getCategoryList(category: string) {
  const query = `
  select Conversations {
    conversation_id,
    user_id,
    topic,
    created_at,
    category,
    published
  }
  filter .category = <str>$category and .published = true;
  `;

  return await client.query(query, { category });
}


export async function publishConversation(id: string) {
  const query = `
    UPDATE Conversations
    FILTER .conversation_id = <str>$id
    SET {
      published := true
    };
  `;

  try {
    const result = await client.query(query, { id });
    console.log('Conversation updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
}


