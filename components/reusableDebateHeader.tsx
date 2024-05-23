'use client';

import { ShareIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

type DebateHeaderProps = {
  topic: string;
  handleShare: () => void;
  path: string;
  text: string;
};

const DebateHeader: React.FC<DebateHeaderProps> = ({
  topic,
  path,
  text,
  handleShare,
}) => {
  return (
    <div>
      <div className="flex lg:flex-row flex-col pb-10 lg:pb-0 items-center justify-between w-full">
        {topic && (
          <div className="mx-auto w-full py-5">
            <h2 className="font-extrabold text-4xl">Debate Topic</h2>
            <div>
              <h3 className="text-2xl py-5 font-bold">{topic}</h3>

              <div className="flex gap-2">
                <div
                  className="flex items-center cursor-pointer space-x-1"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-5 w-5 text-gray-400" />

                  <span className="text-sm flex gap-1">
                    <span className="md:block hidden">Share</span>
                  </span>
                </div>
              </div>
            </div>
            {/* we can also publish direcly after clicking here, we can show a modal and then publish directly */}
            <div className="flex justify-end">
              <Button className="max-w-fit flex gap-2 py-3">
                <Link href={path}>{text}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateHeader;
