import { NextResponse } from 'next/server';

// Remplace par l'URL réelle de ton fichier PHP sur le serveur
const PHP_API_URL = 'https://webemtiyaz.com/api/ia/quotes.php';

/* ==========================================================
   GET : Récupérer tous les devis ou un devis par ID
   ========================================================== */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // On construit l'URL avec l'ID si présent
    const targetUrl = id ? `${PHP_API_URL}?id=${id}` : PHP_API_URL;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `HTTP error! status: ${res.status}` }, { status: res.status });
    }

    const text = await res.text();
    let data: any;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing quotes response:', text);
      return NextResponse.json({ error: "Réponse invalide du serveur" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in quotes GET:', error);
    return NextResponse.json({ error: "Erreur de chargement des données", details: error.message }, { status: 500 });
  }
}

/* ==========================================================
   POST : Create, Update ou Delete
   Next.js reçoit le JSON et le renvoie tel quel au PHP
   ========================================================== */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON response:', text);
      return NextResponse.json({ 
        error: "Réponse invalide du serveur", 
        rawResponse: text.substring(0, 500) 
      }, { status: 500 });
    }

    if (!res.ok) {
      return NextResponse.json({ 
        error: data.error || "Erreur serveur", 
        status: res.status 
      }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in quotes POST:', error);
    return NextResponse.json({ 
      error: "Erreur lors de l'opération", 
      details: error.message 
    }, { status: 500 });
  }
}