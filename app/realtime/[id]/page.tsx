import { supabase } from '@/lib/supabase';
import React from 'react';
import RealTimePost from './realtime-post';


export const revalidate = 0;


const DynamicPost = async ({ params }: { params: { id: string } }) => {
    console.log("params",params)
  const { data: conversationData, error: conversationError } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', params.id)
    .single();
  return (
    <div>
      <RealTimePost serverPosts={conversationData ?? []} />
    </div>
  );
};

export default DynamicPost;
