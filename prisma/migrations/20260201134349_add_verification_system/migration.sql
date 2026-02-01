-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "isEmergency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationRequired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "emergencyVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idDocument" TEXT,
ADD COLUMN     "medicalCert" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastRequestDate" TIMESTAMP(3),
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;

-- CreateIndex
CREATE INDEX "BloodRequest_isEmergency_idx" ON "BloodRequest"("isEmergency");

-- CreateIndex
CREATE INDEX "User_verificationToken_idx" ON "User"("verificationToken");
