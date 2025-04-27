// app/api/check-status/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log("Checking payment status for:", email);

  try {
    const content = await fs.readFile(USERS_PATH, 'utf-8');
    const users = JSON.parse(content);

    const user = users.find((u: { email: string }) => u.email === email);

    if (!user) {
      console.log("User not found in database:", email);
      return NextResponse.json({ status: 'not_found' });
    }

    if (user.status === 'accepted') {
      console.log("User already accepted:", email);
      return NextResponse.json({ status: 'accepted' });
    }

    if (user.status === 'pending') {
      // Mettre à jour l'utilisateur en accepted
      user.status = 'accepted';
      await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
      console.log("User status updated to accepted:", email);
      return NextResponse.json({ status: 'accepted' });
    }

    return NextResponse.json({ status: 'unknown' });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
