// app/api/request-hospital/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id_request = url.searchParams.get("id_request");

    if (!id_request) {
      return NextResponse.json({ error: "id_request est requis" }, { status: 400 });
    }

    const res = await fetch(`https://pro.medotra.com/app/http/api/request_hospital.php?id_request=${id_request}`);
    
    if (!res.ok) {
      // Si 404, retourner un tableau vide (pas d'hôpitaux assignés)
      if (res.status === 404) {
        return NextResponse.json([]);
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      return NextResponse.json([]);
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/request_hospital:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des hôpitaux", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_request || !body.id_hospital) {
      return NextResponse.json(
        { error: "id_request et id_hospital sont requis" },
        { status: 400 }
      );
    }

    const res = await fetch("https://pro.medotra.com/app/http/api/request_hospital.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("Réponse vide de l'API");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/request_hospital:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'hôpital", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_relation || body.is_active === undefined) {
      return NextResponse.json(
        { error: "id_relation et is_active sont requis" },
        { status: 400 }
      );
    }

    const res = await fetch("https://pro.medotra.com/app/http/api/request_hospital.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("Réponse vide de l'API");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/request_hospital:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id_relation) {
      return NextResponse.json(
        { error: "id_relation est requis" },
        { status: 400 }
      );
    }

    const res = await fetch("https://pro.medotra.com/app/http/api/request_hospital.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("Réponse vide de l'API");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/request_hospital:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression", details: (error as Error).message },
      { status: 500 }
    );
  }
}
