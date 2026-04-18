import Stripe from 'stripe';

let _stripe: Stripe | null = null;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[stripe] STRIPE_SECRET_KEY not set — Stripe features will be unavailable');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('[stripe] STRIPE_WEBHOOK_SECRET not set — webhook verification will fail');
}
if (!process.env.STRIPE_PRICE_ID) {
  console.warn('[stripe] STRIPE_PRICE_ID not set — checkout will fail');
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Cannot use Stripe features without a secret key.'
    );
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    get priceId() { return process.env.STRIPE_PRICE_ID || ''; },
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
};

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
