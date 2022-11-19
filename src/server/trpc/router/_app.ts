import { router } from "../trpc";
import { authRouter } from "./auth";
import { songsRouter } from "./songs";

export const appRouter = router({
  songs: songsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
