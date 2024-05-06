"use client";

import { Button } from "./ui/button";
import useSupabase from "@/lib/helper/useSupabase";
import { guid } from "@/constants/default";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const Login: React.FC = () => {
  const { handleSignin, user, handleSignOut, error } = useSupabase();

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user.provider_id)
            .single();

          if (error) {
            console.error("Error fetching user name:", error.message);
            return;
          }

          if (userData) {
            console.log("User name:", userData);
          }
        } catch (error: any) {
          console.error("Error fetching user name:", error.message);
        }
      };

      fetchUserName();
    }
  }, [user]);

  return (
    <div className="max-w-fit">
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {user ? (
        <>
          <p className="text-white">Welcome, {user.name}</p>
          <Button onClick={handleSignOut}>Sign out</Button>
        </>
      ) : (
        <Button
          onClick={async () => {
            await handleSignin();
          }}
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
};

export default Login;
