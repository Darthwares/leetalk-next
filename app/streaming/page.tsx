'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
interface DebateResponse {
  model: string;
  response: string;
}
export default function Home() {
  const [streamedData, setStreamedData] = useState<DebateResponse[]>([]);
  const [isDebateOver, setIsDebateOver] = useState<boolean>(false);
  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStreamedData([]);
    setIsDebateOver(false);
    const formData = new FormData(e.currentTarget);
    const response = await fetch('api/langchain', {
      method: 'POST',
      body: JSON.stringify({
        prompt: formData.get('prompt'),
        key: formData.get('key'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const reader = response.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = new TextDecoder().decode(value);
        const jsonResponse = text
          .trim()
          .split('\n')
          .map((line) => JSON.parse(line));
        for (const response of jsonResponse) {
          if (response.end) {
            setIsDebateOver(true);
            break;
          } else {
            setStreamedData((prevData) => [...prevData, response]);
          }
        }
      }
    }
  };
  const handleClearChat = () => {
    setStreamedData([]);
    setIsDebateOver(false);
  };
  return (
    <main className="flex max-w-6xl mx-auto items-center justify-center p-24">
      <div className="flex flex-col gap-12">
        <form onSubmit={handleChatSubmit}>
          <div className="flex flex-col gap-2">
            <input
              className="py-2 px-4 rounded-md w-full"
              placeholder="Enter prompt"
              name="prompt"
              required
            ></input>
          </div>
          <div className="flex justify-center gap-4 py-4">
            <button
              type="submit"
              className="py-2 px-4 rounded-md text-sm bg-lime-700 text-white hover:opacity-80 transition-opacity"
            >
              Send Chat
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="py-2 px-4 rounded-md text-sm bg-red-700 text-white hover:opacity-80 transition-opacity"
            >
              Clear Chat
            </button>
          </div>
        </form>
        {streamedData.length > 0 && (
          <div>
            <h3 className="text-2xl text-gray-400">AI Assistant</h3>
            <div className="rounded-md bg-gray-700 p-4 text-white space-y-2">
              {streamedData.map((data, index) => (
                <p key={index}>
                  <strong>{data.model}:</strong> {data.response}
                </p>
              ))}
            </div>
          </div>
        )}
        {isDebateOver && (
          <div className="text-center text-green-500">
            <p>The debate is over. Thank you for participating!</p>
          </div>
        )}
      </div>
    </main>
  );
}
