"use server";

import client from "./edgedb";

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
