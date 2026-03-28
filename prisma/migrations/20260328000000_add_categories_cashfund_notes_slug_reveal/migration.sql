-- AlterTable: Add new columns to Group (Registry)
ALTER TABLE "Group" ADD COLUMN "slug" TEXT;
ALTER TABLE "Group" ADD COLUMN "coupleName1" TEXT;
ALTER TABLE "Group" ADD COLUMN "coupleName2" TEXT;
ALTER TABLE "Group" ADD COLUMN "personalMessage" TEXT;
ALTER TABLE "Group" ADD COLUMN "revealEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex: Unique slug
CREATE UNIQUE INDEX "Group_slug_key" ON "Group"("slug");

-- AlterTable: Add claimNote to WishlistItem
ALTER TABLE "WishlistItem" ADD COLUMN "claimNote" TEXT;
ALTER TABLE "WishlistItem" ADD COLUMN "categoryId" TEXT;

-- CreateTable: Category
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CashFund
CREATE TABLE "CashFund" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CashFundContribution
CREATE TABLE "CashFundContribution" (
    "id" TEXT NOT NULL,
    "cashFundId" TEXT NOT NULL,
    "participantId" TEXT,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashFundContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_registryId_idx" ON "Category"("registryId");
CREATE UNIQUE INDEX "Category_registryId_name_key" ON "Category"("registryId", "name");
CREATE INDEX "CashFund_registryId_idx" ON "CashFund"("registryId");
CREATE INDEX "CashFundContribution_cashFundId_idx" ON "CashFundContribution"("cashFundId");
CREATE INDEX "CashFundContribution_participantId_idx" ON "CashFundContribution"("participantId");
CREATE INDEX "WishlistItem_categoryId_idx" ON "WishlistItem"("categoryId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CashFund" ADD CONSTRAINT "CashFund_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CashFundContribution" ADD CONSTRAINT "CashFundContribution_cashFundId_fkey" FOREIGN KEY ("cashFundId") REFERENCES "CashFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CashFundContribution" ADD CONSTRAINT "CashFundContribution_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
