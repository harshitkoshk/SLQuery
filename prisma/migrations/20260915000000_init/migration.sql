-- CreateTable
CREATE TABLE "Streetlight" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WORKING',
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streetlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userName" TEXT,
    "userContact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "aiValid" BOOLEAN,
    "aiReadyToSend" BOOLEAN,
    "aiReason" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "aiMissingInfo" TEXT,
    "streetlightId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Streetlight_code_key" ON "Streetlight"("code");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_streetlightId_fkey" FOREIGN KEY ("streetlightId") REFERENCES "Streetlight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
