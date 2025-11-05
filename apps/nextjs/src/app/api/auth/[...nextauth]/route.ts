/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import NextAuth from "next-auth";

import { authOptions } from "@saasfly/auth";

// Disable static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
