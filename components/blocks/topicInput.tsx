"use client"

import { useState } from "react";
import { Button } from "@ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@ui/card";
import { runDebate } from "@/serverActions/runDebate";
import { Textarea } from "@ui/textarea";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export function TopicInput() {

  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  
  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Enter a topic to debate</CardTitle>
        <CardDescription>Provide a topic or question to start a debate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="w-full border border-gray-300 dark:border-neutral-800 rounded-md p-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={5}
        />
      <div className="mt-4">
        <ReactMarkdown
          className="prose dark:prose-invert"
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
               // @ts-ignore
               <SyntaxHighlighter
               language={match[1]}
               PreTag="div"
               {...props}
             >
               {String(children).replace(/\n$/, '')}
             </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {`\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``}
        </ReactMarkdown>
      </div>
      </CardContent>
      <CardFooter>
        <Button
          className=""
          onClick={async () => {
            const result = await runDebate(inputValue);
            setResult(result);
          }}
        >
          Start Debate
        </Button>
      </CardFooter>
    </Card>
  );
}
