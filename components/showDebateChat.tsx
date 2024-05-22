'use client';

import { Button } from '@/components/ui/button';
import ShowChats from './showChats';
import { PlayIcon } from './svg';
import useDebateMessages from '@/lib/helper/useDebateMessages';
import { useRecoilState } from 'recoil';
import { showDebateInputBoxState } from '@/state/state';

export default function ShowDebateChat() {
  const { messages } = useDebateMessages();
  const [showDebateInputBox] = useRecoilState(showDebateInputBoxState);
  return (
    <div className="flex flex-col w-full mx-auto p-4 md:p-6 bg-white rounded-lg rounded-t-none">
      <ShowChats />
    </div>
  );
}
