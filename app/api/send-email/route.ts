// app/api/send-email/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['lionel.pinau@edu.devinci.fr'],
      subject: 'Nouvelle inscription',
      html: `
        <h2>Nouvelle inscription</h2>
        <p><strong>Nom :</strong> ${body.name}</p>
        <p><strong>Email :</strong> ${body.email}</p>
        <p><strong>Message :</strong> ${body.message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur d’envoi' }, { status: 500 });
  }
}
