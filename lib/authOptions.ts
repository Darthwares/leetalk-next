import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import client from "./helper/edgedb/edgedb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      //   call database here and save the details
      const checkUserQuery = `
      SELECT Users {
        id
      }
      FILTER .email = <str>$email
      LIMIT 1
    `;

      const query = `
      INSERT Users {
        name := <str>$name,
        email := <str>$email,
        user_id := <str>$userId,
        image := <str>$image,
        provider := 'google'
      }
    `;

      const params = {
        name: user.name,
        email: user.email,
        userId: user.id,
        image: user.image,
      };

      try {
        const existingUser = await client.querySingle(checkUserQuery, {
          email: user.email,
        });

        if (!existingUser) {
          await client.querySingle(query, params);
          console.log("User inserted successfully.");
        }

        return true;
      } catch (error) {
        console.error("Error inserting user:", error);
        return false;
      }

      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
