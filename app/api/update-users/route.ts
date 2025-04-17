import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const pendingPath = path.join(process.cwd(), "data", "pending.json");
const usersPath = path.join(process.cwd(), "data", "users.json");
const historyPath = path.join(process.cwd(), "data", "history.json");

type User = {
  name: string;
  email: string;
  message: string;
  date: string;
};

type HistoryUser = User & { status: "accepted" | "rejected" };

type ResponseData = { success: boolean; message?: string }; // Type pour la réponse JSON

export async function GET() {
  try {
    const data = await fs.readFile(pendingPath, "utf-8");
    const users: User[] = JSON.parse(data);
    return NextResponse.json(users);
  } catch (err) {
    console.error('Erreur lors de la lecture des utilisateurs de pending.json:', err);
    return NextResponse.json({ success: false, message: 'Erreur lors de la lecture des utilisateurs.' } as ResponseData);
  }
}

export async function POST(req: Request) {
  const { email, action }: { email: string; action: "accept" | "reject" } = await req.json();

  try {
    const pendingRaw = await fs.readFile(pendingPath, "utf-8");
    const pending: User[] = JSON.parse(pendingRaw) as User[];
    const user = pending.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur non trouvé." } as ResponseData);
    }

    const newPending: User[] = pending.filter((u) => u.email !== email);
    await fs.writeFile(pendingPath, JSON.stringify(newPending, null, 2));

    if (action === "accept") {
      const usersRaw = await fs.readFile(usersPath, "utf-8");
      const usersList: User[] = JSON.parse(usersRaw);
      usersList.push(user);
      await fs.writeFile(usersPath, JSON.stringify(usersList, null, 2));
    }

    const historyRaw = await fs.readFile(historyPath, "utf-8").catch(() => '[]');
    const history: HistoryUser[] = JSON.parse(historyRaw) as HistoryUser[];
    history.unshift({ ...user, status: action === "accept" ? "accepted" : "rejected" });

    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur lors du traitement de la requête POST:', err);
    return NextResponse.json({ success: false, message: 'Une erreur est survenue.' } as ResponseData);
  }
}
