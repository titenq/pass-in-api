/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "events_title_key" ON "events"("title");
