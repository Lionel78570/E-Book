import { NextResponse } from "next/server";
import users from "@/app/data/users.json";

export async function POST(req: Request) {
  const { email } = await req.json();

  const authorized = users.some(user => user.email === email);

  return NextResponse.json({ authorized });
}
