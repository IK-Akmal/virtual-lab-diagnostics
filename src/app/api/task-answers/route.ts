import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const answers = await prisma.taskAnswer.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(answers);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { topicId, taskId, answer } = await req.json();

  const taskAnswer = await prisma.taskAnswer.create({
    data: {
      userId: session.user.id as string,
      topicId,
      taskId,
      answer,
    },
  });

  return NextResponse.json(taskAnswer, { status: 201 });
}
