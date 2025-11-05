import type { NextRequest } from "next/server";
import {initTRPC, TRPCError} from "@trpc/server";
import type { Session } from "next-auth";
import { ZodError } from "zod";

import { transformer } from "./transformer";

interface CreateContextOptions {
  session: Session | null;
  headers: Headers;
}

export const createTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    headers: opts.headers,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<TRPCContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const procedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // Make ctx.session.user non-nullable in protected procedures
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});


export const protectedProcedure = procedure.use(isAuthed);