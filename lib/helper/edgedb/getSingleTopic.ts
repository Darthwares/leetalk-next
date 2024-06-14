'use server';

import client from './edgedb';

export default async function getSingleTopic(conversationId: string) {
  const query = `
    select Conversations {
      conversation_id,
      user_id,
      topic,
      created_at,
      category,
      imageURL,
      published
    }
    filter .conversation_id = <str>$conversationId; 
  `;

  const topic = await client.query(query, { conversationId });
  return topic[0];
}
