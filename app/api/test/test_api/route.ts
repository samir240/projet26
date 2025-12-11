export async function POST(request) {
  try {
    const body = await request.json();

    // Appel direct à ton PHP
    const res = await fetch("https://lepetitchaletoran.com/api/create_request.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data);

  } catch (err) {
    return Response.json({
      success: false,
      message: "Server relay error",
      error: err.message,
    }, { status: 500 });
  }
}
