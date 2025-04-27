import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log("Payment successful for email:", email);

  // Charger les utilisateurs
  const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
  try {
    const content = await fs.readFile(USERS_PATH, 'utf-8');
    const users = JSON.parse(content);

    // Trouver l'utilisateur et mettre à jour son statut
    const userIndex = users.findIndex((user: { email: string }) => user.email === email);
    
    if (userIndex !== -1) {
      // Mettre à jour le statut de l'utilisateur à "accepted"
      users[userIndex].status = 'accepted';
      await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
      console.log("User status updated to accepted:", email);
    } else {
      // Si l'utilisateur n'est pas trouvé, ajouter un nouvel utilisateur
      users.push({ email, status: 'accepted' });
      await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
      console.log("New user added:", email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating users.json:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}
