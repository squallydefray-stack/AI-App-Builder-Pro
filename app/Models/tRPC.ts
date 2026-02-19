/* =============================
2. TEMPLATE API (tRPC)
============================= */
import { initTRPC } from '@trpc/server';
import { prisma } from '@/lib/prisma';


const t = initTRPC.create();


export const templateRouter = t.router({
getTemplates: t.procedure.query(async () => {
return prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
}),


createTemplate: t.procedure.input((val: any) => val).mutation(async ({ input }) => {
return prisma.template.create({ data: input });
}),


purchaseTemplate: t.procedure.input((val: any) => val).mutation(async ({ input }) => {
return prisma.marketplacePurchase.create({
data: input
});
})
});
