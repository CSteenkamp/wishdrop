import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: 'Free',
    maxRegistries: 1,
    maxParticipants: 10,
    maxWishlistItems: 10,
    features: [
      '1 registry',
      'Up to 10 items',
      'Item claiming',
      'Surprise-safe (owner can\'t see who claimed)',
      'Email magic link login',
      'Multi-currency support',
      'Mobile-friendly design',
    ],
  },
  unlimited: {
    name: 'Unlimited',
    priceId: 'price_1TDAokBiNvYQF2cP1HlmIisk',
    price: '$10',
    priceUsd: '$10 USD',
    maxRegistries: Infinity,
    maxParticipants: Infinity,
    maxWishlistItems: Infinity,
    features: [
      'Everything in Free',
      'Unlimited registries',
      'Unlimited items',
      'One-time payment',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanLimits(plan: PlanType) {
  return PLANS[plan];
}

export function canAddParticipant(plan: PlanType, currentCount: number): boolean {
  return currentCount < PLANS[plan].maxParticipants;
}

export function getMaxWishlistItems(plan: PlanType): number {
  return PLANS[plan].maxWishlistItems;
}
