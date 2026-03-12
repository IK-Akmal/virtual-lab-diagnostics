-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TopicProgress_userId_topicId_key" ON "TopicProgress"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "TopicProgress" ADD CONSTRAINT "TopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAnswer" ADD CONSTRAINT "TaskAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
