import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const songsRouter = router({
  // get: protectedProcedure
  //   .input(
  //     z.object({
  //       skip: z.number().optional(),
  //     }),
  //   )
  //   .query(({ ctx, input }) => {
  //     return ctx.prisma.songsOnUsers.findMany({
  //       where: { userId: ctx.session.user.id },
  //       select: { song: true, isSaved: true },
  //       skip: input.skip,
  //       take: 50,
  //     });
  //   }),
  getInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.songsOnUsers.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: { userId: ctx.session.user.id },
        cursor: cursor
          ? {
              userId_songSpotifyId: {
                songSpotifyId: cursor,
                userId: ctx.session.user.id,
              },
            }
          : undefined,
        select: { song: true, isSaved: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.song.spotifyId;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
