'use client';
import React, { useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';

interface LoginPageProps { 
    callBackUrl:string
}
export function LoginPage({ callBackUrl }: LoginPageProps) {
  const ref = useRef(null);

  useEffect(() => {
    import('@lottiefiles/lottie-player');
  });
  return (
    <>
      <div className=" flex w-full pt-20 sm:pt-32 items-center flex-col sm:flex-row">
        <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome to Leet Talk
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login to to view all the features and your debates information
          </p>

          <div className="my-8 max-w-md">
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              onClick={() => {
                signIn('google', { callBackUrl });
              }}
            >
              Sign In &rarr;
              <BottomGradient />
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="h-72 lg:h-96">
            <lottie-player
              ref={ref}
              src="/login.json"
              background="white"
              speed={1}
              loop
              autoplay
              data-testid="lottie"
            />
          </div>
        </div>
      </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
