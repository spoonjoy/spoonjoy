/*
  Warnings:

  - A unique constraint covering the columns `[outputOfStepId,inputOfStepId]` on the table `StepOutputUse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StepOutputUse_outputOfStepId_inputOfStepId_key" ON "StepOutputUse"("outputOfStepId", "inputOfStepId");
