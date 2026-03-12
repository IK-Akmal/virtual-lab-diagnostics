import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const results = await prisma.testResult.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(results);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { topicId, score, totalQuestions, answers } = await req.json();

  const result = await prisma.testResult.create({
    data: {
      userId: session.user.id as string,
      topicId,
      score,
      totalQuestions,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json(result, { status: 201 });
}
