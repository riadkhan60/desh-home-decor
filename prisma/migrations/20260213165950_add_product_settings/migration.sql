-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "maximuxShippingCostInsideDhaka" DECIMAL(10,2) NOT NULL DEFAULT 300,
ADD COLUMN     "maximuxShippingCostOusideDhaka" DECIMAL(10,2) NOT NULL DEFAULT 400,
ADD COLUMN     "minimumShippingCostInsideDhaka" DECIMAL(10,2) NOT NULL DEFAULT 70,
ADD COLUMN     "minimumShippingCostOutsideDhaka" DECIMAL(10,2) NOT NULL DEFAULT 180;
