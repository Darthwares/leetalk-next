import { TopicInput } from '@/components/blocks/topicInput';
import DebateLayout from '@/components/debateLayout';
import Sidebar from '@/components/sidebar';
import { supabase } from '@/lib/supabase';

export default function Home() {

  const saveData =async () => {
    const {data, error}= await supabase.from("demo").insert({name:"shailendra"})
  }

  return (
    <>
      {/* <main className="flex min-h-screen flex-col items-center justify-between py-5 px-2 lg:p-24">
        <TopicInput />
      </main> */}

      <main className="mx-auto mx-w-7xl w-full">
        {/* <ChatHistory /> */}
        {/* <DebateLayout /> */}
       <Sidebar />
      </main>
    </>
  );
}
