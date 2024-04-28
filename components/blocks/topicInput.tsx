import { useState } from "react";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

export function TopicInput() {

  const [inputValue, setInputValue] = useState("");
  
  return (
    <>
      <Input
        type="text"
        className="border border-gray-300 dark:border-neutral-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        className=""
        onClick={() => {
          fetch("/api/startDebate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: inputValue }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
            });
        }}
      >
        Click me
      </Button>
    </>
  );
}
