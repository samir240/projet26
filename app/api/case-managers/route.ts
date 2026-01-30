import { NextRequest, NextResponse } from 'next/server';

const PHP_API_URL = 'https://webemtiyaz.com/api/ia/case_managers.php';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const id_hospital = searchParams.get('id_hospital');
    
    let url = PHP_API_URL;
    if (id) url += `?id=${id}`;
    else if (id_hospital) url += `?id_hospital=${id_hospital}`;
    
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
    
    // Si c'est FormData (upload de fichiers)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const res = await fetch(PHP_API_URL, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      return NextResponse.json(data);
    }
    
    // Sinon, c'est du JSON normal (Create / Update / Delete)
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
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id_case_manager: parseInt(id) }),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
