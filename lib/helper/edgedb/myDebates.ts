'use server';

import client from './edgedb';

export default async function getUserDebates(userId: string) {
  const conversations = await client.query(
    `
    SELECT Conversations {
      conversation_id,
      user_id,
      topic,
      created_at,
      category,
      published
    }
    FILTER .user_id = <str>$userId
    ORDER BY .created_at DESC;
  `,
    { userId }
  );

  return conversations;
}
