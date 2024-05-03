'use client';

import React from 'react';
import { useWindowDimensions } from '@/lib/helper/useWindowDimensions';
import ChatLayout from './chatLayout';

const DebateLayout = () => {
  const { height, width } = useWindowDimensions();
  return (
    <div className="flex flex-col gap-10 max-w-7xl my-8 mx-auto lg:flex-row w-full bg-gray-100 items-stretch p-4 md:p-8">
      <ChatLayout />
    </div>
  );
};

export default DebateLayout;
