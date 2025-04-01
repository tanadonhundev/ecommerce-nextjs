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
    expiresIn: 60 * 30, // ✅ 30 นาที
    updateAge: 60 * 5, // ✅ อัปเดตทุก 5 นาที
  },
  advanced: {
    cookiePrefix: "thana-app",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },
});
