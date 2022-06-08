/*
  Warnings:

  - A unique constraint covering the columns `[task]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_task_key" ON "Card"("task");
