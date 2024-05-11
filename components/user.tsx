"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const User = () => {
  const { data: session } = useSession();
  console.log('session', session)
  return (
    <div>
      {session ? (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back, {session.user?.name}!
          </h2>
          <img src={session.user?.image as string} alt="" />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <button
            className="px-4 py-2.5 bg-gray-50 text-gray-900 rounded-md font-semibold"
            onClick={() => {
              signIn("google");
            }}
          >
            Sign in with google
          </button>
        </>
      )}
    </div>
  );
};

export default User;
