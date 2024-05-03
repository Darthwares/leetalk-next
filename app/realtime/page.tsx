import { supabase } from '@/lib/supabase';
import React from 'react';
import RealTimePosts from './realtime-posts';


export const revalidate = 0;

const Post = async () => {
  const { data: conversationData, error: conversationError } = await supabase
    .from('messages')
    .select();
  return (
    <div>
      <RealTimePosts serverPosts={conversationData ?? []} />
    </div>
  );
};

export default Post;
