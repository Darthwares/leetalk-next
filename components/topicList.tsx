import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWindowDimensions } from '@/lib/helper/useWindowDimensions';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface Topic {
  query: string;
}

const dataList = [
  { query: 'hello redis' },
  { query: 'hello nodejs' },
  { query: 'Climate change is the greatest threat facing humanity today.' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
  { query: 'welcome to coding' },
];

const TopicList = () => {
  const { height, width } = useWindowDimensions();
  const [topics, setTopics] = useState<Topic[]>(dataList);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredTopics = dataList.filter((topic) =>
      topic.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTopics(filteredTopics);
  }, [searchTerm]);

  return (
    <div
      className="flex flex-col w-full pb-10 h-full space-y-3 bg-white p-2 rounded-lg"
    //   style={{ maxHeight: `calc(${height}px - 250px)`, overflowY: 'scroll' }}
    >
      <h2 className="bg-gray-800 text-white text-center rounded-md p-2">
        Topic Suggestions
      </h2>
      <div className="flex flex-col mb-4">
        <Input
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        // style={{ maxHeight: `calc(${height}px - 250px)`, overflowY: 'scroll' }}
        className=""
      >
        {topics.length > 0 ? (
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg">
                <Link href="#" className='line-clamp-1 hover:line-clamp-none'>{topic.query}</Link>
                {/* <div className="">
                  <Separator />
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No topics found.</div>
        )}
      </div>
    </div>
  );
};

export default TopicList;
