import { router } from "../trpc";
import { authRouter } from "./auth";
import { labelsRouter } from "./labels";
import { playlistsRouter } from "./playlists";
import { songsRouter } from "./songs";

export const appRouter = router({
  songs: songsRouter,
  auth: authRouter,
  labels: labelsRouter,
  playlists: playlistsRouter,
});

export type AppRouter = typeof appRouter;
