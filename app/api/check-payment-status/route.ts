// app/api/check-payment-status/route.ts
import fs from 'fs/promises';
import path from 'path';

interface User {
  email: string;
  paid: boolean;
}

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response('Email requis', { status: 400 });
  }

  // Charger les utilisateurs et vérifier si l'utilisateur est payé
  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);
  const user = users.find((u) => u.email === email);

  if (user && user.paid) {
    return new Response(JSON.stringify({ paid: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ paid: false }), { status: 200 });
  }
}
