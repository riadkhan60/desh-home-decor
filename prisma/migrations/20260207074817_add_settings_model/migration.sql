-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "insideDhakaShipping" DECIMAL(10,2) NOT NULL DEFAULT 70,
    "outsideDhakaShipping" DECIMAL(10,2) NOT NULL DEFAULT 180,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
