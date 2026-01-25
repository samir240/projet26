import { NextResponse } from 'next/server';

const PHP_API_URL = 'https://webemtiyaz.com/api/ia/medical_procedures.php';

// GET : Récupérer toutes les procédures
export async function GET() {
  try {
    const res = await fetch(PHP_API_URL, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

// POST : Créer, Modifier ou Supprimer
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'opération" }, { status: 500 });
  }
}