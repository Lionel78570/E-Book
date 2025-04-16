import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PENDING_PATH = path.join(DATA_DIR, 'pending.json');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

export async function GET() {
  try {
    const data = await fs.readFile(PENDING_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const { email, action } = await req.json();

  const pending = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch(() => '[]'));
  const users = JSON.parse(await fs.readFile(USERS_PATH, 'utf-8').catch(() => '[]'));

  const user = pending.find((u: any) => u.email === email);
  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  const updatedPending = pending.filter((u: any) => u.email !== email);

  if (action === 'accept') {
    users.push({ ...user, status: 'accepted' });
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  }

  await fs.writeFile(PENDING_PATH, JSON.stringify(updatedPending, null, 2));

  return NextResponse.json({ success: true });
}
