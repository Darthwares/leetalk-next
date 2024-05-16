"use server";

import client from "./edgedb";

interface ToggleLikeProps {
  messageId: string;
  conversationId: string;
  userId: string;
}

export const setPostLikes = async ({
  messageId,
  userId,
  conversationId,
}: ToggleLikeProps) => {
  const isPostLikedQuery = `
    SELECT Likes {
      id,
      like_id,
      message_id,
      user_id
    }
    FILTER .like_id = <str>$conversationId AND
           .message_id = <str>$messageId AND
           .user_id = <str>$userId;
  `;

  const likedPosts = await client.query(isPostLikedQuery, {
    conversationId,
    messageId,
    userId,
  });

  const isTotalLikes = `
  SELECT Likes {
    message_id
  }
  FILTER .message_id = <str>$messageId;
`;

  const totalLikes = await client.query(isTotalLikes, {
    messageId,
  });

  if (likedPosts.length > 0) {
    const deleteQuery = `
      DELETE Likes
      FILTER .message_id = <str>$messageId AND
            .user_id = <str>$userId AND
            .like_id = <str>$conversationId;
    `;

    await client.query(deleteQuery, {
      messageId,
      conversationId,
      userId,
    });
    return { liked: false, count: totalLikes.length - 1  };
  } else {
    const insertQuery = `
      INSERT Likes {
        message_id := <str>$messageId,
        like_id := <str>$conversationId,
        user_id := <str>$userId
      }
    `;
    await client.query(insertQuery, {
      messageId,
      conversationId,
      userId,
    });
    return { liked: true, count: totalLikes.length + 1 };
  }
};

export const getPostLikeStatus = async ({
  messageId,
}: Pick<ToggleLikeProps, 'messageId'>) => {
  const isPostLikedQuery = `
    SELECT Likes {
      id,
      like_id,
      message_id,
    }
    FILTER .message_id = <str>$messageId;
  `;

  const likedPosts = await client.query(isPostLikedQuery, {
    messageId
  });

  const isTotalLikes = `
    SELECT Likes {
      message_id
    }
    FILTER .message_id = <str>$messageId;
  `;

  const totalLikes = await client.query(isTotalLikes, {
    messageId,
  });

  return {
    liked: likedPosts.length > 0,
    count: totalLikes.length,
  };
};