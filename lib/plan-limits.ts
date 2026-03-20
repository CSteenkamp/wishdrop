import { prisma } from '@/lib/db';
import { PLANS, PlanType } from '@/lib/stripe';

export async function checkRegistryLimits(registryId: string) {
  const registry = await prisma.registry.findUnique({
    where: { id: registryId },
    include: {
      _count: { select: { participants: true } },
      subscription: true,
    },
  });

  if (!registry) return null;

  const rawPlan = registry.plan || 'free';
  // Map legacy plans (plus/pro) to unlimited
  const plan: PlanType = (rawPlan === 'plus' || rawPlan === 'pro') ? 'unlimited' : (rawPlan as PlanType);
  const limits = PLANS[plan] || PLANS.free;

  return {
    plan,
    limits,
    currentParticipants: registry._count.participants,
    canAddParticipant: registry._count.participants < limits.maxParticipants,
    maxWishlistItems: limits.maxWishlistItems,
    subscription: registry.subscription,
  };
}

export async function enforceParticipantLimit(registryId: string): Promise<{ allowed: boolean; message?: string }> {
  const info = await checkRegistryLimits(registryId);
  if (!info) return { allowed: false, message: 'Registry not found' };

  if (!info.canAddParticipant) {
    return {
      allowed: false,
      message: `Your ${info.limits.name} plan allows up to ${info.limits.maxParticipants} participants. Upgrade to add more.`,
    };
  }

  return { allowed: true };
}

export async function enforceWishlistLimit(registryId: string, itemCount: number): Promise<{ allowed: boolean; message?: string }> {
  const info = await checkRegistryLimits(registryId);
  if (!info) return { allowed: false, message: 'Registry not found' };

  if (itemCount > info.maxWishlistItems) {
    return {
      allowed: false,
      message: `Your ${info.limits.name} plan allows up to ${info.maxWishlistItems} wishlist items. Upgrade for more.`,
    };
  }

  return { allowed: true };
}
