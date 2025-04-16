import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'pending.json');

  console.log('📥 Lecture de pending.json à :', filePath); // <-- log chemin

  const data = await fs.readFile(filePath, 'utf-8').catch((err) => {
    console.error('❌ Erreur lecture pending.json :', err); // <-- log erreur éventuelle
    return '[]';
  });

  const parsed = JSON.parse(data);

  console.log('📄 Données récupérées :', parsed); // <-- log contenu

  return NextResponse.json(parsed);
}
