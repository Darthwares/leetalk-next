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
import { PlaneIcon } from './svg';

export function InputDebate() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState("");
  // const [result, setResult] = useState('');

  return (
    <Card className="w-full">
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
              {error && <span className='text-red-500 text-sm'>{error}</span>}
      </CardContent>
      <CardFooter>
        <Button
          className="ml-2 whitespace-nowrap"
          onClick={async () => {
            if (!inputValue) {
              setError("Please enter debate topic!");
              return;
            }
            const result = await runDebate(inputValue);
            // setResult(result);
          }}
        >
          Start Debate
          <PlaneIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
