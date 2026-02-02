import { NextRequest, NextResponse } from 'next/server';

const PHP_API_URL = 'https://pro.medotra.com/app/http/api/doctors.php';

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
    
    // Si le Content-Type est explicitement JSON, traiter comme JSON
    if (contentType.includes('application/json')) {
      const body = await req.json();
      
      const res = await fetch(PHP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      return NextResponse.json(data);
    }
    
    // Sinon, traiter comme FormData (upload de fichiers)
    // Le Content-Type pour FormData est généralement "multipart/form-data; boundary=..."
    const formData = await req.formData();
    
    // Vérifier que id_medecin et id_hospital sont présents
    const idMedecin = formData.get('id_medecin');
    const idHospital = formData.get('id_hospital');
    
    if (!idMedecin || !idHospital) {
      return NextResponse.json({ 
        success: false, 
        error: 'id_medecin et id_hospital sont requis pour l\'upload de fichiers' 
      }, { status: 400 });
    }
    
    const res = await fetch(PHP_API_URL, {
      method: 'POST',
      body: formData,
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
      body: JSON.stringify({ action: 'delete', id_medecin: parseInt(id) }),
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
