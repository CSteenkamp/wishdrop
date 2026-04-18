import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Webhook error: STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { groupId, plan } = session.metadata || {};

      if (groupId && plan) {
        console.log(`[webhook] checkout.session.completed: groupId=${groupId} plan=${plan} eventId=${event.id}`);

        await prisma.registry.update({
          where: { id: groupId },
          data: { plan },
        });

        await prisma.subscription.upsert({
          where: { registryId: groupId },
          update: {
            stripeCustomerId: session.customer as string,
            plan,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          create: {
            registryId: groupId,
            stripeCustomerId: session.customer as string,
            plan,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      console.log(`[webhook] charge.refunded: chargeId=${charge.id} paymentIntent=${charge.payment_intent} eventId=${event.id}`);

      if (!charge.payment_intent) {
        console.warn('[webhook] charge.refunded: no payment_intent on charge, skipping');
        break;
      }

      // Look up the checkout session that produced this payment
      const sessions = await getStripe().checkout.sessions.list({
        payment_intent: charge.payment_intent as string,
      });

      const checkoutSession = sessions.data[0];
      if (!checkoutSession) {
        console.warn(`[webhook] charge.refunded: no checkout session found for payment_intent=${charge.payment_intent}`);
        break;
      }

      const groupId = checkoutSession.metadata?.groupId;
      if (!groupId) {
        console.warn('[webhook] charge.refunded: no groupId in checkout session metadata, skipping');
        break;
      }

      // Natural idempotency: only downgrade if not already on free plan
      const registry = await prisma.registry.findUnique({ where: { id: groupId } });
      if (!registry) {
        console.warn(`[webhook] charge.refunded: registry not found for groupId=${groupId}`);
        break;
      }

      if (registry.plan === 'free') {
        console.log(`[webhook] charge.refunded: registry ${groupId} already on free plan, skipping`);
        break;
      }

      console.log(`[webhook] charge.refunded: downgrading registry ${groupId} from ${registry.plan} to free`);

      await prisma.registry.update({
        where: { id: groupId },
        data: { plan: 'free' },
      });

      await prisma.subscription.updateMany({
        where: { registryId: groupId },
        data: { status: 'canceled' },
      });

      break;
    }

    default:
      // Unhandled event type — acknowledged but ignored
      break;
  }

  return NextResponse.json({ received: true });
}
