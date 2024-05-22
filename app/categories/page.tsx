import CategoryContainer from "@/components/categoriesContainer/category";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Categories - Leetalk",
  description: "category section of Leetalk",
};

const Category = () => {
  return <CategoryContainer />
};

export default Category;
