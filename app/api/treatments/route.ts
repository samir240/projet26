import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json({ error: 'Failed to fetch treatments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing treatment:', error);
    return NextResponse.json({ error: 'Failed to process treatment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, action: 'update' }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating treatment:', error);
    return NextResponse.json({ error: 'Failed to update treatment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const response = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'delete', id_relation: id }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return NextResponse.json({ error: 'Failed to delete treatment' }, { status: 500 });
  }
}
