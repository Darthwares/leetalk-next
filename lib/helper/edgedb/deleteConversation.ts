'use server';

import client from './edgedb';

export default async function deleteConversation(conversationId: string) {
  const deleteQuery = `
    with
      cid := <str>$conversationId
    delete Messages
    filter .conversation_id = cid;

    with
      cid := <str>$conversationId
    delete Conversations
    filter .conversation_id = cid;
  `;

  await client.execute(deleteQuery, { conversationId });
}
