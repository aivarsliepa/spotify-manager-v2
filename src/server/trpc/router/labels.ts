import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const labelsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.label.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        name: true,
        id: true,
      },
    });
  }),
  createAndConnectToSong: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        songId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          songs: {
            connect: {
              spotifyId: input.songId,
            },
          },
        },
      });
    }),
  connectToSong: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        songId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: {
          name_userId: {
            name: input.name,
            userId: ctx.session.user.id,
          },
        },
        data: {
          songs: {
            connect: {
              spotifyId: input.songId,
            },
          },
        },
      });
    }),
  disconnectSong: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        songId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: {
          name_userId: {
            name: input.name,
            userId: ctx.session.user.id,
          },
        },
        data: {
          songs: {
            disconnect: {
              spotifyId: input.songId,
            },
          },
        },
      });
    }),
});
