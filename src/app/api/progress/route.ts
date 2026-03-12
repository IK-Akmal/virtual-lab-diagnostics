import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const progress = await prisma.topicProgress.findMany({
    where: { userId: session.user.id as string },
  });

  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { topicId, completed } = await req.json();

  const progress = await prisma.topicProgress.upsert({
    where: {
      userId_topicId: {
        userId: session.user.id as string,
        topicId,
      },
    },
    update: { completed },
    create: {
      userId: session.user.id as string,
      topicId,
      completed,
    },
  });

  return NextResponse.json(progress);
}
