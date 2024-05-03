'use client';

import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

const RealTimePost = ({ serverPost }: any) => {
  const [post, setPost] = useState(serverPost);
  useEffect(() => {
    const channel = supabase
      .channel('realtime posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages',filter: `conversation_id=eq.${serverPost.conversation_id}` },
        (payload: any) => {
          setPost([payload.new]);
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, post, setPost]);

  return <div>{JSON.stringify(post, null, 2)}</div>;
};

export default RealTimePost;
