import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

interface User {
  email: string;
  status: string; // "accepted" ou "pending"
}

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get('user_email')?.value;

  if (!email) {
    return NextResponse.json({ authorized: false });
  }

  // Vérifier que l'utilisateur existe et a un statut "accepted"
  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  const content = await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]');
  const users: User[] = JSON.parse(content);

  const user = users.find((u) => u.email === email && u.status === 'accepted');

  return NextResponse.json({ authorized: !!user });
}
