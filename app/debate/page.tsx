import { InputDebate } from '@/components/InputDebate';
import ShowDebateChat from '@/components/showDebateChat';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate - Leetalk",
  description: "Debate section of Leetalk",
};

const Debate = () => {
  return (
    <>
      <InputDebate />
      <ShowDebateChat />
    </>
  );
};

export default Debate;
