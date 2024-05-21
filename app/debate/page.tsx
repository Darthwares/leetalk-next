'use client';

import { InputDebate } from '@/components/InputDebate';
import Loading from '@/components/loading';
import ShowDebateChat from '@/components/showDebateChat';
import { Suspense } from 'react';

const Debate = () => {
  return (
    <Suspense fallback={<Loading />}>
      <InputDebate />
      <ShowDebateChat />
    </Suspense>
  );
};

export default Debate;
