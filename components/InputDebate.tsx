'use client';

import { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';
import { guid } from '@/constants/default';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  conversationIdState,
  loaderState,
  showDebateInputBoxState,
  waitingMessageState,
} from '@/state/state';
import { setConversations } from '@/lib/helper/edgedb/setConversations';
import { useSession } from 'next-auth/react';
import Loading from './loading';
import { useRouter } from 'next/navigation';

export function InputDebate() {
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [id, setId] = useRecoilState(conversationIdState);
  const setWaitingMessage = useSetRecoilState(waitingMessageState);
  const setShowDebateInputBox = useSetRecoilState(showDebateInputBoxState);
  const [error, setError] = useState('');
  const [loader, setLoader] = useRecoilState(loaderState);
  const router = useRouter();

  if (status === 'unauthenticated') {
    setTimeout(() => {
      return router.push('/');
    }, 1000);
  }

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <>
      {status === 'authenticated' && (
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
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </CardContent>
          <CardFooter>
            <Button
              className="ml-2 whitespace-nowrap"
              onClick={async () => {
                if (!inputValue) {
                  setError('Please enter debate topic!');
                  return;
                }
                const id = guid();
                setId(id);
                await setConversations({
                  conversationId: id,
                  topic: inputValue.trim(),
                  userId: session?.user?.id ?? '',
                });

                const result = await runDebate(inputValue.trim(), id);
                if (result) {
                  setLoader(false);
                }
              }}
            >
              Start Debate
              <PlaneIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
