import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { UserMetadata } from "@/types/types";

const useSupabase = () => {
  const [user, setUser] = useState<UserMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();

      if (session && session.data.session?.user) {
        const userData = session.data.session?.user.user_metadata;

        try {
          const { data: existingData } = await supabase
            .from("users")
            .select()
            .eq("email", userData.email)
            .maybeSingle();

          if (existingData) {
            setUser(session.data.session?.user.user_metadata as UserMetadata);
            return;
          }

          const { data: newData } = await supabase.from("users").insert({
            user_id: userData.provider_id,
            email: userData.email,
            name: userData.name,
            image: userData.avatar_url,
            provider: "google",
          });

          if (newData) {
            console.log(newData);
          }
        } catch (error: any) {
          if (error.response?.status === 409) {
            console.error("Conflict: User with the same email already exists.");
          } else {
            console.error("Error:", error.message);
          }
        }
      } else {
        setUser(null);
        setError("No active session");
      }
    };

    fetchUser();
  }, []);

  const handleSignin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (data) {
      return data;
    }

    if (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
      return;
    }
    setUser(null);
    setError(null);
  };

  return {
    handleSignin,
    handleSignOut,
    user,
    error,
  };
};

export default useSupabase;
