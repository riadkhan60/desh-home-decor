-- AlterTable
ALTER TABLE "products" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "products_order_idx" ON "products"("order");
