-- CreateTable
CREATE TABLE "StepOutputUse" (
    "id" TEXT NOT NULL,
    "outputOfStepId" TEXT NOT NULL,
    "inputOfStepId" TEXT NOT NULL,

    CONSTRAINT "StepOutputUse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StepOutputUse" ADD CONSTRAINT "StepOutputUse_outputOfStepId_fkey" FOREIGN KEY ("outputOfStepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepOutputUse" ADD CONSTRAINT "StepOutputUse_inputOfStepId_fkey" FOREIGN KEY ("inputOfStepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
