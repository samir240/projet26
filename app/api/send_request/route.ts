export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://pro.medotra.com/app/http/api/create_request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // On récupère la réponse brute
    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text }; // Si ce n’est pas du JSON (debug PHP)
    }

    return Response.json({ success: true, data });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Server error",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}
