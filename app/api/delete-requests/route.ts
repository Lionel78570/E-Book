import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type PendingUser = {
  email: string;
};

type ResponseData = { success: boolean; message?: string }; // Type pour la réponse JSON

export async function POST(req: Request) {
  const { email }: { email: string } = await req.json();

  const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');

  try {
    const pending: PendingUser[] = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch((err) => {
      console.error('Erreur de lecture de pending.json:', err);
      return '[]';
    }));

    const updated: PendingUser[] = pending.filter((entry) => entry.email !== email);
    await fs.writeFile(PENDING_PATH, JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur de pending.json:', err);
    return NextResponse.json({ success: false, message: 'Une erreur est survenue.' } as ResponseData);
  }
}
