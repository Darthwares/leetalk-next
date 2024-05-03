'use client';

import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

const RealTimePosts = ({ serverPosts }: any) => {
    const [posts, setPosts] = useState(serverPosts);
  useEffect(() => {
    const channel = supabase
      .channel('realtime posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload: any) => {
          setPosts([...posts, payload.new]);
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, posts,setPosts]);

  return <div>{JSON.stringify(serverPosts, null, 2)}</div>;
};

export default RealTimePosts;
