import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id_hospital = formData.get("id_hospital");
    const langue = formData.get("langue") || "all";

    if (!id_hospital || isNaN(Number(id_hospital))) {
      return NextResponse.json(
        { error: "id_hospital invalide" },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("files")
      .filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const phpFormData = new FormData();
    phpFormData.append("id_hospital", String(id_hospital));
    phpFormData.append("langue", String(langue));

    // ✅ clé correcte pour PHP
    files.forEach((file) => {
      phpFormData.append("files", file, file.name);
    });

    const res = await fetch(
      "https://webemtiyaz.com/api/ia/hospital_media.php",
      {
        method: "POST",
        body: phpFormData,
      }
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Réponse PHP invalide", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur upload", details: (error as Error).message },
      { status: 500 }
    );
  }
}
