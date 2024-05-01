'use client';
import { useState } from 'react';
import { Button } from '@ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@ui/card';
import { runDebate } from '@/serverActions/runDebate';
import { Textarea } from '@ui/textarea';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ShowChats from '../showChats';

interface HumanMessage {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: Content[];
    additional_kwargs: any;
    response_metadata: any;
  };
}

interface Content {
  type: string;
  text: string;
}

interface Result {
  messages: HumanMessage[];
  sender: string;
}

export function TopicInput() {
  const [inputValue, setInputValue] = useState('');
  // const [result, setResult] = useState('');

  return (
    <Card className="w-full lg:w-2/3">
      <CardHeader>
        <CardTitle>Enter a topic to debate</CardTitle>
        <CardDescription>
          Provide a topic or question to start a debate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="w-full border border-gray-300 dark:border-neutral-800 rounded-md p-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={5}
        />
        <div className="mt-4">
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className=""
          onClick={async () => {
            const result = await runDebate(inputValue);
            // setResult(result);
          }}
        >
          Start Debate
        </Button>
      </CardFooter>
      <ShowChats />
    </Card>
  );
}
