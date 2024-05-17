"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cards, categories } from "@/constants/default";

const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].name
  );

  const handleClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="p-5 max-w-7xl w-full">
      <div className="space-y-3 text-center">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pt-5 pb-10">
          <h2>What ever your mood is</h2>
          <h2 className="py-4 text-2xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            We have a debate for you
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {categories.map((category, index) => (
          <Button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg`}
            onClick={() => handleClick(category.name)}
          >
            <p className="text-sm text-white">{category.name}</p>
            <category.icon className="w-5 h-5 text-white" />
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full place-content-center">
        <AnimatePresence mode="wait">
          {cards[selectedCategory].slice(0, 7).map((card, index) => (
            <motion.div
              key={card.title}
              className="border border-gray-300 rounded-xl shadow-md overflow-hidden cursor-pointer py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={card.imgUrl}
                alt={`${selectedCategory} ${index + 1}`}
                className="w-full h-auto"
              />
              <p className="text-center text-sm p-2">{card.title}</p>
            </motion.div>
          ))}
          <motion.div
            key="explore-more"
            className="border border-gray-300 rounded shadow overflow-hidden cursor-pointer flex items-center justify-center font-extrabold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/explore/${selectedCategory}`}>
              <span className="text-center text-sm p-2">Explore More</span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryList;
