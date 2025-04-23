import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  // Vérifier que l'utilisateur est authentifié
  const email = req.cookies.get('user_email')?.value;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Chemin d'accès au fichier PDF
  const filePath = path.join(process.cwd(), 'privates', 'ebooks', params.slug);

  try {
    // Lire le fichier PDF
    const fileBuffer = await fs.readFile(filePath);

    // Retourner le fichier PDF en réponse
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',  // Afficher le PDF directement dans le navigateur
      },
    });
  } catch (error) {
    console.error('Erreur de lecture du fichier PDF:', error);
    return new NextResponse('Fichier non trouvé', { status: 404 });
  }
}
