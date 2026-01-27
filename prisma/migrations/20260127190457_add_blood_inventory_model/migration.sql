-- CreateTable
CREATE TABLE "BloodInventory" (
    "id" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "unitsAvailable" INTEGER NOT NULL,
    "minThreshold" INTEGER NOT NULL,
    "isLow" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "hospitalId" TEXT NOT NULL DEFAULT 'SYSTEM',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloodInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BloodInventory_bloodGroup_idx" ON "BloodInventory"("bloodGroup");

-- CreateIndex
CREATE INDEX "BloodInventory_isLow_idx" ON "BloodInventory"("isLow");

-- CreateIndex
CREATE UNIQUE INDEX "BloodInventory_bloodGroup_hospitalId_key" ON "BloodInventory"("bloodGroup", "hospitalId");
