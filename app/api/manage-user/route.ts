import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const pendingPath = path.join(process.cwd(), "data/pending.json");
const historyPath = path.join(process.cwd(), "data/history.json");

export async function GET() {
  try {
    const data = await fs.readFile(pendingPath, "utf-8").catch(() => "[]");
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Error reading pending.json:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, action } = await req.json();
    const pendingRaw = await fs.readFile(pendingPath, "utf-8").catch(() => "[]");
    const historyRaw = await fs.readFile(historyPath, "utf-8").catch(() => "[]");

    const pending = JSON.parse(pendingRaw);
    const history = JSON.parse(historyRaw);

    const userIndex = pending.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [user] = pending.splice(userIndex, 1);
    user.status = action === "accept" ? "accepted" : "rejected";

    history.unshift(user);

    await fs.writeFile(pendingPath, JSON.stringify(pending, null, 2));
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ POST /api/manage-user failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
