import React from 'react';
import { MemoizedReactMarkdown } from './memoizedReactMarkdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
interface ChildNodeProps {
  children?: React.ReactNode;
}

const CustomParagraph = ({ children }: ChildNodeProps) => {
  return <p className="mb-2 last:mb-0">{children}</p>;
};

const CustomList = ({ children }: ChildNodeProps) => {
  return (
    <span className="mb-2 last:mb-0">
      <li>{children}</li>
    </span>
  );
};

const CustomStrong = ({ children }: ChildNodeProps) => {
  return (
    <strong className="cursor-cell font-medium text-gray-800 rounded-xl">
      {children}
    </strong>
  );
};

const CustomEmphasis = ({ children }: ChildNodeProps) => {
  return (
    <em className="cursor-cell not-italic text-gray-600 bg-gradient-to-r rounded-xl from-indigo-100 to-pink-50">
      {children}
    </em>
  );
};
interface ShowMarkdownProps {
  content: string;
}

const ShowMarkdown = ({ content }: ShowMarkdownProps) => {
  return (
    <MemoizedReactMarkdown
      className="prose break-words markdown-color dark:prose-invert text-gray-[#676262] prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p: CustomParagraph,
        li: CustomList,
        strong: CustomStrong,
        em: CustomEmphasis,
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
};

export default ShowMarkdown;
