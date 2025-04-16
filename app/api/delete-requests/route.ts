import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { email } = await req.json();
  const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');

  const pending = JSON.parse(await fs.readFile(PENDING_PATH, 'utf-8').catch(() => '[]'));
  const updated = pending.filter((entry: any) => entry.email !== email);

  await fs.writeFile(PENDING_PATH, JSON.stringify(updated, null, 2));

  return NextResponse.json({ success: true });
}
