// app/api/prisma-test/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// ⚡ Crée l'instance Prisma
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test de connexion
    await prisma.$queryRaw`SELECT 1`;

    // Liste toutes les tables de la base
    const tables = await prisma.$queryRaw<Array<{ Tables_in_kubi8227_elite: string }>>`SHOW TABLES`;

    return NextResponse.json({
      message: "Connexion MySQL réussie ✅",
      tables,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur connexion MySQL ❌",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
