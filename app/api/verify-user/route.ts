import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type User = {
  email: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
  console.log('Received login request:', { email, password });
  console.log('Is Admin:', isAdmin);

  // Si admin, on autorise direct sans lire users.json
  if (isAdmin) {
    return NextResponse.json({ authorized: true, admin: true });
  }

  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);

  const authorized = users.some((user) => user.email === email);

  return NextResponse.json({ authorized, admin: false });
}
