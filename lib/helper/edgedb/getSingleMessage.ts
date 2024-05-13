'use server';

import { createClient } from 'edgedb';

const client = createClient();

export default async function getSingleMessages(conversationId: string) {
  const query = `
    select Messages {
      conversation_id,
      message_id,
      sender,
      message_text,
      created_at
    }
    filter .conversation_id = <str>$conversationId; 
  `;

  const message = await client.query(query, { conversationId });

  return message;
}
