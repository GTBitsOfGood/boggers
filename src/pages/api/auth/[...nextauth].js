import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {getUser} from "../../../server/mongodb/actions/User";
import connectMongo from "../../../server/mongodb/connectMongo";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        await connectMongo();
        const user = await getUser(credentials.email);
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) token.user = user;
      return token;
    },
    async session({session, token}) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
