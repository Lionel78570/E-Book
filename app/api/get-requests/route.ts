import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type PendingUser = {
  email: string;
  name?: string;  // Si d'autres propriétés existent, tu peux les ajouter ici
  message?: string;
  date?: string;
};

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'pending.json');

  console.log('📥 Lecture de pending.json à :', filePath); // <-- log chemin

  const data = await fs.readFile(filePath, 'utf-8').catch((err) => {
    console.error('❌ Erreur lecture pending.json :', err); // <-- log erreur éventuelle
    return '[]';
  });

  const parsed: PendingUser[] = JSON.parse(data); // Typage des données récupérées

  console.log('📄 Données récupérées :', parsed); // <-- log contenu

  return NextResponse.json(parsed);
}
