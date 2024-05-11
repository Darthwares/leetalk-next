'use client';

import { useRecoilState } from 'recoil';
import { InputDebate } from './InputDebate';
import ShowDebateChat from './showDebateChat';
import { showDebateInputBoxState } from '@/state/state';

export default function ChatLayout() {
  const [showDebateInputBox] = useRecoilState(showDebateInputBoxState);

  return (
    <>
      {showDebateInputBox && <InputDebate />}
      <ShowDebateChat />
    </>
  );
}
