// app/api/login/route.ts

import { NextResponse } from 'next/server'
import usersRaw from '@/data/users.json'

interface User {
  email: string
  status: string // 👈 corresponds au champ réel dans users.json
}

const users = usersRaw as User[]

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = users.find((u) => u.email === email)

  if (!user || user.status !== 'accepted') {
    return new Response('Forbidden', { status: 403 })
  }

  const response = NextResponse.json({ authorized: true })
  response.cookies.set('user_email', email, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 jour
  })
  return response
}
