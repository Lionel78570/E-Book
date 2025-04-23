// app/api/ebooks/[slug]/route.ts
import { NextRequest } from 'next/server'
import { cookies }     from 'next/headers'
import path            from 'path'
import fs              from 'fs/promises'
import users           from '@/data/users.json'

interface User {
  email : string
  status: 'accepted' | 'pending'
}

export async function GET(
  _req: NextRequest,
  { params }: any          // ◀️  on ne précise plus le type
) {
  /* ---------- auth ---------- */
  const email = (await cookies()).get('user_email')?.value
  if (!email) return new Response('Unauthorized', { status: 401 })

  const ok = (users as User[]).some(u => u.email === email && u.status === 'accepted')
  if (!ok)   return new Response('Forbidden',    { status: 403 })

  /* ---------- fichier ---------- */
  const filePath = path.join(process.cwd(), 'privates', 'ebooks', params.slug)

  try {
    const file = await fs.readFile(filePath)
    return new Response(file, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `inline; filename="${params.slug}"`,
      },
    })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}
