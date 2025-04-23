// app/api/ebooks/[slug]/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import users from '@/data/users.json';

interface User {
  email: string;
  status: 'accepted' | 'pending';
}

// on laisse Next déduire le type du 2ᵉ paramètre
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }   // <-- Assurez-vous d'avoir bien spécifié le type du paramètre slug
) {
  const email = (await cookies()).get('user_email')?.value;
  if (!email) return new Response('Unauthorized', { status: 401 });

  const ok = (users as User[]).some(u => u.email === email && u.status === 'accepted');
  if (!ok) return new Response('Forbidden', { status: 403 });

  // Nous devons attendre les paramètres avant d'y accéder
  const { slug } = await context.params; // Utilisation correcte avec `await`

  const filePath = path.join(process.cwd(), 'privates', 'ebooks', slug);

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${slug}"`, // Utilisation correcte du slug
      },
    });
  } catch (err) {
    return new Response('File not found', { status: 404 });
  }
}
