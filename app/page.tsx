import ChatLayout from "@/components/chatLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Leetalk",
  description: "Home section of Leetalk",
};

export default async function Home() {
  return (
    <main className="mx-auto mx-w-7xl w-full">
      <ChatLayout />
    </main>
  );
}
