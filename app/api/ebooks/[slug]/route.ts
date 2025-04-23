// app/api/ebooks/[slug]/route.ts
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import users from '@/data/users.json';

interface User {
  email: string;
  status: 'accepted' | 'pending';
}

export async function GET(
  req: Request,
  context: { params: { slug: string } }   // ✅ RouteContext
) {
  /* ---------- auth ---------- */
  const email = (await cookies()).get('user_email')?.value;
  if (!email) return new Response('Unauthorized', { status: 401 });

  const user = (users as User[]).find(
    (u) => u.email === email && u.status === 'accepted'
  );
  if (!user) return new Response('Forbidden', { status: 403 });

  /* ---------- fichier ---------- */
  const filePath = path.join(process.cwd(), 'privates', 'ebooks', context.params.slug);

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${context.params.slug}"`,
      },
    });
  } catch {
    return new Response('File not found', { status: 404 });
  }
}
