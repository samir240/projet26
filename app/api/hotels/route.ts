import { NextRequest, NextResponse } from "next/server";

const PHP_API_BASE_URL = "https://lepetitchaletoran.com/api/ia/hotels.php";

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
    if (id_hospital) {
      phpApiUrl += `?id_hospital=${id_hospital}`;
    } else if (id) {
      phpApiUrl += `?id=${id}`;
    }

    const res = await fetch(phpApiUrl);
    const data = await handleApiResponse(res);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in GET /api/hotels:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des hôtels", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    let phpResponse;
    if (isFormData) {
      const formData = await req.formData();
      phpResponse = await fetch(PHP_API_BASE_URL, {
        method: "POST",
        body: formData,
      });
    } else {
      const body = await req.json();
      phpResponse = await fetch(PHP_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    const data = await handleApiResponse(phpResponse);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/hotels:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'hôtel", details: (error as Error).message },
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
    console.error("Error in PUT /api/hotels:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'hôtel", details: (error as Error).message },
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
    console.error("Error in DELETE /api/hotels:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'hôtel", details: (error as Error).message },
      { status: 500 }
    );
  }
}