import { NextResponse } from 'next/server';

const PHP_URL = 'https://lepetitchaletoran.com/api/ia/manage_status.php';

export async function GET() {
  const res = await fetch(PHP_URL, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(PHP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}