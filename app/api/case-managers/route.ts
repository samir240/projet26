import { NextRequest, NextResponse } from 'next/server';

const PHP_API_URL = 'https://pro.medotra.com/app/http/api/case_managers.php';

/**
 * GET : Récupérer les Case Managers
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const id_hospital = searchParams.get('id_hospital');
    
    let url = PHP_API_URL;
    if (id) url += `?id=${id}`;
    else if (id_hospital) url += `?id_hospital=${id_hospital}`;
    
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST : Gère l'Upload (FormData) et les Actions (JSON)
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    // CAS A : Upload de fichier (Multipart FormData)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const res = await fetch(PHP_API_URL, {
        method: 'POST',
        // IMPORTANT: On ne définit PAS de Content-Type ici. 
        // Le moteur fetch le fera automatiquement avec le bon "boundary".
        body: formData,
      });
      
      const data = await res.json();
      return NextResponse.json(data);
    }
    
    // CAS B : Opérations standards (Create / Update / Delete)
    const body = await req.json();
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur API", details: error.message }, { status: 500 });
  }
}

/**
 * DELETE : Proxy vers l'action delete du PHP
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'delete', 
        id_case_manager: id // Le PHP gère le parseInt
      }),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}