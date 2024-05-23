'use server';

import client from './edgedb';

interface ConversationProps {
  conversationId: string;
  userId?: string; // Optional
  topic: string;
  createdAt?: string; // Optional
  category: string;
  publisher: boolean;
}

export const setConversations = async ({
  conversationId,
  userId,
  topic,
  createdAt,
  category,
  publisher,
}: ConversationProps) => {
  const query = `
  INSERT Conversations {
    conversation_id := <str>$conversationId,
    topic := <str>$topic,
    category := <str>$category,
    published := <bool>$publisher,
    ${userId ? `user_id := <str>$userId,` : ''}
    ${createdAt ? `created_at := <datetime>$createdAt` : ''}
    }
  `;

  const params = {
    conversationId,
    topic,
    category,
    publisher,
    ...(userId && { userId }),
    ...(createdAt && { createdAt }),
  };

  const conversation = await client.querySingle(query, params);

  console.log('Conversation inserted:', conversation, conversationId);
};
