import { NextResponse } from 'next/server';

const PHP_URL = 'https://lepetitchaletoran.com/api/ia/manage_email_templates.php';

// Récupérer la liste (Appelé par fetch('/api/email_templates'))
export async function GET() {
  try {
    const res = await fetch(PHP_URL, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur de connexion au serveur" }, { status: 500 });
  }
}

// Créer ou Modifier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(PHP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur de transmission" }, { status: 500 });
  }
}