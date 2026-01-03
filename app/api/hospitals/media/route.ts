import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer les médias d'un hôpital
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id_hospital = url.searchParams.get("id_hospital");

    if (!id_hospital) {
      return NextResponse.json({ error: "id_hospital est requis" }, { status: 400 });
    }

    // Appel à l'API PHP pour récupérer les médias
    const res = await fetch(`https://lepetitchaletoran.com/api/ia/hospital_media.php?id_hospital=${id_hospital}`);
    
    if (!res.ok) {
      // Si 404, retourner un tableau vide (pas de médias)
      if (res.status === 404) {
        return NextResponse.json([]);
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : [];
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error in GET /api/hospitals/media:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des médias", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Uploader des médias pour un hôpital
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const id_hospital = formData.get("id_hospital");
    const langue = formData.get("langue") || "all";

    if (!id_hospital) {
      return NextResponse.json({ error: "id_hospital est requis" }, { status: 400 });
    }

    // Récupérer les fichiers
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      const allKeys = Array.from(formData.keys());
      console.log("Clés disponibles dans FormData:", allKeys);
      return NextResponse.json({ 
        error: "Aucun fichier fourni", 
        debug: { keys: allKeys, id_hospital, langue, filesCount: files.length } 
      }, { status: 400 });
    }

    // Préparer le FormData pour l'API PHP
    const phpFormData = new FormData();
    phpFormData.append("id_hospital", id_hospital as string);
    phpFormData.append("langue", langue as string);
    
    files.forEach((file) => {
      phpFormData.append("files[]", file);
    });

    // Envoyer à l'API PHP
    const res = await fetch("https://lepetitchaletoran.com/api/ia/hospital_media.php", {
      method: "POST",
      body: phpFormData,
    });

    if (!res.ok) {
      throw new Error(`Erreur PHP API: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: true };
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/hospitals/media:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload des médias", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour l'ordre ou la langue d'un média
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_media) {
      return NextResponse.json({ error: "id_media est requis" }, { status: 400 });
    }

    const res = await fetch("https://lepetitchaletoran.com/api/ia/hospital_media.php", {
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
    console.error("Error in PUT /api/hospitals/media:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un média
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_media) {
      return NextResponse.json({ error: "id_media est requis" }, { status: 400 });
    }

    const res = await fetch("https://lepetitchaletoran.com/api/ia/hospital_media.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        id_media: body.id_media,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : { success: false, error: "Réponse vide" };
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/hospitals/media:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression", details: (error as Error).message },
      { status: 500 }
    );
  }
}

