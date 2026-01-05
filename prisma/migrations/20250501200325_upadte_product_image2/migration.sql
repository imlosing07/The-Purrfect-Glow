/*
  Warnings:

  - You are about to drop the column `largeUrl` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `mediumUrl` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `zoomUrl` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `originalUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standardUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "largeUrl",
DROP COLUMN "mediumUrl",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "url",
DROP COLUMN "zoomUrl",
ADD COLUMN     "originalUrl" TEXT NOT NULL,
ADD COLUMN     "standardUrl" TEXT NOT NULL;
