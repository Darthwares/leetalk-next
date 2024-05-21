'use client';
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import TopicList from './topicList';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  categoryPage,
  generateImageUrl,
  navigation,
} from '@/constants/default';
import { classNames } from '@/lib/utils';
import getCategoryList from '@/lib/helper/edgedb/getCategoryList';
import { debateListState } from '@/state/state';
import { useRecoilState } from 'recoil';
import Loading from './loading';
const DesktopSidebar = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get('query');
  const [updatedState, setUpdatedState] = useRecoilState(debateListState);
  const [activeCategory, setActiveCategory] = useState<string>('');
  let pathArray = pathname === '/categories' ? categoryPage : navigation;
  React.useEffect(() => {
    if (query && pathArray.some((item) => item.name === query)) {
      setActiveCategory(query);
    }
    async function getSelectedList(query: string) {
      const list = await getCategoryList(query);
      const formattedList = list.map((debate: any) => ({
        title: debate.topic,
        dateAdded: new Date(debate.created_at).toLocaleDateString(),
        id: debate.conversation_id,
        time: new Date(debate.created_at).toLocaleTimeString(),
        imageUrl: generateImageUrl(debate.topic),
      }));
      setUpdatedState(formattedList as any);
    }
    query && getSelectedList(query!);
  }, [query, pathArray]);
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
      <Suspense fallback={<Loading />}>
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          <div className="flex h-16 pb-2 sticky top-0 z-20 -pr-5 bg-white/50 shrink-0 items-center">
            <Link href="/">
              <Image
                width={80}
                height={36}
                className="h-[3.5rem] w-20"
                src="/logo1.png"
                alt="Your Company"
              />
            </Link>
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
                  <TopicList />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Suspense>
  );
};
export default DesktopSidebar;
