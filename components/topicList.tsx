import { Dispatch, SetStateAction, useMemo, useState } from "react";
import Link from "next/link";
import { useWindowDimensions } from "@/lib/helper/useWindowDimensions";
import { Input } from "./ui/input";
import useDebateTopics from "@/lib/helper/useDebateTopics";

interface TopicListProps {
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}
const TopicList = ({ setSidebarOpen }: TopicListProps) => {
  const { height, width } = useWindowDimensions();
  const [searchTerm, setSearchTerm] = useState('');
  const { topics } = useDebateTopics();

  const filteredTopics = useMemo(() => {
    return topics?.filter((topic) =>
      topic?.topic?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, topics]);

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
        {filteredTopics!?.length > 0 ? (
          <div className="space-y-2">
            {filteredTopics?.map((item, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg">
                <Link
                  href={`/chat/${item.conversation_id}`}
                  className="line-clamp-2 hover:line-clamp-none delay-200 translate-x-0 duration-150"
                  onClick={() => setSidebarOpen && setSidebarOpen(false)}
                >
                  {item.topic}
                </Link>
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
