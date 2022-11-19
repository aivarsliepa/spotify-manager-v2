import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const songsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({ where: { id: ctx.session.user.id } }).songs();
  }),
});
