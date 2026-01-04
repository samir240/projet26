import { NextRequest, NextResponse } from "next/server";

const PHP_API_URL = "https://lepetitchaletoran.com/api/ia/sales_agents.php";

// GET - Récupérer tous les agents ou un agent par ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const apiUrl = id ? `${PHP_API_URL}?id=${id}` : PHP_API_URL;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      return NextResponse.json([]);
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/sales-agents:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des agents", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un agent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(PHP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, error: "Réponse invalide", raw: text };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/sales-agents:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'opération", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un agent
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id est requis" }, { status: 400 });
    }

    const res = await fetch(`${PHP_API_URL}?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/sales-agents:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression", details: (error as Error).message },
      { status: 500 }
    );
  }
}

