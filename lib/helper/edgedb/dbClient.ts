"use server";

import { createClient, createHttpClient } from "edgedb";

const client = createClient();

export default async function getList() {
  const conversations = await client.query(`\
    select Conversations {
      conversation_id,
      user_id,
      topic,
      created_at
    };`);

   console.log('conversations', conversations)

  return conversations;
}
