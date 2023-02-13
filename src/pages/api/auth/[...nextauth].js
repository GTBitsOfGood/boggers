import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUser } from "../../../server/mongodb/actions/User";
import urls from "../../../server/utils/urls";
import connectMongo from "../../../server/mongodb/connectMongo";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongo();
        console.log("starting authorization");
        const user = await getUser(credentials.email);
        console.log("got authorized user", user);
        if (user && user.emailVerified && (await bcrypt.compare(credentials.password, user.password))) {
          console.log("user authorized");
          return user;
        } else {
          console.log("user not authorized");
          return null;
        }
      },
    }),
  ],
  secret: urls.nextAuthSecret,
  callbacks: {
    async redirect() {
      return urls.base + urls.pages.member;
    },
    async jwt({ token, user }) {
      console.log("jwt", token, user);
      if (user) token.user = user;
      console.log("after jwt", token);
      return token;
    },
    async session({ session, token }) {
      console.log("session", session, token);
      session.user = token.user;
      console.log("after session", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
