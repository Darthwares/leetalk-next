'use client';

import { Button } from '@/components/ui/button';
import ShowChats from './showChats';
import { PlayIcon } from './svg';

export default function ShowDebateChat() {
  return (
    <div className="flex flex-col w-full p-4 md:p-6 bg-white shadow rounded-lg rounded-t-none">
      <ShowChats />
      <div className="flex items-center justify-between mt-4">
        <div className="mb-4 w-full">
          <Button className="w-full flex gap-2 py-3">
            <span className="text-lg">Listen </span>
            <PlayIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
