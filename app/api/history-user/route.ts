import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type HistoryUser = {
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'accepted' | 'rejected';
};

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

export async function GET() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8');
    const parsed: HistoryUser[] = JSON.parse(data);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json([] satisfies HistoryUser[]);
  }
}
