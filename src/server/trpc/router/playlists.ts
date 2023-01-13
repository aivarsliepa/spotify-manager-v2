import { router, protectedProcedure } from "../trpc";

export const playlistsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.playlist.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
