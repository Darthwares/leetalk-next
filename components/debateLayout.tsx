'use client';

import React from 'react';
import { useWindowDimensions } from '@/lib/helper/useWindowDimensions';
import Sidebar from './sidebar';

const DebateLayout = () => {
  const { height, width } = useWindowDimensions();
  return (
    <div className="flex flex-col gap-10 max-w-7xl my-8 mx-auto lg:flex-row w-full bg-gray-100 items-stretch p-4 md:p-8">
      <Sidebar />
    </div>
  );
};

export default DebateLayout;
