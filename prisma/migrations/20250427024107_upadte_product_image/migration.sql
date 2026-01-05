/*
  Warnings:

  - You are about to drop the column `position` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `largeUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediumUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductImage_productId_position_key";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "position",
ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "largeUrl" TEXT NOT NULL,
ADD COLUMN     "mediumUrl" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "zoomUrl" TEXT;
