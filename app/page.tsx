import ChatLayout from "@/components/chatLayout";
import Landing from "@/components/landing";
import User from "@/components/user";

export default async function Home() {
  return (
    <main className="mx-auto mx-w-7xl w-full">
      <ChatLayout />
      {/* <User /> */}
    </main>
  );
}
