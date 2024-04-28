"use client"

import { useState } from "react";
import { Button } from "@ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@ui/card";
import { runDebate } from "@/serverActions/runDebate";
import { Textarea } from "@ui/textarea";

export function TopicInput() {

  const [inputValue, setInputValue] = useState("");
  
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
      </CardContent>
      <CardFooter>
        <Button
          className=""
          onClick={() => {
            runDebate(inputValue);
          }}
        >
          Start Debate
        </Button>
      </CardFooter>
    </Card>
  );
}
