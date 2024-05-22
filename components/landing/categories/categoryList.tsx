"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { categories, generateImageUrl } from "@/constants/default";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { getConversationsByCategory } from "@/lib/helper/edgedb/dbClient";

const placeholderData = [
  {
    conversation_id: "placeholder-1",
    topic: "Placeholder Topic 1",
  },
  {
    conversation_id: "placeholder-2",
    topic: "Placeholder Topic 2",
  },
  {
    conversation_id: "placeholder-3",
    topic: "Placeholder Topic 3",
  },
];

const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].name
  );
  const [conversations, setConversations] =
    useState<{ conversation_id: string; topic: string }[]>(placeholderData);

  const handleClick = async (category: string) => {
    setSelectedCategory(category);
    const data = await getConversationsByCategory(category);
    if (data.length === 0) {
      setConversations(placeholderData);
    } else {
      setConversations(data);
    }
  };

  useEffect(() => {
    handleClick(selectedCategory);
  }, []);

  return (
    <div className="w-full">
      <div className="space-y-3 text-center">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pt-5 pb-10">
          <h2 className="py-4 text-2xl sm:text-4xl font-extrabold">
            We have a{' '}
            <span className="text-gray-600 text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              debate for you
            </span>
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap sm:px-8 px-2 items-center gap-3 mb-5">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              selectedCategory === category.name
                ? 'bg-slate-900 font-semibold text-white'
                : 'bg-white border font-semibold border-slate-900'
            }`}
            onClick={() => handleClick(category.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <p>{category.name}</p>
            <category.icon className="w-5 h-5" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:auto-rows-[18rem] mt-10 grid-cols-1 md:grid-cols-2 px-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto"
        >
          {conversations.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.topic}
              image={generateImageUrl(item.topic)}
              className={''}
              id={item.conversation_id}
            />
          ))}
          <div className="row-span-1 rounded-xl h-full group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] border border-gray-300 gap-2 p-4 flex flex-col space-y-4">
            <div className="flex flex-1 w-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black aspect-square h-48 object-center bg-gradient-to-br from-neutral-300 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
            <div className="group-hover/bento:translate-x-2 relative bottom-[50%] transition duration-200">
              <div className="font-sans text-center font-bold text-neutral-600 dark:text-neutral-200">
                <Link href={`/categories?query=${selectedCategory}`}>
                  <span className="text-center text-sm bg-black text-white rounded-lg px-4 py-2">
                    Explore More
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;
