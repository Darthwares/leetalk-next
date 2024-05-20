'use server';

import client from './edgedb';

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

  console.log('conversations', conversations);

  return conversations;
}
