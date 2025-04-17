import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔠 Type pour les demandes en attente
type PendingUser = {
  name: string;
  email: string;
  message: string;
  date: string;
};

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  try {
    const PENDING_PATH = path.join(process.cwd(), 'data', 'pending.json');
    await fs.mkdir(path.dirname(PENDING_PATH), { recursive: true });

    const fileData = await fs.readFile(PENDING_PATH, 'utf-8').catch(() => '[]');
    const pending: PendingUser[] = JSON.parse(fileData);

    pending.push({ name, email, message, date: new Date().toISOString() });

    await fs.writeFile(PENDING_PATH, JSON.stringify(pending, null, 2));

    await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['lionel.pinau@edu.devinci.fr'],
      subject: 'Nouvelle inscription',
      html: `
        <h2>Nouvelle inscription</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
      `,
    });

    console.log('✅ Email ajouté dans pending.json');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur dans /api/send-email :', error);
    return NextResponse.json({ error: 'Erreur d’envoi' }, { status: 500 });
  }
}
