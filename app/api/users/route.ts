import { NextRequest, NextResponse } from 'next/server';

const PHP_API_URL = 'https://pro.medotra.com/app/http/api/users.php';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const id_hospital = searchParams.get('id_hospital');
    const roles = searchParams.get('roles');
    
    let url = PHP_API_URL;
    if (id) url += `?id=${id}`;
    else if (id_hospital) url += `?id_hospital=${id_hospital}`;
    else if (roles) url += `?roles=true`;
    
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    /* ===== UPLOAD (FormData) ===== */
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      const res = await fetch(PHP_API_URL, {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: true };
      }

      return NextResponse.json(data);
    }

    /* ===== JSON NORMAL ===== */
    const body = await req.json();
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const id_hospital = searchParams.get('id_hospital');
    
    if (!id || !id_hospital) {
      return NextResponse.json({ error: 'ID et id_hospital sont requis' }, { status: 400 });
    }
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id_user: parseInt(id), id_hospital: parseInt(id_hospital) }),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
