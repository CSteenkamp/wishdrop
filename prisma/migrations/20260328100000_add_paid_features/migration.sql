-- AlterTable: Add branding and gift-received fields
ALTER TABLE "Group" ADD COLUMN "brandingHidden" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Group" ADD COLUMN "brandingColor" TEXT;

ALTER TABLE "WishlistItem" ADD COLUMN "received" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "WishlistItem" ADD COLUMN "receivedAt" TIMESTAMP(3);
ALTER TABLE "WishlistItem" ADD COLUMN "thankYouSent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: CoAdmin
CREATE TABLE "CoAdmin" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Rsvp
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "participantId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "headcount" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AnalyticsEvent
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoAdmin_registryId_idx" ON "CoAdmin"("registryId");
CREATE INDEX "CoAdmin_email_idx" ON "CoAdmin"("email");
CREATE UNIQUE INDEX "CoAdmin_registryId_email_key" ON "CoAdmin"("registryId", "email");

CREATE UNIQUE INDEX "Rsvp_participantId_key" ON "Rsvp"("participantId");
CREATE INDEX "Rsvp_registryId_idx" ON "Rsvp"("registryId");

CREATE INDEX "AnalyticsEvent_registryId_idx" ON "AnalyticsEvent"("registryId");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
CREATE INDEX "AnalyticsEvent_registryId_event_idx" ON "AnalyticsEvent"("registryId", "event");

-- AddForeignKey
ALTER TABLE "CoAdmin" ADD CONSTRAINT "CoAdmin_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
