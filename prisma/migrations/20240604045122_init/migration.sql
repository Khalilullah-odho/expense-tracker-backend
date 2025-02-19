/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email_address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email_address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_phone_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `phone`,
    ADD COLUMN `email_address` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_address_key` ON `User`(`email_address`);
