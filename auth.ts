import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import {
  authUserWithCredentials,
  authUserWithGoogle,
} from "./actions/authActions";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  otp: z.string().optional(),
});

const providers: Provider[] = [
  Google,
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      otp: { label: "OTP", type: "text" },
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password, otp } = parsed.data;
      const user = await authUserWithCredentials(email, password, otp);

      console.log("user", user);

      if (!user) return null;

      return user;
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log("user", user);
      console.log("account", account);

      // NOT THE RIGHT WAY TO HANDLE THIS, IMPROVISE LATER
      if (account?.provider === "google") {
        if (!profile?.email) return false;
        const authUser = await authUserWithGoogle(
          user?.id || "",
          user?.email || "",
          user?.name || "",
          user?.image || ""
        );
        if (!authUser) return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
