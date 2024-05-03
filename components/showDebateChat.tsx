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
    <div className="flex flex-col w-full mx-auto p-4 md:p-6 bg-white shadow rounded-lg rounded-t-none">
      <ShowChats />
      {messages?.length! > 0 ? (
        <div className="flex items-center justify-between mt-4">
          <div className="mb-4 w-full">
            <Button className="w-full flex gap-2 py-3">
              <span className="text-lg">Listen </span>
              <PlayIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
