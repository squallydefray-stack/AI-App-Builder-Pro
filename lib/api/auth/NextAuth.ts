/* =============================
3. AUTH CONFIG
============================= */


// app/api/auth/[...nextauth]/route.ts


import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


export const authHandler = NextAuth({
adapter: PrismaAdapter(prisma),
providers: [
GitHub({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
Google({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! })
],
session: { strategy: "jwt" }
});


export { authHandler as GET, authHandler as POST };
