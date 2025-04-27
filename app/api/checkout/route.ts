// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs/promises';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log("Payment started for email:", email);

  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

  try {
    // Lire les utilisateurs
    const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
    const users = JSON.parse(content);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find((u: { email: string }) => u.email === email);

    if (!existingUser) {
      // Ajouter l'utilisateur avec statut "pending"
      users.push({ email, status: 'pending' });
      await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
      console.log("User added as pending:", email);
    } else {
      console.log("User already exists:", email);
    }
  } catch (error) {
    console.error("Error updating users.json at checkout:", error);
    return NextResponse.json({ error: "Failed to update user list" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.PRICE_ID!,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/signup`,
      metadata: { email },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}
