import { NextRequest, NextResponse } from 'next/server';

// URL de ton nouveau script PHP en mode Base64
const PHP_API_URL = 'https://webemtiyaz.com/api/ia/hospital_poto.php';

/**
 * GET : Récupérer les médias d'un hôpital
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id_hospital = searchParams.get('id_hospital');

    if (!id_hospital) {
      return NextResponse.json({ error: "ID hospital manquant" }, { status: 400 });
    }

    const res = await fetch(`${PHP_API_URL}?id_hospital=${id_hospital}`, {
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST : Upload d'images en Base64
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Récupère le JSON (id_hospital + tableau images base64)

    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: "Erreur serveur PHP", detail: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur Route API POST", details: error.message }, { status: 500 });
  }
}

/**
 * DELETE : Supprimer un média spécifique
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // On récupère l'id depuis l'URL côté Front

    if (!id) {
      return NextResponse.json({ error: "ID média manquant" }, { status: 400 });
    }

    // On transmet l'ID au PHP en paramètre d'URL (?id=...)
    const res = await fetch(`${PHP_API_URL}?id=${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur Route API DELETE", details: error.message }, { status: 500 });
  }
}