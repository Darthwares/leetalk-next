import TopicList from "@/components/topicList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search - Leetalk",
  description: "Search page of Leetalk",
};

const Search = () => {
  return (
    <>
      <TopicList />
    </>
  );
};

export default Search;
