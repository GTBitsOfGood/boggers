import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUser } from "../../../server/mongodb/actions/User";
import urls from "../../../../utils/urls";
import mongoose from "mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!global.cache) {
          global.cache = await mongoose.connect(urls.dbUrl, { dbName: urls.dbName });
        }
        const user = await getUser(credentials.email);
        if (user && user.emailVerified && (await bcrypt.compare(credentials.password, user.password))) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: urls.nextAuthSecret,
  callbacks: {
    async redirect() {
      return urls.base + urls.pages.members;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
