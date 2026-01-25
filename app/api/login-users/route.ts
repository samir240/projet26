import { NextRequest, NextResponse } from 'next/server';

const PHP_API_URL = 'https://webemtiyaz.com/api/ia/users.php';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing email or password' },
        { status: 400 }
      );
    }

    // D'abord vérifier les credentials avec login1.php
    const loginCheckRes = await fetch('https://webemtiyaz.com/api/login1.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginCheck = await loginCheckRes.json();

    if (!loginCheck.success || !loginCheck.user) {
      return NextResponse.json(
        { success: false, message: loginCheck.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Maintenant récupérer les détails complets via users.php avec le nom de l'hôpital
    const userDetailRes = await fetch(`${PHP_API_URL}?id=${loginCheck.user.id_user}`);
    const userDetail = await userDetailRes.json();

    if (userDetail.error) {
      return NextResponse.json(
        { success: false, message: 'Error fetching user details' },
        { status: 500 }
      );
    }

    // Construire la réponse avec les informations de l'utilisateur et le nom de l'hôpital
    const response = {
      success: true,
      data: {
        user: {
          id_user: loginCheck.user.id_user,
          email: loginCheck.user.email,
          nom_role: loginCheck.user.nom_role,
          system: loginCheck.user.system,
          id_hospital: userDetail.id_hospital || loginCheck.user.id_hospital || null,
          hospital_nom: userDetail.hospital_nom || loginCheck.user.hospital_nom || null,
          username: userDetail.username || null,
          nom: userDetail.nom || null,
          prenom: userDetail.prenom || null,
        }
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
