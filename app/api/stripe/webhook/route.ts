// app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface User {
  email: string;
  paid: boolean;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',    // dernière version stable
});

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: Request) {
  // 1. Stripe exige le body brut (pas de JSON.parse)
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;

  // 2. Vérification de signature
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response('Webhook signature invalid', { status: 400 });
  }

  // 3. On traite l’événement pertinent
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    if (email) await activateUser(email);
  }

  return NextResponse.json({ received: true });
}

async function activateUser(email: string) {
  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);

  const idx = users.findIndex((u) => u.email === email);
  if (idx >= 0) {
    users[idx].paid = true;
  } else {
    users.push({ email, paid: true });
  }

  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}
