import { NextResponse } from 'next/server';

const PHP_API_URL = 'https://webemtiyaz.com/api/ia/relances.php';

export async function GET() {
  try {
    const res = await fetch(PHP_API_URL, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur de chargement" }, { status: 500 });
  }
}

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
    return NextResponse.json({ error: "Erreur opération" }, { status: 500 });
  }
}