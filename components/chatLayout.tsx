'use client';

import { useRecoilState } from 'recoil';
import { InputDebate } from './InputDebate';
import ShowDebateChat from './showDebateChat';
import { messagesState, showDebateInputBoxState } from '@/state/state';
import Image from 'next/image';

export default function ChatLayout() {
  const [chatList] = useRecoilState(messagesState);
  const [showDebateInputBox] = useRecoilState(showDebateInputBoxState);
  
  return (
    <>
      {showDebateInputBox && <InputDebate />}
      <ShowDebateChat />
    </>
  );
}
