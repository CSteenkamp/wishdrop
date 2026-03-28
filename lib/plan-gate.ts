import { prisma } from '@/lib/db';

export async function isPaidPlan(registryId: string): Promise<boolean> {
  const registry = await prisma.registry.findUnique({
    where: { id: registryId },
    select: { plan: true },
  });
  if (!registry) return false;
  return registry.plan === 'unlimited' || registry.plan === 'plus' || registry.plan === 'pro';
}
