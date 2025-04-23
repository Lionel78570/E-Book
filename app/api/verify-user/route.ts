// app/api/verify-user/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type User = {
  email: string;
  status: string;
};

export async function POST(req: Request) {
  const { email, password } = await req.json();

  /* Vérification admin */
  const isAdmin =
    email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

  if (isAdmin) {
    const res = NextResponse.json({ authorized: true, admin: true });
    res.cookies.set('user_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  /* Vérification utilisateur normal */
  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);

  const user = users.find(
    (u) => u.email === email && u.status === 'accepted'  // Vérifie si l'utilisateur est accepté
  );

  if (!user) {
    return NextResponse.json({ authorized: false, admin: false });
  }

  const res = NextResponse.json({ authorized: true, admin: false });
  res.cookies.set('user_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}
