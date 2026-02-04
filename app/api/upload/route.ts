import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // On récupère l'URL de ton PHP (pro.medotra.com)
    // On appelle api_upload.php qui contient ta fonction api_upload_media
    const phpRes = await fetch('https://pro.medotra.com/app/http/api/upload.php', {
      method: 'POST',
      body: formData, // On transmet le FormData tel quel (avec type, entity_id et file)
    });

    if (!phpRes.ok) {
      const errorText = await phpRes.text();
      return NextResponse.json({ success: false, message: "Erreur PHP", detail: errorText }, { status: 500 });
    }

    const data = await phpRes.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}