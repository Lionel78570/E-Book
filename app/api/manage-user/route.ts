import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type PendingEntry = {
  email: string;
};

type ResponseData = { success: boolean; message?: string }; // Type pour la réponse JSON

export async function POST(req: Request) {
  const { email }: { email: string } = await req.json();
  console.log('📨 Reçu pour acceptation :', email);

  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');

  try {
    const users: string[] = JSON.parse(await fs.readFile(USERS_PATH, 'utf-8').catch((err) => {
      console.error('Erreur de lecture de users.json:', err);
      return '[]';
    })) as string[];

    const pending: PendingEntry[] = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch((err) => {
      console.error('Erreur de lecture de pending.json:', err);
      return '[]';
    })) as PendingEntry[];

    if (!users.includes(email)) {
      users.push(email);
      console.log('✅ Email ajouté à users.json');
    } else {
      console.log('ℹ️ Email déjà présent dans users.json');
    }

    const updatedPending = pending.filter((entry) => entry.email !== email);
    console.log('🧹 Entrée supprimée de pending.json');

    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
    await fs.writeFile(PENDING_PATH, JSON.stringify(updatedPending, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur lors du traitement de la requête :', err);
    return NextResponse.json({ success: false, message: 'Une erreur est survenue.' } as ResponseData);
  }
}
