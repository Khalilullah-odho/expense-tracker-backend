/*
  Warnings:

  - Added the required column `amount` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `amount` DOUBLE NOT NULL,
    MODIFY `category_id` INTEGER NOT NULL DEFAULT 12;
