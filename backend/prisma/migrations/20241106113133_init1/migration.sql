/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Stream` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `imageUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('SPOTIFY', 'YOUTUBE');

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "type",
ADD COLUMN     "type" "StreamType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropEnum
DROP TYPE "provider";
