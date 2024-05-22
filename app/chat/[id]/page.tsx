import ShowSingle from "@/components/chatContainer/singleChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debate Topic - Leetalk",
  description: "Debate Topic section of Leetalk",
};

const ShowSingleChats = ({ params }: { params: { id: string } }) => {
  return <ShowSingle params={params} />;
};

export default ShowSingleChats;
