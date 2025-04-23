import { NextRequest } from 'next/server';
import { cookies }     from 'next/headers';
import path            from 'path';
import fs              from 'fs/promises';
import users           from '@/data/users.json';

interface User {
  email: string;
  status: 'accepted' | 'pending';
}

export async function GET(
  req: NextRequest,
  context: { params: Record<string, string> }   // ← typage ultra‑large
) {
  const email = (await cookies()).get('user_email')?.value;
  if (!email) return new Response('Unauthorized', { status: 401 });

  const ok = (users as User[]).some(u => u.email === email && u.status === 'accepted');
  if (!ok) return new Response('Forbidden', { status: 403 });

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
