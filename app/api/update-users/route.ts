import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { email } = await req.json();

  console.log('📨 Reçu pour acceptation :', email); // log reçu

  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');

  const users = JSON.parse(await fs.readFile(USERS_PATH, 'utf-8').catch(() => {
    console.warn('⚠️ users.json introuvable, initialisation vide.');
    return '[]';
  }));

  const pending = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch(() => {
    console.warn('⚠️ pending.json introuvable, initialisation vide.');
    return '[]';
  }));

  if (!users.includes(email)) {
    users.push(email);
    console.log('✅ Email ajouté à users.json');
  } else {
    console.log('ℹ️ Email déjà présent dans users.json');
  }

  const updatedPending = pending.filter((entry: any) => entry.email !== email);
  console.log('🧹 Entrée supprimée de pending.json');

  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  await fs.writeFile(PENDING_PATH, JSON.stringify(updatedPending, null, 2));

  return NextResponse.json({ success: true });
}
