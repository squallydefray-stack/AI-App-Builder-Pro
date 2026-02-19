/* =============================
4. tRPC API ROUTER
============================= */


// server/api/router.ts


import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";


const t = initTRPC.create();


export const appRouter = t.router({
getProjects: t.procedure.query(() => {
return prisma.project.findMany();
}),


saveSchema: t.procedure
.input((val: any) => val)
.mutation(({ input }) => {
return prisma.project.update({
where: { id: input.projectId },
data: { schema: input.schema }
});
})
});


export type AppRouter = typeof appRouter;