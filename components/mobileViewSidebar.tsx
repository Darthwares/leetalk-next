'use client';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Separator } from './ui/separator';
import React, { useState } from 'react';
import Image from 'next/image';
import TopicList from './topicList';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  categoryPage,
  generateImageUrl,
  navigation,
} from '@/constants/default';
import getCategoryList from '@/lib/helper/edgedb/getCategoryList';
import { debateListState } from '@/state/state';
import { useSetRecoilState } from 'recoil';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface MobileViewSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const MobileViewSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: MobileViewSidebarProps) => {

  const pathname = usePathname();
  const setUpdatedState = useSetRecoilState(debateListState);
  const [activeCategory, setActiveCategory] = useState<string>('');

  let pathArray = pathname === '/categories' ? categoryPage : navigation;

  const handleDebates = async (category: string) => {
    setActiveCategory(category);
    const list = await getCategoryList(category);

    const formattedList = list.map((debate: any) => ({
      title: debate.topic,
      dateAdded: new Date(debate.created_at).toLocaleDateString(),
      id: debate.conversation_id,
      time: new Date(debate.created_at).toLocaleTimeString(),
      imageUrl: generateImageUrl(debate.topic),
    }));

    setUpdatedState(formattedList as any);
  };
  
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 xl:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-2 ring-1 ring-white/10">
                <div className="flex h-16 z-20 -pr-5 shrink-0 items-center">
                  <Link href={'/'}>
                    <Image
                      width={80}
                      height={36}
                      className="h-[3.5rem] w-20"
                      src="/logo1.png"
                      alt="Your Company"
                    />
                  </Link>
                </div>

                <div className="">
                  {' '}
                  <Separator />
                </div>
                <div className="flex grow pt-5 flex-col gap-y-5 overflow-y-auto bg-gray-100 px-4 ring-1 ring-white/5">
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {pathArray.map((item) => (
                            <li
                              key={item.name}
                              onClick={() => handleDebates(item.name)}
                            >
                              <a
                                href={item.href}
                                className={classNames(
                                  activeCategory === item.name
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-700 hover:text-white hover:bg-gray-800',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-2">
                        <TopicList setSidebarOpen={setSidebarOpen} />
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileViewSidebar;
