import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer un hôpital par ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id est requis" }, { status: 400 });
    }

    const res = await fetch(`https://webemtiyaz.com/api/ia/hospitals.php?id=${id}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      return NextResponse.json({ error: "Hôpital non trouvé" }, { status: 404 });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/hospitals:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'hôpital", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Créer un hôpital ou uploader des fichiers
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    
    // Si c'est un FormData (upload de fichiers)
    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      const id_hospital = formData.get("id_hospital");
      const logo = formData.get("logo");
      const certifications = formData.get("certifications");

      if (!id_hospital) {
        return NextResponse.json({ error: "id_hospital est requis" }, { status: 400 });
      }

      // Préparer le FormData pour l'API PHP externe
      const phpFormData = new FormData();
      phpFormData.append("id_hospital", id_hospital as string);
      
      if (logo) phpFormData.append("logo", logo as File);
      if (certifications) phpFormData.append("certifications", certifications as File);

      // Envoyer à l'API PHP
      const res = await fetch("https://webemtiyaz.com/api/ia/hospitals.php", {
        method: "POST",
        body: phpFormData,
      });

      if (!res.ok) {
        throw new Error(`Erreur PHP API: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: true };
      return NextResponse.json(data);
    } 
    // Sinon, c'est une création d'hôpital (JSON)
    else {
      const body = await req.json();

      const res = await fetch("https://webemtiyaz.com/api/ia/hospitals.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: false, error: "Réponse vide" };
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in POST /api/hospitals:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'opération", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un hôpital
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_hospital) {
      return NextResponse.json({ error: "id_hospital est requis" }, { status: 400 });
    }

    const res = await fetch("https://webemtiyaz.com/api/ia/hospitals.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        ...body,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: false, error: "Réponse vide" };
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/hospitals:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour", details: (error as Error).message },
      { status: 500 }
    );
  }
}