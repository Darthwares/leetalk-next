import MyDebateContainer from "@/components/myDebatesContainer/myDebate";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debates - Leetalk",
  description: "Debates section of Leetalk",
};
const MyDebate = () => {
  return <MyDebateContainer />;
};

export default MyDebate;
