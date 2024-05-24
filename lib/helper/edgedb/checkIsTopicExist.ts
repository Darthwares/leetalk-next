'use server';

import client from './edgedb';

export default async function checkIsTopicExist(topic: string) {
  const query = `
    select Conversations {
      conversation_id
    }
    filter .topic = <str>$topic; 
  `;

  const topics = await client.query(query, { topic });
  return topics.length > 0;
}
