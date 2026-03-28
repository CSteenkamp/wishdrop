import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { groupId, plan } = await request.json();

    if (!groupId || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (plan !== 'unlimited') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const priceId = PLANS.unlimited.priceId;
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/admin/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
      metadata: { groupId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
