import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type PendingUser = {
  email: string;
};

export async function POST(req: Request) {
  const { email }: { email: string } = await req.json();
  const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');

  const pending: PendingUser[] = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch(() => '[]'));
  const updated: PendingUser[] = pending.filter((entry) => entry.email !== email);

  await fs.writeFile(PENDING_PATH, JSON.stringify(updated, null, 2));

  return NextResponse.json({ success: true });
}
