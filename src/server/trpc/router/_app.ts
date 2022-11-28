import { router } from "../trpc";
import { authRouter } from "./auth";
import { labelsRouter } from "./labels";
import { songsRouter } from "./songs";

export const appRouter = router({
  songs: songsRouter,
  auth: authRouter,
  labels: labelsRouter,
});

export type AppRouter = typeof appRouter;
