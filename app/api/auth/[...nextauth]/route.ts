import NextAuth from "next-auth";

import CredentialsProvider
from "next-auth/providers/credentials";

const handler = NextAuth({

  providers: [

    CredentialsProvider({

      name: "Credentials",

      credentials: {

        email: {},

        password: {},
      },

      async authorize(
        credentials
      ) {

        //////////////////////////////////////////////////////
        // ADMIN
        //////////////////////////////////////////////////////

        if (

          credentials?.email ===
          "admin@allohealth.com"

          &&

          credentials?.password ===
          "admin123"
        ) {

          return {

            id: "1",

            name: "Admin",

            email:
              "admin@allohealth.com",

            role:
              "ADMIN",
          };
        }

        //////////////////////////////////////////////////////
        // STAFF
        //////////////////////////////////////////////////////

        if (

          credentials?.email ===
          "staff@allohealth.com"

          &&

          credentials?.password ===
          "staff123"
        ) {

          return {

            id: "2",

            name: "Staff",

            email:
              "staff@allohealth.com",

            role:
              "STAFF",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {

    //////////////////////////////////////////////////////
    // JWT
    //////////////////////////////////////////////////////

    async jwt({
      token,
      user,
    }) {

      if (user) {

        token.role =
          (user as any).role;
      }

      return token;
    },

    //////////////////////////////////////////////////////
    // SESSION
    //////////////////////////////////////////////////////

    async session({
      session,
      token,
    }) {

      if (session.user) {

        (session.user as any).role =
          token.role;
      }

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
});

export {
  handler as GET,
  handler as POST,
};