import { NextRequest, NextResponse } from "next/server";

const PHP_API_BASE_URL = "https://lepetitchaletoran.com/api/ia/case_managers.php";

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || `PHP API error: ${response.status} - ${errorText}`);
    } catch {
      throw new Error(`PHP API error: ${response.status} - ${errorText}`);
    }
  }
  const responseText = await response.text();
  if (!responseText) return null;
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON response from PHP API: ${responseText}`);
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id_hospital = url.searchParams.get("id_hospital");
    const id = url.searchParams.get("id");

    let phpApiUrl = PHP_API_BASE_URL;
    if (id) {
      phpApiUrl += `?id=${id}`;
    } else if (id_hospital) {
      phpApiUrl += `?id_hospital=${id_hospital}`;
    }

    const res = await fetch(phpApiUrl);
    const data = await handleApiResponse(res);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in GET /api/case-managers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des case managers", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Gestion Upload Photo de profil CM
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const res = await fetch(PHP_API_BASE_URL, {
        method: "POST",
        body: formData,
      });
      const data = await handleApiResponse(res);
      return NextResponse.json(data);
    } 
    
    // Gestion CRUD (Create)
    else {
      const body = await req.json();
      const res = await fetch(PHP_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await handleApiResponse(res);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in POST /api/case-managers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du case manager", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(PHP_API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, action: "update" }),
    });
    const data = await handleApiResponse(res);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/case-managers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du case manager", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(PHP_API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, action: "delete" }),
    });
    const data = await handleApiResponse(res);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/case-managers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du case manager", details: (error as Error).message },
      { status: 500 }
    );
  }
}