// app/api/login/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface User {
  email: string;
  paid: boolean;
}

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email: string };

  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);

  const user = users.find((u) => u.email === email && u.paid);

  if (!user) {
    return new Response('Forbidden', { status: 403 });
  }

  const res = NextResponse.json({ authorized: true });
  res.cookies.set('user_email', email, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 jour
  });
  return res;
}
