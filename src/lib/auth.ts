import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import conn from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema";

const db = await conn;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql", // or "pg", "sqlite"
    schema: {
      user: user,
      account: account,
      session: session,
      verification: verification,
    },
    usePlural: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    minPasswordLength: 4,
    sendVerificationEmail: true,
  },
  socialProviders: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 15, // ✅ 15 นาที (900 วินาที)
    updateAge: 60 * 1, // ✅ อัปเดตทุก 1 นาที (60 วินาที)
  },
});
